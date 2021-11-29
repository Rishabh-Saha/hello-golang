/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('Part');
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
var partApiReq = requireHelper.partApiReq;
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
const setHeader = utils.setHeader;
module.exports = function (Part) {

    Part.auditStockTransferOrder = (data, _cb) => {
        const functionName = "Part.auditStockTransferOrder";
        partApiReq.post({
            uri: 'Wrapper/auditStockTransferOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.createShipmentForStockTransferOrder = (data, _cb) => {
        const functionName = "Part.createShipmentForStockTransferOrder";
        partApiReq.post({
            uri: 'Wrapper/createShipmentForStockTransferOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.approveAndInvoicePurchaseOrder = (data, _cb) => {
        const functionName = "Part.approveAndInvoicePurchaseOrder";
        partApiReq.post({
            uri: 'Wrapper/approveAndInvoicePurchaseOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.createShipmentForPurchaseOrder = (data, _cb) => {
        const functionName = "Part.createShipmentForPurchaseOrder";
        partApiReq.post({
            uri: 'Wrapper/createShipmentForPurchaseOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.auditReturnOrder = (data, _cb) => {
        const functionName = "Part.auditReturnOrder";
        partApiReq.post({
            uri: 'Wrapper/auditReturnOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.receiveShipment = (data, _cb) => {
        const functionName = "Part.receiveShipment";
        partApiReq.post({
            uri: 'Wrapper/receiveShipment',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.auditPurchaseOrder = (data, _cb) => {
        const functionName = "Part.auditPurchaseOrder";
        partApiReq.post({
            uri: 'Wrapper/auditPurchaseOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };

    Part.createPurchaseOrderInvoice = (data, _cb) => {
        const functionName = "Part.createPurchaseOrderInvoice";
        partApiReq.post({
            uri: 'Wrapper/createPurchaseOrderInvoice',
            json: data,
            headers: setHeader(data)
        }, function (error, response, Part) {
            if (error) {
                log.errorInfo(functionName,'error from parts',error);
                return _cb('Error occured while fetching product data !');
            } else {
                return _cb(null, Part);
            }
        });
    };
	
	Part.createParts = (data, _cb) => {
		const functionName = "Part.createParts";
		partApiReq.post({
			uri: 'Wrapper/createPartsFromIntegration',
            json: data,
            headers: setHeader(data)
		}, function (error, response, Part) {
			if (error) {
				log.errorInfo(functionName,'error from parts',error);
				return _cb('Error occured while creating part !');
			} else {
				return _cb(null, Part);
			}
		});
    };
    
    Part.receiveShipmentWithoutShipmentDetails = (data, _cb) => {
        const functionName = 'Part.receiveShipmentWithoutShipmentDetails';
        partApiReq.post({
			uri: 'Wrapper/receiveShipmentWithoutShipmentDetails',
            json: data,
            headers: setHeader(data)
		}, function (error, response, Part) {
			if (error) {
				log.errorInfo(functionName,'error from parts',error);
				return _cb('Error occured while fetching product data !');
			} else {
				return _cb(null, Part);
			}
		});
    };

    Part.remoteMethod(
        'approveStockTransferOrder', {
            description: 'Update Part',
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

    Part.remoteMethod(
        'createShipmentForStockTransferOrder', {
            description: 'Update Part',
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

    Part.remoteMethod(
        'approveAndInvoicePurchaseOrder', {
            description: 'Update Part',
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

    Part.remoteMethod(
        'createShipmentForPurchaseOrder', {
            description: 'Update Part',
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
	
    Part.remoteMethod(
        'createParts', {
            description: 'create Part',
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

    disableAllMethods(Part, [
        'approveStockTransferOrder',
        'createShipmentForStockTransferOrder',
        'approveAndInvoicePurchaseOrder',
        'createShipmentForPurchaseOrder',
        'createParts'
    ]);


};