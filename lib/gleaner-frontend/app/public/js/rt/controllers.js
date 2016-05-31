var app = angular.module('sessionApp', ['sessionServices']);

function getQueryParams() {
    var qs = document.location.search;
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

app.config(['$locationProvider',
    function ($locationProvider) {
        $locationProvider.html5Mode(false);
    }
]);

app.directive('reports', function () {
    return function (scope, element, attrs) {
        new RadialProgress(angular.element(element).children(".progress-marker")[0], scope.result.progress);
        new ColumnProgress(angular.element(element).children(".score-marker")[0], scope.result.score);
    };
});

app.controller('SessionCtrl', ['$scope', '$location', 'Sessions', 'Results', 'Versions',
    function ($scope, $location, Sessions, Results, Versions) {

        $scope.refreshResults = function () {
            var rawResults = Results.query({id: $scope.session._id},
                function () {
                    calculateResults(rawResults);
                });
        };

        $scope.session = Sessions.get({id: getQueryParams().session}, function () {
            $scope.version = Versions.get({
                gameId: $scope.session.gameId,
                versionId: $scope.session.versionId
            }, function () {
                $scope.refreshResults();
                if (!$scope.session.end) {
                    setInterval(function () {
                        $scope.refreshResults()
                    }, 10000);
                }
            });
        });

        var evalExpression = function (expression, defaultValue) {
            try {
                return eval(expression) || defaultValue;
            } catch (err) {
                //console.log('Impossible to evaluate expression ' + expression);
                //console.log(err.stack);
                return defaultValue;
            }
        };


        var calculateResults = function (rawResults) {
            var results = [];
            var agg = {
                score: [],
                progress: [],
                warnings: [],
                alerts: []
            };
            rawResults.forEach(function (result) {
                result.name = evalExpression.call(result, $scope.version.alias, "Unknown");

                result.score = Math.min(1, evalExpression.call(result, $scope.version.score, 0) / $scope.version.maxScore);

                result.progress = Math.min(1, evalExpression.call(result, $scope.version.progress, 0));
                result.warnings = [];
                for (var i = 0; $scope.version.warnings && i < $scope.version.warnings.length; i++) {
                    var warning = $scope.version.warnings[i];
                    if (evalExpression.call(result, warning.cond, false)) {
                        result.warnings.push(i);
                        var aggWarning = agg.warnings[i] || {
                                id: i,
                                message: warning.message,
                                count: 0
                            };

                        agg.warnings[i] = aggWarning;
                        aggWarning.count++;
                    }
                }

                result.alerts = [];
                for (i = 0; $scope.version.alerts && i < $scope.version.alerts.length; i++) {
                    var alert = $scope.version.alerts[i];
                    var level = evalExpression.call(result, alert.value, 0);
                    if (level - ((result.levels && result.levels[i]) || 0 ) >= alert.maxDiff) {
                        result.alerts.push({
                            id: i,
                            level: level
                        });

                        var aggAlert = agg.alerts[i] || {
                                id: i,
                                message: alert.message,
                                count: 0
                            };

                        agg.alerts[i] = aggAlert;
                        aggAlert.count++;
                    }
                }
                results.push(result);

                if ($scope.player && $scope.player._id === result._id) {
                    $scope.player = result;
                }

                agg.score.push(result.score);
                agg.progress.push(result.progress);
            });

            $scope.agg = {
                alerts: [],
                warnings: []
            };

            agg.alerts.forEach(function (alert) {
                alert && $scope.agg.alerts.push(alert);
            });

            agg.warnings.forEach(function (warning) {
                warning && $scope.agg.warnings.push(warning);
            });

            new gauss.Vector(agg.score).median(function (median) {
                $scope.agg.score = median;
            });

            new gauss.Vector(agg.progress).median(function (median) {
                $scope.agg.progress = median;
            });

            $scope.results = results;


        };

        var progressUI = new RadialProgress("#progress");

        $scope.$watch('agg.progress', function () {
            progressUI.setProgress($scope.agg.progress);
        });

        var scoreUI = new ColumnProgress("#score");

        $scope.$watch('agg.score', function () {
            scoreUI.setProgress($scope.agg.score);
        });

        $scope.alertScore = function (result) {
            return result.alerts.length * 100 + result.warnings.length - result.score * 10;
        };

        var progressPlayer = new RadialProgress("#progress-player");
        var scorePlayer = new ColumnProgress("#score-player");

        $scope.viewPlayer = function (result) {
            progressPlayer.setProgress(result.progress);
            scorePlayer.setProgress(result.score);
            $scope.player = result;
        };

        $scope.updateLevels = function (player) {
            var levels = player.levels || [];

            player.alerts.forEach(function (alert) {
                levels[alert.id] = alert.level;
            });
            delete player.alerts;
            player.levels = levels;
            player.$save({id: $scope.session._id}, function () {
                $scope.player = null;
                $scope.refreshResults();
            });
        };
    }
]);


