angular.module('activityApp', ['gleanerServices', 'gleanerApp']);

d3.json('/api/statements', function(error, data) {
    var rows = d3.select('.container').selectAll('.row').data(data);

    var div = rows.enter()
        .append('div')
        .attr('class', 'col-md-offset-1 col-md-10');

    div.html(function(sentence) {
        return sentence.actor.mbox + ' <span class="label label-default">' + sentence.verb.display['en-US'] + '</span> ' + sentence.object.definition.name;
    });

});