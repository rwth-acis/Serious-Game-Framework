/**
 * data: [
 * 	[ "label1", value1 ],
 * 	[ "label2", value2 ],
 * 	...
 * ]
 */
var Counter = function() {

};

Counter.prototype.draw = function(containerId, data, options) {
    var container = d3.select(containerId).selectAll('div').data(data);
    var counter = container.enter()
        .append('p')
        .text(function(row) {
            return row[0] + ': ' + row[1];
        });
};

var Bars = function() {

};

/**
 * [
 * ["label", value],
 * ["label", value],
 * ]
 */
Bars.prototype.draw = function(containerId, data, options) {

};