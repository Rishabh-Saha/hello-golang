const assert = require('chai').assert;
const expect = require('chai').expect;
const generateHMAC = require('../../../src/utils/middleware-helper/generateHmac');
const describe = require('mocha').describe;
const it = require('mocha').it;

const validHmacSignature = '7VlailmR0NvCX3GLnQi+RhbRuY+sRUt3rjBoX5PMV70=';

let date = 'Thu, 29 Apr 2021 19:24:31 GMT';
let host = 'servify.com';
let string = `x-date: ${date}\nx-host: ${host}`;
let secret = 'QfXf4r4ae2Q4AWFchFQzT8E8WfaJTQLhjcDvhXBxz6FCYkRnFm5HvRftsQPk8gGM';

describe('generateHMAC', () => {
    //success
    it('checks if HMAC is generated properly', () => {

        const response = generateHMAC({ string, secret });
        assert.equal(response, validHmacSignature);
    });

    //failures
    it('checks for an error when no parameters are passed', () => {
        try {
            generateHMAC();
            assert.fail('expected exception not thrown');
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('checks for an error against invalid secret', () => {
        try {
            generateHMAC({ string, secret: null });
            assert.fail('expected exception not thrown');
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('checks for an error against invalid string', () => {
        const response = generateHMAC({ string: '', secret });
        assert.notDeepEqual(response, validHmacSignature)
    });

    it('checks for an error against invalid host', () => {
        host = 'test.com';
        string = `x-date: ${date}\nx-host: ${host}`;
        const response = generateHMAC({ string, secret });
        assert.notDeepEqual(response, validHmacSignature)
    });
});