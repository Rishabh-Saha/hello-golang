var app = require('./../server');
var requireHelper = require('./require-helper');
var log = requireHelper.createBunyanLogger('Cache Helper');
var env = requireHelper.env;
var constants = requireHelper.constants;
var cachingModel = 'RedisCache';
var CACHE_PREFIX = constants.CACHE_PREFIX;
const errorWrapper = requireHelper.errorWrapper;

function doNothing() {
    // console.log(doNothing.caller + ' cache set arguments', arguments);
}

function getCachedKey(prefix, ttl, queryFunction) {
    return function (data, key, txnObj, _cb) {
        const functionName = "getCachedKey";
        app.models[cachingModel].getKey(CACHE_PREFIX + prefix + key, function (error, result) {
            if (error) {
                log.errorInfo(functionName,'error in getCachedKey',errorWrapper(error));
                return _cb('Unable to get key !');
            } else {
                if (result && !(data.updateCache)) {
                    log.information(functionName,'key name',' from ' + cachingModel + CACHE_PREFIX + prefix + key);
                    log.information(functionName,'result of key',result);
                    if(CACHE_PREFIX === "public_" && prefix === "clientAuth_"){
                        log.information(functionName,"client token updated with TTL",CACHE_PREFIX + prefix + key,{"TTL":ttl});
                        app.models[cachingModel].setExpKey(CACHE_PREFIX + prefix + key, result, ttl, doNothing);
                    }
                    return _cb(null, result);
                } else {
                    queryFunction(data, key, txnObj, function (error, result) {
                        if (error) {
                            log.errorInfo(functionName,'error in getCachedKey queryFunction',errorWrapper(error));
                            return _cb(error);
                        } else {
                            if (result) {
                                log.information(functionName,'key name',' refreshed  ' + cachingModel + CACHE_PREFIX + prefix + key);
                                _cb(null, result);
                                app.models[cachingModel].setExpKey(CACHE_PREFIX + prefix + key, result, ttl, doNothing);
                            } else {
                                log.errorInfo(functionName,'error in get key',errorWrapper('Unable to get key !'));
                                return _cb('Unable to get key !');
                            }
                        }
                    });
                }
            }
        });
    };
}

function getKey(data, _cb) {
    const functionName = "getKey";
    app.models[cachingModel].getKey(CACHE_PREFIX + data.prefix + data.key, function (error, result) {
        if (error) {
            log.errorInfo(functionName,'error in getKey',errorWrapper(error));
            return _cb('Unable to get key !');
        } else {
            log.information(functionName,'result of getKey', result);
            return _cb(null, result);
        }
    });
}

function setExpKey(data, _cb) {
    _cb(null, data.token);
    app.models[cachingModel].setExpKey(CACHE_PREFIX + data.prefix + data.key, data.token, data.ttl, doNothing);
}

function burstCache(data, _cb) {
    const functionName = "burstCache";
    log.information(functionName,'cachingModel', cachingModel);
    app.models.RedisCache.burstCache(data,_cb);
}



exports.getCachedKey = getCachedKey;
exports.getKey = getKey;
exports.setExpKey = setExpKey;
exports.burstCache = burstCache;