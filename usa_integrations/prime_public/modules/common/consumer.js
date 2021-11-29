/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('Consumer');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;


module.exports = function (Consumer) {
    Consumer.getExternalConsumer = function (data, _cb) {
        const functionName = "Consumer.getExternalConsumer";
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
            getConsumerFromOpenID: ['validate', function (results, callback) {
                app.models.CoreApi.getConsumerFromOpenID(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in getExternalConsumer', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                log.information(functionName,'result of getExternalConsumer',asyncAutoResult.getConsumerFromOpenID);
                if (asyncAutoResult && asyncAutoResult.getConsumerFromOpenID) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.getConsumerFromOpenID));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };

    Consumer.createOrUpdateExternalConsumer = function (data, _cb) {
        const functionName = "Consumer.createOrUpdateExternalConsumer";
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
            createOrUpdateExternalConsumer: ['validate', function (results, callback) {
                app.models.CoreApi.createOrUpdateExternalConsumer(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in createOrUpdateExternalConsumer', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                log.information(functionName,'result of createOrUpdateExternalConsumer',asyncAutoResult.createOrUpdateExternalConsumer);
                if (asyncAutoResult && asyncAutoResult.createOrUpdateExternalConsumer) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.createOrUpdateExternalConsumer));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };

    Consumer.createContract = function (data, _cb) {
        const functionName = 'Consumer.createContract'; 
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
            createContract: ['validate', function (results, callback) {
                app.models.CoreApi.createContract(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in createContract', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of createContract', asyncAutoResult);
                    return _cb(null, asyncAutoResult.createContract);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };


    Consumer.remoteMethod(
        'createOrUpdateExternalConsumer', {
            description: 'createOrUpdateExternalConsumer',
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
    Consumer.remoteMethod(
        'getExternalConsumer', {
            description: 'getExternalConsumer',
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

    Consumer.remoteMethod(
        'createContract', {
            description: 'getExternalConsumer',
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

    disableAllMethods(Consumer, [
        'getExternalConsumer',
        'createOrUpdateExternalConsumer',
        'createContract'
    ]);
};