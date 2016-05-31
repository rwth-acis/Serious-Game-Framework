var Q = require('q');
var shell = require('shelljs');
var configuration = require('../../configuration');

module.exports = {
    startTopology: function (sessionId) {
        var deferred = Q.defer();
        shell.exec("cd " + configuration.stormPath + " && ./storm jar " + configuration.stormJar + " es.eucm.gleaner.realtime.RealTime " + sessionId.toString(), {async: true}, function (code, output) {
            deferred.resolve();
        });
        return deferred.promise;
    },
    endTopology: function (sessionId) {
        var deferred = Q.defer();
        shell.exec("cd " + configuration.stormPath + " && ./storm kill " + sessionId.toString(), {async: true}, function (code, output) {
            deferred.resolve();
        });
        return deferred.promise;
    }
};
