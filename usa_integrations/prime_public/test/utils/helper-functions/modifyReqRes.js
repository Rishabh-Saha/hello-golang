const modifyReqRes = require('../../../src/utils/helper-functions/modifyReqRes');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');

let responseObj = {
    status: 200,
    success: true,
    message: 'Success',
    keys: {},
    token: '6881e8b0-cd3f-11eb-8291-41eb3d184cf1',
    ttl: 1623696678
};

let requestObj = {
    MobileNumber: '2284346812'
}

describe('Testing modifyReqRes function', function () {
    
    it('Testing modifyReqRes with no parameters', function () {
        const response = modifyReqRes();
        assert.typeOf(response, 'undefined', 'The response is data type undefined')
    })

    it('Testing modifyReqRes without passing ApiName or clientId', function () {
        const response = modifyReqRes(responseObj, 'response');
        assert.typeOf(response, 'object', 'The response is data type object')
        assert.deepEqual(response.status, responseObj.status);
        assert.deepEqual(response.success, responseObj.success);
        assert.deepEqual(response.message, responseObj.message);
        assert.deepEqual(response.keys, responseObj.keys);
        assert.deepEqual(response.token, responseObj.token);
        assert.deepEqual(response.ttl, responseObj.ttl);
    })
    
    it('Testing modifyReqRes without sending ApiName', function () {
    const response = modifyReqRes(responseObj, 'response', '', 'ServifyTest');
        assert.typeOf(response, 'object', 'The response is data type object')
        assert.deepEqual(response.status, responseObj.status);
        assert.deepEqual(response.success, responseObj.success);
        assert.deepEqual(response.message, responseObj.message);
        assert.deepEqual(response.keys, responseObj.keys);
        assert.deepEqual(response.token, responseObj.token);
        assert.deepEqual(response.ttl, responseObj.ttl);
    })

    it('Testing modifyReqRes without sending clientId', function () {
        const response = modifyReqRes(responseObj, 'response', '/Auth/generateToken1', '');
        assert.typeOf(response, 'object', 'The response is data type object')
        assert.deepEqual(response.status, responseObj.status);
        assert.deepEqual(response.success, responseObj.success);
        assert.deepEqual(response.message, responseObj.message);
        assert.deepEqual(response.keys, responseObj.keys);
        assert.deepEqual(response.token, responseObj.token);
        assert.deepEqual(response.ttl, responseObj.ttl);
    })

    it('Testing modifyReqRes with a response Object', function () {
        const response = modifyReqRes(responseObj, 'response','/Auth/generateToken1','ServifyTest');
        assert.typeOf(response, 'object', 'The response is data type object')
        assert.deepEqual(response.tok, responseObj.token);
        assert.deepEqual(response.tt, responseObj.ttl);
    })

    it('Testing modifyReqRes with a request Object', function () {
        const response = modifyReqRes(requestObj, 'request','/User/requestPIN1','ServifyTest_Encrypt');
        assert.typeOf(response, 'object', 'The response is data type object')
        assert.deepEqual(response.MobileNo, requestObj.MobileNumber);
        assert.typeOf(response.MobileNo, 'string', 'The response.mobileNumber is data type string')
    })
    


    
})
