/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('CarrierIntegration');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;


module.exports = function (CarrierIntegration) {
    
    CarrierIntegration.getRequestStatus = function (data, _cb) {
        const functionName = 'CarrierIntegration.getRequestStatus'; 
        async.auto({
            validate: function (callback) {
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
            getRequestStatus: ['validate', function (results, callback) {
                app.models.CoreApi.fetchDetailsByPlan(data, (error, result) => {
                    if(error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error getRequestStatus', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult getRequestStatus', asyncAutoResult); 
                    return _cb(null, asyncAutoResult.getRequestStatus);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    CarrierIntegration.getPlanDetailsByMobileNumber = function (data, _cb) {
        const functionName = 'CarrierIntegration.getPlanDetailsByMobileNumber'; 
        async.auto({
            validate: function (callback) {
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
            getPlanDetailsByMobileNumber: ['validate', function (results, callback) {
                app.models.CoreApi.getPlanDetailsByMobileNumber(data, (error, result) => {
                    if(error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in getPlanDetailsByMobileNumber', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of getPlanDetailsByMobileNumber', asyncAutoResult); 
                    return _cb(null, asyncAutoResult.getPlanDetailsByMobileNumber);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };

    
    CarrierIntegration.remoteMethod(
        'getRequestStatus', {
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

    CarrierIntegration.remoteMethod(
        'getPlanDetailsByMobileNumber', {
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
    
    disableAllMethods(CarrierIntegration, [
        'getRequestStatus',
        'getPlanDetailsByMobileNumber'
    ]);
};