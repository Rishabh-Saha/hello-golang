/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('Otp');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;


module.exports = function (Otp) {
    Otp.requestOTP = function(data, _cb) {
        const functionName = "Otp.requestOTP";
        async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        // 'serialNumber'
                    ],
                    type: 'presence',
                    against: ''
                }]);

                if (!validate) {
                    return callback("Please provide correct data");
                }

                if (!validate.success) {
                    return callback(validate);
                }

                data = validatorFunctions.trimAll(data);
                return callback(null, data);
            },
            requestOTP : ['validate', function(results, callback) {

                app.models.CoreApi.requestOTP(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in requestOTP', error);
                return _cb(null, customCatchError({msg : error},data));
            } else {
                log.information(functionName,'result of requestOTP',asyncAutoResult.requestOTP);
                if (asyncAutoResult && asyncAutoResult.requestOTP) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.requestOTP));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Otp.verifyOtp = function(data, _cb) {
        const functionName = "Otp.verifyOtp";
        async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        // 'serialNumber'
                    ],
                    type: 'presence',
                    against: ''
                }]);

                if (!validate) {
                    return callback("Please provide correct data");
                }

                if (!validate.success) {
                    return callback(validate);
                }

                data = validatorFunctions.trimAll(data);
                return callback(null, data);
            },
            verifyOtp : ['validate', function(results, callback) {

                app.models.CoreApi.verifyOtp(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in verifyOtp', error);
                return _cb(null, customCatchError({msg : error},data));
            } else {
                log.information(functionName,'result of verifyOtp',asyncAutoResult.verifyOtp);
                if (asyncAutoResult && asyncAutoResult.verifyOtp) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.verifyOtp));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Otp.remoteMethod(
        'verifyOtp', {
            description: 'verifyOtp',
            accepts: {
                arg: 'data',
                type: 'object',
                default: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true
            },
            http: {
                verb: 'post'
            }
        });
    
    Otp.remoteMethod(
        'requestOTP', {
            description: 'requestOTP',
            accepts: {
                arg: 'data',
                type: 'object',
                default: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true
            },
            http: {
                verb: 'post'
            }
        });

    disableAllMethods(Otp, [
        'requestOTP',
        'verifyOtp'
    ]);
};