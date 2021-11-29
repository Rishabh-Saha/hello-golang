var requireHelper = require('./../utility/require-helper');
var utils = require('./../utility/utils');
var middlewareHelper = require('./../utility/middleware-helper');
var cacheHelper = require('./../utility/cache-helper');
var log = requireHelper.createBunyanLogger('Token');
var constants = requireHelper.constants;
var OPEN_ROUTES = constants.OPEN_ROUTES;
var UAT_BYPASS_ENV = constants.UAT_BYPASS_ENV;
var DEFAULT_LANGUAGE_CODE = constants.DEFAULT_LANGUAGE_CODE;
var consumingApi = requireHelper.consumingApi;
var customCatchError = utils.customCatchError;
var _ = requireHelper._;
var async = requireHelper.async;
var getExternalClientList = middlewareHelper.getExternalClientList;
var getWhitelistedIPList = middlewareHelper.getWhitelistedIPList;
var getClientToken = middlewareHelper.getClientToken;
var resetTokenValidity = middlewareHelper.resetTokenValidity;
// var unAuth = customCatchError({
// 	status: 401,
// 	msg: 'You are not authenticated'
// });
var env = requireHelper.env;

module.exports = function () {
	return function token(req, res, next) {
		const functionName = "token";
		var rp = req.path;
		var apiName = rp.substr(rp.lastIndexOf('/') + 1);
		var referer = req.headers && req.headers.referer ? req.headers.referer : '';
		var rpArr = rp.split('/');
		var modelName = rpArr[rpArr.length - 2];
		//var unAuthObj = _.cloneDeep(unAuth); //_.cloneDeep because _.assign mutates
		apiName = modelName + '/' + apiName;
		//Allow all open routes
		req.body.apiName = apiName;
		// req.body.headers.clientID = req.headers['client-id'];
		// req.body.headers.clientSecret = req.headers['client-secret'];
		// req.body.headers.clientSessionID = '89a26740-0f46-11e9-bb22-2374bb535bc8';
		if (OPEN_ROUTES.TOKEN.indexOf(rp) > -1 || _.startsWith(rp, '/v1/explorer')) {
			next();
		} else {
			var userSessionID = _.get(req.body, 'headers.clientSessionID');
			async.auto({
				validate: (callback) => {
					if (userSessionID && !_.isEmpty(userSessionID)) {
						//Do nothing
						return callback(null, userSessionID);
					} else {
						return callback({
							errorCode: 'TOK.EXP.001',
							msg: 'Token is either invalid or expired, Please generate again!'
						});
					}
				},
				getClientToken: ['validate', (results, callback) => {
					getClientToken(req.body, (error, clientToken) => {
						if (error) {
							return callback(error);
						} else {
							log.information(functionName, 'client token', clientToken);
							log.information(functionName, 'token userSessionID', userSessionID);
							if (clientToken === userSessionID) {
								//Reset invalidation time in redis
								return callback(null, clientToken);
							} else {
								return callback({
									errorCode: 'TOK.EXP.001',
									msg: 'Token is either invalid or expired, Please generate again!'
								});
							}
						}
					});
				}],
				resetTokenValidity: ['getClientToken', (results, callback) => {
					var sendData = {
						token: userSessionID,
						headers: req.body.headers
					};
					resetTokenValidity(sendData, callback);
				}]
			}, function (error, asyncAutoResult) {
				if (error) {
					if (error === 500) {
						res.send(customCatchError());
					} else {
						var dataForError = {
							clientShelterCreds: req.body.clientShelterCreds
						};
						res.status(401).send(customCatchError(error, dataForError));
					}
				} else {
					next();
				}
			});
		}
	};
};