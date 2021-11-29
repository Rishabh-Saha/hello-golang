/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('ConsumerProduct');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;


module.exports = function (ConsumerProduct) {
    ConsumerProduct.createOrUpdateExternalConsumerProduct = function (data, _cb) {
        const functionName = "ConsumerProduct.createOrUpdateExternalConsumerProduct";
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
            createOrUpdateExternalConsumerProduct: ['validate', function (results, callback) {

                app.models.CoreApi.createOrUpdateExternalConsumerProduct(data, (error, result) => {
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
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in createOrUpdateExternalConsumerProduct', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                log.information(functionName,'result of createOrUpdateExternalConsumerProduct',asyncAutoResult.createOrUpdateExternalConsumerProduct);
                if (asyncAutoResult && asyncAutoResult.createOrUpdateExternalConsumerProduct) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.createOrUpdateExternalConsumerProduct));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    //done
    ConsumerProduct.getDevicePlans = function (data, _cb) {
        const functionName = 'ConsumerProduct.getDevicePlans'; 
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
            getDevicePlans: ['validate', function (results, callback) {
                app.models.CoreApi.getDevicePlansFromImei(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in getDevicePlans', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of getDevicePlans', asyncAutoResult);
                    return _cb(null, asyncAutoResult.getDevicePlans);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    //done
    ConsumerProduct.retailPlanPurchase = function (data, _cb) {
        const functionName = 'ConsumerProduct.retailPlanPurchase'; 
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
            retailPlanPurchase: ['validate', function (results, callback) {
                data.Customer = 'B2X';
                app.models.CoreApi.retailPlanPurchase(data, (error, result) => {
                    if(error) {
                        return callback(error)
                    }
                    if(result && result.success) {
                        return callback(null, result)
                    }
                    return callback(null, {
                        success: false,
                        msg: "Something went wrong",
                        data: {}
                    })
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in retailPlanPurchase', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of retailPlanPurchase', asyncAutoResult); 
                    return _cb(null, asyncAutoResult.retailPlanPurchase);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    //done
    ConsumerProduct.createComplimentaryPlan = function (data, _cb) {
        const functionName = 'ConsumerProduct.createComplimentaryPlan'; 
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
            createComplimentaryPlan: ['validate', function (results, callback) {
                app.models.CoreApi.createComplimentaryPlan(data, (error, result) => {
                    if(error || !result.success) {
                        return callback(null, {
                            success: false,
                            status: 999,
                            status_code: (result && result.status_code) ? result.status_code : 'UNKNOWN_ERROR',
                            msg: (result && result.msg) ? result.msg : 'Something went wrong',
                            data: {}
                        })
                    }
                    else {
                        return callback(null, {
                            success: true,
                            msg: result.msg || 'Success',
                            status_code: 'OK',
                            data: {}
                        })
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in createComplimentaryPlan', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of createComplimentaryPlan', asyncAutoResult);
                    return _cb(null, asyncAutoResult.createComplimentaryPlan);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };

    ConsumerProduct.iosCheck = function(data, _cb) {
        const functionName = "ConsumerProduct.iosCheck";
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
            checkICloudLockAndFakeIphone : ['validate', function(results, callback) {
                app.models.CoreApi.checkICloudLockAndFakeIphone(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else {
                        if(result && result.success){
                            log.information(functionName,'response of checkICloudLockAndFakeIphone',result);
                        }else{
                            log.errorInfo(functionName,'error in checkICloudLockAndFakeIphone',result);
                        }
                        return callback(null, result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in iosCheck',error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of iosCheck',asyncAutoResult);
                if(asyncAutoResult.checkICloudLockAndFakeIphone.success) delete asyncAutoResult.checkICloudLockAndFakeIphone.data.app;
                return _cb(null, customCatchError(asyncAutoResult.checkICloudLockAndFakeIphone,data));
            }
        });
    };
    
    ConsumerProduct.remoteMethod(
        'createOrUpdateExternalConsumerProduct', {
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

    ConsumerProduct.remoteMethod(
        'getDevicePlans', {
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

    ConsumerProduct.remoteMethod(
        'retailPlanPurchase', {
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

    ConsumerProduct.remoteMethod(
        'iosCheck', {
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

    disableAllMethods(ConsumerProduct, [
        'createOrUpdateExternalConsumerProduct',
        'getDevicePlans',
        'retailPlanPurchase',
        'iosCheck'
    ]);
};