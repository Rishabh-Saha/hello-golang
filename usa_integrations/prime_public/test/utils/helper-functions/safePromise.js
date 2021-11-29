const safePromise = require('../../../src/utils/helper-functions/safePromise');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;

function testFunction() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000)
    })
}

async function testFunctionReject() {
    await Promise.reject(new Error("Error"));
}


async function callTestFunction() {
    const response = await testFunction();
    return response
}

describe('safePromise', function () {
    // this.timeout(3000);
    it('Testing safePromise with testFunction', async () => {
        const response = await safePromise(testFunction());
        assert.typeOf(response, 'array', 'the response is data type array')
        assert.deepEqual(response[1], 'resolved');
    })

    it('Testing safePromise with testFunction reject', async () => {
        const response = await safePromise(testFunctionReject());
        assert.deepEqual(response[0].message, 'Error');
        assert.typeOf(response, 'array', 'response is a Error');
    })

    it('Testing safePromise with async await function', async () => {
        const response = await safePromise(callTestFunction());
        assert.typeOf(response, 'array', 'the response is data type array')
        assert.deepEqual(response[1], 'resolved');
    })

    it('Testing safePromise without passing it a function', async () => {
        try {
            const response = await safePromise();
            assert.fail('expected exception not thrown');
        } catch (err) {
            assert.deepEqual(err.message, "Cannot read property 'then' of undefined");
        }

    })
})