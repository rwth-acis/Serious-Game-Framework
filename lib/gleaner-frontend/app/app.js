var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    conf = require('./configuration'),
    upload = require('jquery-file-upload-middleware'),
    cors = require('cors');

// Set database

var dbProvider = {
    db: function () {
        return this.database;
    }
};

var connectToDB = function () {
    var MongoClient = require('mongodb').MongoClient;
    var connectionString = 'mongodb://' + conf.mongoHost + ':' + conf.mongoPort + '/' + conf.mongoDatabase;
    MongoClient.connect(connectionString, function (err, db) {
        if (err) {
            console.log(err);
            console.log('Impossible to connect to Mongo. Retrying in 5s');
            setTimeout(connectToDB, 5000);
        } else {
            console.log('Successfully connected to Mongo.')
            dbProvider.database = db;
        }
    });
};

connectToDB();

require('gleaner-data').db.setDBProvider(dbProvider);

// Traces consumers

var traces = require('gleaner-data').traces;
traces.addConsumer(require('./lib/consumers/mongo'));
traces.addConsumer(require('./lib/consumers/kafka'));

// Sessions tasks

var sessions = require('gleaner-data').sessions;
sessions.startTasks.push(require('./lib/services/kafka').createTopic);
sessions.endTasks.push(require('./lib/services/kafka').removeTopic);

sessions.startTasks.push(require('./lib/services/storm').startTopology);
sessions.endTasks.push(require('./lib/services/storm').endTopology);
// Build app

var app = express();

app.use(cors());

app.use(cookieParser());
app.use(session({
    secret: conf.sessionSecret
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// Set router paths

var options = {
    passwordsSalt: conf.passwordsSalt,
    apiRoot: '/api/',
    collectorRoot: '/collect/',
    loginPath: '/login',
    redirectLogin: '/app'
};


app.get('/', function (req, res) {
    res.redirect(options.redirectLogin);
});

app.get(options.loginPath, function (req, res) {
    if (req.session.role) {
        res.redirect(options.redirectLogin);
    } else {
        res.render('login', {
            error: req.query.error
        });
    }
});

var redirect = function (req, res, next) {
    if (conf.test || req.session.role) {
        next();
    } else {
        res.redirect(options.loginPath);
    }
};

app.all(options.apiRoot + '*', redirect);
app.all(options.redirectLogin + '*', redirect);

app.get(options.redirectLogin, function (req, res) {
    res.render('index');
});

app.get(options.redirectLogin + '/home', function (req, res) {
    res.render('home');
});

app.get(options.redirectLogin + '/data', function (req, res) {
    res.render('data');
});

app.get(options.redirectLogin + '/realtime', function (req, res) {
    res.render('realtime');
});

app.get(options.redirectLogin + '/reports', function (req, res) {
    res.render('reports');
});

app.get(options.redirectLogin + '/activity', function (req, res) {
    res.render('activity');
});

app.get('/logout', function (req, res) {
    delete req.session.role;
    delete req.session.name;
    res.render('login');
});


// Real time
app.get('/rt', function (req, res) {
    res.render('realtime/index');
});

// Uploads

upload.configure({
    uploadDir: process.cwd() + '/uploads',
    uploadUrl: '/app/uploads'
});

app.use('/app/upload', upload.fileHandler());

// EAd Analyzer
var eadAnalyzer = require('./lib/ead-analyzer');
app.post('/app/extractdata', eadAnalyzer.processReq);

// Start analysis
app.post('/api/analyze/:versionId', require('./lib/version-analysis').analyze);

var Collection = require('easy-collections');
// FIXME
app.get('/api/traces/:versionId/:lastId', function (req, res) {
    var traces = new Collection(dbProvider.db(), 'traces_' + req.params.versionId);
    var query = {};
    if (req.params.lastId && req.params.lastId !== '0') {
        query._id =
        {$gt: traces.toObjectID(req.params.lastId)};
    }
    traces.find(query).then(function (result) {
        res.json(result);
    }).fail(function () {
        res.status(400).end();
    });
});

var fs = require('fs');

app.get('/app/uploads/*', function (req, res) {
    var file = process.cwd() + '/uploads/' + req.params[0];
    fs.exists(file, function (exists) {
        if (exists) {
            fs.readFile(file, function (err, img) {
                if (err) {
                    res.send(500);
                } else {
                    var re = /(?:\.([^.]+))?$/;
                    var extension = re.exec(file)[1];
                    res.writeHead(200, {
                        'Content-Type': 'image/' + extension
                    });
                    res.end(img, 'binary');
                }
            });
        } else {
            res.send(404);
        }
    });
});

var rest = require('gleaner-data').rest;
rest(app, options, dbProvider);

app.all('*', function (req, res) {
    res.redirect(options.redirectLogin);
});

app.listen(conf.port, function () {
    console.log('Listening in ' + conf.port);
});

