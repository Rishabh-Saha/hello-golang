const { getClientWhitelistedIPs } = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const source = require('../testHelper');
const _ = source._;

let whitelistedIps;
const ipAddressType = ['', 'ipv4', 'range-v4'];

describe('Schema check for whitelisted_ips', function () {
    // this.timeout(3000);
    before(async () => {
        whitelistedIps = await getClientWhitelistedIPs();
    });
    it('Checking WhitelistedIPID coloumn', async () => {
        _.map(whitelistedIps, (eachClient) => {
            assert.typeOf(eachClient.WhitelistedIPID, 'number', 'WhitelistedIPID is a number');
        });
    })

    it('Checking ExternalClientID coloumn', async () => {
        _.map(whitelistedIps, (eachClient) => {
            if (eachClient.ExternalClientID != null) {
                assert.typeOf(eachClient.ExternalClientID, 'number', 'ExternalClientID is a number');
            } else {
                assert.deepEqual(eachClient.ExternalClientID, null)
            }
        });
    });

    it('Checking Address coloumn', async () => {
        _.map(whitelistedIps, (eachClient) => {
            assert.typeOf(eachClient.Address, 'string', 'Address is a string');
        });
    })
    it('Checking AddressType coloumn', async () => {
        _.map(whitelistedIps, (eachClient) => {
            assert.include(ipAddressType, eachClient.AddressType, 'AddressType must be at least one of these values')
        });
    })
    it('Checking Active column', async () => {
        _.map(whitelistedIps, (eachClient) => {
            assert.typeOf(eachClient.Active, 'number', 'Active is a string');
            assert.include([0, 1], eachClient.Active, 'Active is either true or false')
        });
    });
    it('Checking Archived column', async () => {
        _.map(whitelistedIps, (eachClient) => {
            assert.typeOf(eachClient.Archived, 'number', 'Archived is a string');
            assert.include([0, 1], eachClient.Archived, 'Archived is either true or false')
        });
    });
})