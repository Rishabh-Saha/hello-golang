const respConfig = require('../../src/config/respConfig.json');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('testing response configuration file', function(){
    it('checking if response configuation objects exist', function(){
        assert.exists(respConfig['/financepartners/dmi/receiveOfferDetails1'], 'response object exists');
        assert.exists(respConfig['/financepartners/dmi/receiveOfferDetails1'].ServifyTest, 'ServifyTest exists');
        assert.exists(respConfig['/financepartners/dmi/receiveOfferDetails1'].ServifyTest_Encrypt, 'ServifyTest encrypt exists');
        assert.exists(respConfig['/Auth/generateToken1'], 'response object exists');
        assert.exists(respConfig['/Auth/generateToken1'].ServifyTest, 'ServifyTest exists');
    })
})