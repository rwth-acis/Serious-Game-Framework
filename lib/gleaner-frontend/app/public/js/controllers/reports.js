angular.module('reportsApp', ['gleanerServices', 'gleanerApp', 'gridster'])
    .controller('ReportsCtrl', ['$scope', '$modal', 'Results',
        function($scope, $modal, Results) {
            var savePanels = function(event, ui, $widget) {
                $scope.selectedVersion.$save();
            };

            $scope.gridsterOpts = {
                margins: [20, 20],
                columns: 3,
                minColumns: 1,
                pushing: true,
                floating: true,
                draggable: {
                    enabled: true,
                    stop: savePanels
                },
                resizable: {
                    enabled: true,
                    stop: savePanels
                }
            };
            $scope.$watch('selectedVersion', function() {
                if ($scope.selectedVersion) {
                    $scope.results = Results.query({
                        gameId: $scope.selectedGame._id,
                        versionId: $scope.selectedVersion._id,
                    }, function() {
                        var panels = $scope.selectedVersion.panels;
                        if (panels && panels.length) {
                            $scope.showPanel(0);
                        }
                    });
                }
            });

            $scope.relaunchAnalysis = function() {
                $.post('/api/analyze/' + $scope.selectedVersion._id);
            };

            $scope.addPanel = function() {
                var newPanel = {
                    name: 'Untitled panel',
                    reports: []
                };

                var panels = $scope.selectedVersion.panels;
                if (!panels) {
                    $scope.selectedVersion.panels = panels = [];
                }
                panels.push(newPanel);
                $scope.selectedVersion.$save(function() {
                    $scope.showPanel($scope.selectedVersion.panels.length - 1);
                });
            };

            $scope.showPanel = function(index) {
                $scope.selectedPanelIndex = index;
                refreshReports();
            };

            $scope.deleteCurrentPanel = function() {
                $scope.selectedVersion.panels.splice($scope.selectedPanelIndex, 1);
                $scope.saveVersion(function() {
                    if ($scope.selectedVersion.panels.length) {
                        $scope.selectedPanelIndex = 0;
                    } else {
                        delete $scope.selectedPanelIndex;
                    }
                });
            };

            $scope.deleteReport = function(index) {
                $scope.currentPanel().reports.splice(index, 1);
                $scope.saveVersion();
            };

            $scope.currentPanel = function() {
                return $scope.selectedVersion && $scope.selectedVersion.panels ? $scope.selectedVersion.panels[$scope.selectedPanelIndex] : null;
            };

            $scope.addNewReport = function() {
                var report = $scope.newReport;
                report.sizeX = 1;
                report.sizeY = 1;
                report.row = 0;
                report.col = 0;
                $scope.currentPanel().reports.push(report);
                $scope.selectedVersion.$save();
            };

            $scope.editReport = function(index) {
                $scope.modifyReport($scope.currentPanel().reports[index], index);
            };

            $scope.createReport = function(type) {
                var id = newReportId();
                $scope.modifyReport({
                    id: id,
                    type: type
                }, -1);
            };

            $scope.modifyReport = function(report, index) {
                var reportModal = $modal.open({
                    templateUrl: 'counter.html',
                    controller: 'ReportModalCtrl',
                    resolve: {
                        create: function() {
                            return index === -1;
                        },
                        report: function() {
                            return report;
                        },
                        selectedVersion: function() {
                            return $scope.selectedVersion;
                        }
                    }
                });

                reportModal.result.then(function(result) {
                    var report = result[1];
                    switch (result[0]) {
                        case 'create':
                            $scope.currentPanel().reports.push(report);
                            break;
                        case 'save':
                            $scope.currentPanel().reports[index] = report;
                            break;
                    }
                    $scope.saveVersion();
                });
            };


            var refreshReports = function() {
                $scope.currentPanel().reports.forEach(function(report, index) {
                    Gleaner.draw('#report' + index, $scope.results, $scope.segments, report, $scope.selectedVersion);
                });
            };

            var newReportId = function() {
                var panels = $scope.selectedVersion.panels;
                var freeId;
                var id;
                do {
                    id = Math.random().toString(10).substr(10);
                    freeId = true;
                    for (var i = 0; i < panels.length && freeId; i++) {
                        for (var j = 0; panels[i].reports && j < panels[i].reports.length && freeId; j++) {
                            freeId = panels[i].reports[j].id !== id;
                        }
                    }
                } while (!freeId);
                return 'r' + id;
            };

            $scope.$watch('currentPanel()', function() {
                if ($scope.currentPanel()) {
                    refreshReports();
                }
            });

            setTimeout(refreshReports, 1000);

            $scope.toggleSegment = function(segment) {
                $scope.segments[segment] = $scope.segments[segment] ? false : true;
                refreshReports();
            };

            $scope.segments = {
                'all': true
            };
        }
    ]).controller('ReportModalCtrl', ['$scope', '$modalInstance', 'create', 'report', 'selectedVersion',
        function($scope, $modalInstance, create, report, selectedVersion) {
            $scope.create = create;
            $scope.report = report;
            $scope.selectedVersion = selectedVersion;

            $scope.createReport = function() {
                $modalInstance.close(['create', report]);
            };

            $scope.saveReport = function() {
                $modalInstance.close(['save', report]);
            };

            $scope.dismiss = function() {
                $modalInstance.dismiss('cancel');
            };
        }
    ]);