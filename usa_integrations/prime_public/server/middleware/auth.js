var requireHelper = require('./../utility/require-helper');
var utils = require('./../utility/utils');
var middlewareHelper = require('./../utility/middleware-helper');
var helper = require('./../../server/utility/helper');
var shelterHelper = helper.shelterHelper;
var log = requireHelper.createBunyanLogger('Auth');
var constants = requireHelper.constants;
var OPEN_ROUTES = constants.OPEN_ROUTES;
var DEFAULT_LANGUAGE_CODE = constants.DEFAULT_LANGUAGE_CODE;
var customCatchError = utils.customCatchError;
var _ = requireHelper._;
var async = requireHelper.async;
var getExternalClientList = middlewareHelper.getExternalClientList;
var getWhitelistedIPList = middlewareHelper.getWhitelistedIPList;
var hmacAuth = middlewareHelper.hmacAuth;
var getClientShelter = middlewareHelper.getClientShelter();
var getClientWhitelistedAPIList = middlewareHelper.getClientWhitelistedAPIList;
const errorWrapper = requireHelper.errorWrapper;

/*var unAuth = customCatchError({
    status: 401,
    msg: 'You are not authenticated'
});*/
var env = requireHelper.env;
var secretEncryption = secretEncryption;

module.exports = function() {
    return function auth(req, res, next) {
        const functionName = 'auth-middleware';
        var rp = req.path;
        var apiName = rp.substr(rp.lastIndexOf('/') + 1);
        // var referer = req.headers && req.headers.referer ? req.headers.referer : '';
        var rpArr = rp.split('/');
        var modelName = rpArr[rpArr.length - 2];
        // var unAuthObj = _.cloneDeep(unAuth); //_.cloneDeep because _.assign mutates
        apiName = modelName + '/' + apiName;
        //Allow all open routes
        req.body.apiName = apiName;

        req.body.headers = req.body.customHeaders;
        if (!req.body.customHeaders) {
            req.body.headers = req.headers;
        }

        req.body.headers.clientName = req.headers['client-id'];
        req.body.headers.clientSessionID = req.headers['client-session-id'];
        req.body.headers.restAction = req.headers['rest-action'];
        
        req.body.headers.clientIP = _.split(req.headers['x-forwarded-for'], ',')[0];
        
        // req.body.headers.clientID = 1;

        if (env === 'default' || env === 'development') {
            req.body.headers.clientIP = '203.187.221.178';
        }

        var LanguageCode = req.body.headers.languagecode;
        if (!LanguageCode) {
            LanguageCode = DEFAULT_LANGUAGE_CODE;
        }
        req.body.headers.LanguageCode = LanguageCode;
        req.body.LanguageCode = LanguageCode;
        log.information(functionName,'request headers', req.body.headers)
        if (OPEN_ROUTES.AUTH.indexOf(rp) > -1 || _.startsWith(rp, '/v1/explorer')) {
            next();
        } else {
            async.auto({
                getClientList: (callback) => {
                    getExternalClientList(callback);
                },
                validateClient: ['getClientList', (results, callback) => {
                    if (results.getClientList && results.getClientList.length) {
                        var externalClients = results.getClientList;
                        var externalClient = _.find(externalClients, (o) => {
                            return o.ClientName === req.body.headers['client-id'];
                        });
                        log.information(functionName,'external client detail', externalClient);
                        if (externalClient && !_.isEmpty(externalClient) && externalClient.ExternalClientID) {
                            req.body.headers.ExternalClientID = externalClient.ExternalClientID;
                            return callback(null, externalClient);
                        } else {
                            return callback('Client is not registered with Servify, Please Contact Servify !');
                        }
                    } else {
                        return callback('Client is not registered with Servify, Please Contact Servify !');
                    }
                }],
                getWhitelistedApiList: ['validateClient',(results, callback) => {
                    log.information(functionName,'results of validateClient',results.validateClient);
                    if (results.validateClient && !_.isEmpty(results.validateClient) && results.validateClient.ExternalClientID && results.validateClient.ApiWhitelisting == 1) {
                        let sendData = {
                            ExternalClientID:results.validateClient.ExternalClientID,
                            ApiName: apiName,
                            RestAction: req.body.headers.restAction,
                            Active: true
                        }
                        
                        getClientWhitelistedAPIList(sendData,function(error,apiAllowed){
                            log.information(functionName,'result of client whitelisted api',apiAllowed);
                            if(error){
                                log.errorInfo(functionName, 'error in getClientWhitelistedAPIList',errorWrapper(error));
                                return callback('Client API not found. Please Contact Servify !');
                            }else if(!apiAllowed || !apiAllowed.success){
                                return callback('Client API is not whitelisted. Please Contact Servify !');
                            }else{
                                return callback();
                            }
                        });
                    } else {
                        return callback();
                    }
                }],
                hmacAuth: ['validateClient', (results, callback) => {
                    if (results.validateClient && !_.isEmpty(results.validateClient)) {
                        req.body.externalClient = results.validateClient;
                        var hmacAuthRes = hmacAuth(req.body);
                        if (hmacAuthRes && hmacAuthRes.success) {
                            return callback(null, hmacAuthRes);
                        } else {
                            return callback(hmacAuthRes.msg);
                        }
                    } else {
                        return callback('Client is not registered with Servify, Please Contact Servify !');
                    }
                }],
                getWhitelistedIPList: ['hmacAuth', (results, callback) => {
                    if(results.validateClient && !_.isEmpty(results.validateClient) && results.validateClient.ExternalClientID){
                        if(results.validateClient.SourceWhitelisting == 1){
                            getWhitelistedIPList(callback);
                        }else{
                            log.information(functionName,'IP varification','NO NEED TO FETCH IP LIST FOR VERIFICATION');
                            return callback(); //No need to check IP whitelisting
                        }
                    }else{
                        return callback('Client is not registered with Servify, Please Contact Servify !');
                    }
                }],
                validateIP: ['getWhitelistedIPList', (results, callback) => {
                    if (results.validateClient && !_.isEmpty(results.validateClient) && results.validateClient.ExternalClientID){
                        if(results.validateClient.SourceWhitelisting == 1) {
                            if (results.getWhitelistedIPList && results.getWhitelistedIPList.length) {
                                var whitelistedIPs = results.getWhitelistedIPList;
                                var whitelistedIP = _.find(whitelistedIPs, (o) => {
                                    return o.ExternalClientID === results.validateClient.ExternalClientID && o.Address === req.body.headers.clientIP;
                                });
                                if (whitelistedIP && !_.isEmpty(whitelistedIP) && whitelistedIP.ExternalClientID && whitelistedIP.Address) {
                                    return callback(null, whitelistedIP);
                                } else {
                                    return callback('Client IP address is not whitelisted with Servify, Please Contact Servify !');
                                }
                            } else {
                                return callback('Client IP address is not whitelisted with Servify, Please Contact Servify !');
                            }
                        }else{
                            log.information(functionName,'source whitelisting','NO NEED TO CHECK FOR SOURCE WHITELISTING');
                            return callback(); //No need to check SOURCE whitelisting
                        }
                    }else{
                        return callback('Client is not registered with Servify, Please Contact Servify !');
                    }
                }],
                getClientShelter: ['validateIP', (results, callback) => {
                    getClientShelter(req.body, results.validateClient.ExternalClientID, {}, (error, result) => {
                        if (error) {
                            return callback(error);
                        } else {
                            req.body.clientShelterCreds = result;
                            return callback(null, result);
                        }
                    });
                }],
                decryptRequestBody: ['getClientShelter','getWhitelistedApiList', (results, callback) => {
                    log.information(functionName,'result of getClientShelter', results.getClientShelter);
                    var decryptedRequestBody;
                    if(req.is('multipart/form-data')) {
                        decryptedRequestBody = req.body;
                    } else {
                        var sendData = {
                            dataToProcess: req.body,
                            clientShelterCreds: req.body.clientShelterCreds
                        }
                        
                        decryptedRequestBody = shelterHelper.decrypt(sendData);
                    }
                    decryptedRequestBody.PartnerID = results.validateClient.PartnerID;
          
                    log.information(functionName,'decrypted request body', decryptedRequestBody, sendData);
                    if (!_.isEmpty(decryptedRequestBody) && (decryptedRequestBody.success === false) && (decryptedRequestBody.success !== undefined) && !(decryptedRequestBody.success)) {
                        return callback(decryptedRequestBody);
                    } else {
                        var decryptedForward = decryptedRequestBody;
                        decryptedForward.clientShelterCreds = req.body.clientShelterCreds;
                        decryptedForward.IntegrationID = results.validateClient.IntegrationID;
                        decryptedForward.PartnerID = results.validateClient.PartnerID;
                        decryptedForward.headers = req.body.headers;
                        decryptedForward.externalClient = results.validateClient;
                        req.body = decryptedForward;
                        return callback(null, decryptedForward);
                    }
                }]
            }, function(error, asyncAutoResult) {
                if (error) {
                    log.errorInfo(functionName,'error of auth middleware', errorWrapper(error));
                    if (error === 500) {
                        res.send(customCatchError({}, req.body));
                    } else {
                        res.status(401).send(customCatchError(error, req.body));
                    }
                } else {
                    log.information(functionName,'result of auth middleware', {
                        "validateClient": asyncAutoResult.validateClient,
                        "hmacAuth": asyncAutoResult.hmacAuth,
                        "validateIP": asyncAutoResult.validateIP,
                        "decryptRequestBody": asyncAutoResult.decryptRequestBody
                    });
                    next();
                }
            });
        }
    };
};