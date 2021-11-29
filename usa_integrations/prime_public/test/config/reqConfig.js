const reqConfig = require('../../src/config/reqConfig.json');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('testing request configuration file', function(){
    it('checking if request configuation objects exist', function(){
        assert.exists(reqConfig['/User/requestPIN1'], 'request object exists');
        assert.exists(reqConfig['/User/requestPIN1'].ServifyTest_Encrypt, 'ServifyTest encrypt exists');
        assert.exists(reqConfig['/User/requestPIN1'].ServifyTest, 'ServifyTest exists');

    })
})