const { getExternalClientShelter } = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const source = require('../testHelper');
const _ = source._;

let externalClientShelter;
let servifyTestShelter;

describe('Schema check for external_client_shelter', function () {
    // this.timeout(4000);
    before(async () => {
        externalClientShelter = await getExternalClientShelter(5);
        servifyTestShelter = await getExternalClientShelter(1);
    });
    it('Checking externalClientShelter data', async () => {
        _.map(externalClientShelter, (eachClient) => {
            assert.typeOf(eachClient.ShelterAlgoID, 'number', 'ShelterAlgoID is a number');
            assert.typeOf(eachClient.ApiDirection, 'string', 'ApiDirection is a string');
            assert.typeOf(eachClient.ParamName, 'string', 'ParamName is a string');
            assert.typeOf(eachClient.ParamValue, 'string', 'ParamValue is a string');
            assert.deepEqual(eachClient.ParamType, 'PEM');
            assert.include(['ENCRYPTION', 'DECRYPTION'], eachClient.KeyType, 'KeyType must be at least one of these values')
        });
    })

    it('Checking servifyTestShelter data', async () => {
        _.map(servifyTestShelter, (eachClient) => {
            assert.typeOf(eachClient.ShelterAlgoID, 'number', 'ShelterAlgoID is a number');
            assert.deepEqual(eachClient.ShelterAlgoID, 3);
            assert.typeOf(eachClient.ApiDirection, 'string', 'ApiDirection is a string');
            assert.include(['IN', 'OUT'], eachClient.ApiDirection, 'ApiDirection must be at least one of these values')
        });
    })
});