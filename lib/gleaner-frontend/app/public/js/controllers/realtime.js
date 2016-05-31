angular.module('realtimeApp', ['gleanerServices', 'gleanerApp'])
    .controller('RealtimeCtrl', ['$scope', 'Sessions',
        function ($scope, Sessions) {
            $scope.running = true;
            $scope.refreshSessions = function () {
                if ($scope.selectedVersion) {
                    $scope.sessions = Sessions.query({
                        gameId: $scope.selectedGame._id,
                        versionId: $scope.selectedVersion._id
                    }, function () {
                        $scope.running = false;
                        for (var i = 0; i < $scope.sessions.length; i++) {
                            if (!$scope.sessions[i].end) {
                                $scope.running = true;
                                break;
                            }
                        }
                    });
                }
            };

            $scope.$watch('selectedVersion', function () {
                $scope.refreshSessions();
            });

            $scope.start = function () {
                $.post('/api/sessions?gameId=' + $scope.selectedGame._id + "&versionId=" + $scope.selectedVersion._id + "&event=start",
                    function (session) {
                        window.location.replace("/rt?session=" + session._id);
                    });
            };

            $scope.end = function () {
                $.post('/api/sessions?gameId=' + $scope.selectedGame._id + "&versionId=" + $scope.selectedVersion._id + "&event=end",
                    function (session) {
                        window.location.replace("/rt?session=" + session._id);
                    });
            };
        }
    ]);