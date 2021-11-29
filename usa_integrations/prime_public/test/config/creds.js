const creds = require('../../src/config/creds.json');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;


describe('testing Creds file', function(){
    
    it('checking if creds exists', function(){
        assert.exists(creds.bluedart, 'bluedart creds exist');
        assert.exists(creds.flipkart, 'flipkart creds exist');
    });

    it('checks if all keys for bluedart exist',function(){
        const bluedartCreds = creds.bluedart;
        assert.exists(bluedartCreds.LicenseKey, 'license key exist');
        assert.isNotEmpty(bluedartCreds.LicenseKey, 'license is not empty');
        assert.exists(bluedartCreds.clientName, 'clientName key exist');
        assert.isNotEmpty(bluedartCreds.clientName, 'clientName is not empty');
    });

    it('checks if all keys for flipkart exist',function(){
        const flipkartCreds = creds.flipkart;
        assert.exists(flipkartCreds.LicenseKey, 'license key exist');
        assert.isNotEmpty(flipkartCreds.LicenseKey, 'license is not empty');
        assert.exists(flipkartCreds.clientName, 'clientName key exist');
        assert.isNotEmpty(flipkartCreds.clientName, 'clientName is not empty');
    })
})