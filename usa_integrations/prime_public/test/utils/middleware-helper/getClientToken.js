const assert = require('chai').assert;
const getClientToken = require('../../../src/utils/middleware-helper/getClientToken');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('getClientToken', () => {
    it('checks for no response without a key', async() => {
        const response = await getClientToken();
        assert.isNull(response, 'No key was found');
    });

    it('checks for a response when key is sent', async() => {
        //Make sure generateToken has been hit for ServifyTest
        const tokenData = {}
        tokenData.headers = {};
        tokenData.headers.ExternalClientID = '1';
        const response = await getClientToken(tokenData);
        assert.isString(response, 'Auth token fetched');
        assert.lengthOf(response, 36);
    });

    it('checks for a response when wrong key is sent', async() => {
        //Make sure generateToken has been hit for ServifyTest
        const tokenData = {}
        tokenData.headers = {};
        tokenData.headers.ExternalClientID = '9999';
        const response = await getClientToken(tokenData);
        assert.isNull(response, 'No key was found');
    });
})