const memoize = require('../../../src/utils/helper-functions/memoize')
const getClientDetails = require(
    '../../../src/utils/middleware-helper/getClientDetails'
)
const { keys, getKey } = require('../../../src/dal/dbhelpers/redis');
const cacheHelper = require('../../../src/services/internal-routes');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const safePromise = require('../../../src/utils/helper-functions/safePromise');


const beforeFunctionData = {
    "cacheList": [
        "getClientDetails_ServifyTest", "getClientDetails_WyJTZXJ2aWZ5VGVzdCJd"
    ],
    "moduleName": ""
}

const afterFunctionData = {
    "cacheList": ["getClientDetails_WyJTZXJ2aWZ5VGVzdCJd"],
    "moduleName": ""
}

describe('Memoize', function () {
    // this.timeout(5000);
    before(async () => {
        await cacheHelper.deleteCacheList(beforeFunctionData);
    })

    it('testing memoize function without useBase64', async () => {
        const response = await memoize(getClientDetails)({
            useBase64: false,
            keyName: 'ServifyTest'
        }, 'ServifyTest')
        assert.typeOf(response, 'object', 'The data type of the response is object');
        assert.deepEqual(response.ClientName, 'ServifyTest');
        assert.deepEqual(response.ExternalClientID, 1);

        const newLog = await getKey("public_getClientDetails_ServifyTest");
        assert.typeOf(newLog, 'object', 'The response is data type object')
        assert.deepEqual(newLog.ExternalClientID, 1);
        assert.deepEqual(newLog.ClientName, 'ServifyTest');
    })

    it('testing memoize function with useBase64', async () => {
        const response = await memoize(getClientDetails)({
            useBase64: true
        }, 'ServifyTest')
        assert.typeOf(response, 'object', 'The data type of the response is object');
        assert.deepEqual(response.ClientName, 'ServifyTest');
        assert.deepEqual(response.ExternalClientID, 1);

        const newLog = await getKey("public_getClientDetails_WyJTZXJ2aWZ5VGVzdCJd");
        assert.typeOf(newLog, 'object', 'The response is data type object')
        assert.deepEqual(newLog.ExternalClientID, 1);
        assert.deepEqual(newLog.ClientName, 'ServifyTest');
    })

    it('testing memoize function with fake external client', async () => {
        try {
            const response = await memoize(getClientDetails)({
                useBase64: false,
                keyName: 'fakeServifyTest'
            }, 'fakeServifyTest')
            assert.fail('expected exception not thrown');
        } catch (err) {
            assert.deepEqual(err.message, "No externalClient found");
            const newLog = await getKey("public_getClientDetails_fakeServifyTest");
            assert.deepEqual(newLog, null)

        }
    })
    after(async () => {
        await cacheHelper.deleteCacheList(afterFunctionData);
    })

})