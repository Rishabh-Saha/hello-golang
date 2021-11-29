/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('Diagnosis');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;

module.exports = function (Diagnosis) {
    Diagnosis.fetchDiagnosisResult = function (data, _cb) {
        const functionName = "Diagnosis.fetchDiagnosisResult";
        async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        'ProductUniqueID'
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
            fetchDiagnosisResult: ['validate', function (results, callback) {
            	app.models.CoreApi.fetchDiagnosisResult(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });   
            }]
        }, function (asyncError, asyncResult) {
        	if (asyncError) {
                log.errorInfo(functionName,'error in fetchDiagnosisResult',asyncError);
                return _cb(null, customCatchError(asyncError, data));
            } else {
                log.information(functionName,'result of fetchDiagnosisResult',asyncResult.fetchDiagnosisResult);
                if (asyncResult && asyncResult.fetchDiagnosisResult) {
                    return _cb(null, sendFormattedResponse(asyncResult.fetchDiagnosisResult));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        })
    }
    
    Diagnosis.getDiagnosisStatusList = function(data,cb){
        const functionName = "Diagnosis.getDiagnosisStatusList";
		async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        //'ProductUniqueID'
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
            getDiagnosisStatusList: ['validate', function (results, callback) {
                app.models.CoreApi.getDiagnosisStatusList(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result);
                    } else {
                        return callback(result);
                    }
                });   
            }]
        }, function (asyncError, asyncResult) {
            if (asyncError) {
                log.errorInfo(functionName,'error in getDiagnosisStatusList',asyncError);
                return cb(null, customCatchError(asyncError, data));
            } else {
                log.information(functionName,'result of getDiagnosisStatusList',asyncResult.getDiagnosisStatusList);
                if (asyncResult && asyncResult.getDiagnosisStatusList) {
                    return cb(null, sendFormattedResponse(asyncResult.getDiagnosisStatusList));
                } else {
                    return cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        })
    }

    Diagnosis.getDiagnosisDetails = function(data,cb){
        const functionName = "Diagnosis.getDiagnosisDetails";
		async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        //'ProductUniqueID','DiagnosisUUID'
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
            getDiagnosisDetails: ['validate', function (results, callback) {
                app.models.CoreApi.getDiagnosisDetails(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result);
                    } else {
                        return callback(result);
                    }
                });   
            }]
        }, function (asyncError, asyncResult) {
            if (asyncError) {
                log.errorInfo(functionName,'error in getDiagnosisDetails',asyncError);
                return cb(null, customCatchError(asyncError, data));
            } else {
                log.information(functionName,'result of getDiagnosisDetails',asyncResult.getDiagnosisDetails);
                if (asyncResult && asyncResult.getDiagnosisDetails) {
                    return cb(null, sendFormattedResponse(asyncResult.getDiagnosisDetails));
                } else {
                    return cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        })
    }

	Diagnosis.remoteMethod(
        'fetchDiagnosisResult', {
            description: '',
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

    Diagnosis.remoteMethod(
        'getDiagnosisStatusList', {
        description: '',
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

    Diagnosis.remoteMethod(
        'getDiagnosisDetails', {
        description: '',
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
}
