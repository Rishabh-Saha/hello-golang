const apiList = require('../../../src/utils/helper-functions/apilist');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;


let testApiDetails = null;

describe('getApiList', function () {
    // this.timeout(5000);
    it('testing getApiList function', async () => {
        const response = await apiList.getApiList();
        assert.typeOf(response, 'array', 'getApiList response is an array');
        response.forEach(x => {
            expect(x.Active).to.equal(1);
            if(x.RouteType === 'common' && !testApiDetails){
                testApiDetails = x;
            }

        })
    })
})

describe('getApiConfig', function () {
    it('testing getApiConfig function', async () => {
        const response = await apiList.getAPIConfig(testApiDetails.ApiName.toLowerCase());
        assert.typeOf(response.ApiName, 'string', 'message from response is a string');
        assert.deepEqual(response.ApiName, testApiDetails.ApiName);
        assert.deepEqual(response.ApiMethod, testApiDetails.ApiMethod);
        assert.deepEqual(response.DownstreamMethod, testApiDetails.DownstreamMethod);
        assert.deepEqual(response.DownstreamModule, testApiDetails.DownstreamModule);
        assert.deepEqual(response.DownstreamApiName, testApiDetails.DownstreamApiName);
        assert.deepEqual(response.RouteType, testApiDetails.RouteType);
        expect(response.Active).to.equal(1);
    });

    it('testing getApiConfig function with fake end point', async () => {
        const response = await apiList.getAPIConfig('/internal/fakeEndpoint');
        assert.typeOf(response, 'undefined', 'the response is undefined')
    })

})
