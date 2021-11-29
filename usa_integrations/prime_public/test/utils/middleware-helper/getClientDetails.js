const expect = require('chai').expect;
const assert = require('chai').assert;
const getClientDetails = require('../../../src/utils/middleware-helper/getClientDetails');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('getClientDetails', function() {
    // this.timeout(4000);
    it('checks for an error in getClientdetails', async() => {
        try {
            await getClientDetails();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal('No externalClient found');
        }
    });

    it('checks for proper response from getClientdetails', async() => {
        const response = await getClientDetails('ServifyTest');
        expect(response).that.includes.all.keys([
            'ExternalClientID',
            'IntegrationID',
            'ReferenceID',
            'ClientName',
            'ConstantName',
            'ClientSignature',
            'ApiWhitelisting',
            'PartnerID',
            'SourceWhitelisting',
            'ips',
            'apis',
            'external_client_shelter'
        ]);
        expect(response.ExternalClientID).to.be.a('number');
        expect(response.IntegrationID).to.be.a('number');
        expect(response.ReferenceID).to.be.a('string');
        expect(response.ClientName).to.be.a('string');
        expect(response.ConstantName).to.be.a('string');
        expect(response.ClientSignature).to.be.a('string');
        expect(response.ApiWhitelisting).to.be.a('number');
        expect(response.PartnerID).to.be.a('number');
        expect(response.SourceWhitelisting).to.be.a('number');
        expect(response.ips).to.be.a('Object');
        expect(response.apis).to.be.a('Object');
        expect(response.external_client_shelter).to.be.a('Object');

        expect(response.ips).that.includes.all.keys(['ipv4','range-v4','ipv6','range-v6']);
        expect(response.external_client_shelter).that.includes.all.keys(['IN', 'OUT']);

        expect(response.ips.ipv4).to.be.a('Object');
        expect(response.ips.ipv6).to.be.a('Object');
        expect(response.ips['range-v4']).to.be.a('Array');
        expect(response.ips['range-v6']).to.be.a('Array');

        expect(response.external_client_shelter.IN).to.be.a('Object');
        expect(response.external_client_shelter.OUT).to.be.a('Object');
        expect(response.external_client_shelter.IN).that.includes.all.keys(['ShelterAlgoID','ApiDirection','ParamName','ParamValue','ParamType','KeyType']);
        expect(response.external_client_shelter.OUT).that.includes.all.keys(['ShelterAlgoID','ApiDirection','ParamName','ParamValue','ParamType','KeyType']);

    }); 

    it('checks for an error in getClientdetails with fakeClient', async() => {
        try {
            const response = await getClientDetails('fakeClient');
            assert.fail('expected exception to be thrown');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal('No externalClient found');
        }
    });
})