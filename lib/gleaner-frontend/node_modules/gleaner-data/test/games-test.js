var testHelper = require('./test-helper')();
var test = testHelper.test;
var helper = testHelper.helper();
var Q = require('q');

var idCreated;
var versionCreated;
var sessionCreated;

test.postGame = function (test) {
    test.expect(2);
    helper.req.post('/games')
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                test.ok(res.body);
                idCreated = res.body._id;
                test.ok(idCreated);
            }
            test.done();
        });
};

test.getGames = function (test) {
    test.expect(1);
    helper.req.get('/games')
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log('Games: ' + res.body);
                test.strictEqual(res.body.length, 1);
            }
            test.done();
        });
};

test.getGame = function (test) {
    test.expect(1);
    helper.req.get('/games/' + idCreated)
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log(res.body);
                test.strictEqual(res.body._id, idCreated);
            }
            test.done();
        });
};

test.updateGame = function (test) {
    test.expect(2);
    helper.req.post('/games/' + idCreated)
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            title: 'title'
        }).end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log(res.body);
                test.strictEqual(res.body._id, idCreated);
                test.strictEqual(res.body.title, 'title');
            }
            test.done();
        });
};

test.addVersion = function (test) {
    test.expect(3);
    helper.req.post('/games/' + idCreated + '/versions')
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log(res.body);
                test.ok(res.body);
                versionCreated = res.body._id;
                test.ok(versionCreated);
                helper.req.get('/games/' + idCreated + '/versions')
                    .expect(200)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            test.ok(false, err.stack);
                        } else {
                            test.strictEqual(res.body.length, 1);
                        }
                        test.done();
                    });
            }
        });
};

test.startSession = function (test) {
    var sessions = require('../lib/sessions');
    var starts = 0;
    var ends = 0;
    sessions.startTasks.push(function () {
        starts++;
        return Q.fcall(function () {
            return true;
        });
    });

    sessions.endTasks.push(function () {
        ends = 2;
        return Q.fcall(function () {
            return true;
        });
    });

    test.expect(5);
    helper.req.post('/sessions?gameId=' + idCreated + '&versionId=' + versionCreated + '&event=start')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            helper.testError(test, err);
            test.strictEqual(res.body.gameId, idCreated);
            test.strictEqual(res.body.versionId, versionCreated);
            sessionCreated = res.body._id;
            helper.req.post('/sessions?gameId=' + idCreated + '&versionId=' + versionCreated + '&event=start')
                .expect(400)
                .end(function (err, res) {
                    helper.testError(test, err);
                    helper.req.post('/sessions?gameId=whatever&versionId=' + versionCreated + '&event=start')
                        .expect(400)
                        .end(function (err, res) {
                            helper.testError(test, err);
                            helper.req.post('/sessions?gameId=' + idCreated + '&versionId=' + versionCreated + '&event=end')
                                .expect(200)
                                .end(function (err, res) {
                                    helper.testError(test, err);
                                    test.ok(res.body.end);
                                    test.strictEqual(starts, 1);
                                    test.strictEqual(ends, 2);
                                    test.done();
                                });
                        });
                });
        });
};

test.versionUpdated = function (test) {
    helper.req.post('/games/' + idCreated + '/versions/' + versionCreated)
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: 'version'
        }).end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log(res.body);
                test.strictEqual(res.body._id, versionCreated);
                test.strictEqual(res.body.name, 'version');
            }
            test.done();
        });
};

test.deleteGame = function (test) {
    test.expect(2);
    helper.req.delete('/games/' + idCreated)
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                test.ok(false, err.stack);
            } else {
                console.log(res.body);
                test.ok(res.body);
                helper.req.get('/games/' + idCreated + '/versions/' + versionCreated)
                    .expect(200)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) {
                            test.ok(false, err.stack);
                        } else {
                            console.log(res.body);
                            test.ok(!res.body._id);
                        }
                        test.done();
                    });
            }
        });
};

module.exports = test;