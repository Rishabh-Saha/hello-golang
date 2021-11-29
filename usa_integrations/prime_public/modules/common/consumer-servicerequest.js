/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('ConsumerServicerequest');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;


module.exports = function (ConsumerServicerequest) {
    
    ConsumerServicerequest.trackContract = function (data, _cb) {
        const functionName = 'ConsumerServicerequest.trackContract'; 
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
            trackContract: ['validate', function (results, callback) {
                app.models.CoreApi.trackContractTapsafe(data, (error, result) => {
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
                log.errorInfo(functionName, 'error in trackContract', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName, 'asyncAutoResult of trackContract', asyncAutoResult); 
                    return _cb(null, asyncAutoResult.trackContract);
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    ConsumerServicerequest.remoteMethod(
        'trackContract', {
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

    disableAllMethods(ConsumerServicerequest, [
        'trackContract'
    ]);
};