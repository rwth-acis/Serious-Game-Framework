angular.module('gleanerApp', ['gleanerServices', 'xeditable', 'ngRoute', 'homeApp', 'dataApp', 'reportsApp', 'realtimeApp', 'gridster', 'ui.bootstrap'])
    .run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    }).filter('prettyDateId', function() {
        return function(_id) {
            return $.format.prettyDate(new Date(parseInt(_id.slice(0, 8), 16) * 1000));
        };
    }).filter('prettyDate', function() {
        return function(date) {
            return $.format.prettyDate(new Date(date));
        };
    }).filter('list', function() {
        return function(list) {
            if (!list || list.length === 0) {
                return 'Empty list';
            } else {
                var result = '';
                list.forEach(function(v) {
                    result += v + ', ';
                });
                return result;
            }
        };
    }).filter('object2array', function() {
        return function(input) {
            var out = [];
            for (var i in input) {
                out.push(input[i]);
            }
            return out;
        }
    }).config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: '/app/home',
                controller: 'HomeCtrl'
            }).when('/data', {
                templateUrl: '/app/data',
                controller: 'DataCtrl'
            }).when('/reports', {
                templateUrl: '/app/reports',
                controller: 'ReportsCtrl'
            }).when('/realtime', {
                templateUrl: '/app/realtime',
                controller: 'RealtimeCtrl'
            }).otherwise({
                redirectTo: '/home'
            });
        }
    ]).controller('GleanerCtrl', ['$scope', '$location', 'Games', 'Versions',
        function($scope, $location, Games, Versions) {
            $scope.loading = 0;
            $scope.load = function() {
                $scope.loading++;
            };

            $scope.loaded = function() {
                $scope.loading--;
            };

            $scope.load();
            $scope.games = Games.query(function() {
                var gameId = $location.search().game;
                if (gameId) {
                    for (var i = 0; i < $scope.games.length; i++) {
                        if ($scope.games[i]._id === gameId) {
                            $scope.selectedGame = $scope.games[i];
                        }
                    }
                }

                if (!$scope.selectedGame) {
                    $scope.selectedGame = $scope.games[0];
                }
                $scope.refreshVersions();
                $scope.loaded();
            });

            $scope.saveGame = function() {
                if ($scope.selectedGame) {
                    $scope.load();
                    $scope.selectedGame.$save($scope.loaded);
                }
            };


            $scope.saveVersion = function(callback) {
                if ($scope.selectedVersion) {
                    $scope.selectedVersion.$save(callback);
                }
            };

            $scope.refreshVersions = function(callback) {
                if ($scope.selectedGame) {
                    $scope.form.selectedGame = $scope.selectedGame;
                    $scope.load();
                    $scope.versions = Versions.query({
                        gameId: $scope.selectedGame._id
                    }, function() {
                        $scope.selectedVersion = null;
                        var versionId = $location.search().version;
                        if (versionId) {
                            for (var i = 0; i < $scope.versions.length; i++) {
                                if ($scope.versions[i]._id === versionId) {
                                    $scope.selectedVersion = $scope.versions[i];
                                }
                            }
                        }

                        if (!$scope.selectedVersion) {
                            $scope.selectedVersion = $scope.versions[0];
                        }

                        $scope.form.selectedVersion = $scope.selectedVersion;

                        if (callback) {
                            callback();
                        }
                        $scope.loaded();
                    });
                }
            };

            $scope.form = {
                selectedGame: null,
                selectedVersion: null
            };

            $scope.setSelectedGame = function(game) {
                $scope.form.selectedGame = game;
            };

            $scope.setSelectedVersion = function(version) {
                $scope.form.selectedVersion = version;
            };

            $scope.$watch('form.selectedGame', function(selected) {
                if (selected) {
                    $scope.selectedGame = selected;
                    $location.search('game', selected._id);
                    $scope.refreshVersions();
                }
            });

            $scope.$watch('form.selectedVersion', function(selected) {
                if (selected) {
                    $location.search('version', selected._id);
                    $scope.selectedVersion = selected;
                }
            });
        }
    ]);