'use strict';

const requireHelper = require('./../../server/utility/require-helper');
const utils = require('./../../server/utility/utils');
const app = requireHelper.app;
const log = requireHelper.createBunyanLogger('Claim');
const disableAllMethods = requireHelper.disableAllMethods;
const async = requireHelper.async;
const customCatchError = utils.customCatchError;
const sendFormattedResponse = utils.sendFormattedResponse;
const validatorFunctions = utils.validatorFunctions;
const _ = requireHelper._;

module.exports = function(Claim) {
    Claim.getClaimList = function(data, _cb) {
        const functionName = "Claim.getClaimList";
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
            getClaimList : ['validate', function(results, callback) {

                app.models.CoreApi.getClaimList(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getClaimList',error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of getClaimList',asyncAutoResult.getClaimList);
                if (asyncAutoResult && asyncAutoResult.getClaimList) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.getClaimList));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Claim.getClaimDetails = function(data, _cb) {
        const functionName = "Claim.getClaimDetails";
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
            getClaimDetails : ['validate', function(results, callback) {

                app.models.CoreApi.getClaimDetails(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName,'error in getClaimDetails',error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of getClaimDetails',asyncAutoResult.getClaimDetails);
                if (asyncAutoResult && asyncAutoResult.getClaimDetails) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.getClaimDetails));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Claim.updateClaimStatus = function(data, _cb) {
        const functionName = "Claim.updateClaimStatus";
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
            updateClaimStatus : ['validate', function(results, callback) {

                app.models.CoreApi.updateClaimStatus(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = data.clientShelterCreds;
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in updateClaimStatus', error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of updateClaimStatus',asyncAutoResult.updateClaimStatus);
                if (asyncAutoResult && asyncAutoResult.updateClaimStatus) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.updateClaimStatus));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Claim.updateClaimExpenditure = function(data, _cb) {
        const functionName = "Claim.updateClaimExpenditure";
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
            updateClaimExpenditure : ['validate', function(results, callback) {

                app.models.Billing.updateClaimExpenditure(data, (error, result) => {
                    if (error) {
                        return callback(error);
                    } else if (result && result.success) {
                        result.data.clientShelterCreds = _.get(data, 'clientShelterCreds');
                        return callback(null, result.data);
                    } else {
                        return callback(result);
                    }
                });                
            }],
        }, function(error, asyncAutoResult) {
            if (error) {
                log.errorInfo(functionName, 'error in updateClaimExpenditure', error);
                return _cb(null, customCatchError(error,data));
            } else {
                log.information(functionName,'result of updateClaimExpenditure',asyncAutoResult.updateClaimExpenditure);
                if (asyncAutoResult && asyncAutoResult.updateClaimExpenditure) {
                    return _cb(null, sendFormattedResponse(asyncAutoResult.updateClaimExpenditure));
                } else {
                    return _cb(null, customCatchError({msg : "Please try again later !"},data));
                }
            }
        });
    };

    Claim.remoteMethod(
        'getClaimList', {
            description: 'getClaimList',
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
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    Claim.remoteMethod(
        'getClaimDetails', {
            description: 'getClaimDetails',
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
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    Claim.remoteMethod(
        'updateClaimStatus', {
            description: 'updateClaimStatus',
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
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });
    Claim.remoteMethod(
        'updateClaimExpenditure', {
            description: 'updateClaimExpenditure',
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
                description: 'Modes Object'
            },
            http: {
                verb: 'post'
            }
        });

    disableAllMethods(Claim, [
        'getClaimList',
        'getClaimDetails',
        'updateClaimStatus',
        'updateClaimExpenditure'
    ]);
};