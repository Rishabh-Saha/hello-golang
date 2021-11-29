const assert = require('chai').assert;
const source = require('../../testHelper');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');

describe('healthCheck', function() {
    this.timeout(4000);
    it('checks the healthCheck route properly', (done) => {
        request(source.app)
            .get('/healthCheck')
            .expect(200)
            .expect('content-length', '2')
            .expect('content-type', 'text/html; charset=utf-8')
            .end((err, response) => {
                if (err) throw err;
                assert(response.text, 'OK')
                done();
            });
    });

    it('checks the healthCheck route properly for post', (done) => {
        request(source.app)
            .post('/healthCheck')
            .expect(401)
            .expect('content-type', 'application/json; charset=utf-8')
            .end((err, response) => {
                if (err) throw err;
                const body = response.body;
                assert(body.status, 401);
                assert.isFalse(body.success);
                assert(body.message, "Invalid credentials");
                assert(body.errorCode, "CLIENT.INVALID.401");
                done();
            });
    });

});