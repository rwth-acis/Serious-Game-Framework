angular.module('homeApp', ['gleanerServices', 'gleanerApp'])
    .controller('HomeCtrl', ['$scope', 'Games', 'Online', '$window',
        function ($scope, Games, Online, $window) {
            $scope.createGame = function () {
                var game = new Games();
                game.title = 'Untitled new game';
                game.$save(function () {
                    $window.location = "/app/#data?game=" + game._id;
                });
            };
        }
    ]);