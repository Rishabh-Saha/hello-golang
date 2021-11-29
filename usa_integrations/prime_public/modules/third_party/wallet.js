var env = process.env.NODE_ENV;
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var fileHelper = require('./../../server/utility/file-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('FileRecord');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var _ = requireHelper._;
var momentAcceptedFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ssSSSZ', 'DD-MM-YYYY'];
var validatorFunctions = utils.validatorFunctions;
const customCatchError = utils.customCatchError;
const sendFormattedResponse = utils.sendFormattedResponse;

module.exports = function (Wallet) {
    
    Wallet.checkAccountBalance = function (data, cb) {
        const functionName = "Wallet.checkAccountBalance";
        var validate = utils.hasSufficientParameters(data, [{
            keys: [
                'StoreCode', 
                'CurrencyCode', 
                'TotalAmount',
                'WalletProvider'
            ],
            type: 'presence',
            against: ''
        }]);
        if (!validate) {
            log.errorInfo(functionName,'validate result',validate);
            return cb("Please provide correct data");
        }
        if (!validate.success) {
            log.errorInfo(functionName,'unsuccessful validation',validate);            
            return cb(validate);
        } else if(!Wallet.app.models[data.WalletProvider] || !Wallet.app.models[data.WalletProvider].checkAccountBalance) {
            log.errorInfo(functionName,'No wallet provider available',data.WalletProvider);
            return cb(null, {
                success: false,
                msg: 'WalletProvider not found!',
                data: {}
            })
        }
        data = validatorFunctions.trimAll(data);
        Wallet.app.models[data.WalletProvider].checkAccountBalance(data, function (error, result) {
            if (error) {
                log.errorInfo(functionName, 'error in checkAccountBalance', error);
                return cb(null, error);
            } else {
                if(result.success){
                    log.information(functionName,'result of checkAccountBalance',result);
                }else{
                    log.errorInfo(functionName,'error in checkAccountBalance',result);
                }
                return cb(null, result);
            }
        });
    };

    Wallet.unlinkPaymentAccount = function (data, cb) {
        const functionName = "Wallet.unlinkPaymentAccount";
        var validate = utils.hasSufficientParameters(data, [{
            keys: [
                'StoreCode', 
                'WalletProvider'
            ],
            type: 'presence',
            against: ''
        }]);
        if (!validate) {
            log.errorInfo(functionName,'validate result',validate);
            return cb("Please provide correct data");
        }
        if (!validate.success) {
            log.errorInfo(functionName,'unsuccessful validation',validate);            
            return cb(validate);
        } else if(!Wallet.app.models[data.WalletProvider] || !Wallet.app.models[data.WalletProvider].unlinkPaymentAccount) {
            log.errorInfo(functionName,'No wallet provider available',data.WalletProvider);            
            return cb(null, {
                success: false,
                msg: 'WalletProvider not found!',
                data: {}
            })
        }
        data = validatorFunctions.trimAll(data);
        Wallet.app.models[data.WalletProvider].unlinkPaymentAccount(data, function (error, result) {
            if (error) {
                log.errorInfo(functionName, 'error in unlinkPaymentAccount', error);
                return cb(null, error);
            } else {
                if(result.success){
                    log.information(functionName,'result of unlinkPaymentAccount',result);
                }else{
                    log.errorInfo(functionName,'error in unlinkPaymentAccount',result);
                }
                return cb(null, result);
            }
        });
    };

    Wallet.checkWalletBalanceAndDebitAmount = function (data, cb) {
        const functionName = "Wallet.checkWalletBalanceAndDebitAmount";
        var validate = utils.hasSufficientParameters(data, [{
            keys: [
                'StoreCode',
                'WalletProvider',
                'CurrencyCode',
                'PlanArray',
            ],
            type: 'presence',
            against: ''
        }]);
        if (!validate) {
            log.errorInfo(functionName,'validate result',validate);            
            return cb("Please provide correct data");
        }
        if (!validate.success) {
            log.errorInfo(functionName,'unsuccessful validation',validate);            
            return cb(validate);
        } else if (!Wallet.app.models[data.WalletProvider] || !Wallet.app.models[data.WalletProvider].checkWalletBalanceAndDebitAmount) {
            log.errorInfo(functionName,'No wallet provider available',data.WalletProvider);            
            return cb(null, {
                success: false,
                msg: 'WalletProvider not found!',
                data: {}
            });
        }
        data = validatorFunctions.trimAll(data);
        Wallet.app.models[data.WalletProvider].checkWalletBalanceAndDebitAmount(data, function (error, result) {
            if (error) {
                log.errorInfo(functionName, 'error in checkWalletBalanceAndDebitAmount', error);
                return cb(null, error);
                // return cb(null, customCatchError(error, data));
            } else {
                if(result.success){
                    log.information(functionName,'result of checkWalletBalanceAndDebitAmount',result);
                }else{
                    log.errorInfo(functionName,'error in checkWalletBalanceAndDebitAmount',result);
                }
                return cb(null, result);
                // result.clientShelterCreds = _.get(data, 'clientShelterCreds');
                // return cb(null, sendFormattedResponse(result));
            }
        });
    };

    Wallet.remoteMethod(
        'checkAccountBalance', {
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

    Wallet.remoteMethod(
        'unlinkPaymentAccount', {
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

    Wallet.remoteMethod(
        'checkWalletBalanceAndDebitAmount', {
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

};
