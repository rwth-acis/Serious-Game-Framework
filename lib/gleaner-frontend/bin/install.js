if (process.argv.length != 4) {
    console.log('You must pass the admin user and password as parameters');
} else {
    var user = process.argv[2];
    var password = process.argv[3];
    var MongoClient = require('mongodb').MongoClient;

    var conf = require('../app/configuration');
    var connectionString = 'mongodb://' + conf.mongoHost + ':' + conf.mongoPort + '/' + conf.mongoDatabase;
    MongoClient.connect(connectionString, function(err, database) {
        if (err) {
            console.log(err);
        } else {
            var db = require('gleaner-data').db;
            db.db = database;
            var users = require('gleaner-data').users;
            users.setSalt(conf.passwordsSalt);
            users.insert({
                name: user,
                password: password,
                role: 'admin'
            }).then(function() {
                db.close();
                console.log('Done');
            });
        }
    });
}
