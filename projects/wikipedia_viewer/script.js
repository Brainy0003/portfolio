$(document).ready(function() {
    var hide = true;

    function createElements(data) {
        $("#results").empty();
        for (var i = 0; i < data.length; i++) {
            var article = $("<div></div>").attr("class", "develop list-group-item").attr("id", "article-" + (i + 1));
            var titleContent = data[i].title;
            var ref = "https://en.wikipedia.org/wiki/" + titleContent.replace(/\s/g, "_");
            var title = $("<h3></h3>").html("<p><a href=" + ref + " target='_blank'>" + titleContent + "</a> <i class='icon-angle fa fa-angle-down pull-right' aria-hidden='true'></i></p>");
            var extract = $("<div></div>").attr("class", "extract").html(data[i].snippet + "...");
            $(article).append(title, extract);
            $("#results").append(article);
        }
    }

    function getResults() {
        $("h1").fadeOut()
        $(".search-bar").addClass("search-bar-active");
        var research = $("#research").val(); // Value of the input
        var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + research.replace(/\s/g, "+") + "&srlimit=7&callback=?";
        $.getJSON(url, function(data) {
            createElements(data.query.search);
        })
    }
    $("#search").click(getResults);
    // Press Enter to get results
    $("#research").keypress(function(e) {
        if (e.which == 13) {
            $("#search").click();
        }
    })

    $(document).on("click", ".develop", function() {
        var extract = "#" + this.id + " .extract";
        hide = !hide;
        $(extract).slideToggle();
        hide === true ? $("#" + this.id + " .icon-angle").attr("class", "icon-angle fa fa-angle-down pull-right") : $("#" + this.id + " .icon-angle").attr("class", "icon-angle fa fa-angle-up pull-right");
    })
});
