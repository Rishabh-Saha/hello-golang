const { getApiLists } = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const source = require('../testHelper');
const _ = source._;

let apiList;

describe('Schema check for api_list', function () {
    // this.timeout(3000);
    before(async () => {
        apiList = await getApiLists();
    });
    it('Checking ApiId column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.ApiId, 'number', 'ApiId is a number');
        });
    })
    it('Checking ApiName column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.ApiName, 'string', 'ApiName is a number');
        });
    })
    it('Checking ApiMethod column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.ApiMethod, 'string', 'ApiMethod is a string');
        });
    })
    it('Checking DownStreamModule column', async () => {
        _.map(apiList, (eachClient) => {
            assert.include([null, 'CoreApi', 'Aegis', 'Billing', 'WebApp', 'Logistics', 'PartnerOnboarding', ''], eachClient.DownstreamModule,
                'DownstreamModule must be at least one of these values')
        });
    })
    it('Checking DownStreamApiName column', async () => {
        _.map(apiList, (eachClient) => {
            if (eachClient.DownstreamApiName != null) {
                assert.typeOf(eachClient.DownstreamApiName, 'string', 'ApiMethod is a string');
            } else {
                assert.deepEqual(eachClient.DownstreamApiName, null)
            }
        });
    })
    it('Checking DownStreamMethod column', async () => {
        _.map(apiList, (eachClient) => {
            assert.include(['', 'POST', 'GET'], eachClient.DownstreamMethod,
                'DownstreamMethod must be at least one of these values')
        });
    })
    it('Checking RouteType column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.RouteType, 'string', 'RouteType is a string');
            assert.include(['v1', 'internal', 'service', 'common', 'authentication'], eachClient.RouteType,
                'RouteType must be at least one of these values')
        });
    })
    it('Checking Active column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.Active, 'number', 'Active is a string');
            assert.include([0, 1], eachClient.Active, 'Active is either true or false')
        });
    });
    it('Checking Archived column', async () => {
        _.map(apiList, (eachClient) => {
            assert.typeOf(eachClient.Archived, 'number', 'Archived is a string');
            assert.include([0, 1], eachClient.Archived, 'Archived is either true or false')
        });
    });

})