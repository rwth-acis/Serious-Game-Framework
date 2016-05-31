var testHelper = require('./test-helper')();
var test = module.exports = testHelper.test;
var helper = testHelper.helper();

test.postUser = function(test) {
    test.expect(4);
    helper.req.post('/users')
        .expect(200)
        .send({
            name: 'admin',
            password: 'admin',
            role: 'admin'
        })
        .end(function(err, res) {
            if (err) {
                test.ok(false, err.stack);
                test.done();
            }
            test.strictEqual(res.body.name, 'admin');
            test.strictEqual(res.body.role, 'admin');
            test.strictEqual(res.body.password, undefined);
            helper.req.post('/')
                .expect(302)
                .send({
                    name: 'admin',
                    password: 'admin'
                }).end(function(err, res) {
                    if (err) {
                        test.ok(false, err.stack);
                    }
                    test.strictEqual(res.header.location, '/logged');
                    test.done();
                });
        });
};