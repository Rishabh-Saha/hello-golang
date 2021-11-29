const errorWrapper = require('../../../src/utils/helper-functions/errorWrapper');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;

const errorMessage = 'There has been an error that occurred';

const errorObject = {
    'Value': 4,
    'Message': 'This is a test'
}

describe('errorWrapper', function () {
    it('Testing errorWrapper by passing it a String', function () {
        const response = errorWrapper(errorMessage);
        assert.typeOf(response, 'Error', 'errorWrapper response is a Error');
        assert.typeOf(response.message, 'string', 'errorWrapper response message is a string');
        assert.deepEqual(response.message, 'There has been an error that occurred');
    });

    it('Testing errorWrapper by passing it an Integer', function () {
        const response = errorWrapper(1);
        assert.typeOf(response, 'Error', 'errorWrapper response is a Error');
        assert.strictEqual(response.message, '1');
    });

    it('Testing errorWrapper by passing it an Object', function () {
        const response = errorWrapper(errorObject);
        assert.typeOf(response, 'Error', 'errorWrapper response is a Error');
    });

    it('Testing errorWrapper by passing it a new Error', function () {
        const response = errorWrapper(new Error('Internal Server Error'));
        assert.typeOf(response, 'Error', 'errorWrapper response is a Error');
        assert.typeOf(response.message, 'string', 'errorWrapper response message is a string');
        assert.deepEqual(response.message, 'Internal Server Error');
    });
})