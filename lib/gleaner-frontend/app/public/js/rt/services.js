var gleanerServices = angular.module('sessionServices', ['ngResource']);

gleanerServices.factory('Results', ['$resource',
    function ($resource) {
        return $resource('/api/sessions/:id/results/:resultId', {resultId: '@_id'});
    }
]);

gleanerServices.factory('Sessions', ['$resource',
    function ($resource) {
        return $resource('/api/sessions/:id');
    }
]);

gleanerServices.factory('Versions', ['$resource',
    function ($resource) {
        return $resource('/api/games/:gameId/versions/:versionId');
    }
]);

