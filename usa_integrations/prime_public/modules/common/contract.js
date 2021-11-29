/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var app = requireHelper.app;
var log = requireHelper.createBunyanLogger('Contract');
var async = requireHelper.async;
var customCatchError = utils.customCatchError;
var sendFormattedResponse = utils.sendFormattedResponse;
var validatorFunctions = utils.validatorFunctions;

module.exports = function (Contract) {
	Contract.getContractDetailsbyIMEI = (data, cb) => {
		const functionName = "Contract.getContractDetailsbyIMEI";
		async.auto({
			validate: function (callback) {
				var validate = utils.hasSufficientParameters(data, [{
					keys: [
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
			getContractDetailsbyIMEI: ['validate', function (results, callback) {
				app.models.CoreApi.getContractDetailsbyIMEI(data, (error, result) => {
					if (error) {
						return callback(error);
					} else if (result && result.success) {
						result.clientShelterCreds = data.clientShelterCreds;
						return callback(null, result);
					} else {
						return callback(result);
					}
				});
			}]
		}, function (asyncError, asyncResult) {
			if (asyncError) {
				log.errorInfo(functionName, 'error in getContractDetailsbyIMEI', asyncError);
				return cb(null, customCatchError(asyncError, data));
			} else {
				log.information(functionName, 'resiult of getContractDetailsbyIMEI', asyncResult.getContractDetailsbyIMEI);
				if (asyncResult && asyncResult.getContractDetailsbyIMEI) {
					return cb(null, sendFormattedResponse(asyncResult.getContractDetailsbyIMEI));
				} else {
					return cb(null, customCatchError({
						msg: "Please try again later !"
					}, data));
				}
			}
		})
	}

	Contract.getSoldContractDetails = (data, cb) => {
		const functionName = "Contract.getSoldContractDetails";
		async.auto({
			validate: function (callback) {
				var validate = utils.hasSufficientParameters(data, [{
					keys: [
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
			getSoldContractDetails: ['validate', function (results, callback) {
				app.models.CoreApi.getSoldContractDetails(data, (error, result) => {
					if (error) {
						return callback(error);
					} else if (result && result.success) {
						result.clientShelterCreds = data.clientShelterCreds;
						return callback(null, result);
					} else {
						return callback(result);
					}
				});
			}]
		}, function (asyncError, asyncResult) {
			if (asyncError) {
				log.errorInfo(functionName, 'error in getSoldContractDetails', asyncError);
				return cb(null, customCatchError(asyncError, data));
			} else {
				log.information(functionName, 'resiult of getSoldContractDetails', asyncResult);
				if (asyncResult) {
					return cb(null, sendFormattedResponse(asyncResult.getSoldContractDetails));
				} else {
					return cb(null, customCatchError({
						msg: "Please try again later !"
					}, data));
				}
			}
		})
	}

	Contract.getContractDetails = (data, cb) => {
		const functionName = "Contract.getContractDetails";
		async.auto({
			validate: function (callback) {
				var validate = utils.hasSufficientParameters(data, [{
					keys: [
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
			getContractDetails: ['validate', function (results, callback) {
				app.models.CoreApi.getContractDetails(data, (error, result) => {
					if (error) {
						return callback(error);
					} else if (result && result.success) {
						result.clientShelterCreds = data.clientShelterCreds;
						return callback(null, result);
					} else {
						return callback(result);
					}
				});
			}]
		}, function (asyncError, asyncResult) {
			if (asyncError) {
				log.errorInfo(functionName, 'error in getContractDetails', asyncError);
				return cb(null, customCatchError(asyncError, data));
			} else {
				log.information(functionName, 'resiult of getContractDetails', asyncResult);
				if (asyncResult) {
					return cb(null, sendFormattedResponse(asyncResult.getContractDetails));
				} else {
					return cb(null, customCatchError({
						msg: "Please try again later !"
					}, data));
				}
			}
		})
	}

	Contract.remoteMethod(
		'getContractDetailsbyIMEI', {
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

	Contract.remoteMethod(
		'getSoldContractDetails', {
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

	Contract.remoteMethod(
		'getContractDetails', {
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
}
