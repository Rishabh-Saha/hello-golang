const getValidationError = require('../../../src/utils/helper-functions/getValidationErrors');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;


const testFunction = function(){
    const test = 'hello'
}

const successTestObject = {
    Test1: "This is a test string", 
    Test2: 36, 
    Test3: true,
    Test4: testFunction,
    Test5: [1,2,3,4,5,6], 
    Test6: {
        randomKey: 'hello'
    }
}

const failTestObject = {
    Test1: 1, 
    Test2: '', 
    Test3: true
}


const validation = [ 
    {
        key: 'Test1',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => typeof value === 'string',
                getErrorMsg: key => `${key} should be a string`
            }
        ]
    },
   
    {
        key: 'Test2',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => typeof value === 'number',
                getErrorMsg: key => `${key} should be a Number`
            }
        ]
    },

    {
        key: 'Test3',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => typeof value === 'boolean',
                getErrorMsg: key => `${key} should be a Boolean`
            }
        ]
    },

    {
        key: 'Test4',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => typeof value === 'function',
                getErrorMsg: key => `${key} should be a function`
            }
        ]
    },

    {
        key: 'Test5',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => Array.isArray(value),
                getErrorMsg: key => `${key} should be a array`
            }
        ]
    }, 

    {
        key: 'Test6',
        rules: [
            {
                isValid: value => !!value,
                getErrorMsg: key => `${key} is missing`
            },
            {
                isValid: value => typeof value === 'object',
                getErrorMsg: key => `${key} should be a object`
            }
        ]
    }
    
];


describe('getValidationErrors', function(){
    it('testing getValidationError by passing no data', function(){
        try {
            const response = getValidationError();
            assert.fail('expected exception not thrown');
        } catch(err){
            assert.deepEqual(err.message, "Cannot destructure property 'validations' of 'undefined' as it is undefined.");
        }
    })

    it('testing getValidationError with data', function(){
        const response = getValidationError({validations: validation, data: successTestObject});
        assert.typeOf(response,'boolean','the response is data type boolean');
        assert.deepEqual(response, false);
    })

    it('testing getValidationError with false data', function(){
        const response = getValidationError({validations: validation, data: failTestObject});
        assert.deepEqual(response[0].Test1[0], 'Test1 should be a string');
        assert.deepEqual(response[1].Test2[0], 'Test2 is missing');
        assert.deepEqual(response[1].Test2[1], 'Test2 should be a Number');
    })
})