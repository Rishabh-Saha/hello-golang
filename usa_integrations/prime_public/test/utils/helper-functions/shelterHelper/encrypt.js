const shelterHelper = require('../../../../src/utils/helper-functions/shelter-helper')
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;

const encryptData = {
    "dataToProcess": {
        "status": 200,
        "success": true,
        "message": "Success",
        "data": {
            "token": "442f7890-c9fe-11eb-824b-cfc89b5789ca",
            "ttl": 1623338847
        }
    },
    "clientShelterCreds": {
        "IN": {
            "ShelterAlgoID": 1,
            "ApiDirection": "IN",
            "ParamName": "PrivateKey",
            "ParamValue": "/opt/prime/public-api-creds/servify/servify_public_api_priv_key.pem",
            "ParamType": "PEM",
            "KeyType": "DECRYPTION"
        },
        "OUT": {
            "ShelterAlgoID": 1,
            "ApiDirection": "OUT",
            "ParamName": "PublicKey",
            "ParamValue": "/opt/prime/public-api-creds/servify/servify_public_api_pub_key.pem",
            "ParamType": "PEM",
            "KeyType": "ENCRYPTION"
        }
    }
}

const dataEncyrpt_noEncryption = {
    "dataToProcess": {
        "status": 200,
        "success": true,
        "message": "Success",
        "data": {
            "token": "adef0570-ca1c-11eb-b293-650eff965012",
            "ttl": 1623351909
        }
    },
    "clientShelterCreds": {
        "IN": {
            "ShelterAlgoID": 3,
            "ApiDirection": "IN",
            "ParamName": null,
            "ParamValue": null,
            "ParamType": null,
            "KeyType": null
        },
        "OUT": {
            "ShelterAlgoID": 3,
            "ApiDirection": "OUT",
            "ParamName": null,
            "ParamValue": null,
            "ParamType": null,
            "KeyType": null
        }
    }
}

describe('shelterHelper encrypt test', function () {
    it('testing encrypt', async () => {
        const response = await shelterHelper.encrypt(encryptData);
        assert.typeOf(response, 'object', 'the response is of data type object');
        assert.typeOf(response.$data, 'string', 'the response data is of data type string')
    })

    it('testing encrypt function without passing data', async () => {
        try {
            const response = await shelterHelper.encrypt();
            assert.fail('expected exception not thrown')
        } catch (err) {
            assert.deepEqual(err.message, "Cannot read property 'clientShelterCreds' of undefined");
        }

    })

    it('testing encrypt with Servify_Test', async () => {
        const response = await shelterHelper.encrypt(dataEncyrpt_noEncryption);
        assert.typeOf(response, 'object', 'the response is of data type object');
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.message, 'Success');
    })
})