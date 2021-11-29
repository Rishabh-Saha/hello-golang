/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('SimpleCache');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = requireHelper.customCatchError;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;

module.exports = function (SimpleCache) {

    SimpleCache.setExpKey = function (key, value, ttl, cb) {
        async.auto({
            set: function (callback) {
                SimpleCache.set(key, value, callback);
            },
            setExpiry: ['set', function (results, callback) {
                SimpleCache.expire(key, ttl, callback);
            }]
        }, cb);
    };

    SimpleCache.getKey = function (key, cb) {
        SimpleCache.get(key, cb);
    };

    SimpleCache.deleteKey = function (key, cb) {
        SimpleCache.expire(key, 0, cb);
    };

    disableAllMethods(SimpleCache, [
    ]);

};