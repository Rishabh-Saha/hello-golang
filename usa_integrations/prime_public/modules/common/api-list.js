/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('ApiList');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const errorWrapper = requireHelper.errorWrapper;

module.exports = function (ApiList) {
    ApiList.insertAllApis = function(data, _cb) {
        const functionName = 'ApiList.insertAllApis';
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
            insertGsxApis : ['validate', function(results, callback) {
                var allMethods = [];
                var Apis = [];
                // var defaultMethods = ['findById', 'destroyById', 'updateById', 'exists', 'link', 'get', 'create', 'update', 'destroy', 'unlink', 'count', 'delete'];
                var defaultMethods = ['create', 'patchOrCreate', 'replaceOrCreate', 'upsertWithWhere', 'exists', 'findById', 'replaceById', 'find', 'findOne', 'destroyAll', 'updateAll', 'deleteById', 'count', 'patchAttributes', 'createChangeStream'];
                _.forEach(app.remotes()._classes, (value, key) => {
                    // log.debug('value.ctor', value.ctor);
                    // log.debug('value.options', value.options);
                    _.forEach(value._methods, (innervalue, innerkey) => {
                        var eachApi = {};
                        if(defaultMethods.indexOf(innervalue.name) == -1) {
                            eachApi.ApiName = _.replace(innervalue.stringName, '.','/');
                            eachApi.isActive = 1;
                            allMethods.push(eachApi.ApiName);
                            Apis.push(eachApi);
                        }
                    });

                });
                async.mapSeries(Apis, (eachApi, callbackMap) => {
                    var findApi = {};
                    _.set(findApi, 'where.ApiName', eachApi.ApiName)

                    app.models.ApiList.findOrCreate(findApi, eachApi, (error, result) => {
                        if(error) {
                            log.errorInfo(functionName,"error in insert ApiList",error);
                            return callbackMap("Unable to insert ApiList");
                        } else {
                            log.information(functionName,"inserted apiList",result)
                            return callbackMap(null, result);
                        }
                    })
                }, (err, results) => {
                    if(err) {
                        log.errorInfo(functionName,"error in insertGsxApis",errorWrapper(err));
                        return callback(err);
                    } else {
                        log.information(functionName,"result of insertGsxApis",results)
                        return callback(null, results);
                    }
                });
                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,"error in insertApis",errorWrapper(error))
                return _cb(null, customCatchError({msg : error}));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName,"result of insertAllApis",asyncAutoResult)
                    var returnData = {};
                    returnData.data = asyncAutoResult.insertApis;
                    return _cb(null,{
                        success:true,
                        msg:'Api list is ready',
                        data: returnData
                    });
                } else {
                    return _cb(null, customCatchError({msg : "Unable to fetch Languaage Country Mapping list right now, Please try again later !"}));
                }
            }
        });
    };

    /*setTimeout(function(){
        var data = 
        ApiList.insertAllApis({},function(err,success){
            console.log("err",err);
            console.log("success",success);
        })
    },1000)*/
	

    disableAllMethods(ApiList, []);
};