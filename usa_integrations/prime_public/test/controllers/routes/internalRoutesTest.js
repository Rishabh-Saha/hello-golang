const source = require('../../testHelper');
const request = require('supertest');
const { assert } = require('chai');
const {describe, it, before} = require('mocha');
const { response } = require('express');
const token = require('./auth')


let integrationApiTestData = {
    "cacheList": ["clientSSODetails","clientSSOCredentials"], 
    "moduleName":"IntegrationAPI"
}


describe('testing internal/getAllCachedKeys route function', function(){
    // this.timeout(4000);
   
    it('testing getAllCachedKeys function', (done) => {
        request(source.app)
            .post('/internal/getAllCachedKeys')
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
                assert.deepEqual(response.body.success, true);
                assert.deepEqual(response.body.status, 200);
                assert.deepEqual(response.body.message, "All cached keys");
                done();
          })
    })
})

describe('testing internal/deleteCacheList route function', function(){
    // this.timeout(4000);
    
    // it('testing deleteCacheList function', (done) => {
    //     request(source.app)
    //         .post('/internal/deleteCacheList')
    //         .set({
    //             'client-id': source.clientID,
    //             'hmac-signature': source.hmacSignature,
    //             'content-type': source.contentType,
    //             'x-date': source.xDate,
    //             'x-host': source.xHost,
    //             'client-session-id' : token()
    //         })
    //         .send(integrationApiTestData)
    //         .end((err, response) => {
    //             if (err) throw err;
    //             assert.deepEqual(response.body.success, true);
    //             assert.deepEqual(response.body.status, 200);
    //             done();
    //       })
    // })//commented for initial uat to work
})

describe('testing internal/rebuildRoute', function(){
    // this.timeout(6000);
   
    it('testing rebuildRoute function', (done) => {
        request(source.app)
            .get('/internal/rebuildRoute')
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
                assert.deepEqual(response.body.success, true);
                assert.deepEqual(response.body.status, 200);
                assert.deepEqual(response.body.message, "Successfully rebuilt routes");
                done();
          })
    })
})

describe('testing internal/getCachedKeyValue route function', function(){
    // this.timeout(5000);
   
    it('testing getCachedKeyValue function', (done) => {
        request(source.app)
            .post('/internal/getCachedKeyValue')
            .set({
                'client-id': source.clientID,
                'hmac-signature': source.hmacSignature,
                'content-type': source.contentType,
                'x-date': source.xDate,
                'x-host': source.xHost,
                'client-session-id' : token()
                
            })
            .send({
                "keyName": "public_getClientDetails"
            })
            .end((err, response) => {
                if (err) throw err;
                assert.deepEqual(response.body.success, true);
                assert.deepEqual(response.body.status, 200);
                assert.deepEqual(response.body.message, "Value for the required cached key");
                done();
          })
    })
})

describe('Testing internal/burstCache route function', function() {
    // this.timeout(4000);
  
    it('testing burstCache function', (done) => {
        request(source.app)
            .get('/internal/burstCache')
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
                assert.deepEqual(response.body.success, true);
                assert.deepEqual(response.body.status, 200);
                assert.deepEqual(response.body.message, "Deleted all keys successfully");
                done();
          })
    })
})