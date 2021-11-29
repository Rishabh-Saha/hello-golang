const source = require('../../testHelper');
const request = require('supertest');
const { assert } = require('chai');
const {describe, it, before} = require('mocha');
const { response } = require('express');
const token = require('./auth')



describe('Testing external-client function', function(){
    // this.timeout(5000)
   
    // it('testing external-client API with fake clientID', (done) => {
    //     request(source.app)
    //         .get('/internal/external-client')
    //         .set({
    //             'client-id': "FakeServifyTest",
    //             'hmac-signature': source.hmacSignature,
    //             'content-type': source.contentType,
    //             'x-date': source.xDate,
    //             'x-host': source.xHost,
    //             'client-session-id' : token()
    //         })
    //         .end((err, response) => {
    //             if (err) throw err;
    //             assert.deepEqual(response.body.message, "Invalid credentials");
    //             assert.deepEqual(response.body.success, false);
    //             assert.deepEqual(response.body.status, 401);
    //             done();
    //       })
    // }) //commented for initial uat to work
    it('testing external-client API', (done) => {
        request(source.app)
            .get('/internal/external-client')
            .set({
                'client-id': source.clientID,
                'hmac-signature': source.hmacSignature,
                'content-type': source.contentType,
                'x-date': source.xDate,
                'x-host': source.xHost,
                'client-session-id' : token()
            })
            .end((err, response) => {
                if (err) throw err;
                assert.deepEqual(response.body.message, "Client details fetched successfully");
                assert.deepEqual(response.body.data.ClientName, "ServifyTest");
                assert.deepEqual(response.body.data.ExternalClientID, 1);
                done();
          })
    })

})