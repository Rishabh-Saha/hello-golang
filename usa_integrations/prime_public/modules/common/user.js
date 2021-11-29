'use strict';

const requireHelper = require('./../../server/utility/require-helper');
const utils = require('./../../server/utility/utils');
const app = requireHelper.app;
const log = requireHelper.createBunyanLogger('User');
const disableAllMethods = requireHelper.disableAllMethods;
const async = requireHelper.async;
const customCatchError = utils.customCatchError;
const sendFormattedResponse = utils.sendFormattedResponse;
const validatorFunctions = utils.validatorFunctions;
const _ = requireHelper._;

module.exports = function(User) {
    User.getUrlWithTokenAndParams = function(data, _cb) {
        const functionName = "User.getUrlWithTokenAndParams";
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
            getUrlWithTokenAndParams : ['validate', function(results, callback) {

                app.models.WebApp.getUrlWithTokenAndParams(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in getUrlWithTokenAndParams', error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of getUrlWithTokenAndParams',asyncAutoResult.getUrlWithTokenAndParams);
                if (asyncAutoResult && asyncAutoResult.getUrlWithTokenAndParams) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.getUrlWithTokenAndParams));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    User.isServifyConsumer = function (data, cb) {
        const functionName = "User.isServifyConsumer";
        app.models.CoreApi.isServifyConsumer(data, (error, result) => {
            if (error) {
                log.errorInfo(functionName, "error in isServifyConsumer",
                    error
                );
                return cb(null, customCatchError(error, data));
            } else if (result && result.success) {
                result.clientShelterCreds = data.clientShelterCreds;
                log.information(
                    functionName,
                    "result of isServifyConsumer",
                    result
                );
                return cb(
                    null,
                    sendFormattedResponse(result)
                );
            } else {
                return cb(
                    null,
                    customCatchError({
                        msg: "Please try again later !"
                    }, data)
                );
            }
        });
    };

    User.remoteMethod(
        'getUrlWithTokenAndParams', {
            description: 'Gets 360 url with token and required parameters',
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
                root: true
            },
            http: {
                verb: 'post'
            }
        });
    
    User.remoteMethod("isServifyConsumer", {
        description: "Servify Consumer validation",
        accepts: {
            arg: "data",
            type: "object",
            required: true,
            http: {
                source: "body",
            },
        },
        returns: {
            arg: "result",
            type: "object",
            root: true,
        },
        http: {
            verb: "post",
        },
    });
};