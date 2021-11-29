var app = require('./../server');
var requireHelper = require('./require-helper');
var cacheHelper = require('./cache-helper');
var log = requireHelper.createBunyanLogger('Middleware Helper');
var _ = requireHelper._;
var async = requireHelper.async;
var crypto = requireHelper.crypto;
var constants = requireHelper.constants;
var moment = requireHelper.moment;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
var HMAC_DATE_FORMAT = constants.HMAC_DATE_FORMAT;
var env = requireHelper.env;
var getCachedKey = cacheHelper.getCachedKey;
var getKey = cacheHelper.getKey;
var setExpKey = cacheHelper.setExpKey;
var secretEncryption = requireHelper.secretEncryption;
const HMAC_THRESHOLD = constants.HMAC_THRESHOLD;
const FUTURE_DATE_HMAC_THRESHOLD = constants.FUTURE_DATE_HMAC_THRESHOLD;

var hmacAuth = function(data) {
	const functionName = 'hmacAuth';
	if (data.headers && data.headers['x-host'] && data.headers['x-date'] && data.headers['hmac-signature']) {
		var clientRequestHost = data.headers['x-host'];
		var clientRequestDate = data.headers['x-date'];
		var clientHmacSignature = data.headers['hmac-signature'];
		if (clientRequestHost.indexOf('.') > -1) {
			log.information(functionName,'x-date', clientRequestDate);
			log.information(functionName,'x-date splits',clientRequestDate.split(' GMT'));
			log.information(functionName,'get date last value', _.reverse(clientRequestDate.split(' '))[0]);
			log.information(functionName,'hmac x-date validated',moment(clientRequestDate.split(' GMT'), HMAC_DATE_FORMAT, true))
			if (moment(clientRequestDate.split(' GMT')[0], HMAC_DATE_FORMAT, true).isValid() && _.reverse(clientRequestDate.split(' '))[0] === 'GMT') {
				try {
					if(moment(clientRequestDate).isBefore(moment().subtract(HMAC_THRESHOLD,'s'))) {
						log.information(functionName,'Expired x-date',`Old x-date: ${clientRequestDate} sent by client: ${data.externalClient.ClientName}`);
                    }
                    if(moment(clientRequestDate).isAfter(moment().add(FUTURE_DATE_HMAC_THRESHOLD,'s'))) {
						log.information(functionName,'Future x-date',`Future x-date: ${clientRequestDate} sent by client: ${data.externalClient.ClientName}`);
					}
					var secret = data.externalClient.ClientSignature;
					var stringToSign = 'x-date: ' + clientRequestDate + '\n' + 'x-host: ' + clientRequestHost;
					log.information(functionName,"string to sign", stringToSign);
					var encodedSignature = crypto.createHmac("sha256", secret).update(stringToSign).digest("base64");
					if (encodedSignature === clientHmacSignature) {
						return {
							success: true,
							msg: 'Hmac signature verified !'
						};
					} else {
						return {
							success: false,
							msg: 'Hmac signature could not be verified !'
						};
					}
				} catch (e) {
					log.information(functionName,"error in validating hmac", e)
					return {
						success: false,
						msg: 'Hmac signature could not be verified !'
					};
				}
			} else {
				return {
					success: false,
					msg: 'Valid x-host or x-date header is not present 1!'
				};
			}
		} else {
			return {
				success: false,
				msg: 'Valid x-host or x-date header is not present 2!'
			};
		}
	} else {
		return {
			success: false,
			msg: 'Valid x-host or x-date header is not present 3!'
		};
	}
};

var getWhitelistedIPList = function(cb) {
    var sendData = {
        Active: true, 
        secretEncryption: secretEncryption
    };
    app.models.WhitelistedIP.getWhitelistedIPList(sendData, (error, result) => {
        if (error) {
            return cb(error);
        } else if (result && result.success && result.data && result.data.whitelistedIPs && result.data.whitelistedIPs.length) {
            return cb(null, result.data.whitelistedIPs);
        } else {
            return cb(result);
        }
    });
};
/*
var getExternalClientList = function(cb) {
    var sendData = {
      secretEncryption: secretEncryption
    };
    app.models.ExternalClient.getExternalClientList(sendData, (error, result) => {
        if (error) {
            return cb(error);
        } else if (result && result.success && result.data && result.data.externalClients && result.data.externalClients.length) {
            return cb(null, result.data.externalClients);
        } else {
            return cb(result);
        }
    });
};
*/

var getErrorCodeList = function() {
	const functionName = 'getErrorCodeList';
	var cache = {};
	var prefix = 'errorCode_';
	return getCachedKey(prefix, CACHE_CLEAR_INTERVAL.ERROR_CODES, function(data, key, cb) {
		log.information(functionName,'headers',data.headers);
		var filter = {
			where: {
				LanguageCode: data.LanguageCode,
				Active: true,
				Archived: false
			}
		};
		// console.log('filter', filter)
		app.models.ErrorCode.find(filter, function(error, result) {
			if (error) {
				log.errorInfo(functionName,'error in getErrorCodeList', error);
				return cb('Error occured while fetching error codes !');
			}
			var errorCodeContent = {};
			_.forEach(result, (value, key) => {
				var eachErrorCode = {
					errorCode: value.ErrorCode,
					msg: value.ErrorMsg,
				};
				errorCodeContent[value.ErrorCode] = eachErrorCode;
			});
			_.set(app.models.ErrorCode, 'errorCodeObj[' + data.LanguageCode + ']', errorCodeContent);
			// app.models.ErrorCode.errorCodeObj[req.body.LanguageCode] = result;
			return cb(null, app.models.ErrorCode.errorCodeObj);
		});
	});
};


var getClientShelter = function() {
    var cache = {};
    var prefix = 'clientShelter_';
    let functionName = 'getClientShelter';
    return getCachedKey(prefix, CACHE_CLEAR_INTERVAL.EXTERNAL_CLIENT_SHELTER, function(data, key, {}, cb) {
        app.models.Master.getClientShelterList(data, function(error, result) {
            if (error) {
                log.errorInfo(functionName,'error in getClientShelter', error);
                return cb('Error occured while fetching client details !');
            } else if (result && result.success && result.data && result.data.clientShelters && result.data.clientShelters.length) {
                //console.log('clientShelterCreds ====>', result.data.clientShelters);
                var externalClientID = _.get(data, 'headers.ExternalClientID');
                var clientShelter = _.filter(result.data.clientShelters, {
                    ExternalClientID: externalClientID,
                    Active: 1 
                });
 
             
                  
                if (clientShelter && clientShelter.length) {
                    var clientShelterCreds = [];

                    // _.forEach(clientShelter, (o) => {
                    // 	_.forEach(o.clientShelterCreds, (ol) => {
                    // 		var eachCredential = {};
                    // 		var credentialProps = {};

                    // 		_.set(credentialProps, 'Value', ol.ParamValue);
                    // 		_.set(credentialProps, 'Type', ol.ParamType);
                    // 		_.set(eachCredential, ol.ParamName, credentialProps);
                    // 		clientShelterCreds.push(eachCredential);
                    // 		console.log('clientShelterCreds ====>', clientShelterCreds);
                    // 	});
                    // 	o.clientShelterCreds = clientShelterCreds;
                    // });
                    //console.log('clientShelter ====>', JSON.stringify(clientShelter));
                    data.clientShelterCreds = clientShelter;
                    return cb(null, clientShelter);
                } else {
                    return cb('Invalid Credentials !');
                }
            } else {
                return cb(result);
            }
        });
    });
};

var getExternalClientList = function(cb) {
    var sendData = {
        Active: true, 
        secretEncryption: secretEncryption
    };
    app.models.ExternalClient.getExternalClientList(sendData, (error, result) => {
        if (error) {
            return cb(error);
        } else if (result && result.success && result.data && result.data.externalClients && result.data.externalClients.length) {
            return cb(null, result.data.externalClients);
        } else {
            return cb(result);
        }
    });
};

var getClientToken = (data, cb) => {
    var prefix = 'clientAuth_';
    var key = _.get(data, 'headers.ExternalClientID');
    var sendData = {
        prefix: prefix,
        key: key
    };
    getKey(sendData, cb);
};

var resetTokenValidity = (data, cb) => {
    const functionName = 'resetTokenValidity'
    log.information(functionName,'resetTokenValidity data', data);
    var prefix = 'clientAuth_';
    var key = _.get(data, 'headers.ExternalClientID');
    var sendData = {
        prefix: prefix,
        key: key,
        token: data.token,
        ttl: CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL
    };
    setExpKey(sendData, cb);
};


var hedwigPublishMessage = function(data, cb) {
    const functionName = 'hedwigPublishMessage';
    cb();
    app.models.Hedwig.publishMessage(data, (error, result) => {
        log.errorInfo(functionName,'error in hedwigPublishMessage', error);
        log.errorInfo(functionName,'result in hedwigPublishMessage', result);
    });
};

var getClientWhitelistedAPIList = (data, cb) => {
    data.secretEncryption = secretEncryption;
    data.Active = true; 
    app.models.ClientWhitelistedAPI.getClientWhitelistedAPI(data, cb);
}

exports.hmacAuth = hmacAuth;
exports.hedwigPublishMessage = hedwigPublishMessage;
exports.getClientShelter = getClientShelter;
exports.getErrorCodeList = getErrorCodeList;
exports.getClientToken = getClientToken;
exports.resetTokenValidity = resetTokenValidity;
exports.getWhitelistedIPList = getWhitelistedIPList;
exports.getExternalClientList = getExternalClientList;
exports.getClientWhitelistedAPIList = getClientWhitelistedAPIList;