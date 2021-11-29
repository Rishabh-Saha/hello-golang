/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var fs = requireHelper.fs;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Master');
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
var masterApiReq = requireHelper.masterApiReq;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
// var getAppConfig = serviceApiUtils.getAppConfig();

module.exports = function (Master) {

    Master.getGlobalCodeList = (data, _cb) => {
        const functionName = 'Master.getGlobalCodeList';
        masterApiReq.get({
            uri: 'GlobalCodes/getGlobalCodeList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getGlobalCodeList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getClientShelterList = (data, _cb) => {
        const functionName = 'Master.getClientShelterList';
        masterApiReq.get({
            uri: 'ClientShelters/getClientShelterList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getClientShelterList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getTemplateActionList = (data, _cb) => {
        const functionName = 'Master.getTemplateActionList'
        masterApiReq.get({
            uri: 'TemplateActions/getTemplateActionList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getTemplateActionList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getNotificationConfigList = (data, _cb) => {
        const functionName = 'Master.getNotificationConfigList';
        masterApiReq.get({
            uri: 'NotificationConfig/getNotificationConfigList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getNotificationConfigList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getEntityRealmList = (data, _cb) => {
        const functionName = 'Master.getEntityRealmList';
        masterApiReq.get({
            uri: 'EntityRealm/getEntityRealmList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getEntityRealmList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getActionStatusMappingList = (data, _cb) => {
        const functionName = 'Master.getActionStatusMappingList';
        masterApiReq.get({
            uri: 'ActionStatusMappings/getActionStatusMappingList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getActionStatusMappingList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getGlobalCodes = (data, _cb) => {
        const functionName = 'Master.getGlobalCodes';
        masterApiReq.post({
            uri: 'GlobalCodes/getGlobalCodes',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getGlobalCodes', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getTrackConfigs = (data, _cb) => {
        const functionName = 'Master.getTrackConfigs';
        masterApiReq.post({
            uri: 'TrackConfig/getTrackConfigs',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getTrackConfigs', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getTrackConfigList = (data, _cb) => {
        const functionName = 'Master.getTrackConfigList';
        masterApiReq.get({
            uri: 'TrackConfig/getTrackConfigList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getTrackConfigList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getFulfilmentFlows = (data, _cb) => {
        const functionName = 'Master.getFulfilmentFlows'
        masterApiReq.post({
            uri: 'FulfilmentFlows/getFulfilmentFlows',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getFulfilmentFlows', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getFeedbackOptions = (data, _cb) => {
        const functionName = 'Master.getFeedbackOptions';
        masterApiReq.post({
            uri: 'FeedbackOptions/getFeedbackOptions',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getFeedbackOptions', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getFulfilmentFlowList = (data, _cb) => {
        const functionName = 'Master.getFulfilmentFlowList';
        masterApiReq.get({
            uri: 'FulfilmentFlows/getFulfilmentFlowList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getFulfilmentFlowList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getRoleTypeList = (data, _cb) => {
        const functionName = 'Master.getRoleTypeList';
        masterApiReq.get({
            uri: 'RoleTypes/getRoleTypeList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getRoleTypeList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getCheckListLineMappingList = (data, _cb) => {
        const functionName = 'Master.getCheckListLineMappingList';
        masterApiReq.get({
            uri: 'CheckListLineMappings/getCheckListLineMappingList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getCheckListLineMappingList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getCheckListList = (data, _cb) => {
        const functionName = 'Master.getCheckListList';
        masterApiReq.get({
            uri: 'CheckLists/getCheckListList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getCheckListList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getCheckListLineList = (data, _cb) => {
        const functionName = 'Master.getCheckListLineList'
        masterApiReq.get({
            uri: 'CheckListLines/getCheckListLineList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getCheckListLineList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getCheckListLines = (data, _cb) => {
        const functionName = 'Master.getCheckListLines';
        masterApiReq.post({
            uri: 'CheckListLines/getCheckListLines',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getCheckListLines', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getPincode = (data, _cb) => {
        const functionName = 'Master.getPincode';
        masterApiReq.post({
            uri: 'Pincodes/getPincode',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getPincode', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getPincodes = (data, _cb) => {
        const functionName = 'Master.getPincodes';
        masterApiReq.post({
            uri: 'Pincodes/getPincodes',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getPincodes',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getRegion = (data, _cb) => {
        const functionName = 'Master.getRegion';
        masterApiReq.post({
            uri: 'Regions/getRegion',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getRegion',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getSourceList = (data, _cb) => {
        const functionName = 'Master.getSourceList';
        masterApiReq.get({
            uri: 'Sources/getSourceList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getSourceList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getRegions = (data, _cb) => {
        const functionName = 'Master.getRegions';
        masterApiReq.post({
            uri: 'Regions/getRegions',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getRegions', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getDocumentMasterList = (data, _cb) => {
        const functionName = 'Master.getDocumentMasterList';
        masterApiReq.get({
            uri: 'DocumentMaster/getDocumentMasterList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getDocumentMasterList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getConfigurationParameterList = (data, _cb) => {
        const functionName = 'Master.getConfigurationParameterList';
        masterApiReq.get({
            uri: 'ConfigurationParameter/getConfigurationParameterList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getConfigurationParameterList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getChargeTypeList = (data, _cb) => {
        const functionName = 'Master.getChargeTypeList';
        masterApiReq.get({
            uri: 'ChargeTypes/getChargeTypeList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getChargeTypeList', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getServiceChargeMatrixList = (data, _cb) => {
        const functionName = 'Master.getServiceChargeMatrixList';
        masterApiReq.get({
            uri: 'ServiceChargeMatrix/getServiceChargeMatrixList',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getServiceChargeMatrixList',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.generateDocument = (data, _cb) => {
        const functionName = 'Master.generateDocument';
        masterApiReq.post({
            uri: 'FileRecords/generateDocument',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in generateDocument',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.saveUploadedDocument = (data, _cb) => {
        const functionName = 'Master.savedUploadedDocument';
        masterApiReq.post({
            uri: 'FileRecords/saveUploadedDocument',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in savedUploadedDocument',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getEntityDocs = (data, _cb) => {
        const functionName = 'Master.getEntityDocs';
        masterApiReq.post({
            uri: 'FileRecordEntityMappings/getFileRecordEntityMappings',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in getEntityDocs', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.saveOrDeleteUploadedDocument = (data, _cb) => {
        const functionName = 'Master.saveOrDeleteUploadedDocument';
        masterApiReq.post({
            uri: 'UserFileRecords/saveOrDeleteUploadedDocument',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName,'error in saveOrDeleteUploadedDocument', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getUserDocs = (data, _cb) => {
        const functionName = 'Master.getUserDocs';
        masterApiReq.post({
            uri: 'UserFileRecords/getUserFileRecords',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getUserDocs', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.getS3Buffer = (data, _cb) => {
        const functionName = 'Master.getS3Buffer';
        masterApiReq.post({
            uri: 'FileUpload/getS3Buffer',
            json: data
        }, function (error, response, Master) {
            if (error) {
                log.errorInfo(functionName, 'error in getS3Buffer', error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Master);
            }
        });
    };

    Master.generateGlobalCodeFile = (data, _cb) => {
        let functionName = 'Master.generateGlobalCodeFile';
        var sendData = {
            // LanguageCode: data.LanguageCode,
            // LanguageCodeID: data.LanguageCodeID,
            Active: true,
            Archived: false,
            skipPagination: true
        };
        // console.log("filter", filter)
        app.models.Master.getGlobalCodes(sendData, function (error, result) {
            if (error) {
                log.errorInfo(functionName,'error in generateGlobalCodeFile', error);
                if (_cb && _.isFunction(_cb)) {
                    return _cb('Error occured while fetching error codes !');
                }
            } else if (result && result.success && result.data && result.data.globalCodes && result.data.globalCodes.length) {
                var globalCodeContent = {};
                var globalCodes = result.data.globalCodes;
                _.forEach(globalCodes, (value, key) => {
                    var eachGlobalCode = {
                        globalCode: value.GlobalCode,
                        content: value.Content,
                    };
                    if (_.isEmpty(globalCodeContent[value.LanguageCode])) {
                        globalCodeContent[value.LanguageCode] = {};
                    }
                    globalCodeContent[value.LanguageCode][value.GlobalCode] = eachGlobalCode;
                });

                var globalFile = __dirname + '/../../server/language/global-codes.json';
                // console.log("globalFile===>", globalFile);
                fs.writeFileSync(globalFile, JSON.stringify(globalCodeContent));
                // _.set(app.models.Master, "globalCodeObj[" + data.LanguageCode + "]", globalCodeContent);
                // app.models.Master.globalCodeObj[req.body.LanguageCode] = result;
                if (_cb && _.isFunction(_cb)) {
                    return _cb(null, globalFile);
                }
            } else {
                if (_cb && _.isFunction(_cb)) {
                    return _cb(result);
                }
            }
        });
    };

    Master.remoteMethod(
        'getGlobalCodeList', {
            description: 'Create Master',
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
                verb: 'get'
            }
        });

    disableAllMethods(Master, [
        'getGlobalCodeList',
    ]);


};