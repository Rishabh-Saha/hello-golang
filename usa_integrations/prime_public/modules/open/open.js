/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var cacheHelper = require('./../../server/utility/cache-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Open');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var app = requireHelper.app;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
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
var INVENTORY_MANAGEMENT_ACTIONS = constants.INVENTORY_MANAGEMENT_ACTIONS;

module.exports = function (Open) {

    Open.verifyIntegration = function (data, _cb) {
        return _cb(null, sendFormattedResponse({
            msg: 'Integration successful !',
            secretEncryption: data.secretEncryption
        }));
    };

    Open.inventoryManagement = function (data, _cb) {
        const functionName = "Open.inventoryManagement";
        log.information(functionName,'data received in Open.inventoryManagement', data);
        async.auto({
            validate: function (callback) {
                var validate = utils.hasSufficientParameters(data.headers, [{
                    keys: ['restAction'],
                    type: 'presence',
                    against: ''
                }]);

                if (!validate) {
                    return callback(customCatchError({}, data));
                }

                if (!validate.success) {
                    return callback(validate);
                }

                data = validatorFunctions.trimAll(data);

				return callback(null, data);
			},
			actionCall: ['validate', (results, callback) => {
				var requestCall = '';
                var restAction = _.get(results.validate.headers, 'restAction');
				switch (restAction) {
				case INVENTORY_MANAGEMENT_ACTIONS.STO_AUDIT:
					requestCall = 'auditStockTransferOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.STO_DELIVERY:
					requestCall = 'createShipmentForStockTransferOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.PO_AUDIT:
					requestCall = 'auditPurchaseOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.PO_INVOICE:
					requestCall = 'createPurchaseOrderInvoice';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.PO_AUDIT_AND_INVOICE:
					requestCall = 'approveAndInvoicePurchaseOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.PO_DELIVERY:
					requestCall = 'createShipmentForPurchaseOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.RO_AUDIT:
					requestCall = 'auditReturnOrder';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.RO_RECEIVED:
					requestCall = 'receiveShipment';
					break;
				case INVENTORY_MANAGEMENT_ACTIONS.CREATE_PARTS:
					requestCall = 'createParts';
                    break;
                case INVENTORY_MANAGEMENT_ACTIONS.RO_RECEIVED_WITHOUT_SHIPMENT_DETAILS:
                    requestCall = 'receiveShipmentWithoutShipmentDetails';
                    break;
				default:
					requestCall = '';
					var returndata = {};
					returndata.msg = 'Invalid Rest Action !';
					return callback(customCatchError(returndata, data));
				}

                app.models.Part[requestCall](data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });
            }]
        }, (error, asyncAutoResult) => {
            if (error) {
                log.errorInfo(functionName,'error in inventoryManagement',error);
                return _cb(null, customCatchError(error, asyncAutoResult.validate));
            }
            log.information(functionName,'result of inventoryManagement',asyncAutoResult);
            return _cb(null, sendFormattedResponse(asyncAutoResult.actionCall));
        });
    };

    Open.remoteMethod(
        'inventoryManagement', {
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

    disableAllMethods(Open, [
        'inventoryManagement'
    ]);

};