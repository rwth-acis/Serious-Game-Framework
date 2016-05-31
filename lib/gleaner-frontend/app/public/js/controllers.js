var gleanerApp = angular.module('gleanerApp', ['gleanerServices']);

gleanerApp.controller('GamesCtrl', ['$scope', 'Games', 'Versions', '$window',
    function($scope, Games, Versions, $window) {
        $scope.addEntry = function() {
            var game = new Games();
            game.title = 'New game';
            game.$save(function() {
                $scope.refresh();
            });
        };

        $scope.remove = function(game) {
            game.$remove(function() {
                $scope.refresh();
            });
        };

        $scope.refresh = function() {
            $scope.games = Games.query(function() {
                $scope.selectedGame = $scope.games[0];
                $scope.refreshVersions();
            });
        };

        $scope.creationDate = function(game) {
            return $.format.prettyDate(new Date(parseInt(game._id.slice(0, 8), 16) * 1000));
        };

        $scope.refreshVersions = function() {
            $scope.versions = Versions.query({
                gameId: $scope.selectedGame._id
            });
        };


        $scope.refresh();
    }
]);

gleanerApp.controller('VersionsCtrl', ['$scope', 'Versions',
    function($scope, Versions) {
        $scope.refresh = function() {};

        $scope.addVersion = function() {
            var version = new Versions();
            version.name = 'Version1.0.0';
            version.gameId = $scope.game._id;
            version.$save(function() {
                $scope.refresh();
            });
        };

        $scope.remove = function(version) {
            version.$remove(function() {
                $scope.refresh();
            });
        };
    }
]);