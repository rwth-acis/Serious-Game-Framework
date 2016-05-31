var MongoConsumer = function () {
    var Collection = require('easy-collections');
    var collections = {};
    var db = require('gleaner-data').db;

    return {
        addTraces: function (playerId, versionId, gameplayId, data) {
            var traces = collections[versionId];
            if (!traces) {
                traces = new Collection(db, 'traces_' + versionId);
                collections[versionId] = traces;
            }
            return traces.insert(data);
        }
    }
};

module.exports = new MongoConsumer();
