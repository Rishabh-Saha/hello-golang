/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Hedwig');
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
var hedwigApiReq = requireHelper.hedwigApiReq;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
// var getAppConfig = serviceApiUtils.getAppConfig();

module.exports = function (Hedwig) {

    Hedwig.publishMessage = (data, _cb) => {
        const functionName = 'Hedwig.publishMessage';
        hedwigApiReq.post({
            uri: 'Producer/publishMessage',
            json: data
        }, function (error, response, Hedwig) {
            if (error) {
                log.errorInfo(functionName,'error in hedwig',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Hedwig);
            }
        });
    };

    Hedwig.remoteMethod(
        'publishMessage', {
            description: 'Create Hedwig',
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

    disableAllMethods(Hedwig, [
        'publishMessage',
    ]);


};