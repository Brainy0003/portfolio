$(document).ready(function () {
    $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?", getQuote, "jsonp");
});

function getQuote(value) {
    // By default, theres is no messages
    $(".notif").text("");
    // If there is no author, author is unknown
    if (value.quoteAuthor === "") {
        value.quoteAuthor = "Unknown";
    }
    // If the quote and the author have more then 140 characters, we can't tweet that
    if (value.quoteText.length + value.quoteAuthor.length > 140) {
        $("#twitter").attr('class', 'btn btn-danger fa fa-twitter disabled');
        $(".notif").text("This quote is too long to be tweeted");
    } else {
        $("#twitter").attr('class', 'btn btn-primary fa fa-twitter');
    }
    $(".quote").html("<i class='fa fa-quote-left'></i>" + value.quoteText + "<i class='fa fa-quote-right'></i>");
    $(".author").html("- " + value.quoteAuthor).attr("href", "https://www.google.fr/search?q=" + value.quoteAuthor);

    $("#twitter").unbind().click(function () {
        if (!$("#twitter").hasClass("disabled")) {
            var url = 'https://twitter.com/intent/tweet?text="' + value.quoteText + '" - ' + value.quoteAuthor;
            window.open(url);
        }
    });
}

function change() {
    $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?", getQuote, "jsonp").done(function () {
        $(".quote, .author").fadeIn('slow');
    });
}

$("#another").click(function () {
    $('.quote, .author').fadeOut('slow', function () {
        change();
    });
});