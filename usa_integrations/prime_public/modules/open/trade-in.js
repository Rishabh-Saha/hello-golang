/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var log = requireHelper.createBunyanLogger('TradeIn');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var app = requireHelper.app;
var sendResponse = utils.sendResponse;
var _ = requireHelper._;

module.exports = function (TradeIn) {
    TradeIn.verifyIntegration = function (data, cb) {
        return cb(null, sendResponse({
            msg: 'Integration successful !',
            secretEncryption: data.secretEncryption
        }));
    };

    TradeIn.getDiagnosisConfig = function (data, cb) {
        const functionName = 'TradeIn.getDiagnosisConfig';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getDiagnosisConfig(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getDiagnosisConfig', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }
    TradeIn.pushDiagnosisData = function (data, cb) {
        const functionName = 'TradeIn.pushDiagnosisData';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.addDiagnosisData(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in pushDiagnosisData', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getPriceEstimate = function (data, cb) {
        const functionName = 'TradeIn.getPriceEstimate';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getPriceEstimate(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getPriceEstimate', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getQuote = function (data, cb) {
        const functionName = 'TradeIn.getQuote';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getQuote(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getQuote', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.processQuote = function (data, cb) {
        const functionName = 'TradeIn.processQuote';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.processQuote(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in processQuote', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getProductVariants = function (data, cb) {
        const functionName = 'TradeIn.getProductVariants';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getBrandAndProductDetails(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getProductVariants', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getDeviceConditions = function (data, cb) {
        const functionName = 'TradeIn.getDeviceConditions';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getPartnerDeviceConditions(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getDeviceConditions', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getFunctionalConditions = function (data, cb) {
        const functionName = 'TradeIn.getFunctionalConditions'; 
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getFunctionalConditions(data, function(error, configResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, configResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getFunctionalConditions', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getBrands = function (data, cb) {
        const functionName = 'TradeIn.getBrands';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getBrandsForTradeIn(data, function(error, brandResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, brandResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo('error in getBrands', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getProducts = function (data, cb) {
        const functionName = 'TradeIn.getProducts';
        async.auto({
            validate: function(callback) {
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getProducts(data, function(error, productResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, productResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getProducts', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.getTradeInRequestDetails = function (data, cb) {
        const functionName = "TradeIn.getTradeInRequestDetails";
        async.auto({
            validate: function(callback) {
                data.partnerID = data.PartnerID;
                log.information(functionName,'data received in getTradeInRequestDetails', data);
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.getTradeInRequestDetails(data, function(error, tradeInResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, tradeInResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getTradeInRequestDetails',error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            log.information(functionName,'result of getTradeInRequestDetails',asyncAutoResult);
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }
  
    TradeIn.cancelTradeInRequest = function (data, cb) {
        const functionName = 'TradeIn.cancelTradeInRequest';
        async.auto({
            validate: function(callback) {
                data.partnerID = data.PartnerID;
                return callback(null, data);
            },
            callExternalAPI: ['validate', function(results, callback) {
                app.models.CoreApi.cancelTradeInRequest(data, function (error, tradeInResults) {
                    if(error) {
                        return callback(error);
                    } else {
                        return callback(null, tradeInResults);
                    }
                });
            }],
            finalResponse: ['callExternalAPI', function(results, callback) {
                if (results.callExternalAPI && results.callExternalAPI.success && results.callExternalAPI.data) {
                    log.information(functionName,'result of cancelTradeInRequest', results.callExternalAPI);
                    results.callExternalAPI.clientShelterCreds = data.clientShelterCreds;
                    return callback(null, results.callExternalAPI);
                } else {
                    log.errorInfo(functionName,'error in cancelTradeInRequest final response', results.callExternalAPI);
                    return callback(results.callExternalAPI);
                }
            }]
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in cancelTradeInRequest', error);
                error.clientShelterCreds = data.clientShelterCreds;
                return cb(null, sendResponse(error));
            }
            return cb(null, sendResponse(asyncAutoResult.finalResponse));
        })
    }

    TradeIn.remoteMethod('verifyIntegration', {
        description: 'Generates Session token for user',
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

    TradeIn.remoteMethod('getDiagnosisConfig', {
        description: 'get Diagnosis config for android and ios devices',
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

    TradeIn.remoteMethod('pushDiagnosisData', {
        description: 'Push diagnosis data to the analytics',
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

    TradeIn.remoteMethod('getPriceEstimate', {
        description: 'To get price estimation for trade in',
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

    TradeIn.remoteMethod('getQuote', {
        description: 'To get quote for the trade in',
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

    TradeIn.remoteMethod('processQuote', {
        description: 'To process the quote of trade in',
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

    TradeIn.remoteMethod('getProductVariants', {
        description: 'Get brand and product details',
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

    TradeIn.remoteMethod('getDeviceConditions', {
        description: 'Get partners device conditions',
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

    TradeIn.remoteMethod('getFunctionalConditions', {
        description: 'Get function conditions',
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

    TradeIn.remoteMethod('getBrands', {
        description: 'Get brands for trade in',
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

    TradeIn.remoteMethod('getProducts', {
        description: 'Get products for trade in',
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

    TradeIn.remoteMethod('getTradeInRequestDetails', {
        description: 'Get trade in request details',
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

    TradeIn.remoteMethod('cancelTradeInRequest', {
        description: 'Cancel trade in request',
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
  
    disableAllMethods(TradeIn, [
        'verifyIntegration',
        'getDiagnosisConfig',
        'pushDiagnosisData',
        'getPriceEstimate',
        'getQuote',
        'processQuote',
        'getProductVariants',
        'getDeviceConditions',
        'getFunctionalConditions',
        'getBrands',
        'getProducts',
        'getTradeInRequestDetails',
        'cancelTradeInRequest'
    ]);
}