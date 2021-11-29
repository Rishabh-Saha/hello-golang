var env = process.env.NODE_ENV;
var loopback = require('loopback');
var app = require('./../server.js');
var async = require('async');
var _ = require('lodash');
const requireHelper = require('../utility/require-helper');
const log = requireHelper.createBunyanLogger('auth-middleware');
const errorWrapper = requireHelper.errorWrapper;

module.exports = function () {
	return function isAuthenticated(req, res, next) {
		const functionName = "isAuthenticated";
		if (req.headers.app) {
			req.body.app = req.headers.app;
			req.body.Source = req.headers.app;
		}
		req.body.ClientName = req.headers.app || req.body.ClientName;
		if (req.body.ClientName) {
			app.models.ClientDetail.findOne({
					where: {
						ClientName: req.body.ClientName
					}
				})
				.then(function (clientResult) {
					if (clientResult) {
						req.body.ClientID = clientResult.ClientID;
						next();
					} else {
						//error
					}
				})
				.catch(function (error) {
					log.errorInfo(functionName, 'error in Authentication', errorWrapper(error));
					next();
				})
		} else {
			//error
			next();
		}
	};
};