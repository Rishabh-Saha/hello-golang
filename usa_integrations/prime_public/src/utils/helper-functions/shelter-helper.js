/* jshint node: true */
// Public keys === Encrypt & Verify
// Private keys === Sign & Decrypt

const {
    _,
    NodeRSA,
    crypto,
    fs
} = require('./require-helper');
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger('ShelterHelper');
const moduleCreds = require('./environmentFiles');
const {constants}  = require('../../utils/helper-functions/environmentFiles');
const shelterAlgo = constants.SHELTER_ALGO;

const decideAlgoAndProcess = async (data) => {
    const functionName = 'decideAlgoAndProcess';
    log.info(functionName, 'data of decideAlgoAndProcess');

    if (!data.ApiDirection) {
        log.info(functionName, 'Invalid data', 'ApiDirection is missing');
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }

    if (!data.creds && _.isEmpty(data.creds)) {
        log.error(functionName, 'cred not found', data);
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }

    let neededAlgo = shelterAlgo[data.creds.ShelterAlgoID];

    if (!neededAlgo) {
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }
    let output;
    data = {
        shelterAlgo: neededAlgo,
        ...data
    };
    switch (neededAlgo.ConstantName) {
        case 'NO-ENCRYPTION':
            log.info(functionName, `algo name for request ${data.ApiDirection}`, 'NO-ENCRYPTION');
            output = data.dataToProcess;
            break;
        case 'RSA':
            log.info(functionName, `algo name for request ${data.ApiDirection}`, 'RSA');
            output = data.ApiDirection === 'IN' ? rsaDecryption(data) : rsaEncryption(data);
            break;
        case 'AES-256-GCM':
            log.info(functionName, `algo name for request ${data.ApiDirection}`, 'AES-256-GCM');
            output = data.ApiDirection === 'IN' ? aes256GcmDecryption(data) : aes256GcmEncryption(data);
            break;
        default:
            log.info(functionName, `algo name for request ${data.ApiDirection}`, 'default');
            output = {};
            break;
    }
    return output;
};

const encrypt = async (data) => {
    let functionName = 'encrypt';
    log.info(functionName, 'data for encryption', JSON.stringify(data));
    if (data.clientShelterCreds && data.clientShelterCreds['OUT']) {
        const encryptionCreds = data.clientShelterCreds['OUT']
        let sendData = {
            dataToProcess: data.dataToProcess,
            creds: encryptionCreds,
            ApiDirection: 'OUT',
            selfRsa: moduleCreds.rsa
        };
        return await decideAlgoAndProcess(sendData);
    } else {
        let status = 401;
        if(data.dataToProcess && data.dataToProcess.status){
            status = data.dataToProcess.status;
        }
        let errorCode = null;
        if(data.dataToProcess && data.dataToProcess.errorCode){
            errorCode = data.dataToProcess.errorCode;
        }
        return {
            status: status,
            success: false,
            message: 'Invalid credentials',
            errorCode: errorCode,
            data:{}
        };
    }
};

const decrypt = async (data) => {
    let functionName = 'decrypt';
    log.info(functionName, 'data for decryption', JSON.stringify(data));
    if (data.clientShelterCreds && data.clientShelterCreds['IN']) {
        const decryptionCreds = data.clientShelterCreds['IN'];
        let sendData = {
            dataToProcess: data.dataToProcess,
            creds: decryptionCreds,
            ApiDirection: 'IN',
            selfRsa: moduleCreds.rsa
        };
        return await decideAlgoAndProcess(sendData);
    } else {
        return {
            success: false,
            message: 'Invalid credentials'
        };
    }
};

const rsaEncryption = async (data) => {
    const functionName = 'rsaEncryption';
    log.info(functionName, 'rsaEncryption data');
    let encryptionKeyContent = await readPemFiles(data.creds);
    if (!encryptionKeyContent) {
        log.error(functionName, 'key not found', encryptionKeyContent);
        return {
            status:401,
            success: false,
            message: 'Invalid client public key',
            errorCode: 'PUBLIC_KEY.INVALID.401',
            data:{}
        };
    }
    let encryptionPublicKey = await new NodeRSA(encryptionKeyContent);
    let dataString;
    let toConvertBuffer;
    if (typeof data.dataToProcess === 'object') {
        toConvertBuffer = Buffer.from(JSON.stringify(data.dataToProcess));
    } else {
        toConvertBuffer = Buffer.from(data.dataToProcess);
    }
    dataString = Buffer.from(toConvertBuffer);
    try {
        let encryptedBuffer = encryptionPublicKey.encrypt(dataString);
        let encryptedBase64 = encryptedBuffer.toString('base64');
        return {
            '$data': encryptedBase64
        };
    } catch (error) {
        log.info(functionName, "V2 encryption key", encryptionKeyContent.toString());
        log.error(functionName, "error in rsaEncryption", error);
        return {
            success: false,
            message: 'Unable to encrypt using public key!'
        };
    }
};

const rsaDecryption = async (data) => {
    const functionName = 'rsaDecryption';
    if (!data.dataToProcess['$data']) {
        log.error(functionName, 'data not send for decryption', data.dataToProcess['$data']);
        return {
            success: false,
            message: "Please send data to encrypt"
        }
    }
    if (data.dataToProcess['$data'] && typeof data.dataToProcess['$data'] !== 'string') {
        log.error(functionName, 'invalid data send for decryption', data.dataToProcess['$data']);
        return {
            success: false,
            message: 'Invalid data sent for decryption!'
        };
    }
    let decryptionKeyContent = await readPemFiles(data.creds);
    if (!decryptionKeyContent) {
        log.error(functionName, 'key not found', decryptionKeyContent);
        return {
            success: false,
            message: 'Invalid client key!'
        };
    }
    let decryptionPrivateKey = await new NodeRSA(decryptionKeyContent);
    try {
        let buf = Buffer.from(data.dataToProcess['$data'], 'base64');
        let decryptedString = decryptionPrivateKey.decrypt(buf);
        decryptedString = JSON.parse(decryptedString);
        log.info(functionName, 'decrypted data', decryptedString);
        return decryptedString;
    } catch (error) {
        log.info(functionName, "V2 decryption key", decryptionKeyContent.toString());
        log.error(functionName, "Error from rsaDecryption", error);
        return {
            success: false,
            message: 'Unable to decrypt using private key!'
        };
    }
};

var aes256GcmEncryption = (data) => {
    const functionName = 'aes256GcmEncryption';
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        // log.info('rsaEncryption 3 ===>', rsaEncryption);
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'EncryptionKey',
            KeyType: 'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'DecryptionKey',
            KeyType: 'DECRYPTION'
        });

        var iterationDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'Iterations',
            KeyType: 'ENCRYPTION'
        });

        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails) && iterationDetails && !_.isEmpty(iterationDetails)) {
            // log.info('rsaEncryption 4 ===>', rsaEncryption);
            var encryptionKeyContent = encryptionKeyDetails.ParamValue;
            var decryptionKeyContent = decryptionKeyDetails.ParamValue;
            var iterationValue = _.parseInt(iterationDetails.ParamValue);
            var toConvertString;
            if (encryptionKeyContent && decryptionKeyContent && iterationValue) {

                if (typeof data.dataToProcess === 'object') {
                    toConvertString = JSON.stringify(data.dataToProcess);
                } else {
                    toConvertString = data.dataToProcess;
                }
                try {
                    // random initialization vector
                    const iv = crypto.randomBytes(16);

                    // random salt
                    const salt = crypto.randomBytes(64);

                    // derive encryption key: 32 byte key length
                    // in assumption the encryptionKeyContent is a cryptographic and NOT a password there is no need for
                    // a large number of iterations. It may can replaced by HKDF
                    // the value of 2145 is randomly chosen!
                    const key = crypto.pbkdf2Sync(encryptionKeyContent, salt, iterationValue, 32, 'sha512');

                    // AES 256 GCM Mode
                    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

                    // encrypt the given text
                    const encrypted = Buffer.concat([cipher.update(toConvertString, 'utf8'), cipher.final()]);

                    // extract the auth tag
                    const tag = cipher.getAuthTag();
                    // log.info("encrypted =>", encrypted);
                    // generate output
                    var encryptedBase64 = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');

                    return {
                        '$data': encryptedBase64
                    };
                } catch (error) {
                    log.error(functionName, 'error in aes256GcmEncryption', error);
                    return {
                        success: false,
                        message: 'Unable to encrypt the data !'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Invalid Client Key !'
                };
            }
        } else {
            return {
                success: false,
                message: 'Invalid Client Key !'
            };
        }

    } else {
        return {
            success: false,
            message: 'Invalid Credentials'
        };
    }
};

var aes256GcmDecryption = (data) => {
    const functionName = 'aes256GcmDecryption';
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        // log.info('rsaEncryption 3 ===>', rsaEncryption);
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'EncryptionKey',
            KeyType: 'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'DecryptionKey',
            KeyType: 'DECRYPTION'
        });

        var iterationDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'Iterations',
            KeyType: 'ENCRYPTION'
        });

        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails) && iterationDetails && !_.isEmpty(iterationDetails)) {
            // log.info('rsaEncryption 4 ===>', rsaEncryption);
            var encryptionKeyContent = encryptionKeyDetails.ParamValue;
            var decryptionKeyContent = decryptionKeyDetails.ParamValue;
            var iterationValue = _.parseInt(iterationDetails.ParamValue);
            if (encryptionKeyContent && decryptionKeyContent && iterationValue) {

                if (data.dataToProcess['$data'] && data.dataToProcess['$data'] !== undefined && typeof data.dataToProcess['$data'] === 'string') {
                    if (Buffer.from(data.dataToProcess['$data'], 'base64')) {
                        var bData = Buffer.from(data.dataToProcess['$data'], 'base64');
                        if (Buffer.isBuffer(bData)) {
                            try {

                                // convert data to buffers
                                const salt = bData.slice(0, 64);
                                const iv = bData.slice(64, 80);
                                const tag = bData.slice(80, 96);
                                const text = bData.slice(96);

                                // derive key using; 32 byte key length
                                const key = crypto.pbkdf2Sync(decryptionKeyContent, salt, iterationValue, 32, 'sha512');

                                // AES 256 GCM Mode
                                const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
                                decipher.setAuthTag(tag);

                                // encrypt the given text
                                const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
                                log.info(functionName, "decrypted data", decrypted);

                                return JSON.parse(decrypted);
                            } catch (error) {
                                log.error(functionName, "Error in aes256GcmDecryption", error);
                                return {
                                    success: false,
                                    message: 'Unable to decrypt the data !'
                                };
                            }
                        } else {
                            return {
                                success: false,
                                message: 'Invalid data sent for decryption !'
                            };
                        }
                    } else {
                        return {
                            success: false,
                            message: 'Invalid data sent for decryption !'
                        };
                    }
                } else {
                    return {
                        success: false,
                        message: 'Invalid data sent for decryption !'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Invalid Client Key !'
                };
            }
        } else {
            return {
                success: false,
                message: 'Invalid Client Key !'
            };
        }

    } else {
        return {
            success: false,
            message: 'Invalid Credentials'
        };
    }
};

const readPemFiles = async (creds) => {
    const functionName = 'readPemFiles';
    if (creds.ParamType === 'PEM') {
        try {
            let keyContent = await fs.readFileSync(creds.ParamValue);
            return keyContent;
        } catch (error) {
            log.error(functionName, 'error in PEM read', error);
            return false;
        }
    } else {
        return creds.ParamValue;
    }
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;