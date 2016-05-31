window.Gleaner = window.Gleaner || {};

Gleaner.draw = function(containerId, data, segments, report, versionData) {
    $(containerId).empty();
    switch (report.type) {
        case 'counter':
            Gleaner.counter(containerId, data, segments, report);
            break;
        case 'choices':
            Gleaner.choices(containerId, data, segments, report, versionData);
            break;
    }
};


Gleaner.counter = function(containerId, data, segments, report) {
    var table = [];
    data.forEach(function(segment) {
        if (segments[segment._name]) {
            table.push([segment._name, segment[report.id]]);
        }
    });

    var counter = new Counter();
    counter.draw(containerId, table);
};

Gleaner.choices = function(containerId, data, segments, report, versionData) {
    data.forEach(function(segment) {
        if (segments[segment._name]) {
            var choices = segment[report.id];
            for (var choiceId in choices) {
                var table = [];
                var options;
                for (var i = versionData.choices.length - 1; i >= 0; i--) {
                    if (versionData.choices[i].id === choiceId) {
                        options = versionData.choices[i].options;
                        break;
                    }
                }
                var selectedOptions = choices[choiceId];
                for (var optionIndex in selectedOptions) {
                    table.push([options[optionIndex], selectedOptions[optionIndex]]);
                }
                table.sort(function(a, b) {
                    return b[1] - a[1];
                });
                var counter = new Counter();
                counter.draw(containerId, table);
            }
        }
    });
};