module.exports = (function() {
    var Collection = require('easy-collections');
    var authTokens = require('./auth-tokens');

    return {
        find: function(versionId) {
            return authTokens.find({
                versionId: versionId,
                lastAccessed: {
                    $gt: new Date(new Date() - 10 * 60000)
                }
            }).then(function(authTokens) {
                var results = new Collection(require('./db'), 'rt_results_' + versionId);
                var ids = [];
                authTokens.forEach(function(authToken) {
                    ids.push(authToken.gameplayId);
                });
                return results.find({
                    gameplayId: {
                        $in: ids
                    }
                });
            });
        }
    };
})();