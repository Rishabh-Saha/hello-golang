const assert = require('chai').assert;
const expect = require('chai').expect;
const downStreamApiCallerFunction = require('../../../src/utils/request-helper/downStreamApiFunction');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('downStreamApiCallerFunction', function() {
    // this.timeout(10000);
    it('no api name provided', async() => {
        const result = await downStreamApiCallerFunction({});
        assert.typeOf(result, 'object', 'The response is data type object');
        expect(result).that.includes.all.keys([
            'success',
            'message',
            'data',
            'status'
        ]);
        assert.equal(result.success, false);
        assert.equal(result.message, "Something went wrong");
        assert.deepEqual(result.data, {});
        assert.equal(result.status, 500);

    });

    it('testing api which does not exist',async () => {
        const result = await downStreamApiCallerFunction({
            apiName: 'User/isServifyConsumer'
        });
        assert.typeOf(result, 'object', 'The response is data type object');
        expect(result).that.includes.all.keys([
            'success',
            'message',
            'data',
            'status'
        ]);
        assert.equal(result.success, false);
        assert.equal(result.message, "Invalid REST action");
        assert.deepEqual(result.data, {});
        assert.equal(result.status, 404);
    });

    it('calling api without downstream module reference',async () => {
        const result = await downStreamApiCallerFunction({
            apiName: '/internal/external-client'
        });
        assert.typeOf(result, 'object', 'The response is data type object');
        expect(result).that.includes.all.keys([
            'success',
            'message',
            'data',
            'status'
        ]);
        assert.equal(result.success, false);
        assert.equal(result.message, "Something went wrong");
        assert.deepEqual(result.data, {});
        assert.equal(result.status, 500);
    });

    it('testing for proper api with false message',async () => {
        try {
            const result = await downStreamApiCallerFunction({
                "apiName": '/User/requestPIN',
                "MobileNo": 9028615024,
                "PhoneCode": 91,
                "app": "Oneplus"
            })
            expect(result).that.includes.all.keys([
                'status',
                'success',
                'msg',
                'messageCode',
                'languagecode',
                'data',
                'message',
            ]);
            assert.equal(result.success, false);
            assert.equal(result.message, "Insufficient Parameters");
            assert.equal(result.msg, "Insufficient parameters");
            assert.equal(result.messageCode, "ERR_CORE_002");
            assert.deepEqual(result.data, [ 'MobileNo' ]);
            assert.equal(result.status, 400);
        } catch (error) {
            assert.equal(2, 1);
            
        }
    });

    it('testing for proper api',async () => {
        try {
            const result = await downStreamApiCallerFunction({
                "apiName": '/User/requestPIN',
                "MobileNo": "9028615024",
                "PhoneCode": 91,
                "app": "Oneplus"
            });
            expect(result).that.includes.all.keys([
                'status',
                'success',
                'msg',
                'data'
            ]);
            assert.equal(result.success, true);
            assert.equal(result.msg, "OTP sent");
            assert.typeOf(result.data, 'object', 'data is an object');
            assert.equal(result.status, 200);
        } catch (error) {
            assert.equal(2, 1);
        }
    });

    
});