const assert = require('chai').assert;
const expect = require('chai').expect;
const isValidHMAC = require('../../../src/utils/middleware-helper/isValidHmac');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('isValidHMAC', () => {
    let date = 'Thu, 29 Apr 2021 19:24:31 GMT';
    let host = 'servify.com';
    let secret = 'QfXf4r4ae2Q4AWFchFQzT8E8WfaJTQLhjcDvhXBxz6FCYkRnFm5HvRftsQPk8gGM';
    let clientHmac = '7VlailmR0NvCX3GLnQi+RhbRuY+sRUt3rjBoX5PMV70=';

    it('checks for an error when no parameters are passed', () => {
        try {
            isValidHMAC();
            assert.fail('expected exception not thrown');
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('checks for a true response for a valid hmac', () => {
        const response = isValidHMAC({clientHmac, date, host, secret});
        assert.isBoolean(response);
        assert.equal(response, true);
    });

    it('checks for a false response for a invalid hmac', () => {
        clientHmac +=  'random';
        const response = isValidHMAC({clientHmac, date, host, secret});
        assert.isBoolean(response);
        assert.equal(response, false, 'hmac does not match');
    });
})