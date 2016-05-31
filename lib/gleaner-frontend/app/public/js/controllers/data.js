angular.module('dataApp', ['gleanerServices', 'gleanerApp', 'checklist-model'])
    .controller('DataCtrl', ['$scope', '$location', '$window', 'Versions',
        function ($scope, $location, $window, Versions) {
            $scope.deleteGame = function () {
                if ($scope.selectedGame) {
                    $scope.selectedGame.$remove(function () {
                        $window.location = "/app";
                    });
                }
            };

            $scope.addEmptyVersion = function () {
                if ($scope.selectedGame) {
                    var version = new Versions();
                    version.name = 'Untitled version';
                    version.gameId = $scope.selectedGame._id;
                    version.$save(function () {
                        $location.search('version', version._id);
                        $scope.refreshVersions();
                    });
                }
            };

            $scope.deleteVersion = function () {
                if ($scope.selectedVersion) {
                    $scope.selectedVersion.$remove(function () {
                        $scope.refreshVersions();
                    });
                }
            };

            $scope.updateZones = function ($data) {
                try {
                    $scope.selectedVersion.zones = JSON.parse($data);
                    $scope.selectedVersion.$save();
                    updateZonesGraph();
                } catch (err) {
                    return 'Invalid JSON';
                }
            };

            $scope.$watch('selectedVersion', function () {
                if ($scope.selectedVersion) {
                    $scope.editedZones = JSON.stringify($scope.selectedVersion.zones, undefined, 4);
                    $scope.zoneNames = [];
                    for (var id in $scope.selectedVersion.zones.nodes) {
                        $scope.zoneNames.push(id);
                    }
                    updateZonesGraph();
                }
            });

            var updateZonesGraph = function () {
                Gleaner.zonesgraph('#zones-graph', $scope.selectedVersion.zones, '/app/');
            };

            $scope.addDerivedVar = function () {
                $scope.addToList('derivedVars', {
                        name: 'new_var',
                        value: 0
                });
            };

            $scope.addWarning = function(){
                $scope.addToList('warnings', {
                    cond: 'false',
                    message: 'No message'
                });
            };

            $scope.addAlert = function(){
                $scope.addToList('alerts', {
                    expression: '0',
                    maxDiff: 0,
                    message: 'No message'
                });
            };

            $scope.addToList = function (list, object) {
                if ($scope.selectedVersion) {
                    if (!$scope.selectedVersion[list]) {
                        $scope.selectedVersion[list] = [];
                    }
                    $scope.selectedVersion[list].push(object);
                    $scope.selectedVersion.$save();
                }
            };

            $scope.deleteFromList = function(list, object){
                var index = $scope.selectedVersion[list].indexOf(object);
                if (index > -1) {
                    $scope.selectedVersion[list].splice(index, 1);
                }
                $scope.selectedVersion.$save();
            };


            $(function () {
                $('#fileupload').fileupload({
                    dataType: 'json',
                    acceptFileTypes: /(\.|\/)(zip|ead)$/i,
                    start: function (e) {
                        $scope.eadLoading = true;
                    },
                    done: function (e, data) {
                        $scope.selectedVersion.loading = true;
                        $scope.selectedVersion.$save(function () {
                            $.post('/app/extractdata/', {
                                file: data.files[0].name,
                                versionId: $scope.selectedVersion._id
                            }, function () {
                                $('#analysis-state').text('Extracting data from .ead...');
                                checkVersionLoaded($scope.selectedVersion);
                            });

                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#analysis-state').text('Loading ' + progress + ' %');
                    }

                });
            });


            var checkVersionLoaded = function (version) {
                var check = function () {
                    version.$get(function () {
                        if (version.loading) {
                            setTimeout(check, 1000);
                        } else {
                            $scope.eadLoading = false;
                        }
                    });
                };
                check();
            };

            // Segments
            $scope.addSegment = function () {
                if (!$scope.selectedVersion.segments) {
                    $scope.selectedVersion.segments = [];
                }

                $scope.selectedVersion.segments.push({
                    name: "New segment",
                    condition: "true"
                });

                $scope.saveVersion();
            };

            $scope.deleteSegment = function (segment) {
                var index = $scope.selectedVersion.segments.indexOf(segment);
                if (index > -1) {
                    $scope.selectedVersion.segments.splice(index, 1);
                }
                $scope.selectedVersion.$save();
            };

            $scope.updateHaving = function (segment) {
                if (!segment.groupby && segment.hasOwnProperty('having')) {
                    delete segment.having;
                }
            };
        }
    ]);