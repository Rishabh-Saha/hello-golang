/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('WhitelistedIP');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var constants = requireHelper.constants;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
var DEFAULT_TX_OPTIONS = constants.DEFAULT_TX_OPTIONS;
var secretEncryption = requireHelper.secretEncryption;
const errorWrapper = requireHelper.errorWrapper;

var getWhitelistedIPList = function () {
    var prefix = 'whitelistedIPs';
    const functionName = 'getWhitelistedIPList';
    return getCachedKey(prefix, CACHE_CLEAR_INTERVAL.WHITELISTED_IPS, function (data, key, txnObj, cb) {
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                log.errorInfo(functionName,'error in getWhitelistedIPList',new Error('API needs a callback function as the second or the third parameter'));
                throw new Error('API needs a callback function as the second or the third parameter');
            }
        }

        async.auto({
            getWhitelistedIPs: function (callback) {
                var filter = {
                    
                    Archived: false,
                    skipPagination: true
                };
                if (_.has(data,'Active')){
                    filter.Active = data.Active; 
                }
                app.models.WhitelistedIP.getWhitelistedIPs(filter, txnObj, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success && result.data && result.data.whitelistedIPs && result.data.whitelistedIPs.length) {
                        return callback(null, result.data.whitelistedIPs);
                    } else {
                        return callback(result);
                    }
                });
            },
            getMappedList: ['getWhitelistedIPs', (results, callback) => {
                var whitelistedIPs = results.getWhitelistedIPs;
                var whitelistedIPConst = {};
                _.forEach(whitelistedIPs, (value) => {
                    if (value.ConstantName) {
                        whitelistedIPConst[value.ConstantName] = value.WhitelistedIPID;
                    }
                });

                var returnData = {
                    whitelistedIPs: whitelistedIPs,
                    whitelistedIPConst: whitelistedIPConst
                };
                return callback(null, returnData);
            }]
        }, (error, asyncAutoResult) => {
            if (error) {
                log.errorInfo(functionName,'error in getWhitelistedIPList',errorWrapper(error));
                return cb(error);
            }
            return cb(null, asyncAutoResult.getMappedList);
        });
    });
};

var getWhitelistedIPList = getWhitelistedIPList();

module.exports = function (WhitelistedIP) {

    

    var create = modelHelper.create(WhitelistedIP);
    var findById = modelHelper.findById(WhitelistedIP);
    var count = modelHelper.count(WhitelistedIP);
    var find = modelHelper.find(WhitelistedIP);
    var paginateData = modelHelper.paginateData(WhitelistedIP);
    //var oneExists = modelHelper.oneExists(WhitelistedIP);
    var findOne = modelHelper.findOne(WhitelistedIP);
    var getEntitiesRes = modelHelper.getEntitiesRes(WhitelistedIP);

    WhitelistedIP.createWhitelistedIPWithTx = function (data, txnObj, cb) {
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error(customCatchError());
            }
        }

        async.auto({
            validate: function (callback) {
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [],
                    type: 'presence',
                    against: ''
                }]);

                if (!validate) {
                    return callback(customCatchError());
                }

                if (!validate.success) {
                    return callback(validate);
                }

                data = validatorFunctions.trimAll(data);
                return callback(null, data);
            },
            create: ['validate', function (results, callback) {
                create(results.validate, txnObj, callback);
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                return cb(error);
            } else {
                return cb(null, asyncAutoResult.create);
            }
        });
    };

    WhitelistedIP.updateWhitelistedIPWithTx = function (data, txnObj, cb) {
        const functionName = 'WhitelistedIP.updateWhitelistedIPWithTx';
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error(customCatchError());
            }
        }

        async.auto({
            validate: function (callback) {
                //Validate keys using hasSufficientParameters
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        'WhitelistedIPID'
                    ],
                    type: 'presence',
                    against: ''
                }, {
                    key: 'WhitelistedIPID',
                    type: 'isNumber'
                }]);

                if (!validate) {
                    return callback(customCatchError());
                }

                if (!validate.success) {
                    return callback(validate);
                }

                if (data.Status && !_.isString(data.Status))
                    return callback(customCatchError({
                        globalCode: 'MSR.REGN.001',
                        languageCode: data.headers.LanguageCode
                    }));

                //Trim all the data using a helper
                data = validatorFunctions.trimAll(data);

                var partnerServiceRequestObj = {
                    WhitelistedIPID: data.WhitelistedIPID,
                    Status: data.Status,
                    Active: data.Active,
                    Archived: data.Archived
                };

                return callback(null, partnerServiceRequestObj);
            },
            find: ['validate', function (results, callback) {
                findById(results.validate.WhitelistedIPID, txnObj, callback);
            }],
            update: ['find', function (results, callback) {
                if (results.find) {
                    results.find.updateAttributes(results.validate, txnObj).then(function (updatedWhitelistedIP) {
                        log.information(functionName,'updated Whitelisted IP',updatedWhitelistedIP);
                        return callback(null, {
                            status: 200,
                            message: 'A service request with WhitelistedIPID : ' + results.validate.WhitelistedIPID + ' was updated successfully',
                            success: true,
                            msg: 'A service request was updated successfully',
                            data: updatedWhitelistedIP
                        });
                    }).catch(function (error) {
                        log.errorInfo(functionName,'error in updateWhitelistedIPWithTx',error);
                        return callback(customCatchError());
                    });
                } else {
                    return callback('Entry not found !');
                }
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                return cb(error);
            } else {
                return cb(null, asyncAutoResult.update);
            }
        });
    };

    WhitelistedIP.getWhitelistedIPsWithTx = function (data, txnObj, cb) {
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error(customCatchError());
            }
        }

        async.auto({
            //Validating inputs and creating a where filter
            validate: function (callback) {
                data = validatorFunctions.trimAll(data);

                var filter = {
                    where: {}
                };

                if (data.WhitelistedIPID && !_.isNumber(data.WhitelistedIPID))
                    return callback(customCatchError({
                        globalCode: 'MSR.REGN.002',
                        languageCode: data.headers.LanguageCode
                    }));

                if (data.LanguageCode && !_.isString(data.LanguageCode))
                    return callback(customCatchError({
                        globalCode: 'MSR.COMM.005',
                        languageCode: data.headers.LanguageCode
                    }));
                
                filter.where.AddressType = 'ipv4';
                filter.where.WhitelistedIPID = data.WhitelistedIPID;
                filter.where.LanguageCode = data.LanguageCode;
                filter.where.Active = data.Active;
                filter.where.Archived = data.Archived;

                if (data.WhitelistedIPIDs)
                    filter.where.WhitelistedIPID = {
                        inq: data.WhitelistedIPIDs
                    };

                if (data.fields)
                    filter.fields = data.fields;

                //Setting pagination defaults
                if (!data.skipPagination) {
                    if (!data.pagination) {
                        data.pagination = {
                            currentPage: 1
                        };
                    }
                    if (data.pagination && !data.pagination.currentPage) {
                        data.pagination.currentPage = 1;
                    }

                    filter.limit = constants.PAGINATION_ITEMS_PER_PAGE;
                    filter.skip = (data.pagination.currentPage - 1) * constants.PAGINATION_ITEMS_PER_PAGE;
                }

                return callback(null, filter);
            },
            //Getting the count of the service request matching the where filter [w/o limit & skip]
            count: ['validate', function (results, callback) {
                if (data.skipPagination) {
                    return callback(null, {});
                } else {
                    count(results.validate.where, txnObj, callback);
                }
            }],
            //Getting the service request with limit and skip 
            find: ['validate', function (results, callback) {
                var filter = _.cloneDeep(results.validate);
                find(filter, txnObj, callback);
            }],
            //Preparing the final result
            paginate: ['count', 'find', function (results, callback) {
                if (data.skipPagination) {
                    return callback(null, getEntitiesRes(results.find));
                } else {
                    paginateData(results.find, results.count, data.pagination.currentPage, callback);
                }
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                return cb(error);
            } else {
                return cb(null, asyncAutoResult.paginate);
            }
        });
    };

    WhitelistedIP.deleteWhitelistedIPWithTx = function (data, txnObj, cb) {
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error(customCatchError());
            }
        }
        WhitelistedIP.updateWhitelistedIP({
            WhitelistedIPID: data.WhitelistedIPID,
            Active: false
        }, txnObj, cb);
    };

    WhitelistedIP.getWhitelistedIPWithTx = function (data, txnObj, cb) {
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error(customCatchError());
            }
        }
        async.auto({
            validate: function (callback) {
                //Validate keys using hasSufficientParameters
                data = validatorFunctions.trimAll(data);
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        'WhitelistedIPID'
                    ],
                    type: 'presence',
                    against: ''
                }, {
                    key: 'WhitelistedIPID',
                    type: 'isNumber'
                }]);

                if (!validate) return callback(customCatchError());
                if (!validate.success) return callback(validate);

                return callback(null, data);
            },
            findOne: ['validate', function (results, callback) {
                results.validate.limit = 1;
                WhitelistedIP.getWhitelistedIPs(results.validate, txnObj, function (error, result) {
                    if (error) {
                        return callback(customCatchError());
                    } else if (result.success) {
                        if (_.get(result, 'data.whitelistedIPs') && result.data.whitelistedIPs.length > 0) {
                            return callback(null, result.data.whitelistedIPs[0]);
                        } else {
                            result.success = false;
                            result.data = {};
                            return callback(result);
                        }
                    } else {
                        result.success = false;
                        return callback(result);
                    }
                });
            }]
        }, function (error, asyncAutoResult) {
            if (error)
                return cb(null, error);
            else
                return cb(null, {
                    status: 200,
                    success: true,
                    msg: 'WhitelistedIP found',
                    message: 'WhitelistedIP found',
                    data: asyncAutoResult.findOne
                });
        });
    };

    WhitelistedIP.createWhitelistedIP = (data, txnObj, _cb) => {
        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('WhitelistedIP.createWhitelistedIP', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.createWhitelistedIPWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.createWhitelistedIPWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.updateWhitelistedIP = (data, txnObj, _cb) => {
        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo(' WhitelistedIP.updateWhitelistedIP', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.updateWhitelistedIPWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.updateWhitelistedIPWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.getWhitelistedIPs = (data, txnObj, _cb) => {
        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('WhitelistedIP.getWhitelistedIPs', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.getWhitelistedIPsWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.getWhitelistedIPsWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.deleteWhitelistedIP = (data, txnObj, _cb) => {
        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('WhitelistedIP.deleteWhitelistedIP', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.deleteWhitelistedIPWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.deleteWhitelistedIPWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.getWhitelistedIP = (data, txnObj, _cb) => {
        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('WhitelistedIP.getWhitelistedIP', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.getWhitelistedIPWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.getWhitelistedIPWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.getWhitelistedIPListWithTx = function (data, txnObj, cb) {
        const functionName = 'WhitelistedIP.getWhitelistedIPListWithTx';
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
                    return callback('Please provide correct data');
                }

                if (!validate.success) {
                    return callback(validate);
                }

                data = validatorFunctions.trimAll(data);
                return callback(null, data);
            },
            getWhitelistedIPs: ['validate', function (results, callback) {
                getWhitelistedIPList(data, '', txnObj, callback);
            }],
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getWhitelistedIPListWithTx',errorWrapper(error));
                return cb(customCatchError(error));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName,'result of getWhitelistedIPListWithTx',asyncAutoResult);
                    var returnData = {};
                    returnData.data = asyncAutoResult.getWhitelistedIPs;
                    returnData.secretEncryption = data.secretEncryption;
                    return cb(null, sendFormattedResponse(returnData));
                } else {
                    return cb(customCatchError({
                        globalCode: 'MSR.COMM.004',
                        languageCode: data.headers.LanguageCode
                    }));
                }
            }
        });
    };

    WhitelistedIP.getWhitelistedIPList = (data, txnObj, _cb) => {

        if (!_.isFunction(_cb)) {
            if (_.isFunction(txnObj)) {
                _cb = txnObj;

                WhitelistedIP.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('WhitelistedIP.getWhitelistedIPList', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
                    var txnObj = {
                        transaction: tx
                    };
                    var cbCalled = false;
                    tx.observe('timeout', function (context, next) {
                        next();
                        if (!cbCalled) {
                            return _cb(null, customCatchError({
                                globalCode: 'MSR.REGN.004',
                                languageCode: data.headers.LanguageCode
                            }));
                        }
                    });
                    WhitelistedIP.getWhitelistedIPListWithTx(data, txnObj, (error, result) => {
                        if (error) {
                            tx.rollback(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError(error));
                                } else {
                                    return _cb(null, customCatchError(error));
                                }
                            });
                        } else {
                            tx.commit(function (err) {
                                cbCalled = true;
                                if (err) {
                                    return _cb(null, customCatchError({
                                        globalCode: 'MSR.REGN.005',
                                        languageCode: data.headers.LanguageCode
                                    }));
                                } else {
                                    return _cb(null, result);
                                }
                            });
                        }
                    });
                });
            } else {
                throw new Error(customCatchError());
            }
        } else {
            WhitelistedIP.getWhitelistedIPListWithTx(data, txnObj, (error, result) => {
                if (error) {
                    return _cb(null, customCatchError(error));
                } else {
                    return _cb(null, result);
                }
            });
        }
    };

    WhitelistedIP.remoteMethod(
        'createWhitelistedIP', {
            description: 'Create WhitelistedIP',
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
                description: 'object'
            },
            http: {
                verb: 'post'
            }
        });

    WhitelistedIP.remoteMethod(
        'updateWhitelistedIP', {
            description: 'Update WhitelistedIP',
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
                description: 'object'
            },
            http: {
                verb: 'post'
            }
        });

    WhitelistedIP.remoteMethod(
        'getWhitelistedIPs', {
            description: 'Get WhitelistedIPs',
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
                description: 'object'
            },
            http: {
                verb: 'post'
            }
        });

    WhitelistedIP.remoteMethod(
        'deleteWhitelistedIP', {
            description: 'Delete WhitelistedIP',
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
                description: 'object'
            },
            http: {
                verb: 'post'
            }
        });

    WhitelistedIP.remoteMethod(
        'getWhitelistedIP', {
            description: 'Check if a service request exists by id and other filter',
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
                description: 'object'
            },
            http: {
                verb: 'post'
            }
        });

    WhitelistedIP.remoteMethod(
        'getWhitelistedIPList', {
            description: 'Check if a service request exists by id and other filter',
            accepts: {
                arg: 'data',
                type: 'object',
                required: false,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true,
                description: 'object'
            },
            http: {
                verb: 'get'
            }
        });

    disableAllMethods(WhitelistedIP, [
        'createWhitelistedIP',
        'updateWhitelistedIP',
        'getWhitelistedIPs',
        'deleteWhitelistedIP',
        'getWhitelistedIP',
        'getWhitelistedIPList'
    ]);
};