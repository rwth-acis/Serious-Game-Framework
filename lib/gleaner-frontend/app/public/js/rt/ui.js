var colors = (function () {
    var startColor1 = d3.rgb("#f44336");
    var startColor2 = d3.rgb("#e57373");
    var startColor3 = d3.rgb("#ffcdd2");
    var middleColor1 = d3.rgb("#ff9800");
    var middleColor2 = d3.rgb("#ffb74d");
    var middleColor3 = d3.rgb("#ffe0b2");
    var endColor1 = d3.rgb("#4caf50");
    var endColor2 = d3.rgb("#81c784");
    var endColor3 = d3.rgb("#c8e6c9");

    var interpolators = [];
    interpolators.push(d3.interpolate(startColor1, middleColor1));
    interpolators.push(d3.interpolate(middleColor1, endColor1));
    interpolators.push(d3.interpolate(startColor2, middleColor2));
    interpolators.push(d3.interpolate(middleColor2, endColor2));
    interpolators.push(d3.interpolate(startColor3, middleColor3));
    interpolators.push(d3.interpolate(middleColor3, endColor3));

    return function (index, progress) {
        return interpolators[index * 2 + (progress >= 0.5 ? 1 : 0)].call(null, (progress * 2) - (progress >= 0.5 ? 1 : 0));
    }
})();


var RadialProgress = function (div, initialProgress) {
    var svg = d3.select(div).append("svg")
        .attr("viewBox", "0 0 100 100");

    this.outerCircle = svg.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 40);

    this.startAngle = 0;
    this.arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(35)
        .startAngle(this.startAngle)
        .endAngle(this.startAngle);

    this.progressCircle = svg.append("path")
        .attr("d", this.arc)
        .attr("transform", "translate(50,50)");

    this.mainCircle = svg.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 30);

    this.text = svg.append("text")
        .text("0%")
        .attr("x", 50)
        .attr("y", 50)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("style", "fill:white");

    this.setProgress(initialProgress || 0);
};

RadialProgress.prototype.setProgress = function (progress) {
    var endAngle = progress * 2 * Math.PI;
    this.text.text(Math.round((endAngle / Math.PI) * 50) + "%");

    endAngle += this.startAngle;
    if (endAngle > 2 * Math.PI) {
        endAngle -= 2 * Math.PI;
    }

    this.mainCircle.attr("fill", colors(0, progress));

    this.arc.endAngle(endAngle);
    this.progressCircle
        .attr("d", this.arc)
        .attr("fill", colors(1, progress));

    this.outerCircle.attr("fill", colors(2, progress));

};

var ColumnProgress = function (div, initialProgress) {
    var svg = d3.select(div).append("svg")
        .attr("viewBox", "0 0 100 100");

    this.height = 60;
    this.y = 20;

    this.outerRectangle = svg.append("rect")
        .attr("x", 20)
        .attr("y", 10)
        .attr("width", 60)
        .attr("height", 80);

    this.middleRectangle = svg.append("rect")
        .attr("x", 25)
        .attr("y", 15)
        .attr("width", 50)
        .attr("height", 70);

    this.progressRectangle = svg.append("rect")
        .attr("x", 30)
        .attr("width", 40);

    this.text = svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("style", "fill:white");

    this.setProgress(initialProgress || 0);
};

ColumnProgress.prototype.setProgress = function (progress) {
    this.progressRectangle
        .attr("height", this.height * progress)
        .attr("y", this.y + this.height - (this.height * progress));

    var mark = progress * 5.5;
    var value = Math.floor(mark);

    var letter;
    switch (value) {
        case 0:
            letter = 'F';
            break;
        case 1:
            letter = 'E';
            break;
        case 2:
            letter = 'D';
            break;
        case 3:
            letter = 'C';
            break;
        case 4:
            letter = 'B';
            break;
        case 5:
            letter = 'A';
            break;
    }
    this.text.text(letter + (mark - value > 0.5 ? "+" : ""));


    this.progressRectangle.attr("fill", colors(0, progress));
    this.middleRectangle.attr("fill", colors(1, progress));
    this.outerRectangle.attr("fill", colors(2, progress));
};
