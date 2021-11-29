/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('Voucher');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
const externalApi = requireHelper.externalApi;


module.exports = function (Voucher) {
    Voucher.createVoucher = function (data, _cb) {
        let functionName = 'Voucher.createVoucher';
        async.auto({
            validate: function (callback) {
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
            createVoucher: ['validate', function (results, callback) {
                app.models.CoreApi.createVoucher(data, (error, result) => {
                    if(error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,"error in createVoucher",error)
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult && asyncAutoResult.createVoucher) {
                    asyncAutoResult.createVoucher.clientShelterCreds = data.clientShelterCreds; 
                    log.information(functionName,"result of createVoucher",asyncAutoResult)
                    return _cb(null, sendFormattedResponse(asyncAutoResult.createVoucher));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };

    Voucher.captureVoucherSales = function (data, _cb) {
        const functionName = 'Voucher.captureVoucherSales'
        async.auto({
            validate: function (callback) {
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
            captureVoucherSales: ['validate', function (results, callback) {
                app.models.CoreApi.captureVoucherSaleData(data, (error, result) => {
                    if(error) {
                        return callback(error)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }]
        }, function (error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in captureVoucherSales', error);
                return _cb(null, customCatchError({ msg: error }, data));
            } else {
                if (asyncAutoResult) {
                    log.information(functionName,'asyncAutoResult of captureVoucherSales', asyncAutoResult);
                    asyncAutoResult.captureVoucherSales.clientShelterCreds = data.clientShelterCreds; 
                    return _cb(null, sendFormattedResponse(asyncAutoResult.captureVoucherSales));
                } else {
                    return _cb(null, customCatchError({ msg: "Please try again later !" }, data));
                }
            }
        });
    };
    
    Voucher.remoteMethod(
        'createVoucher', {
            description: '',
            accepts: {
                arg: 'data',
                type: 'object',
                default: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true
            },
            http: {
                verb: 'post'
            }
        });

    Voucher.remoteMethod(
        'captureVoucherSales', {
            description: '',
            accepts: {
                arg: 'data',
                type: 'object',
                default: '{}',
                required: true,
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'result',
                type: 'object',
                root: true
            },
            http: {
                verb: 'post'
            }
        });

    disableAllMethods(Voucher, [
        'createVoucher',
        'captureVoucherSales'
    ]);
};