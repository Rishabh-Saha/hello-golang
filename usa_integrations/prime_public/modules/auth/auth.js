/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Auth');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = requireHelper.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var redis = requireHelper.redis;
var uuid = requireHelper.uuid;
var moduleCreds = requireHelper.moduleCreds;
var redicConfig = moduleCreds.redis;
var redisCache = moduleCreds.redisCache;
var getCachedKey = cacheHelper.getCachedKey;
var CACHE_PREFIX = constants.CACHE_PREFIX;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
var secretEncryption = requireHelper.secretEncryption;
var moment = requireHelper.moment;
const errorWrapper = requireHelper.errorWrapper;

if (redisCache) {
    var redisClient = redis.createClient(redicConfig);
}


var generateToken = function () {
    var prefix = 'clientAuth_';
    return getCachedKey(prefix, CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL, (data, key, txnObj, cb) => {
        const functionName = 'getCachedKey';
        var token = uuid.v1();
        log.information(functionName,`token for ${key}`, token, {"TTL":CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL}); 
        log.information(functionName,'typeof txnObj', typeof txnObj); 
        log.information(functionName,'typeof cb', typeof cb);
        log.information(functionName,'data of generateToken', data);
        if (!_.isFunction(cb)) {
            if (_.isFunction(txnObj)) {
                cb = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('API needs a callback function as the second or the third parameter');
            }
        }
        return cb(null, token);
    });
};

var generateToken = generateToken();
module.exports = function (Auth) {

    // Auth.afterRemote('generateToken', function (context, remoteMethodOutput, next) {
    // 	console.log('Turning off the engine, removing the key.', context, remoteMethodOutput);
    // 	next();
    // });

    Auth.generateToken = function (data, _cb) {
        const functionName = 'Auth.generateToken';
        log.information(functionName, 'starting authToken','Fetching auth token now');
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
            generateToken: ['validate', function (results, callback) {
                var key = _.get(data, 'headers.ExternalClientID');
                generateToken(data, key, {}, callback);
            }]
        }, (error, asyncAutoResult) => {
            if (error) {
                log.errorInfo(functionName, 'error in generateToken', errorWrapper(error));
                return _cb(null, customCatchError(error));
            }
            log.information(functionName,'result of generateToken',asyncAutoResult);
            return _cb(null, sendFormattedResponse({
                token: asyncAutoResult.generateToken,
                ttl: moment().unix()+(CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL),
                secretEncryption: data.secretEncryption,
                clientShelterCreds: _.get(data, 'clientShelterCreds')
            }));
        });
    };

    Auth.remoteMethod(
        'generateToken', {
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

    disableAllMethods(Auth, [
        'generateToken'
    ]);

};