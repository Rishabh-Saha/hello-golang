var env = process.env.NODE_ENV;
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var fileHelper = require('./../../server/utility/file-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('FileRecord');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = requireHelper.customCatchError;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var s3BaseUrl = requireHelper.s3BaseUrl;
var FILE_REQUEST_TYPE = constants.FILE_REQUEST_TYPE;
var FILE_REQUEST_STATUS = constants.FILE_REQUEST_STATUS;
var momentAcceptedFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ssSSSZ', 'DD-MM-YYYY'];
var catchError = {
    status: 500,
    msg: 'Error in fetching data'
};

module.exports = function (Paytm) {
    Paytm.scheduleRequest = function (data, cb) {
        var consumer = {};
        var product = {};
        var request = {};
        try {
            async.auto({
                fetchMappingDetails: function (autoCallback) {
                    var requestObj = {};
                    requestObj.ClientID = data.ClientID;
                    requestObj.RequestBody = data;
                    var lookupObj = [];
                    if (data.Product && data.Product.ProductID) {
                        mappingObj.push({
                            EntityType: 'Product',
                            LookUpField: 'ExternalProductReferenceID',
                            LookUpValue: data.Product.ProductID,
                            FieldPath: 'Product.ProductID'
                        })
                    }
                    if (data.Product && data.Product.BrandID) {
                        mappingObj.push({
                            EntityType: 'Brand',
                            EntityValue: data.Product.BrandID,
                            FieldPath: 'Product.BrandID'
                        })
                    }
                    Paytm.app.models.EntityMapping.fetchExternalMappingDetails(requestObj, function (error, mappingResult) {
                        if (error || !mappingResult.success) {
                            autoCallback(error || mappingResult)
                        } else {
                            if (mappingResult.data && mappingResult.data.ModifiedRequestBody) {
                                data = mappingResult.data.ModifiedRequestBody
                            }
                            autoCallback()
                        }
                    })
                }
            }, function (error, autoResult) {
                if (error) {
                    return cb(null, error)
                } else {
                    var requestType = _.find(autoResult.getRequestTypeMapping, function (req) {
                        return req.ProductID == data.ProductID
                    })
                    return cb(null, {
                        success: true,
                        msg: 'Success',
                        data: {
                            am: autoResult.createRequest.ConsumerServicerequest.ConsumerAmount || 0,
                            cu: 'INR',
                            irid: autoResult.createRequest.ConsumerServicerequest.ReferenceID,
                            rt: requestType ? requestType.RequestType : 2,
                            isrsch: true,
                            iscnc: true,
                            isnew: autoResult.createRequest.ConsumerServicerequest.underRepair ? !autoResult.createRequest.ConsumerServicerequest.underRepair : 1
                        }
                    })
                }
            })
        } catch (error) {
            return cb(null, {
                success: false,
                status: 444,
                error: {}
            })
        }
    };
    Paytm.getSlots = function (data, cb) { };
    Paytm.updateRequest = function (data, cb) {
        async.auto({
            actionBasedUpdates: function (autoCallback, result) {
                switch (data.Action) {
                case 'RESCHEDULE':
                    data.updateObj.ReferenceID = data.ReferenceID
                    externalRequest[0].requestObj.post({
                        url: externalApiParams.core.url + '/ConsumerServicerequest/rescheduleRequest',
                        json: data.updateObj
                    }, function (error, response, body) {
                        if (error || !body || !body.success) {
                            autoCallback({
                                success: false,
                                msg: "An unknown error occurred",
                                status: 500,
                                statusCode: "INTERNAL_SERVER_ERROR",
                                data: {}
                            })
                        } else {
                            autoCallback(null, {
                                success: true,
                                msg: 'Success',
                                data: {}
                            })
                        }
                    })
                    break;
                case 'CANCEL':
                    externalRequest[0].requestObj.post({
                        url: externalApiParams.core.url + '/ConsumerServicerequest/cancelRequest',
                        json: {
                            ReferenceID: data.ReferenceID
                        }
                    }, function (error, response, body) {
                        if (error || !body || !body.success) {
                            autoCallback({
                                success: false,
                                msg: "An unknown error occurred",
                                status: 500,
                                statusCode: "INTERNAL_SERVER_ERROR",
                                data: {}
                            })
                        } else {
                            autoCallback(null, {
                                success: true,
                                msg: 'Success',
                                data: {}
                            })
                        }
                    })
                    break;
                default:
                    return cb(null, {
                        success: false,
                        msg: "Not a valid action",
                        status: 400,
                        statusCode: "INVALID_ACTION",
                        data: {}
                    })
                }
            }
        }, function (error, autoResult) {
            if (error) {
                return cb(null, error)
            } else {
                return cb(null, autoResult.actionBasedUpdates)
            }
        })
    };
    Paytm.trackRequest = function (data, cb) { };

    Paytm.checkAccountBalance = function (data, cb) {
        Paytm.app.models.CoreApi.checkAccountBalance(data, function (error, balanceResult) {
            if (error) {
                return cb(null, error);
            } else {
                return cb(null, balanceResult);
            }
        });
    };

    Paytm.unlinkPaymentAccount = function (data, cb) {
        Paytm.app.models.CoreApi.unlinkPaymentAccount(data, function (error, unlinkResult) {
            if (error) {
                return cb(null, error);
            } else {
                return cb(null, unlinkResult);
            }
        });
    };

    Paytm.checkWalletBalanceAndDebitAmount = function (data, cb) {
        Paytm.app.models.CoreApi.checkWalletBalanceAndDebitAmount(data, function (error, debitResult) {
            if (error) {
                return cb(null, error);
            } else {
                return cb(null, debitResult);
            }
        });
    };

    

};
