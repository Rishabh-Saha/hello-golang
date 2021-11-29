/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var cacheHelper = require('./../../server/utility/cache-helper');
var modelHelper = require('./../../server/utility/model-helper');
var getCachedKey = cacheHelper.getCachedKey;
var app = requireHelper.app;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('ExternalClient');
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
var CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
var DEFAULT_TX_OPTIONS = constants.DEFAULT_TX_OPTIONS;
var secretEncryption = requireHelper.secretEncryption;
const errorWrapper = requireHelper.errorWrapper;

var getExternalClientList = function () {
	var prefix = 'externalClients';
	const functionName = 'getExternalClientList';
	return getCachedKey(prefix, CACHE_CLEAR_INTERVAL.EXTERNAL_CLIENTS, function (data, key, txnObj, cb) {
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error('API needs a callback function as the second or the third parameter');
			}
		}

		async.auto({
			getExternalClients: function (callback) {
				
				var filter = {
					Archived: false,
					skipPagination: true,
					secretEncryption: data.secretEncryption
				};
				if (_.has(data, 'Active')){
					filter.Active = data.Active; 
				 }
				 
				 app.models.ExternalClient.getExternalClients(filter, txnObj, (error, result) => {
					if (error) {
						return callback(error);
					} else if (result && result.success && result.data && result.data.externalClients && result.data.externalClients.length) {
						return callback(null, result.data.externalClients);
					} else {
						return callback(result);
					}
				});
			},
			getMappedList: ['getExternalClients', (results, callback) => {
				var externalClients = results.getExternalClients;
				var externalClientConst = {};
				_.forEach(externalClients, (value) => {
					if (value.ConstantName) {
						externalClientConst[value.ConstantName] = value.ExternalClientID;
					}
				});

				var returnData = {
					externalClients: externalClients,
					externalClientConst: externalClientConst
				};
				return callback(null, returnData);
			}]
		}, (error, asyncAutoResult) => {
			if (error) {
				log.errorInfo(functionName, 'error in getExternalClientList', errorWrapper(error));
				return cb(error);
			}
			return cb(null, asyncAutoResult.getMappedList);
		});
	});
};

var getExternalClientList = getExternalClientList();

module.exports = function (ExternalClient) {

	var create = modelHelper.create(ExternalClient);
	var findById = modelHelper.findById(ExternalClient);
	var count = modelHelper.count(ExternalClient);
	var find = modelHelper.find(ExternalClient);
	var paginateData = modelHelper.paginateData(ExternalClient);
	//var oneExists = modelHelper.oneExists(ExternalClient);
	var findOne = modelHelper.findOne(ExternalClient);
	var getEntitiesRes = modelHelper.getEntitiesRes(ExternalClient);

	
	

	ExternalClient.createExternalClientWithTx = function (data, txnObj, cb) {
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error(customCatchError());
			}
		}

		async.auto({
			validate: function (callback) {
				var validate = utils.hasSufficientParameters(data, [{
					keys: [],
					type: 'presence',
					against: ''
				}]);

				if (!validate) {
					return callback(customCatchError());
				}

				if (!validate.success) {
					return callback(validate);
				}

				data = validatorFunctions.trimAll(data);
				return callback(null, data);
			},
			create: ['validate', function (results, callback) {
				create(results.validate, txnObj, callback);
			}]
		}, function (error, asyncAutoResult) {
			if (error) {
				return cb(error);
			} else {
				return cb(null, asyncAutoResult.create);
			}
		});
	};

	ExternalClient.updateExternalClientWithTx = function (data, txnObj, cb) {
		const functionName = 'ExternalClient.updateExternalClientWithTx';
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error(customCatchError());
			}
		}

		async.auto({
			validate: function (callback) {
				//Validate keys using hasSufficientParameters
				var validate = utils.hasSufficientParameters(data, [{
					keys: [
						'ExternalClientID'
					],
					type: 'presence',
					against: ''
				}, {
					key: 'ExternalClientID',
					type: 'isNumber'
				}]);

				if (!validate) {
					return callback(customCatchError());
				}

				if (!validate.success) {
					return callback(validate);
				}

				if (data.Status && !_.isString(data.Status))
					return callback(customCatchError({
						globalCode: 'MSR.REGN.001',
						languageCode: data.headers.LanguageCode
					}));

				//Trim all the data using a helper
				data = validatorFunctions.trimAll(data);

				var partnerServiceRequestObj = {
					ExternalClientID: data.ExternalClientID,
					Status: data.Status,
					Active: data.Active,
					Archived: data.Archived
				};

				return callback(null, partnerServiceRequestObj);
			},
			find: ['validate', function (results, callback) {
				findById(results.validate.ExternalClientID, txnObj, callback);
			}],
			update: ['find', function (results, callback) {
				if (results.find) {
					results.find.updateAttributes(results.validate, txnObj).then(function (updatedExternalClient) {
						log.information(functionName, 'updated External Client', updatedExternalClient);
						return callback(null, {
							status: 200,
							message: 'A service request with ExternalClientID : ' + results.validate.ExternalClientID + ' was updated successfully',
							success: true,
							msg: 'A service request was updated successfully',
							data: updatedExternalClient
						});
					}).catch(function (error) {
						log.errorInfo(functionName, 'error in updateExternalClientWithTx', error);
						return callback(customCatchError());
					});
				} else {
					return callback('Entry not found !');
				}
			}]
		}, function (error, asyncAutoResult) {
			if (error) {
				return cb(error);
			} else {
				return cb(null, asyncAutoResult.update);
			}
		});
	};

	ExternalClient.getExternalClientsWithTx = function (data, txnObj, cb) {
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error(customCatchError());
			}
		}

		async.auto({
			//Validating inputs and creating a where filter
			validate: function (callback) {
				data = validatorFunctions.trimAll(data);

				var filter = {
					where: {}
				};

				if (data.ExternalClientID && !_.isNumber(data.ExternalClientID))
					return callback(customCatchError({
						globalCode: 'MSR.REGN.002',
						languageCode: data.headers.LanguageCode
					}));

				if (data.LanguageCode && !_.isString(data.LanguageCode))
					return callback(customCatchError({
						globalCode: 'MSR.COMM.005',
						languageCode: data.headers.LanguageCode
					}));

				filter.where.ExternalClientID = data.ExternalClientID;
				filter.where.LanguageCode = data.LanguageCode;
				filter.where.Active = data.Active;
				filter.where.Archived = data.Archived;

				if (data.ExternalClientIDs)
					filter.where.ExternalClientID = {
						inq: data.ExternalClientIDs
					};

				if (data.fields)
					filter.fields = data.fields;

				//Setting pagination defaults
				if (!data.skipPagination) {
					if (!data.pagination) {
						data.pagination = {
							currentPage: 1
						};
					}
					if (data.pagination && !data.pagination.currentPage) {
						data.pagination.currentPage = 1;
					}

					filter.limit = constants.PAGINATION_ITEMS_PER_PAGE;
					filter.skip = (data.pagination.currentPage - 1) * constants.PAGINATION_ITEMS_PER_PAGE;
				}

				return callback(null, filter);
			},
			//Getting the count of the service request matching the where filter [w/o limit & skip]
			count: ['validate', function (results, callback) {
				if (data.skipPagination) {
					return callback(null, {});
				} else {
					count(results.validate.where, txnObj, callback);
				}
			}],
			//Getting the service request with limit and skip 
			find: ['validate', function (results, callback) {
				var filter = _.cloneDeep(results.validate);
				find(filter, txnObj, callback);
			}],
			//Preparing the final result
			paginate: ['count', 'find', function (results, callback) {
				if (data.skipPagination) {
					return callback(null, getEntitiesRes(results.find));
				} else {
					paginateData(results.find, results.count, data.pagination.currentPage, callback);
				}
			}]
		}, function (error, asyncAutoResult) {
			if (error) {
				return cb(error);
			} else {
				return cb(null, asyncAutoResult.paginate);
			}
		});
	};

	ExternalClient.deleteExternalClientWithTx = function (data, txnObj, cb) {
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error(customCatchError());
			}
		}
		ExternalClient.updateExternalClient({
			ExternalClientID: data.ExternalClientID,
			Active: false
		}, txnObj, cb);
	};

	ExternalClient.getExternalClientWithTx = function (data, txnObj, cb) {
		if (!_.isFunction(cb)) {
			if (_.isFunction(txnObj)) {
				cb = txnObj;
				txnObj = undefined;
			} else {
				throw new Error(customCatchError());
			}
		}
		async.auto({
			validate: function (callback) {
				//Validate keys using hasSufficientParameters
				data = validatorFunctions.trimAll(data);
				var validate = utils.hasSufficientParameters(data, [{
					keys: [
						'ExternalClientID'
					],
					type: 'presence',
					against: ''
				}, {
					key: 'ExternalClientID',
					type: 'isNumber'
				}]);

				if (!validate) return callback(customCatchError());
				if (!validate.success) return callback(validate);

				return callback(null, data);
			},
			findOne: ['validate', function (results, callback) {
				results.validate.limit = 1;
				ExternalClient.getExternalClients(results.validate, txnObj, function (error, result) {
					if (error) {
						return callback(customCatchError());
					} else if (result.success) {
						if (_.get(result, 'data.externalClients') && result.data.externalClients.length > 0) {
							return callback(null, result.data.externalClients[0]);
						} else {
							result.success = false;
							result.data = {};
							return callback(result);
						}
					} else {
						result.success = false;
						return callback(result);
					}
				});
			}]
		}, function (error, asyncAutoResult) {
			if (error)
				return cb(null, error);
			else
				return cb(null, {
					status: 200,
					success: true,
					msg: 'ExternalClient found',
					message: 'ExternalClient found',
					data: asyncAutoResult.findOne
				});
		});
	};

	ExternalClient.createExternalClient = (data, txnObj, _cb) => {
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('ExternalClient.createExternalClient', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
					ExternalClient.createExternalClientWithTx(data, txnObj, (error, result) => {
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.createExternalClientWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
	};

	ExternalClient.updateExternalClient = (data, txnObj, _cb) => {
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('ExternalClient.updateExternalClient', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
					ExternalClient.updateExternalClientWithTx(data, txnObj, (error, result) => {
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.updateExternalClientWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
    };

	ExternalClient.getExternalClients = (data, txnObj, _cb) => {
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('ExternalClient.getExternalClients', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
					ExternalClient.getExternalClientsWithTx(data, txnObj, (error, result) => {
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.getExternalClientsWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
	};

	ExternalClient.deleteExternalClient = (data, txnObj, _cb) => {
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('ExternalClient.deleteExternalClient', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
					ExternalClient.deleteExternalClientWithTx(data, txnObj, (error, result) => {
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.deleteExternalClientWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
	};

	ExternalClient.getExternalClient = (data, txnObj, _cb) => {
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
                    if(error || !tx){
                        log.errorInfo('ExternalClient.getExternalClient', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
					ExternalClient.getExternalClientWithTx(data, txnObj, (error, result) => {
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.getExternalClientWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
	};

	ExternalClient.getExternalClientListWithTx = function (data, txnObj, cb) {
		const functionName = 'ExternalClient.getExternalClientListWithTx';
	
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
					return callback('Please provide correct data');
				}

				if (!validate.success) {
					return callback(validate);
				}

				data = validatorFunctions.trimAll(data);
				return callback(null, data);
			},
			getExternalClients: ['validate', function (results, callback) {
				getExternalClientList(data, '', txnObj, callback);
			}],
		}, function (error, asyncAutoResult) {
			if (error) {
				log.errorInfo(functionName, 'error in getExternalClientListWithTx', errorWrapper(error));
				return cb(customCatchError(error));
			} else {
				if (asyncAutoResult) {
					log.information(functionName, 'result of getExternalClientListWithTx', asyncAutoResult);
					var returnData = {};
					returnData.data = asyncAutoResult.getExternalClients;
					returnData.secretEncryption = data.secretEncryption;
					return cb(null, sendFormattedResponse(returnData));
				} else {
					return cb(customCatchError({
						globalCode: 'MSR.COMM.004',
						languageCode: data.headers.LanguageCode
					}));
				}
			}
		});
	};

	ExternalClient.getExternalClientList = (data, txnObj, _cb) => {
		
		if (!_.isFunction(_cb)) {
			if (_.isFunction(txnObj)) {
				_cb = txnObj;

				ExternalClient.beginTransaction(DEFAULT_TX_OPTIONS, function (error, tx) {
					if(error || !tx){
                        log.errorInfo('ExternalClient.getExternalClientList', 'No transaction object', errorWrapper(error));
                        return _cb(null, customCatchError("Internal Server Error"));
                    }
					var txnObj = {
						transaction: tx
					};
					var cbCalled = false;
					tx.observe('timeout', function (context, next) {
						next();
						if (!cbCalled) {
							return _cb(null, customCatchError({
								globalCode: 'MSR.REGN.004',
								languageCode: data.headers.LanguageCode
							}));
						}
					});
				
					ExternalClient.getExternalClientListWithTx(data, txnObj, (error, result) => {
						
						if (error) {
							tx.rollback(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError(error));
								} else {
									return _cb(null, customCatchError(error));
								}
							});
						} else {
							tx.commit(function (err) {
								cbCalled = true;
								if (err) {
									return _cb(null, customCatchError({
										globalCode: 'MSR.REGN.005',
										languageCode: data.headers.LanguageCode
									}));
								} else {
									return _cb(null, result);
								}
							});
						}
					});
				});
			} else {
				throw new Error(customCatchError());
			}
		} else {
			ExternalClient.getExternalClientListWithTx(data, txnObj, (error, result) => {
				if (error) {
					return _cb(null, customCatchError(error));
				} else {
					return _cb(null, result);
				}
			});
		}
	};

	ExternalClient.remoteMethod(
		'createExternalClient', {
			description: 'Create ExternalClient',
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

	ExternalClient.remoteMethod(
		'updateExternalClient', {
			description: 'Update ExternalClient',
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

	ExternalClient.remoteMethod(
		'getExternalClients', {
			description: 'Get ExternalClients',
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

	ExternalClient.remoteMethod(
		'deleteExternalClient', {
			description: 'Delete ExternalClient',
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

	ExternalClient.remoteMethod(
		'getExternalClient', {
			description: 'Check if a service request exists by id and other filter',
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

	ExternalClient.remoteMethod(
		'getExternalClientList', {
			description: 'Check if a service request exists by id and other filter',
			accepts: {
				arg: 'data',
				type: 'object',
				required: false,
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

	disableAllMethods(ExternalClient, [
		'createExternalClient',
		'updateExternalClient',
		'getExternalClients',
		'deleteExternalClient',
		'getExternalClient',
		'getExternalClientList'
	]);
};