const { getAllShelterAlgos } = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const source = require('../testHelper');
const _ = source._;

let shelterAlgos;

const algoConstantName = ['RSA', 'AES-256-GCM', 'NO-ENCRYPTION'];
const algoID = [1, 2, 3];

describe('Schema check for shelter_algos', function () {
    // this.timeout(3000);
    before(async () => {
        shelterAlgos = await getAllShelterAlgos();
    });
    it('Checking ShelterAlgo columns', async () => {
        _.map(shelterAlgos, (eachClient) => {
            assert.typeOf(eachClient.ShelterAlgoID, 'number', 'ShelterAlgoID is a number');
            assert.include(algoID, eachClient.ShelterAlgoID, 'ShelterAlgoID must be at least one of these values')
            assert.deepEqual(eachClient.ServifyAlgoName, 'Servify Preferred')
            assert.include(algoConstantName, eachClient.ConstantName, 'ConstantName must be at least one of these values')
        });
    })

})