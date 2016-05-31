module.exports = (function() {
    var shell = require('shelljs');

    return {
        analyze: function(req, res) {
            res.render('reports');
            shell.exec('/home/angel/programas/spark-1.0.2/bin/spark-submit --class es.eucm.gleaner.analysis.Main --master local[*] /home/angel/repositories/gleaner-repositories/gleaner-analysis/target/analysis-jar-with-dependencies.jar ' + req.params.versionId, {
                async: true
            });
        }
    };
})();