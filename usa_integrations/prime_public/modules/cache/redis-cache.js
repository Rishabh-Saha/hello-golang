/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('RedisCache');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = requireHelper.customCatchError;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var redis = requireHelper.redis;
var moduleCreds = requireHelper.moduleCreds;
var redicConfig = moduleCreds.redis;
var redisCache = moduleCreds.redisCache;
var CACHE_PREFIX = constants.CACHE_PREFIX;
const MASTER_CACHE_PREFIX = constants.MASTER_CACHE_PREFIX;

if (redisCache) {
    var redisClient = redis.createClient(redicConfig);
    log.information('redis-cache','redis connection','Redis connected');
}

module.exports = function (RedisCache) {

    RedisCache.setExpKey = function (key, value, ttl, cb) {
        async.auto({
            set: function (callback) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                redisClient.set(key, value, callback);
            },
            setExpiry: ['set', function (results, callback) {
                redisClient.expire(key, ttl, callback);
            }]
        }, cb);
    };

    RedisCache.getKey = function (key, cb) {
        var returnValue;
        redisClient.get(key, (error, result) => {
            if (error) {
                return cb(error);
            } else {
                try {
                    returnValue = JSON.parse(result);
                } catch (e) {
                    returnValue = result;
                }
                return cb(null, returnValue);
            }
        });
    };

    RedisCache.deleteKey = function (key, cb) {
        redisClient.expire(key, 0, cb);
    };

    RedisCache.burstCache = function (data, cb) {
        const functionName = 'RedisCache.burstCache';
        if (redisCache && redisClient && redisClient.keys) {
            async.auto({
                publicAPICacheClear:(callback)=>{
                    redisClient.keys(CACHE_PREFIX + '*', function (err, rows) {
                        log.information(functionName,'publicAPI redis keys',rows);
                        async.each(rows, function (row, callbackDelete) {
                            redisClient.del(row, callbackDelete);
                        }, (error, asyncResult) => {
                            if(error){
                                callback(error)
                            } else {
                                callback(null,{
                                    success:true,
                                    msg: 'Cache reset on public api'
                                })
                            }
                        });
                    });
                },
                masterAPICacheClear:(callback)=>{
                    redisClient.keys(MASTER_CACHE_PREFIX + '*', function (err, rows) {
                        log.information(functionName,'masterAPI redis keys',rows);
                        async.each(rows, function (row, callbackDelete) {
                            redisClient.del(row, callbackDelete);
                        }, (error, asyncResult) => {
                            if(error){
                                callback(error)
                            } else {
                                callback(null,{
                                    success:true,
                                    msg: 'Cache reset on master api'
                                })
                            }
                        });
                    });
                }
            },(error,result)=>{
                if(error){
                    log.errorInfo(functionName,'error in burstCache',error);
                    return cb(null, {
                        success: false,
                        msg: 'Something went wrong'
                    });
                } else {
                    log.information(functionName,'result of burstCache',result);
                    return cb(null, {
                        success: true,
                        msg: 'Cache reset done !'
                    });
                }
            })
            
        } else {
            return cb();
        }
    };

    RedisCache.deleteCacheList = function (data, cb) {
        const functionName = 'RedisCache.deleteCacheList';
        async.auto({
            validateKeys: function (callback) {
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        "cacheList"
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
            deleteKeys: ['validateKeys', function (results, callback) {
                const cacheKeyArray = data.cacheList;
                const keysNotDeleted = [];
                const modulePrefix = data.module === 'MasterAPI' ? MASTER_CACHE_PREFIX : CACHE_PREFIX;
                async.map(cacheKeyArray, (eachKey, callback) => {
                    let keyName = modulePrefix+eachKey;
                    log.information(functionName, 'key to be deleted', keyName);
                    RedisCache.deleteKey(keyName, (err, response) => {
                        if (err) {
                            log.errorInfo(functionName, `could not delete the key ${CACHE_PREFIX+eachKey}`, err);
                            keysNotDeleted.push(eachKey);
                            return callback();
                        } else {
                            log.information(functionName, `deleted the key ${CACHE_PREFIX+eachKey}`, response);
                            return callback(null,eachKey);
                        }
                    })
                },(error, results) => {
    
                    return callback(null,{
                        success: keysNotDeleted.length === cacheKeyArray.length ? false : true,
                        msg: keysNotDeleted.length === cacheKeyArray.length ? "Could not delete the keys in the list" : "Keys have been deleted",
                        data: {
                            deletedKeys: results.filter(e => e),
                            keysNotDeleted
                        }
                    });
                });
            }]
        },(error, autoResult) => {
            if(error){
                return cb(null,customCatchError(error));
            }else{
                return cb(null,autoResult.deleteKeys);
            }
        });
    };

    disableAllMethods(RedisCache, [
    ]);

};