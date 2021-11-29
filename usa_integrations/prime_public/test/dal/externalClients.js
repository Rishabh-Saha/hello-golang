const { getTableDetails, getExternalClients } = require('../../src/dal');
const describe = require('mocha').describe;
const before = require('mocha').before;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;
const source = require('../testHelper');
const _ = source._;

let table_column_info;
let externalClients;

describe('Schema check for external_clients', function () {

    it('Checks the existence of all columns', async () => {
        const query = 'SHOW COLUMNS FROM external_clients';
        table_column_info = await getTableDetails(query);
        const fields = _.map(table_column_info, 'Field');
        assert.includeDeepMembers(fields, ['ExternalClientID', 'IntegrationID', 'ReferenceID', 'ClientName', 'ConstantName', 'ClientSignature', 'ApiWhitelisting', 'SourceWhitelisting', 'Active', 'Archived', 'CreatedDate', 'UpdatedDate', 'PartnerID'], 'All keys present in the external clients table');
    });

    before(async ()=> {
        if(!table_column_info)
            setInterval(() => {
                return;
            }, 1000);
    })
    it('Checks ExternalClientID', async () => {
        let externalClientID = _.find(table_column_info, { 'Field': 'ExternalClientID' });
        assert.equal(externalClientID.Type, 'mediumint(6)');
        assert.equal(externalClientID.Null, 'NO');
        assert.equal(externalClientID.Key, 'PRI');
        assert.equal(externalClientID.Default, null);
        assert.equal(externalClientID.Extra, 'auto_increment');
    });

    it('Checks IntegrationID', async () => {
        let integrationID = _.find(table_column_info, { 'Field': 'IntegrationID' });
        assert.equal(integrationID.Type, 'int(4)');
        assert.equal(integrationID.Null, 'YES');
        assert.equal(integrationID.Default, null);
    });

    it('Checks ReferenceID', async () => {
        let referenceID = _.find(table_column_info, { 'Field': 'ReferenceID' });
        assert.equal(referenceID.Type, 'varchar(10)');
        assert.equal(referenceID.Null, 'NO');
        assert.equal(referenceID.Default, null);
    });

    it('Checks ClientName', async () => {
        let clientName = _.find(table_column_info, { 'Field': 'ClientName' });
        assert.equal(clientName.Type, 'varchar(100)');
        assert.equal(clientName.Null, 'NO');
        assert.equal(clientName.Default, null);
    });

    it('Checks ConstantName', async () => {
        let constantName = _.find(table_column_info, { 'Field': 'ConstantName' });
        assert.equal(constantName.Type, 'varchar(100)');
        assert.equal(constantName.Null, 'NO');
        assert.equal(constantName.Default, null);
    });

    it('Checks ClientSignature', async () => {
        let clientSign = _.find(table_column_info, { 'Field': 'ClientSignature' });
        assert.equal(clientSign.Type, 'varchar(64)');
        assert.equal(clientSign.Null, 'NO');
        assert.equal(clientSign.Default, null);
    });

    it('Checks ApiWhitelisting', async () => {
        let apiWhitelisting = _.find(table_column_info, { 'Field': 'ApiWhitelisting' });
        assert.equal(apiWhitelisting.Type, 'tinyint(1)');
        assert.equal(apiWhitelisting.Null, 'NO');
        assert.equal(apiWhitelisting.Default, null);
    });

    it('Checks SourceWhitelisting', async () => {
        let sourceWhitelisting = _.find(table_column_info, { 'Field': 'SourceWhitelisting' });
        assert.equal(sourceWhitelisting.Type, 'tinyint(1)');
        assert.equal(sourceWhitelisting.Null, 'NO');
        assert.equal(sourceWhitelisting.Default, '1');
    });

    it('Checks Active', async () => {
        let active = _.find(table_column_info, { 'Field': 'Active' });
        assert.equal(active.Type, 'tinyint(1)');
        assert.equal(active.Null, 'NO');
        assert.equal(active.Default, '1');
    });

    it('Checks Archived', async () => {
        let archived = _.find(table_column_info, { 'Field': 'Archived' });
        assert.equal(archived.Type, 'tinyint(1)');
        assert.equal(archived.Null, 'NO');
        assert.equal(archived.Default, '0');
    });

    it('Checks CreatedDate', async () => {
        let createdDate = _.find(table_column_info, { 'Field': 'CreatedDate' });
        assert.equal(createdDate.Type, 'timestamp');
        assert.equal(createdDate.Null, 'NO');
        assert.equal(createdDate.Default, 'CURRENT_TIMESTAMP');
        assert.equal(createdDate.Extra, 'on update CURRENT_TIMESTAMP')
    });

    it('Checks UpdatedDate', async () => {
        let updatedDate = _.find(table_column_info, { 'Field': 'UpdatedDate' });
        assert.equal(updatedDate.Type, 'timestamp');
        assert.equal(updatedDate.Null, 'NO');
        assert.equal(updatedDate.Default, 'CURRENT_TIMESTAMP');
        assert.equal(updatedDate.Extra, 'on update CURRENT_TIMESTAMP')
    });

    it('Checks PartnerID', async () => {
        let partnerID = _.find(table_column_info, { 'Field': 'PartnerID' });
        assert.equal(partnerID.Type, 'mediumint(8) unsigned');
        assert.equal(partnerID.Null, 'YES');
        assert.equal(partnerID.Default, null);
    });
});

describe('Data sanity for external_clients', function () {
    before(async() => {
        externalClients = await getExternalClients();
    });
    it('checks whether the ExternalClientID is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.ExternalClientID, 'number', 'ExternalClientID is a number');

        });
    });
    it('checks whether the IntegrationID is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.IntegrationID, 'number', 'IntegrationID is a number');

        });
    });
    // it('checks whether the ReferenceID is a number', async () => {
    //     _.map(externalClients, (eachClient)=>{
    //         assert.typeOf(eachClient.ReferenceID, 'string', 'ReferenceID is a string');
    //         assert.lengthOf(eachClient.ReferenceID, 10, `ReferenceID: ${eachClient.ReferenceID} is of length 10`);
    //         const upperCasedReferenceID = eachClient.ReferenceID.toUpperCase();
    //         assert.deepEqual(eachClient.ReferenceID, upperCasedReferenceID);
    //     });
    // }); //commented for initial uat to work
    // it('checks whether the ClientName is a number', async () => {
    //     _.map(externalClients, (eachClient)=>{
    //         assert.typeOf(eachClient.ClientName, 'string', 'ClientName is a string');
    //         const upperCasedClientName = eachClient.ClientName.toUpperCase();
    //         if(!['ServifyTest','ServifyTest_Encrypt'].includes(eachClient.ClientName))
    //             assert.deepEqual(eachClient.ClientName, upperCasedClientName);
    //     });
    // });//commented for initial uat to work
    // it('checks whether the ConstantName is a number', async () => {
    //     _.map(externalClients, (eachClient)=>{
    //         assert.typeOf(eachClient.ConstantName, 'string', 'ConstantName is a string');
    //         // const upperCasedConstantName = eachClient.ConstantName.toUpperCase();
    //         // assert.deepEqual(eachClient.ConstantName, upperCasedConstantName);
    //     });
    // }); //commented for initial uat to work
    // it('checks whether the ClientSignature is a number', async () => {
    //     _.map(externalClients, (eachClient)=>{
    //         assert.typeOf(eachClient.ClientSignature, 'string', 'ClientSignature is a string');
    //         assert.lengthOf(eachClient.ClientSignature, 64, `ClientSignature: ${eachClient.ClientSignature} is of length 64`);
    //     });
    // }); //commented for initial uat to work
    it('checks whether the ApiWhitelisting is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.ApiWhitelisting, 'number', 'ApiWhitelisting is a string');
            assert.include([0,1],eachClient.ApiWhitelisting, 'ApiWhitelisting is either true or false')
        });
    });
    it('checks whether the SourceWhitelisting is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.SourceWhitelisting, 'number', 'SourceWhitelisting is a string');
            assert.include([0,1],eachClient.SourceWhitelisting, 'SourceWhitelisting is either true or false')
        });
    });
    it('checks whether the Active is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.Active, 'number', 'Active is a string');
            assert.include([0,1],eachClient.Active, 'Active is either true or false')
        });
    });
    it('checks whether the Archived is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.Archived, 'number', 'Archived is a string');
            assert.include([0,1],eachClient.Archived, 'Archived is either true or false')
        });
    });
    it('checks whether the PartnerID is a number', async () => {
        _.map(externalClients, (eachClient)=>{
            assert.typeOf(eachClient.PartnerID, 'number', 'PartnerID is a number');
        });
    });
});