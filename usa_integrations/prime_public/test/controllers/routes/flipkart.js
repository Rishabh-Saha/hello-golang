const source = require('../../testHelper');
const request = require('supertest');
const { assert } = require('chai');
const {describe, it, before} = require('mocha');
const expect = require('chai').expect;
const token = require('./auth')


describe('testing flipKart functions', function(){
    // this.timeout(4000)
    it('testing flipkart activate function', (done) => {
        request(source.app)
            .post('/flipkart/activate')
            .set({
                'Content-Type':'application/json',
                'Client-Id':'FLIPKART_STAGE',
                'FK-Request-Id':'pvcpD9UAQ6xLhZOqEfag5gy2zuMwjuzNrfMubRm0QhNU',
                'Authorization':'Basic c2Z0ZXN0OnVrc3lz',
                'X-forwarded-for':'103.4.255.77'
            })
            .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.error[0].message, "string", "Error message is data type string");
                assert.deepEqual(response.body.status, "ACTIVATION_FAILED");
                assert.typeOf(response.body.error, 'array', 'response includes data type array')
                done();
          })
    })

    it('testing flipkart update function', (done) => {
        request(source.app)
            .post('/flipkart/update')
            .set({
                'Content-Type':'application/json',
                'Client-Id':'FLIPKART_STAGE',
                'FK-Request-Id':'pvcpD9UAQ6xLhZOqEfag5gy2zuMwjuzNrfMubRm0QhNU',
                'Authorization':'Basic c2Z0ZXN0OnVrc3lz',
                'X-forwarded-for':'103.4.255.77'
            })
            .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.error[0].message, "string", "Error message is data type string");
                assert.deepEqual(response.body.status, "EDIT_FAILED");
                assert.typeOf(response.body.error, 'array', 'response includes data type array')
                done();
          })
    })

})