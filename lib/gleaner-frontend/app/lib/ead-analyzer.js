module.exports = (function() {
    var PythonShell = require('python-shell');

    var analyze = function(eadFile, versionId) {
        var options = {
            scriptPath: process.cwd() + '/scripts',
            args: [process.cwd() + '/uploads/' + eadFile, versionId]
        };
        PythonShell.run('eadanalyzer.py', options, function(err) {
            if (err) {
                console.log(err);
            }
        });
    };

    return {
        processReq: function(req, res) {
            res.send(200);
            analyze(req.body.file, req.body.versionId);
        },
        analyze: analyze
    };

})();