function ChartCreator() {
  this.drawChart = function(stats, type, prefix) {
    var chart_type = type || 'pie';
    var prefix = prefix || 'player-';
    var chart_container = prefix + 'chart-container';

    if(stats.correct || stats.wrong) {
      $('div#' + prefix + 'no-records').hide();
      $('div#' + prefix + 'worst-levels, div#' + prefix + 'choose-chart, div#' + prefix + 'chart-container').show();
    }
    else {
      $('div#' + prefix + 'worst-levels, div#' + prefix + 'choose-chart, div#' + prefix + 'chart-container').hide();
      $('div#' + prefix + 'no-records').show();
    }

    if(prefix !== 'admin-') {
      var worst_level_div = 'div#' + prefix + 'worst-levels';
      // Remove old worst_levels
      $.merge($(worst_level_div).children('span'), $(worst_level_div).children('ul')).remove();

      // Draw worst_levels
      if(stats.worst_levels.length > 0) {
        for(var i = 0; i < stats.worst_levels.length; i++) {
          var level_data = stats.worst_levels[i];

          var level = $('<ul id="level'+ i +'"></ul>');
          $(worst_level_div).append(level);

          LEVELDATA[level_data.level].pieces.forEach(function(piece) {
            var tile = $('<li><img src="' + UPLOADPATH + PIECESDATA[piece].src + '" ' +
              'title="' + PIECESDATA[piece].description + '"></li>');
            $(worst_level_div).children('ul#level' + i).append(tile);
          });

          // <div>Correct: ' + level_data.correct + ' Wrong: '+ level_data.wrong +'</div>
          tile = $('<li><div>' + level_data.wrong + '/' + (level_data.correct + level_data.wrong) +
            ' (' + Math.floor(level_data.ratio * 100) + '%) wrong</div></li>');
          $(worst_level_div).children('ul#level' + i).append(tile);
        }
      } else {
        var string;
        if(prefix === "player-") {
          string = 'Congratulations! You have studied exceptionally well! (or not at all...)';
        }
        else if(prefix === 'designer-') {
          string = 'No levels were solved exceptionally bad.';
        }

        $(worst_level_div).append('<span>'+ string +'</span>');
      }
    }

    if(chart_type == "pie") {
      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Result');
      data.addColumn('number', '#');
      data.addRows([
        ['Correct', stats.correct],
        ['Wrong', stats.wrong]
        // Don't use show me in graphs
        // ['Show Me', stats.show_me]
      ]);

      // Set chart options
      var options = {
        chartArea: {
          left: 250,
          top: 0,
          width: '100%',
          height: '100%',
        },
        width: 625,
        height: 400,
        colors: ['#009F00', '#DC3812', '#FF9500'],
        is3D: true,
        legend: {
          position: 'right',
          alignment:'center'
        },
        pieSliceText: 'value'
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById(chart_container));
      chart.draw(data, options);
    }
    else if(chart_type == "bar") {
      var game_name = stats.target_game == 2 ? 'Test' : GAMESDATA[stats.target_game].name;
      var data = google.visualization.arrayToDataTable([
        ['Result', 'Correct', 'Wrong'], // 'Show Me'
        [game_name, stats.correct, stats.wrong] // stats.show_me
      ]);

      var options = {
        chartArea: {
          left: 250
        },
        width: 625,
        height: 400,
        colors: ['#009F00', '#DC3812', '#FF9500'],
        legend: {
          position: 'right',
          alignment:'center'
        },
        bar: { groupWidth: '75%' },
        isStacked: true
      };

      var chart = new google.visualization.ColumnChart(document.getElementById(chart_container));
      chart.draw(data, options);
    }
  }

  this.changeChart = function(gameID, type, prefix) {
    // Query statistics for newly selected game
    $.ajax({
      url: "http://localhost:3000/collect/traces/" + gameID, // TODO MARKO add real url
      dataType: "json",
      headers: {
        'Email': oidc_userinfo.email,
        'Type': prefix
      },
      success: function(result) {
        // If everything went ok, draw the chart
        // TODO MARKO Worse then shit
        new ChartCreator().drawChart(result, type, prefix);
      },
      error: function(err) {
        console.log(err);
        console.log("Can't get traces. Server down?");
      }
    });
  }
}
