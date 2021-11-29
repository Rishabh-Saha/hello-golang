const source = require('../../testHelper');
const request = require('supertest');
const { assert } = require('chai');
const {describe, it, before} = require('mocha');
const { resource } = require('../../../server/server');

let token; 

describe('testing /Auth/generateToken', function() {
    // this.timeout(10000);
    
    it('checking generateToken function with missing x-host', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'content-type': source.contentType,
            'x-date': source.xDate,
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 400);
            assert.deepEqual(response.body.message, "Bad request")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });
    
    it('checking generateToken function with missing x-date', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'content-type': source.contentType,
            'x-host': source.xHost
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 400);
            assert.deepEqual(response.body.message, "Bad request")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });
    
    it('checking generateToken function with missing content-type', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'x-date': source.xDate,
            'x-host': source.xHost
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 200);
            assert.deepEqual(response.body.message, "Success")
            assert.deepEqual(response.body.success, true)
            done();
        });
        
    });
    
    it('checking generateToken function with missing h-mac', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'content-type': source.contentType,
            'x-date': source.xDate,
            'x-host': source.xHost
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 400);
            assert.deepEqual(response.body.message, "Bad request")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });
    
    it('checking generateToken function with future x-date', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'content-type': source.contentType,
            'x-date': 'Sat, 21 Nov 2029 01:22:57 GMT',
            'x-host': source.xHost
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 400);
            assert.deepEqual(response.body.message, "Bad request")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });

    it('checking generateToken function with invalid x-date', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'content-type': source.contentType,
            'x-date': 'Sat, 21 2020 01:22:57',
            'x-host': source.xHost
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 400);
            assert.deepEqual(response.body.message, "Bad request")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });

    it('checking generateToken function with invalid host-name', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': source.clientID,
            'hmac-signature': source.hmacSignature,
            'content-type': source.contentType,
            'x-date': source.xDate,
            'x-host': 'fakeHost.ca'
        })
        .end((err, response) => {
            if (err) throw err;
            assert.typeOf(response.body, 'object', 'response includes is data type object')
            assert.deepEqual(response.status, 401);
            assert.deepEqual(response.body.message, "Invalid credentials")
            assert.deepEqual(response.body.success, false)
            done();
        });
        
    });

    it('checking generateToken function with ServifyTestEncrypt with no data', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': 'ServifyTest_Encrypt',
            'hmac-signature': 'Mx/DNlRZCApj8TPznbYuqPYuGdxBCnPSGXjuaUL6m48=',
            'content-type': 'application/json',
            'x-date': 'Sun, 04 Aug 2019 13:22:57 GMT',
            'x-host': 'servify.com'
        })
        .end((err, response) => {
            if (err) throw err;
            assert.deepEqual(response.status, 401);
            assert.typeOf(response,'object','response is data type object');
            done();
        });
        
    });

    it('checking generateToken function with ServifyTestEncrypt with data', (done) => {
        request(source.app)
        .post('/Auth/generateToken')
        .set({
            'client-id': 'ServifyTest_Encrypt',
            'hmac-signature': 'Mx/DNlRZCApj8TPznbYuqPYuGdxBCnPSGXjuaUL6m48=',
            'content-type': 'application/json',
            'x-date': 'Sun, 04 Aug 2019 13:22:57 GMT',
            'x-host': 'servify.com'
        })
        .send({ 
            "data": "hKANdRHFpSGovg934E6ccL3K+gbTtB6FjDpg5Wrv6XJGMKRSyllJUkW7jvJfQIPp/BeNgdTV6zMzGsJ+bKxXlY/r0ESyCLXMhvyspnieD8YRpbyg1/HDcI43rvZgiR5Nn4aRasAc8p+B4M202ZpbsNq0UTn4AMoSqXgcVhbLJuuqVaU32zUH6X5xyTc92QJCtVPJqcVeEKVKTLEFBiC8e2ukcjLhLr+KjaE1d4gT7Z5k+k8NfhlIvrF9HB8UlDCgQbbhWLcdbnQcndd5AYpPEm2wUrE+dXSBdNOvujd62dXSBrQKdq4CJFAurbITKG/2V/mH5Yon5dGQwjl9Xwv9tg==" 
        })
        .end((err, response) => {
            if (err) throw err;
            assert.deepEqual(response.status, 401);
            assert.typeOf(response,'object','response is data type object');
            done();
        });
        
    });


    it('checking generateToken function', (done) => {
        request(source.app)
            .post('/Auth/generateToken')
            .set({
                'client-id': source.clientID,
                'hmac-signature': source.hmacSignature,
                'content-type': source.contentType,
                'x-date': source.xDate,
                'x-host': source.xHost
            })
            .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body, 'object', 'response includes is data type object')
                assert.deepEqual(response.status, 200);
                assert.deepEqual(response.body.message, "Success")
                assert.typeOf(response.body.data.token, 'string', 'message from response is a string');
                token = response.body.data.token;
               done();
            });
           
    });
    
});


describe('testing /Auth/getToken', function() {
    // this.timeout(10000);
    it('checking getToken function', (done) => {
        request(source.app)
            .get('/Auth/getToken')
            .set({
                'client-id': source.clientID,
                'hmac-signature': source.hmacSignature,
                'client-session-id' : '38797b10-d673-11ea-aec9-337635531c83',
                'content-type': source.contentType,
                'x-date': source.xDate,
                'x-host': source.xHost
            })
            .end((err, response) => {
                if (err) throw err; 
                assert.typeOf(response.body, 'object', 'response includes is data type object')
                assert.deepEqual(response.status, 200);
                assert.deepEqual(response.body.message, "Success")
                assert.typeOf(response.body.data.token, 'string', 'message from response is a string');
                done();
            });
    });
});

module.exports = () => {
    return token;
}


