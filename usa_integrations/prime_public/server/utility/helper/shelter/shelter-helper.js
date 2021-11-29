/* jshint node: true */
// Public keys === Encrypt & Verify
// Private keys === Sign & Decrypt

var requireHelper = require('../../require-helper');
var log = requireHelper.createBunyanLogger('ShelterHelper');
var app = requireHelper.app;
var _ = requireHelper._;
var NodeRSA = requireHelper.NodeRSA;
var crypto = requireHelper.crypto;
var fs = requireHelper.fs;
var moduleCreds = requireHelper.moduleCreds;

var decideAlgoAndProcess = (data) => {
    const functionName = 'decideAlgoAndProcess';
    log.information(functionName,'data of decideAlgoAndProcess', JSON.stringify(data));
    if (data.creds.encryptionCreds && data.creds.decryptionCreds && data.creds.encryptionCreds.shelterAlgo && data.creds.decryptionCreds.shelterAlgo && data.creds.encryptionCreds.shelterAlgo.ConstantName && data.creds.decryptionCreds.shelterAlgo.ConstantName && data.ApiDirection) {
        log.information(functionName,'data to process', data.dataToProcess);
        var output;
        switch (data.ApiDirection) {
        case 'IN':
            switch (data.creds.decryptionCreds.shelterAlgo.ConstantName) {
            case 'RSA':
                log.information(functionName,'algo name for request IN','RSA');
                output = rsaDecryption(data);
                break;
            case 'AES-256-GCM':
                log.information(functionName,'algo name for request IN','AES-256-GCM');
                output = aes256GcmDecryption(data);
                break;
            case 'NO-ENCRYPTION':
                log.information(functionName,'algo name for request IN','NO-ENCRYPTION');
                output = data.dataToProcess;
                break;
            default:
                log.information(functionName,'algo name for request IN','default');
                output = {};
                break;
            }
            break;
        case 'OUT':
            switch (data.creds.encryptionCreds.shelterAlgo.ConstantName) {
            case 'RSA':
                log.information(functionName,'algo name for request out','RSA');
                output = rsaEncryption(data);
                break;
            case 'AES-256-GCM':
                log.information(functionName,'algo name for request out','AES-256-GCM');
                output = aes256GcmEncryption(data);
                break;
            case 'NO-ENCRYPTION':
                log.information(functionName,'algo name for request out','NO-ENCRYPTION');
                output = data.dataToProcess;
                break;
            default:
                log.information(functionName,'algo name for request out','default');
                output = {};
                break;
            }
        }
        return output;
    } else {
        log.information(functionName,'invalid data','invalid Credentials');
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

var encrypt = (data) => {
		let functionName = 'encrypt';
		log.information(functionName,'data for encryption', JSON.stringify(data));
    if (data.clientShelterCreds && data.clientShelterCreds.length) {
        var encryptionCreds = _.find(data.clientShelterCreds, {
            ApiDirection: 'OUT'
        });
        var decryptionCreds = _.find(data.clientShelterCreds, {
            ApiDirection: 'IN'
        });
        if (encryptionCreds && !_.isEmpty(encryptionCreds) && encryptionCreds.shelterAlgo && encryptionCreds.shelterAlgo.ConstantName && decryptionCreds && !_.isEmpty(decryptionCreds) && decryptionCreds.shelterAlgo && decryptionCreds.shelterAlgo.ConstantName) {
            var sendData = {
                dataToProcess: data.dataToProcess,
                creds: {
                    encryptionCreds: encryptionCreds,
                    decryptionCreds: decryptionCreds,
                },
                ApiDirection: 'OUT',
                selfRsa: moduleCreds.rsa
            };
            return decideAlgoAndProcess(sendData);
        } else {
            return {
                success: false,
                msg: 'Invalid Credentials'
            };
        }
    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

var decrypt = (data) => {
    if (data.clientShelterCreds && data.clientShelterCreds.length) {
        var encryptionCreds = _.find(data.clientShelterCreds, {
            ApiDirection: 'OUT'
        });
        var decryptionCreds = _.find(data.clientShelterCreds, {
            ApiDirection: 'IN'
        });
        if (encryptionCreds && !_.isEmpty(encryptionCreds) && encryptionCreds.shelterAlgo && encryptionCreds.shelterAlgo.ConstantName && decryptionCreds && !_.isEmpty(decryptionCreds) && decryptionCreds.shelterAlgo && decryptionCreds.shelterAlgo.ConstantName) {
            var sendData = {
                dataToProcess: data.dataToProcess,
                creds: {
                    encryptionCreds: encryptionCreds,
                    decryptionCreds: decryptionCreds,
                },
                ApiDirection: 'IN',
                selfRsa: moduleCreds.rsa
            };
            return decideAlgoAndProcess(sendData);
        } else {
            return {
                success: false,
                msg: 'Invalid Credentials'
            };
        }
    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

var rsaEncryption = (data) => {
    const functionName = 'rsaEncryption';
    log.information(functionName,'rsaEncryption data',JSON.stringify(data));
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        // log.information('rsaEncryption 3 ===>', rsaEncryption);
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'PublicKey',
            KeyType:'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'PrivateKey',
            KeyType:'DECRYPTION'
        });
        log.information(functionName,'encryption Key Details',encryptionKeyDetails);
        log.information(functionName,'decryptionKeyDetails',decryptionKeyDetails);
        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails)) {
            // log.information('rsaEncryption 4 ===>', rsaEncryption);
            var encryptionKeyContent = '';
            var decryptionKeyContent = '';
            try{
                if (encryptionKeyDetails.ParamType === 'PEM') {
                    encryptionKeyContent = fs.readFileSync(encryptionKeyDetails.ParamValue);
                } else {
                    encryptionKeyContent = encryptionKeyDetails.ParamValue;
                }
                if (decryptionKeyDetails.ParamType === 'PEM') {
                    decryptionKeyContent = fs.readFileSync(decryptionKeyDetails.ParamValue);
                } else {
                    decryptionKeyContent = decryptionKeyDetails.ParamValue;
                }
            } catch (error) {
                log.errorInfo(functionName,"error in reading file",error);
                return {
                    success: false,
                    msg: 'Unable to encrypt using Public Key !'
                };
            }
            log.information(functionName,'encryptionKeyContent',encryptionKeyContent);
            log.information(functionName,'decryptionKeyContent',decryptionKeyContent);
            if (encryptionKeyContent && decryptionKeyContent) {
                var encryptionPublicKey = new NodeRSA(encryptionKeyContent);
                var decryptionPrivateKey = new NodeRSA(decryptionKeyContent);
                var dataString;
                var toConvertBuffer;
                if (typeof data.dataToProcess === 'object') {
                    toConvertBuffer = Buffer.from(JSON.stringify(data.dataToProcess));
                } else {
                    toConvertBuffer = Buffer.from(data.dataToProcess);
                }
                dataString = Buffer.from(toConvertBuffer);
                if (Buffer.isBuffer(dataString)) {
                    try {
                        var encryptedBuffer = encryptionPublicKey.encrypt(dataString);
                        var encryptedBase64 = encryptedBuffer.toString('base64');
                        var encryptedSignature = decryptionPrivateKey.sign(dataString);
                        var verifiedString = decryptionPrivateKey.verify(dataString, encryptedSignature);
                        return {
                            '$data': encryptedBase64
                        };
                    } catch (error) {
                        log.information(functionName,'V1 encryption key', encryptionKeyContent.toString());
                        log.errorInfo(functionName,"error in rsaEncryption",error);
                        return {
                            success: false,
                            msg: 'Unable to encrypt using Public Key !'
                        };
                    }
                } else {
                    return {
                        success: false,
                        msg: 'Invalid data sent for encryption !'
                    };
                }
            } else {
                return {
                    success: false,
                    msg: 'Invalid Client Public Key !'
                };
            }
        } else {
            return {
                success: false,
                msg: 'Invalid Client Public Key !'
            };
        }

    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

var rsaDecryption = (data) => {
    const functionName = 'rsaDecryption';
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'PublicKey',
            KeyType:'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'PrivateKey',
            KeyType:'DECRYPTION'
        });
        log.information(functionName,'encryption key details', encryptionKeyDetails);
        log.information(functionName,'decryption key details', decryptionKeyDetails);
        log.information(functionName,'data for encryption',data.dataToProcess['$data']);

        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails)) {
            var encryptionKeyContent = '';
            var decryptionKeyContent = '';
            try {
                if (encryptionKeyDetails.ParamType === 'PEM') {
                    encryptionKeyContent = fs.readFileSync(encryptionKeyDetails.ParamValue);
                } else {
                    encryptionKeyContent = encryptionKeyDetails.ParamValue;
                }
                if (decryptionKeyDetails.ParamType === 'PEM') {
                    decryptionKeyContent = fs.readFileSync(decryptionKeyDetails.ParamValue);
                } else {
                    decryptionKeyContent = decryptionKeyDetails.ParamValue;
                }
            } catch (error) {
                log.errorInfo(functionName,"error in reading file", error);
                return {
                    success: false,
                    msg: 'Unable to decrypt using Private Key !'
                };
            }
            if (encryptionKeyContent && decryptionKeyContent) {
                var encryptionPublicKey = new NodeRSA(encryptionKeyContent);
                var decryptionPrivateKey = new NodeRSA(decryptionKeyContent);
				
                if (data.dataToProcess['$data'] && data.dataToProcess['$data'] !== undefined && typeof data.dataToProcess['$data'] === 'string') {
                    if (Buffer.from(data.dataToProcess['$data'], 'base64')) {
                        var buf = Buffer.from(data.dataToProcess['$data'], 'base64');
                        if (Buffer.isBuffer(buf)) {
                            try {
                                var decryptedString = decryptionPrivateKey.decrypt(buf);
                                decryptedString = JSON.parse(decryptedString);
                                log.information(functionName,'verifiedString', decryptedString);
                                return decryptedString;
                            } catch (error) {
                                log.information(functionName,'V1 decryption key', decryptionKeyContent.toString());
                                log.errorInfo(functionName,"Error from rsaDecryption", error);
                                return {
                                    success: false,
                                    msg: 'Unable to decrypt using Private Key !'
                                };
                            }
                        } else {
                            return {
                                success: false,
                                msg: 'Invalid data sent for decryption 1!'
                            };
                        }
                    } else {
                        return {
                            success: false,
                            msg: 'Invalid data sent for decryption 2!'
                        };
                    }
                } else {
                    return {
                        success: false,
                        msg: 'Invalid data sent for decryption 3!'
                    };
                }
            } else {
                return {
                    success: false,
                    msg: 'Invalid Client  Key !'
                };
            }
        } else {
            return {
                success: false,
                msg: 'Invalid Client  Key !'
            };
        }

    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};


var aes256GcmEncryption = (data)=>{
    const functionName = 'aes256GcmEncryption';
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        // log.information('rsaEncryption 3 ===>', rsaEncryption);
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'EncryptionKey',
            KeyType:'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'DecryptionKey',
            KeyType:'DECRYPTION'
        });

        var iterationDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'Iterations',
            KeyType:'ENCRYPTION'
        });

        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails) && iterationDetails && !_.isEmpty(iterationDetails)) {
            // log.information('rsaEncryption 4 ===>', rsaEncryption);
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
				    // log.information("encrypted =>", encrypted);
				    // generate output
				    var encryptedBase64 = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');

				    return {
				    	'$data': encryptedBase64
				    };
                } catch (error) {
                    log.errorInfo(functionName,'error in aes256GcmEncryption',error);
                    return {
                        success: false,
                        msg: 'Unable to encrypt the data !'
                    };
                }
            } else {
                return {
                    success: false,
                    msg: 'Invalid Client Key !'
                };
            }
        } else {
            return {
                success: false,
                msg: 'Invalid Client Key !'
            };
        }

    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

var aes256GcmDecryption= (data)=>{
    const functionName = 'aes256GcmDecryption';
    if (data.creds && data.creds.encryptionCreds && data.creds.encryptionCreds.clientShelterCreds && data.creds.encryptionCreds.clientShelterCreds.length && data.creds.decryptionCreds && data.creds.decryptionCreds.clientShelterCreds && data.creds.decryptionCreds.clientShelterCreds.length) {
        // log.information('rsaEncryption 3 ===>', rsaEncryption);
        var encryptionKeyDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'EncryptionKey',
            KeyType:'ENCRYPTION'
        });

        var decryptionKeyDetails = _.find(data.creds.decryptionCreds.clientShelterCreds, {
            ParamName: 'DecryptionKey',
            KeyType:'DECRYPTION'
        });

        var iterationDetails = _.find(data.creds.encryptionCreds.clientShelterCreds, {
            ParamName: 'Iterations',
            KeyType:'ENCRYPTION'
        });

        if (encryptionKeyDetails && !_.isEmpty(encryptionKeyDetails) && decryptionKeyDetails && !_.isEmpty(decryptionKeyDetails) && iterationDetails && !_.isEmpty(iterationDetails)) {
            // log.information('rsaEncryption 4 ===>', rsaEncryption);
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
							    const key = crypto.pbkdf2Sync(decryptionKeyContent, salt , iterationValue, 32, 'sha512');

							    // AES 256 GCM Mode
							    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
							    decipher.setAuthTag(tag);

							    // encrypt the given text
							    const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
							    log.information(functionName,"decrypted data", decrypted);

							    return JSON.parse(decrypted);
                            } catch (error) {
                                log.errorInfo(functionName,"Error in aes256GcmDecryption", error);
                                return {
                                    success: false,
                                    msg: 'Unable to decrypt the data !'
                                };
                            }
                        } else {
                            return {
                                success: false,
                                msg: 'Invalid data sent for decryption !'
                            };
                        }
                    } else {
                        return {
                            success: false,
                            msg: 'Invalid data sent for decryption !'
                        };
                    }
                } else {
                    return {
                        success: false,
                        msg: 'Invalid data sent for decryption !'
                    };
                }
            } else {
                return {
                    success: false,
                    msg: 'Invalid Client Key !'
                };
            }
        } else {
            return {
                success: false,
                msg: 'Invalid Client Key !'
            };
        }

    } else {
        return {
            success: false,
            msg: 'Invalid Credentials'
        };
    }
};

// var rsaDecryptionSample = (data) => {
// 	var decryptionPrivateKey = new NodeRSA(fs.readFileSync('/Users/tj/.ssh/ext_client_priv_key.pem'));
// 	// {"$data":"I0cSeHtNH2HLOJ2YaWkhFcymWzuTLs7J3YfjlC5d8+IrS5VAudv5VgT30Pu/S+XNfh3/lwMR4C04\r\n4na5zL5orfx8pURJNwU/kFOtQKolY+vQ9Fkk7VWLVVOq1+XYXpOZpslxnWKJRV/Nv2fB5TQEMO5+\r\n0zXmMU2bM3sxRmlzbt7BTzUE0GE0RjuI1IpSBjbbAAhUBC8yyGSwH9wgm8NDSJtnQrZHWZlEJL5N\r\nM7FFhXvvxxgQpulRlBZXSLMWZmQ303nq+HubIZijq7r52ahxC6YGxL2kqN8gJDMVCHQdhOOtP9Hm\r\nZMhDv9WrpdZbAUB4OfzXfzP8F5kra3eaOsvwTg==\r\n"}
// 	var encryptedString = {
// 		"$type": "base64",
// 		"$data": "I0cSeHtNH2HLOJ2YaWkhFcymWzuTLs7J3YfjlC5d8+IrS5VAudv5VgT30Pu/S+XNfh3/lwMR4C04\r\n4na5zL5orfx8pURJNwU/kFOtQKolY+vQ9Fkk7VWLVVOq1+XYXpOZpslxnWKJRV/Nv2fB5TQEMO5+\r\n0zXmMU2bM3sxRmlzbt7BTzUE0GE0RjuI1IpSBjbbAAhUBC8yyGSwH9wgm8NDSJtnQrZHWZlEJL5N\r\nM7FFhXvvxxgQpulRlBZXSLMWZmQ303nq+HubIZijq7r52ahxC6YGxL2kqN8gJDMVCHQdhOOtP9Hm\r\nZMhDv9WrpdZbAUB4OfzXfzP8F5kra3eaOsvwTg==\r\n"
// 	};
// 	// log.information('verifiedString ===>', verifiedString);
// 	// 
// 	var buf = Buffer.from(encryptedString['$data'], 'base64');
// 	var decryptedString = decryptionPrivateKey.decrypt(buf);
// 	decryptedString = JSON.parse(decryptedString);
// 	// log.information('decryptedString ===>', decryptedString);
// 	return decryptedString;
// };


// log.information("aesEncryptionSample.  ====>" ,aesEncryption(JSON.stringify({
// 	"ThirdPartyID": "4D0S64",
// 	"SubscriptionCode": "OP001",
// 	"ShipmentReferenceID": "SHIPMENT_REF",
// 	"orders": [
// 	{
// 		"OrderReferenceID": "ORDER_REF1",
// 		"parts": [
// 		{
// 			"PartCode": "0412001401",
// 			"PartState": "FRESH",
// 			"Quantity": "1",
// 			"partItems": [
// 			{
// 				"SerialNumber": "SERIAL_NUMBER1"
// 			}]
// 		},
// 		{
// 			"PartCode": "0412001401",
// 			"PartState": "DEFECTIVE",
// 			"Quantity": "1",
// 			"partItems": [
// 			{
// 				"SerialNumber": "1212121A",
// 				"JobReferenceID": "JOB_REF_1"
// 			}]
// 		}]
// 	},
// 	{
// 		"OrderReferenceID": "ORDER_REF2",
// 		"parts": [
// 		{
// 			"PartCode": "0412001401",
// 			"PartState": "FRESH",
// 			"Quantity": "2"
// 		}]
// 	}]
// }), '3zTvzr3p67VC61jmV54rIYu1545x4TlY'));
// aesDecryption('VgDXiOMk3XUrL4TzlApVBsqQUH0DpJ2lNMaRPK/ZUD627IVQ1QeGsCa+kt1zLO6zCOkJfG+4K4403KaVlJ3tTqJrkCxg81/HwZyhCLROPBFxMz130wpfNo0XN3V9HBQYx9aDPqRUbP5fppmJcJffp/QQyN+IU7XmkzVprmLa1r5WlRKgeE43lcXJOETcdF9IBTGYod+kCiQn7Wr8wHsVCByQpUj/hqYsBFLAg7+5W85vZEhelL1KWx6fP3CJ5u4LxSKy+zuect3flX5MEOOvAZ7sj/fZ1qdUNb5yMdWwLOBQm+0iT0+fhGS1GSQASpe0GZyg8JFzucLPAgYLJq56vM9/KoHyZhW7+0gIPWfXogle61jKoJSzO7z7M1e32583MvVn3+Ehah4w+NIXnAHZlQb8fe8x0tn+7ybakti5mw2PkdHh7Q1K8BSxqBA7FnO47exqLx11uFkBivtLvn8koLbfq2HQDr2ribeMjkvpAqChDswZ+BM4sDINXgqrry+rMZwx85lI4KFK2xdjG6eZthL933VNi5Q5eYecVCHC6/yxAAfbyHwRcpzBPhsQyVQ+OzuoQPtpTJXkyDPBRGJR1OZrlrRrNqHplID0eAaE4bWIfZ3n3d6DsqWrG/y+E9wyElJ9j01dQMIw7QwziC2AqEh82HgpDzjN6agjN9DTwhvenx1p5OstM4FGkSqmjqNmWETCjC2DCHLGQSVCRfaYS2a55gEeksH29Zt5mc5p9/SNKzTeVM+GGOifX/0REMBIv0iXNOC2OZUawRyp/zA=','3zTvzr3p67VC61jmV54rIYu1545x4TlY');

// rsaDecryptionSample({});
exports.encrypt = encrypt;
exports.decrypt = decrypt;