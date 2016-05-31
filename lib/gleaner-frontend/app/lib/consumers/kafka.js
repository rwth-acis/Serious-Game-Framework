var Q = require('q');
var sessions = require('gleaner-data').sessions;
var kafka = require('../services/kafka');

module.exports = {
    addTraces: function (playerId, versionId, gameplayId, data) {
        return sessions.find({versionId: sessions.toObjectID(versionId), end: null}, true).then(function (session) {
            if (!session) {
                return true;
            }
            return kafka.send(session._id.toString(), data);
        });
    }
};