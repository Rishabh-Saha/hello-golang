const {getClientWhitelistedApis} = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const source = require('../testHelper');
const _ = source._;

let whiteListedApis;

const apiNames = [
    'ServiceRequest/scheduleRequest',
    'ServiceRequest/getSlots',
    'ServiceRequest/updateRequest',
    'ServiceRequest/trackRequest',
    'Auth/generateToken',
    'SimpleCache/get',
    'Open/inventoryManagement',
    'SoldPlan/createSoldPlan',
    'ServiceRequest/getClaimStatus'
]

describe('Schema check for client_whitelisted_apis', function () { 
    this.timeout(3000);
    before(async() => {
        apiList = await getClientWhitelistedApis(1);
    });
    it('Checking ClientWhiteListedApiID', async() =>{
        _.map(whiteListedApis, (eachClient)=>{
            assert.typeOf(eachClient.ApiName, 'string', 'whiteListedApis is a string');
            assert.include(apiNames, eachClient.ApiName, 'ClientWhiteListedApi must be at least one of these values')
         });
    })
})
