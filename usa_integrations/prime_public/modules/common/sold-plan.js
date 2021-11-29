/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('SoldPlan');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;
const constants = requireHelper.constants;

/**
 * All the previously used ThirdPartyResult.Source is changed to data.externalClient.ConstantName assuming that
 * it is appended in data after authentication
 */


var sourceRightsMapping = {
    'Oppo': {
        Filters: {
            BrandIDs: [85]
        },
        RequiredFields: ['IMEI']
    },
    'Micromax': {
        Filters: {
            Source: 'Micromax'
        }
    }
}

module.exports = function (SoldPlan) {
    
    SoldPlan.externalPlanCreation = function (data, _cb) {
        const functionName = 'SoldPlan.externalPlanCreation'; 
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
            externalPlanCreation: ['validate', function (results, callback) {
                app.models.Aegis.externalPlanCreation(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in externalPlanCreation', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.externalPlanCreation) {
                    log.information(functionName, 'asyncAutoResult of externalPlanCreation', asyncAutoResult);
                    return _cb(null, asyncAutoResult.externalPlanCreation);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    SoldPlan.getContractDetails = function (data, _cb) {
        const functionName = "SoldPlan.getContractDetails";
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
            getContractDetails: ['validate', function (results, callback) {
                data.ThirdPartyID = data.headers ? data.headers['client-id'] : null;
                app.models.Aegis.getContractDetailsTapsafe(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getContractDetails',error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.getContractDetails) {
                    if(asyncAutoResult.getContractDetails.success) {
                        log.information(functionName,'result of getContractDetails',asyncAutoResult.getContractDetails);
                    }else{
                        log.errorInfo(functionName,'error in getContractDetails',asyncAutoResult.getContractDetails);
                    }
                    return _cb(null, asyncAutoResult.getContractDetails);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    SoldPlan.cancelContract = function (data, _cb) {
        const functionName = "SoldPlan.cancelContract";
        let externalClientName = data.externalClient.ClientName;
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
            cancelContract: ['validate', function (results, callback) {
                data.ThirdPartyID = data.headers ? data.headers['client-id'] : null;
                app.models.Aegis.cancelContract(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in cancelContract', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.cancelContract) {
                    if(asyncAutoResult.cancelContract.success) {
                        log.information(functionName,'result of cancelContract',asyncAutoResult.cancelContract);
                    }else{
                        log.errorInfo(functionName,'error in cancelContract',asyncAutoResult.cancelContract);
                    }
                    if (constants.RESPONSE_HANDLER.indexOf(externalClientName) > -1) {
                        return _cb(null, asyncAutoResult.cancelContract);
                    }else{
                        asyncAutoResult.cancelContract.clientShelterCreds = data.clientShelterCreds;
                        return _cb(null, sendFormattedResponse(asyncAutoResult.cancelContract));
                    }    
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    SoldPlan.getActivationData = function (data, _cb) {
        const functionName = "SoldPlan.getActivationData";
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
            getActivationData: ['validate', function (results, callback) {
                data.FulfillerReferenceID = data.BrokerReferenceID;
                if (data.FulfillerReferenceID) {
                    delete data.Source;
                }
                if (data.IMEI) {
                    data.ProductUniqueID = data.IMEI
                }
                let source = (data.externalClient && data.externalClient.ConstantName) ? data.externalClient.ConstantName : data.app || 'PublicApi';
                //TODO:fetch from third party access config
                if (sourceRightsMapping && sourceRightsMapping[source] && sourceRightsMapping[source].Filters) {
                    _.forEach(sourceRightsMapping[source].Filters, function (value, key) {
                        var filter = value;
                        if (data[key] && data[key].length) {
                            filter = _.intersection(filter, data[key])
                        }
                        data[key] = filter
                    })
                }
                //check for required keys
                if (sourceRightsMapping && sourceRightsMapping[source] && sourceRightsMapping[source].RequiredFields) {
                    var difference = _.difference(sourceRightsMapping[source].RequiredFields, _.keysIn(data));
                    if (difference && difference.length) {
                        return callback('Insufficient Parameters');
                    }
                }
                app.models.Aegis.getActivationData(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getActivationData',error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                log.information(functionName,'result of getActivationData',asyncAutoResult.getActivationData);
                if (asyncAutoResult && asyncAutoResult.getActivationData) {
                    return _cb(null, asyncAutoResult.getActivationData);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
     
    SoldPlan.updateSoldPlanDetails = function (data, _cb) {
        const functionName = 'SoldPlan.updateSoldPlanDetails';
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
            updateSoldPlanDetails: ['validate', function (results, callback) {
                app.models.Aegis.updateSoldPlanDetails(data, (error, result) => {
                    if (result && result.success && result.data) {
                        return callback(null, result)
                    } else {
                        return callback(null, {
                            success: false,
                            msg: 'Something went wrong',
                            data: {}
                        })
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in updateSoldPlanDetails', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.updateSoldPlanDetails) {
                    log.information(functionName, 'asyncAutoResult of updateSoldPlanDetails', asyncAutoResult);
                    asyncAutoResult.updateSoldPlanDetails.clientShelterCreds = asyncAutoResult.validate.clientShelterCreds;
                    return _cb(null, sendFormattedResponse(asyncAutoResult.updateSoldPlanDetails));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    SoldPlan.updatePlan = function (data, _cb) {
        const functionName = 'SoldPlan.updatePlan';
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
            updatePlan: ['validate', function (results, callback) {
                app.models.Aegis.activateSoldPlanByInvoice(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in updatePlan', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.updatePlan) {
                    log.information(functionName, 'asyncAutoResult of updatePlan', asyncAutoResult);
                    return _cb(null, asyncAutoResult.updatePlan);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    SoldPlan.createSoldPlan = function (data, _cb) {
        const functionName = "SoldPlan.createSoldPlan";
        let externalClientName = data.externalClient.ClientName;
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
            createSoldPlan: ['validate', function (results, callback) {
                app.models.CoreApi.createPublicSoldPlan(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    } else {
                        return callback(null, result);
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in createSoldPlan', error);
                return _cb(null, customCatchError({
                    msg: error
                }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.createSoldPlan) {
                    if(asyncAutoResult.createSoldPlan.success){
                        log.information(functionName, 'result of createSoldPlan', asyncAutoResult.createSoldPlan);
                    }else{
                        log.errorInfo(functionName, 'error in createSoldPlan', asyncAutoResult.createSoldPlan);                        
                    }
                    if (constants.RESPONSE_HANDLER.indexOf(externalClientName) > -1) {
                        return _cb(null, asyncAutoResult.createSoldPlan);
                    } else {
                        asyncAutoResult.createSoldPlan.clientShelterCreds = data.clientShelterCreds;
                        return _cb(null, sendFormattedResponse(asyncAutoResult.createSoldPlan));
                    }
                } else {
                    return _cb(null, customCatchError({
                        msg: "Please try again later !"
                    }, data));
                }
            }
        });
    };
    SoldPlan.getContractList = function (data, _cb) {
        const functionName = "SoldPlan.getContractList";
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
            getContractList: ['validate', function (results, callback) {
                data.ThirdPartyID = data.headers ? data.headers['client-id'] : null;
                app.models.Aegis.getSoldPlanList(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in getContractList', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                log.information(functionName,'result of getContractList',asyncAutoResult.getContractList);
                if (asyncAutoResult && asyncAutoResult.getContractList) {
                    return _cb(null, asyncAutoResult.getContractList);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    }

    SoldPlan.checkEligibility = function(data, _cb) {
        let functionName = 'SoldPlan.checkEligibility';
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
            checkEligibility : ['validate', function(results, callback) {
                app.models.CoreApi.checkSoldPlanEligibility(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,"error  in checkEligibility",error)
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,"result of checkEligibility",asyncAutoResult.checkEligibility)
                if (asyncAutoResult && asyncAutoResult.checkEligibility) {
                    asyncAutoResult.checkEligibility.clientShelterCreds = data.clientShelterCreds;
                    return _cb(null, sendFormattedResponse(asyncAutoResult.checkEligibility));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    SoldPlan.remoteMethod(
        'createSoldPlan', {
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

    SoldPlan.remoteMethod(
        'externalPlanCreation', {
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

    SoldPlan.remoteMethod(
        'getContractDetails', {
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

    SoldPlan.remoteMethod(
        'cancelContract', {
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

    SoldPlan.remoteMethod(
        'getActivationData', {
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

    SoldPlan.remoteMethod(
        'updateSoldPlanDetails', {
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


    SoldPlan.remoteMethod(
        'updatePlan', {
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

    SoldPlan.remoteMethod(
        'getContractList', {
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

    SoldPlan.remoteMethod(
        'checkEligibility', {
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

    disableAllMethods(SoldPlan, [
        'createSoldPlan',
        'externalPlanCreation',
        'getContractDetails',
        'cancelContract',
        'getActivationData',
        'updateSoldPlanDetails',
        'updatePlan',
        'getContractList',
        'checkEligibility'
    ]);
};
