/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Integration');
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
var integrationApiReq = requireHelper.integrationApiReq;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
// var getAppConfig = serviceApiUtils.getAppConfig();

module.exports = function (Integration) {

    Integration.postWebhook = (data, _cb) => {
        const functionName = 'Integration.postWebhook';
        integrationApiReq.post({
            uri: 'Integration/postWebhook',
            json: data
        }, function (error, response, Integration) {
            if (error) {
                log.errorInfo(functionName,'error in integration',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Integration);
            }
        });
    };

    Integration.remoteMethod(
        'postWebhook', {
            description: 'Create Integration',
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

    disableAllMethods(Integration, [
        'postWebhook',
    ]);


};