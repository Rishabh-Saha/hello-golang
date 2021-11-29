const request = require('supertest');
const { assert } = require('chai');
const { describe, it, before } = require('mocha');
const source = require('../../../testHelper');
const token = require('../auth')



describe("Testing commonRoute function", function () {
    // this.timeout(4000);
    it('testing requestOTP function', (done) => {
        request(source.app)
            .post('/User/requestPIN')
            .set({
                'client-id': 'ServifyTest',
                'hmac-signature': 'q9Y3R2PIS8VV7dMaksasT8THUORK+2qZdWzLjP7wRFQ=',
                'content-type': 'application/json',
                'x-date': 'Sat, 21 Nov 2020 01:22:57 GMT',
                'x-host': 'servify.com',
                'client-session-id': token()
            })
            .send({
                "MobileNo": "9028615035",
                "PhoneCode": 91,
                "app": "Oneplus"
            })
            .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.data.allowResend, 'boolean', 'allowResend is type boolean')
                assert.deepEqual(response.body.data.app, "Oneplus")
                done();
            })
    })

    it('testing requestOTP function with fake data', (done) => {
        request(source.app)
            .post('/User/requestPIN')
            .set({
                'client-id': 'ServifyTest',
                'hmac-signature': 'q9Y3R2PIS8VV7dMaksasT8THUORK+2qZdWzLjP7wRFQ=',
                'content-type': 'application/json',
                'x-date': 'Sat, 21 Nov 2020 01:22:57 GMT',
                'x-host': 'servify.com',
                'client-session-id': token()
            })
            .send({
                "MobileNo": 9028615024,
                "PhoneCode": 91,
                "app": "Oneplus"
            })
            .end((err, response) => {
                if (err) throw err;
                assert.deepEqual(response.body.success, false)
                assert.deepEqual(response.body.message, "Insufficient Parameters")
                done();
            })
    })

    it('testing requestOTP function with no client-session-ID', (done) => {
        request(source.app)
            .post('/User/requestPIN')
            .set({
                'client-id': 'ServifyTest',
                'hmac-signature': 'q9Y3R2PIS8VV7dMaksasT8THUORK+2qZdWzLjP7wRFQ=',
                'content-type': 'application/json',
                'x-date': 'Sat, 21 Nov 2020 01:22:57 GMT',
                'x-host': 'servify.com',

            })
            .send({
                "MobileNo": "9028615035",
                "PhoneCode": 91,
                "app": "Oneplus"
            })
            .end((err, response) => {
                if (err) throw err;
                assert.deepEqual(response.body.success, false)
                assert.deepEqual(response.body.message, "Bad request")
                done();
            })
    })

    it('testing requestOTP function with invalid client-session-ID', (done) => {
        request(source.app)
            .post('/User/requestPIN')
            .set({
                'client-id': 'ServifyTest',
                'hmac-signature': 'q9Y3R2PIS8VV7dMaksasT8THUORK+2qZdWzLjP7wRFQ=',
                'content-type': 'application/json',
                'x-date': 'Sat, 21 Nov 2020 01:22:57 GMT',
                'x-host': 'servify.com',
                'client-session-id': 'jdcjasfijjvkjsjdknjibhkjks==KD'

            })
            .send({
                "MobileNo": "9028615035",
                "PhoneCode": 91,
                "app": "Oneplus"
            })
            .end((err, response) => {
                if (err) throw err;
                assert.deepEqual(response.body.success, false)
                assert.deepEqual(response.body.message, "Token is either invalid or expired, please generate again!")
                done();
            })
    })



})

