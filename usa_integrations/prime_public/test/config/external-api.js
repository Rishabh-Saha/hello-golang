const externalApi = require('../../src/config/external-api.json');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('Checking for external apis', function(){
    it('Checking if external apis exist', function(){
        assert.exists(externalApi.coreApi, 'coreApi exists'); 
        assert.exists(externalApi.logisticsApi, 'logisticsApi exists');
        assert.exists(externalApi.billingApi, 'billingApi exists');
        assert.exists(externalApi.partApi, 'partApi exists');
        assert.exists(externalApi.aegisApi, 'aegisApi exists');
        assert.exists(externalApi.webApi, 'webApi exists');
    })
})
