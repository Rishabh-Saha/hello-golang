/* jshint node:true */
'use strict';

/** External files */
const requireHelper = require('../../server/utility/require-helper');
const utils = require('../../server/utility/utils');

/** NPM Modules */
const async = requireHelper.async;

/** Functions */
const log = requireHelper.createBunyanLogger('Logistics');
const customCatchError = utils.customCatchError;
const sendFormattedResponse = utils.sendFormattedResponse;
const disableAllMethods = requireHelper.disableAllMethods;
const validatorFunctions = utils.validatorFunctions;

module.exports = function (Logistics) {
    Logistics.getLogisticStatus = function (data, cb) {
        const functionName = "Logistics.getLogisticStatus";
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
            getLogisticStatus: ['validate', function (results, callback) {
                Logistics.app.models.CoreApi.getLogisticStatus(data, (error, result) => {
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
                log.errorInfo(functionName,'error in getLogisticStatus',error);
                return cb(null, customCatchError({
                    msg: error
                }, data));
            } else {
                log.information(functionName,'result of getLogisticStatus',asyncAutoResult);
                if (asyncAutoResult && asyncAutoResult.getLogisticStatus) {
                    return cb(null, sendFormattedResponse(asyncAutoResult.getLogisticStatus));
                } else {
                    return cb(null, customCatchError({
                        msg: "Please try again later !"
                    }, data));
                }
            }
        });
    };

    Logistics.remoteMethod('getLogisticStatus', {
        description: 'get logistics request status',
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

    disableAllMethods(Logistics, [
        'getLogisticStatus'
    ]);
}
