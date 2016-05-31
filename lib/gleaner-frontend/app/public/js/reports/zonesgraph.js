window.Gleaner = window.Gleaner || {};

Gleaner.zonesgraph = function(containerId, graph, prefix) {
    prefix = prefix || '';

    var cellSize = 200;
    var playerRadius = 10;

    d3.selectAll(containerId).select('svg').remove();
    var svg = d3.selectAll(containerId).append('svg').attr('class', 'zonegraph');

    var filter = svg.append('defs').append('filter')
        .attr('id', 'drop-shadow')
        .attr('x', '-10%')
        .attr('y', '-10%')
        .attr('width', '200%')
        .attr('height', '200%');

    filter.append('feOffset')
        .attr('in', 'SourceAlpha')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('result', 'offOut');

    filter.append('feGaussianBlur')
        .attr('in', 'offOut')
        .attr('stdDeviation', 3)
        .attr('result', 'blurOut');

    filter.append('feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'blurOut')
        .attr('mode', 'normal');


    var nodes = [];
    var links = [];
    var points = [];
    var maxX = 0;
    var maxY = 0;

    for (var id in graph.nodes) {
        var node = _.clone(graph.nodes[id]);
        node.id = id;
        nodes.push(node);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
        for (var i = 0; i < node.links.length; i++) {
            var link = [id, node.links[i]];
            if (links.indexOf(link) == -1) {
                links.push(link);
                var node1 = graph.nodes[link[0]];
                var node2 = graph.nodes[link[1]];
                var x1 = node1.x * cellSize + cellSize / 2;
                var y1 = node1.y * cellSize + cellSize / 2;
                var x2 = node2.x * cellSize + cellSize / 2;
                var y2 = node2.y * cellSize + cellSize / 2;
                points.push([x1, y1, x2, y2]);
            }
        }
    }


    svg.attr('width', cellSize * (maxX + 1))
        .attr('height', cellSize * (maxY + 1));

    var lines = svg.selectAll('line').data(points);

    lines.enter()
        .append('line');
    lines
        .attr('x1', function(point) {
            return point[0];
        }).attr('y1', function(point) {
            return point[1];
        }).attr('x2', function(point) {
            return point[2];
        }).attr('y2', function(point) {
            return point[3];
        });

    var groups = svg.selectAll('g').data(nodes);

    var group = groups.enter()
        .append('g');

    var margin = cellSize * 0.05;

    group.append('rect')
        .attr('class', 'cell')
        .attr('width', cellSize - margin * 2)
        .attr('height', cellSize - margin * 2)
        .attr('x', margin)
        .attr('y', margin)
        .attr('filter', 'url(#drop-shadow)');

    group.append('image')
        .attr('xlink:href', function(node) {
            return prefix + node.background;
        }).attr('width', cellSize - margin * 2)
        .attr('height', cellSize - margin * 2)
        .attr('x', margin)
        .attr('y', margin);

    group.append('text')
        .attr('class', 'zone-name')
        .text(function(node) {
            return node.id;
        }).attr('x', margin + 5)
        .attr('y', cellSize - margin - 5);

    groups
        .attr('transform', function(node) {
            return 'translate(' + node.x * cellSize + ',' + node.y * cellSize + ')';
        });

    var playerZones = {};
    var scenesPlayers = {};

    var zoneCenter = function(zone) {
        return {
            x: graph.nodes[zone].x * cellSize + cellSize / 2,
            y: graph.nodes[zone].y * cellSize + cellSize / 2
        };
    };

    var zoneInPosition = function(zone, position) {
        position = position === undefined ? scenesPlayers[zone].length - 1 : position;
        var top = margin + graph.nodes[zone].x * cellSize;
        var left = margin + graph.nodes[zone].y * cellSize;
        var playersPerRow = (cellSize - margin * 2) / (playerRadius * 2);
        var row = Math.floor(position / playersPerRow);
        var column = position % playersPerRow;
        return {
            x: graph.nodes[zone].x * cellSize + margin + playerRadius * 2 * column + playerRadius,
            y: graph.nodes[zone].y * cellSize + margin + playerRadius * 2 * row + playerRadius
        };
    };

    var setCircleInZone = function(circle, zone, position) {
        var finalPosition = zoneInPosition(zone, position);
        circle.attr('cx', finalPosition.x)
            .attr('cy', finalPosition.y);
    };

    return {
        zone: function(playerId, zone) {

            if (playerZones[playerId] === zone) {
                return;
            }

            var oldZone;
            if (playerZones[playerId]) {
                oldZone = playerZones[playerId];
                scenesPlayers[oldZone] = _.without(scenesPlayers[oldZone], playerId);
                for (var i = 0; i < scenesPlayers[oldZone].length; i++) {
                    setCircleInZone(svg.select('#gameplay' + scenesPlayers[oldZone][i]).transition().duration(500), oldZone, i);
                }
            }

            playerZones[playerId] = zone;
            if (!scenesPlayers[zone]) {
                scenesPlayers[zone] = [playerId];
            } else {
                scenesPlayers[zone].push(playerId);
            }


            var playerNode = svg.select("#gameplay" + playerId);

            if (playerNode.empty()) {
                playerNode = svg.append('circle')
                    .attr('id', "gameplay" + playerId)
                    .attr('r', playerRadius)
                    .on('mouseover', function() {
                        d3.select(this).attr('r', playerRadius * 2);
                    }).on('mouseout', function() {
                        d3.select(this).attr('r', playerRadius);
                    });
            } else {

                var oldCenter = zoneCenter(oldZone);
                var newCenter = zoneCenter(zone);
                playerNode = playerNode.transition()
                    .duration(250)
                    .attr('cx', oldCenter.x)
                    .attr('cy', oldCenter.y)
                    .transition()
                    .duration(500)
                    .attr('cx', newCenter.x)
                    .attr('cy', newCenter.y)
                    .transition()
                    .duration(250);
            }
            setCircleInZone(playerNode, zone);
        }
    };

};