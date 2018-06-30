$(document).ready(function() {
    $.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", d => {

        const baseTemperature = d.baseTemperature;
        const lowestVariance = d3.min(d.monthlyVariance, k => k.variance);
        const highestVariance = d3.max(d.monthlyVariance, k => k.variance);

        const margin = {
            top: 40,
            left: 115,
            right: 40,
            bottom: 45
        }

        const heatWidth = 950 - margin.left - margin.right;
        const heatHeight = 550 - margin.top - margin.bottom;

        let heatMap = d3.select("body")
            .append("svg")
            .attr("width", heatWidth + margin.left + margin.right)
            .attr("height", heatHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let div = d3.select("body").append("div").attr("class", "customTooltip").style("opacity", 0);

        let varianceToValue = d3.scale.linear()
            .domain([lowestVariance, highestVariance])
            .range([0, 5])

        let colorScale = d3.scale.linear()
            .domain([0, 1, 2, 3, 4, 5])
            .range(["purple", "blue", "yellow", "orange", "red"])

        let xScale = d3.scale.linear()
            .domain([2015, 1753])
            .range([heatWidth, 0]);

        let yScale = d3.time.scale()
            .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
            .range([0, heatHeight]);

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(d3.format("d"))

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(d3.time.months)
            .tickSize(5, 0)
            .tickFormat(d3.time.format("%B"));

        heatMap.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + heatHeight + ")")
            .call(xAxis)
            .append("text")
            .attr("x", heatWidth)
            .attr("dy", margin.bottom - 5)
            .attr("font-family", "Roboto")
            .style("text-anchor", "end")
            .text("Years");

        heatMap.append("g")
            .attr("class", "axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", -90)
            .attr("font-family", "Roboto")
            .style("text-anchor", "end")
            .text("Months");

        heatMap.selectAll(".bar")
            .data(d.monthlyVariance)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(new Date(2012, d.month - 1, 1)))
            .attr("height", d => heatHeight / 12 + 1) // +1 removes the white lines between each month
            .attr("width", d => heatWidth / (2015 - 1753))
            .attr("fill", d => colorScale(varianceToValue(d.variance)))
            .on("mouseover", d => {
                let temperature = Math.round((baseTemperature + d.variance) * 100) / 100 + "°C" // /100 * 100 to get 2 decimals
                div.transition().duration(200).style("opacity", 1)
                div.html("<strong>Year : </strong>" + d.year + "<br/>" + "<strong>Temperature : </strong>" + temperature + "<br/>" + "<strong>Variance : </strong>" + d.variance + "°C")
                    .style("left", (d3.event.pageX + 8) + "px").style("top", (d3.event.pageY) + "px")
            })
            .on("mouseout", () => {
                div.transition().duration(500).style("opacity", 0);
            });
    })
})
