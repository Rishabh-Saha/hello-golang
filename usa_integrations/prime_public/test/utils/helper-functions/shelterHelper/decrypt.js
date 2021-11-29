const shelterHelper = require('../../../../src/utils/helper-functions/shelter-helper')
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;
const expect = require('chai').expect;


const decryptData = {
    "$data": `WbodGByRy/hyG4C0/f7AfCMdFt5iajyeSnWwnVnlGgSsGln8bF3zQUR3pM2rx0Uc+Oa0q1Ny0BQr36\
            /2ys+SUA4939HDlchX8GpE81ckVS+zucRXY59IZPHyR7902Tk+3rltMLr9znuSM+e62CgAd1u6G5N7\
            sIlrxwLFwnWhW3RtiV+indM5Ssff4ayc7kQxJR37ea/1wH9V/CpQj+ciI24jCFEYlbg+QKqJcIrNRI\
            zZnMSq7I+8y8JJeQg3wx9J+AA3E2WCbsBTPiRSizI3tg3vYHnQdn075Re0dkmAkHwUABjIIjiDhkGT\
            Tp/1DKZjhdItf3MksWAgjcnuIXFSpw==`
}


const dataDecrypt_noEncryption = {
    "dataToProcess": {
        "apiName": "/Auth/generateToken",
        "externalClient": {
            "ExternalClientID": 1,
            "IntegrationID": 0,
            "ReferenceID": "4D0S64RF4R",
            "ClientName": "ServifyTest",
            "ConstantName": "Servify_Test",
            "ClientSignature": "QfXf4r4ae2Q4AWFchFQzT8E8WfaJTQLhjcDvhXBxz6FCYkRnFm5HvRftsQPk8gGM",
            "ApiWhitelisting": 0,
            "PartnerID": 447,
            "SourceWhitelisting": 0,
            "ips": {
                "ipv4": {},
                "range-v4": [],
                "ipv6": {},
                "range-v6": []
            },
            "apis": {},
            "external_client_shelter": {
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

describe('shelterHelper decrypt test', function () {

    it('testing decrypt', async () => {
        const response = await shelterHelper.decrypt(decryptData);
        assert.deepEqual(response.success, false);
        assert.deepEqual(response.message, 'Invalid credentials');
        assert.typeOf(response, 'object', 'the response is of data type object');
    })

    it('testing decrypt function without passing data', async () => {
        try {
            const response = await shelterHelper.decrypt();
            assert.fail('expected exception not thrown')
        } catch (err) {
            assert.deepEqual(err.message, "Cannot read property 'clientShelterCreds' of undefined");
        }

    })

    it('testing decrypt with Servify_Test', async () => {
        const response = await shelterHelper.decrypt(dataDecrypt_noEncryption);
        assert.typeOf(response, 'object', 'the response is of data type object');
        assert.deepEqual(response.apiName, '/Auth/generateToken');
        assert.deepEqual(response.externalClient.ExternalClientID, 1);
    })


})