var requireHelper = require('./../utility/require-helper');
var utils = require('./../utility/utils');
var middlewareHelper = require('./../utility/middleware-helper');
var log = requireHelper.createBunyanLogger('AuditLog');
var constants = requireHelper.constants;
var moment = requireHelper.moment;
var OPEN_ROUTES = constants.OPEN_ROUTES;
var RABBIT_ROUTES = constants.RABBIT_ROUTES;
var AUDIT_LOG_QUEUE = constants.AUDIT_LOG_QUEUE;
var UAT_BYPASS_ENV = constants.UAT_BYPASS_ENV;
var DEFAULT_LANGUAGE_CODE = constants.DEFAULT_LANGUAGE_CODE;
var consumingApi = requireHelper.consumingApi;
var moduleCreds = requireHelper.moduleCreds;
var primeCreds = requireHelper.primeCreds;
var uuid = requireHelper.uuid;
var customCatchError = utils.customCatchError;
var _ = requireHelper._;
var async = requireHelper.async;
// var unAuth = customCatchError({
// 	status: 401,
// 	msg: 'You are not authenticated'
// });
var env = requireHelper.env;

module.exports = function () {
    return function auditLog(req, res, next) {
        const functionName = 'auditLog';
        var rp = req.path;
        var referer = req.headers && req.headers.referer ? req.headers.referer : '';
        var apiName = rp.substr(rp.lastIndexOf('/') + 1);
        var rpArr = rp.split('/');
        var modelName = rpArr[rpArr.length - 2];
        log.information(functionName,'request path', rp);
        log.information(functionName,'referer path', referer);
        //var unAuthObj = _.cloneDeep(unAuth); //_.cloneDeep because _.assign mutates
        apiName = modelName + '/' + apiName;
        //Allow all open routes
        req.body.apiName = apiName;
        req.body.headers = req.body.customHeaders;
        if (!req.body.customHeaders) {
            req.body.headers = req.headers;
        }

        var LanguageCode = req.body.headers.languagecode;
        // console.log('LanguageCode*************', LanguageCode)
        if (!LanguageCode) {
            LanguageCode = DEFAULT_LANGUAGE_CODE;
        }
        req.body.headers.LanguageCode = LanguageCode;
        req.body.LanguageCode = LanguageCode;
        if (_.startsWith(rp, '/v1/explorer')) {
            next();
        } else {
            async.auto({
                createAuditLog: (callback) => {
                    var ApiHash = uuid.v1();

                    var sendData = {
                        msgArray: [{
                            headers: {},
                            body: {
                                Action: 'createLog',
                                params: {
                                    ApiName: apiName,
                                    Module: constants.MODULE_NAME,
                                    Timestamp: moment().format('YYYY-MM-DD hh:mm:ss'),
                                    ApiHash: ApiHash,
                                    requestHeaders: req.headers,
                                    requestBody: req.body,
                                }
                            }
                        }],
                        queueName: AUDIT_LOG_QUEUE
                    };
                    req.body.ApiHash = ApiHash;
                    middlewareHelper.hedwigPublishMessage(sendData, callback);
                },
                postWebhook: (callback) => {
                    utils.postWebhook(req.body, 'request');
                    return callback();
                }
            }, function (error, asyncAutoResult) {
                log.information(functionName, 'result of auditLog',asyncAutoResult);
                if (error) {
                    if (error === 500) {
                        res.send(customCatchError());
                    } else {
                        res.status(401).send(customCatchError(error));
                    }
                } else {
                    log.information(functionName,'request body',req.body);
                    next();
                }
            });
        }
    };
};