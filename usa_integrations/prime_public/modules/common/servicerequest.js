var env = process.env.NODE_ENV;
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var fileHelper = require('./../../server/utility/file-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('FileRecord');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var s3BaseUrl = requireHelper.s3BaseUrl;
var FILE_REQUEST_TYPE = constants.FILE_REQUEST_TYPE;
var FILE_REQUEST_STATUS = constants.FILE_REQUEST_STATUS;
var momentAcceptedFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ssSSSZ', 'DD-MM-YYYY'];
var catchError = {
    status: 500,
    msg: 'Error in fetching data'
};
var sendFormattedResponse = utils.sendFormattedResponse;
const app = requireHelper.app;

module.exports = function(ServiceRequest) {
    ServiceRequest.scheduleRequest = function(data, cb) {
        try {
            utils.hasSufficientParameters(data, ['Client'], [], [], function(error, sufficientParamsResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    ServiceRequest.app.models[data.Client].scheduleRequest(data, function(error, result) {
                        if (error) {
                            return cb(null, error);
                        } else {
                            return cb(null, result);
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 704,
                error: {
                    "message": "Invalid ThirdpartyID"
                }
            })
        }
    }
    ServiceRequest.getSlots = function(data, cb) {
        try {
            utils.hasSufficientParams(data, ['Client'], [], [], function(error, sufficientParamsResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    ServiceRequest.app.models[data.Client].getSlots(data, function(error, result) {
                        if (error) {
                            return cb(null, error)
                        } else {
                            return cb(null, result)
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 704,
                error: {
                    "message": "Invalid ThirdpartyID"
                }
            })
        }
    }
    ServiceRequest.updateRequest = function(data, cb) {
        try {
            utils.hasSufficientParams(data, ['Client'], [], [], function(error, sufficientParamsResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    ServiceRequest.app.models[data.Client].updateRequest(data, function(error, result) {
                        if (error) {
                            return cb(null, {
                                success: false,
                                status: 444,
                                error: {}
                            })
                        } else {
                            return cb(null, result)
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 704,
                error: {
                    "message": "Invalid ThirdpartyID"
                }
            })
        }
    }
    ServiceRequest.trackRequest = function(data, cb) {
        try {
            utils.hasSufficientParams(data, ['Client'], [], [], function(error, sufficientParamsResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    ServiceRequest.app.models[data.Client].trackRequest(data, function(error, result) {
                        if (error) {
                            return cb(null, {
                                success: false,
                                status: 444,
                                error: {}
                            })
                        } else {
                            return cb(null, result)
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 704,
                error: {
                    "message": "Invalid ThirdpartyID"
                }
            })
        }
    }
    ServiceRequest.fulfillRequest = function(data, cb) {
        try {
            utils.hasSufficientParams(data, ['Client'], [], [], function(error, sufficientParamsResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    ServiceRequest.app.models[data.Client].requestFulfillment(data, function(error, result) {
                        if (error) {
                            return cb(null, {
                                success: false,
                                status: 444,
                                error: {}
                            })
                        } else {
                            return cb(null, result)
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 704,
                error: {
                    "message": "Invalid ThirdpartyID"
                }
            })
        }
    }

    //Note: New API was created because ServiceRequest.getSlots was expecting Client as an input parameter.
    //Discussed with Tejendra
    ServiceRequest.fetchSlots = function(data, _cb) {
        const functionName = "ServiceRequest.fetchSlots";
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
            fetchSlots : ['validate', function(results, callback) {
                ServiceRequest.app.models.CoreApi.fetchSlots(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in fetchSlots', error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of fetchSlots',asyncAutoResult.fetchSlots);
                if (asyncAutoResult && asyncAutoResult.fetchSlots) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.fetchSlots));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    ServiceRequest.checkServiceAvailablity = function(data, _cb) {
        const functionName = 'ServiceRequst.checkServiceAvailabilty';
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
            checkServiceAvailablity : ['validate', function(results, callback) {
                ServiceRequest.app.models.CoreApi.checkServiceAvailablity(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in checkServiceAvailablity', error);
                return _cb(null, customCatchError(error,data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of checkServiceAvailability', asyncAutoResult); 
                    return _cb(null, sendFormattedResponse(asyncAutoResult.checkServiceAvailablity));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    //Note: New API was created because ServiceRequest.scheduleRequest was expecting Client as an input parameter.
    //Discussed with Tejendra
    ServiceRequest.createServiceRequest = function(data, _cb) {
        const functionName = "ServiceRequest.createServiceRequest";
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
            createServiceRequest : ['validate', function(results, callback) {
                ServiceRequest.app.models.CoreApi.createServiceRequest(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in createServiceRequest', error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of createServiceRequest',asyncAutoResult.createServiceRequest);
                if (asyncAutoResult && asyncAutoResult.createServiceRequest) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.createServiceRequest));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    ServiceRequest.updateServiceRequestStatus = function(data, _cb) {
        const functionName = 'ServiceRequest.updateServiceRequestStatus'; 
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
            updateServiceRequestStatus : ['validate', function(results, callback) {

                app.models.CoreApi.updateServiceRequestStatus(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in updateServiceRequestStatus', error);
                return _cb(null, customCatchError(error,data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of updateServiceRequestStatus', asyncAutoResult); 
                    if(asyncAutoResult.updateServiceRequestStatus){
                        asyncAutoResult.updateServiceRequestStatus.clientShelterCreds = data.clientShelterCreds;
                    }
                    return _cb(null, sendFormattedResponse(asyncAutoResult.updateServiceRequestStatus));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    ServiceRequest.getServiceRequestDetails = function(data, _cb) {
        const functionName = 'ServiceRequest.getServiceRequestDetails';
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
            getServiceRequestDetails : ['validate', function(results, callback) {

                app.models.CoreApi.getServiceRequestDetails(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in getServiceRequestDetails', error);
                return _cb(null, customCatchError(error,data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of getServiceRequestDetails', asyncAutoResult);
                    if(asyncAutoResult.getServiceRequestDetails){
                        asyncAutoResult.getServiceRequestDetails.clientShelterCreds = data.clientShelterCreds;
                    }
                    return _cb(null, sendFormattedResponse(asyncAutoResult.getServiceRequestDetails));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };
    
    ServiceRequest.getServiceStatus = function (data, cb) {
        const functionName = 'ServiceRequest.getServiceStatus';
        async.auto({
            validate: function (callback) {
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [],
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
            getServiceStatus: ['validate', function (results, callback) {
                ServiceRequest.app.models.CoreApi.getServiceStatus(data, (error, result) => {
                    if (error) {
                        return callback(error)
                    } else {
                        result.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in ServiceStatus', error);
                return cb(null, customCatchError({
                    msg: error
                }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.getServiceStatus) {
                    log.information(functionName, 'asyncAutoResult of ServiceStatus', asyncAutoResult);
                    return cb(null, sendFormattedResponse(asyncAutoResult.getServiceStatus));
                } else {
                    return cb(null, customCatchError({
                        msg: "Please try again later !"
                    }, data));
                }
            }
        });
    };

    ServiceRequest.getClaimStatus = function(data, cb) {
        const functionName = "ServiceRequest.getClaimStatus";
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
            getClaimStatus : ['validate', function(results, callback) {
                app.models.CoreApi.getClaimStatus(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = _.get(data, 'clientShelterCreds');
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in getClaimStatus', error);
                return cb(null, customCatchError(error,data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName,'result of getClaimStatus',asyncAutoResult);
                    return cb(null, sendFormattedResponse(asyncAutoResult.getClaimStatus));
                } else {
                    return cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    ServiceRequest.remoteMethod(
        'fetchSlots', {
            description: 'fetchSlots',
            accepts: {
                arg: 'data',
                type: 'object',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'checkServiceAvailablity', {
            description: 'checkServiceAvailablity',
            accepts: {
                arg: 'data',
                type: 'object',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'createServiceRequest', {
            description: 'createServiceRequest',
            accepts: {
                arg: 'data',
                type: 'object',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'scheduleRequest', {
            description: 'scheduleRequest',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'getSlots', {
            description: 'getSlots',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'updateRequest', {
            description: 'updateRequest',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'trackRequest', {
            description: 'trackRequest',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'fulfillRequest', {
            description: 'fulfillRequest',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'updateServiceRequestStatus', {
            description: 'updateServiceRequestStatus',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod(
        'getServiceRequestDetails', {
            description: 'getServiceRequestDetails',
            accepts: {
                arg: 'data',
                type: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: '{success: true, msg: "message", data: result}'
            },
            http: {
                verb: 'post'
            }
        });
    ServiceRequest.remoteMethod('getServiceStatus', {
        description: 'Get the service request status',
        accepts: {
            arg: 'data',
            type: 'object',
            required: true,
            http: {
                source: 'body'
            }
        },
        returns: {
            arg: 'result',
            type: 'object',
            root: true,
            description: '{success: true, msg: "message", data: result}'
        },
        http: {
            verb: 'post'
        }
    });

    ServiceRequest.remoteMethod(
        'getClaimStatus', {
            description: 'getClaimStatus',
            accepts: {
                arg: 'data',
                type: 'object',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
}