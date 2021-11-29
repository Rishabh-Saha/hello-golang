const cacheHelper = require('../../src/services/internal-routes');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;

let masterApiTestData = { 
    "cacheList":["shelterAlgos","clientShelterCreds","clientShelters"],
    "moduleName":"MasterAPI"
}

let integrationApiTestData = {
    "cacheList": ["clientSSODetails","clientSSOCredentials"], 
    "moduleName":"IntegrationAPI"
}

let publicTestData = { 
    "cacheList" : ["clientAuth_1","getClientDetails_ServifyTest"], 
    "moduleName" : ""
}

let blankTestData = { 
    
}

let testString = 'testing DeleteCacheList';
let testArray = [];

describe('testing deleteCacheList function', function(){

    it('Testing deleteCacheList with a string', async() => {
       
        const response = await cacheHelper.deleteCacheList(testString);
        const wasSuccessful = response.success; 
        expect(wasSuccessful).to.be.false; 
       
    })

    it('Testing deleteCacheList with an array', async() => {
       
        const response = await cacheHelper.deleteCacheList(testArray);
        const wasSuccessful = response.success; 
        expect(wasSuccessful).to.be.false;   
        
    })
    
    it('Testing deleteCacheList without passing data', async() => {
        const response = await cacheHelper.deleteCacheList(blankTestData);
        assert.typeOf(response, 'object', 'deleteCache response is an object');
        const wasSuccessful = response.success; 
        expect(wasSuccessful).to.be.false; 
        assert.typeOf(response.message, 'string', 'message from response is a string');
        assert.deepEqual(response.message, 'Insufficient parameteres')
    })

    it('checks deleteCacheList function with public data', async() => {
        //Hit Auth/generateToken for ServifyTest Client before running this test case 
        const response = await cacheHelper.deleteCacheList(publicTestData);
        assert.typeOf(response, 'object', 'deleteCache response is an object');
        assert.typeOf(response.success, 'boolean', 'deleteCache response includes boolean value');
        assert.typeOf(response.message, 'string', 'message from response is a string');
        assert.typeOf(response.data, 'object', 'deleteCache response includes data object')
        expect(response.data).that.includes.all.keys(['keysDeleted','keysNotDeleted']);
        if (response.success === true) {
            expect(response.data.keysDeleted).to.not.be.empty;
        } else {
            expect(response.data.keysNotDeleted).to.not.be.empty;
        }
       
        
    })

    it('checks if deleteCacheList is running properly', async() => {
        //Hit /api/v1/Auth/generateToken for ServifyTest Client before running this test case 
        const response = await cacheHelper.deleteCacheList(masterApiTestData);
        assert.typeOf(response, 'object', 'deleteCache response is an object');
        assert.typeOf(response.success, 'boolean', 'deleteCache response includes boolean value');
        assert.typeOf(response.message, 'string', 'message from response is a string');
        assert.typeOf(response.data, 'object', 'deleteCache response includes data object')
        expect(response.data).that.includes.all.keys(['keysDeleted','keysNotDeleted']);
        if (response.success === true) {
            expect(response.data.keysDeleted).to.not.be.empty;
        } else {
            expect(response.data.keysNotDeleted).to.not.be.empty;
        }
       
    })
    
    it('checks deleteCacheList function with IntegrationAPI data', async() => {
        const response = await cacheHelper.deleteCacheList(integrationApiTestData);
        assert.typeOf(response, 'object', 'deleteCache response is an object');
        assert.typeOf(response.success, 'boolean', 'deleteCache response includes boolean value');
        assert.typeOf(response.message, 'string', 'message from response is a string');
        assert.typeOf(response.data, 'object', 'deleteCache response includes data object')
        expect(response.data).that.includes.all.keys(['keysDeleted','keysNotDeleted']);
        if (response.success === true) {
            expect(response.data.keysDeleted).to.not.be.empty;
        } else {
            expect(response.data.keysNotDeleted).to.not.be.empty;
        }
    })
    
    
})

describe('testing burstCache function', function(){
    
     
    it('Testing if burstCache returns proper response', async() => {
        const response =  await cacheHelper.burstCache(); 
        assert.typeOf(response, 'array', 'burstCache response is an array');
        //expect(response).to.not.be.empty;
    })
        
})

