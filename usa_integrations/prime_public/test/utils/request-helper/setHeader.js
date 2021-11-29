const assert = require('chai').assert;
const expect = require('chai').expect;
const setHeader = require('../../../src/utils/request-helper/setHeader');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('setHeader', () => {
   
    describe('fail cases', () => {
        it('No parameters passed', () => {
            try {
                setHeader();
                assert.fail('expected exception to be thrown');
            } catch (error) {
                expect(error).to.be.an('error');
            }
        });
    })


    describe('header obj manipulation', ()=> {
        it('Empty header object passed', () => {
            const requestObj = {
                externalClient: {
                    ExternalClientID: 1,
                    ClientName: 'ServifyTest',
                    PartnerID: 10,
                    IntegrationID: 11
                },
                app: 'Public',
                headerObj: {}
            };
            const response = setHeader(requestObj)              
            assert.isObject(response,'setHeader responds with an object');
            assert.equal(response.externalclientid, '1');
            assert.equal(response.app, 'Public');
            assert.equal(response.PartnerID, 10);
            assert.equal(response.IntegrationID, 11);
        });

        it('Header object passed', () => {
            const requestObj = {
                externalClient: {
                    ExternalClientID: 1,
                    ClientName: 'ServifyTest',
                    PartnerID: 10,
                    IntegrationID: 11
                },
                app: 'Public',
                headerObj: {
                    app: 'HeaderApp',
                    authorization: 'auth',
                    module: 'CoreApi',
                    source: 'random'
                }
            };
            const response = setHeader(requestObj)              
            assert.isObject(response,'setHeader responds with an object');
            assert.equal(response.externalclientid, 1);
            assert.equal(response.app, 'HeaderApp');
            assert.equal(response.authorization, 'auth');
            assert.equal(response.module, 'CoreApi');
            assert.equal(response.source, 'random');
            assert.equal(response.clientName, 'ServifyTest');
            assert.equal(response.PartnerID, 10);
            assert.equal(response.IntegrationID, 11);
        });

    });

    describe('checking for app', () => {
        it('Passing app as a direct parameter', () => {
            const requestObj = {
                externalClient: {
                    ExternalClientID: 1,
                    ClientName: 'ServifyTest',
                    PartnerID: 10,
                    IntegrationID: 11
                },
                app: 'Public',
                headerObj: {}
            };
            const response = setHeader(requestObj);
            assert.equal(response.app, 'Public');             
        });

        it('Passing ConstantName as a parameter', () => {
            const requestObj = {
                externalClient: {
                    ExternalClientID: 1,
                    ClientName: 'ServifyTest',
                    PartnerID: 10,
                    IntegrationID: 11,
                    ConstantName: 'SERVIFY_TEST'
                },
                app: 'Public',
                headerObj: {}
            };
            const response = setHeader(requestObj);
            assert.equal(response.app, 'SERVIFY_TEST');             
        });

        it('Passing app in header as a parameter', () => {
            const requestObj = {
                externalClient: {
                    ExternalClientID: 1,
                    ClientName: 'ServifyTest',
                    PartnerID: 10,
                    IntegrationID: 11,
                    ConstantName: 'SERVIFY_TEST'
                },
                app: 'Public',
                headerObj: {
                    app: 'HEADER_APP'
                }
            };
            const response = setHeader(requestObj);
            assert.equal(response.app, 'HEADER_APP');             
        });
    });
});