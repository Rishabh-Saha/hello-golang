/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var log = requireHelper.createBunyanLogger('ClientWhitelistedAPI');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const errorWrapper = requireHelper.errorWrapper;

module.exports = function (ClientWhitelistedAPI) {
    ClientWhitelistedAPI.getClientWhitelistedAPI = function(data,_cb) {
        const functionName = "ClientWhitelistedAPI.getClientWhitelistedAPI";
        async.auto({
            validate: function(callback){
                var validate = utils.hasSufficientParameters(data, [{
                    keys: [
                        'ApiName',
                        'ExternalClientID'
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
            getApiID: ['validate',(results, callback) => {
                ClientWhitelistedAPI.app.models.ApiList.findOne({
                    where:{
                        ApiName: data.ApiName,
                        Active: true
                    }
                },(error,apiList) => {
                    log.information(functionName,'fetched api list',apiList);
                    if(error) {
                        log.errorInfo(functionName,'error in ApiList',error);
                        return callback(error);
                    } else if(!apiList) {
                        return callback('No such API exists');
                    } else {
                        return callback(null,apiList);
                    }
                })
            }],
            getApiList : ['getApiID', function(results, callback) {
                log.information(functionName,'ApiID get',results.getApiID.ApiId);
                if(results.getApiID && !_.isEmpty(results.getApiID) && results.getApiID.ApiId){
                    ClientWhitelistedAPI.findOne({
                        where:{
                            and:[{
                                ExternalClientID: data.ExternalClientID
                            },{
                                ApiId: results.getApiID.ApiId
                            },{
                                Active: true
                            },{
                                or:[{
                                    RestAction: data.RestAction
                                },{
                                    RestAction: 'ALL'
                                }]
                            }]
                        }
                    },function(error, whitelistedApiList){
                        log.information(functionName,'whitelistedApi list',whitelistedApiList);
                        if(error){
                            log.errorInfo(functionName,'error in ClientWhitelistedAPIs',errorWrapper(error));
                            return callback(error);
                        }else if(!whitelistedApiList){
                            return callback('Api is not whitelisted');
                        }else{
                            return callback(null,whitelistedApiList);
                        }
                    });
                }else{
                    return callback('No such Api Exists.')
                }
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,"error in getClientWhitelistedAPI",errorWrapper(error));
                return _cb(null, customCatchError({msg : error}));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName,"result of getClientWhitelistedAPI",asyncAutoResult)
                    var returnData = {};
                    returnData.data = asyncAutoResult.getApiList;
                    returnData.secretEncryption = data.secretEncryption;
                    return _cb(null, sendFormattedResponse(returnData));
                } else {
                    return _cb(null, customCatchError({msg : "Unable to fetch Api list right now, Please try again later !"}));
                }
            }
        });
    };
	
    disableAllMethods(ClientWhitelistedAPI, [
        'getClientWhitelistedAPI'
    ]);
};