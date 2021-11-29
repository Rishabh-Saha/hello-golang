const assert = require('chai').assert;
const removeUnnecessaryData = require('../../../src/utils/request-helper/removeUnnecessaryData');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('removeUnnecessaryData', () => {
    let obj = {
        externalClient: {},
        clientShelterCreds: {},
        headers: {},
        apiName: '/OTP/requestOTP'
    };
    
    it('sent a string', () => {
        const response = removeUnnecessaryData();
        assert.isObject(response);
    });

    it('no data sent', () => {
        const response = removeUnnecessaryData({});
        assert.isObject(response);
        assert.isEmpty(response);
    });

    it('checks for non-existence of the keys', () => {
        obj.randomVal = {};
        const response = removeUnnecessaryData(obj);
        assert.isObject(response);
        assert.exists(response.randomVal);
        assert.notExists(response.externalClient);
        assert.notExists(response.clientShelterCreds);
        assert.notExists(response.headers);
        assert.notExists(response.apiName);
    });
});