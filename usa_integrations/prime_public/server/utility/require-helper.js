/* jshint node: true */
'use strict';
var http = require('http');
const utils = require('./utils/index.js');
//const { createBunyanLogger } = utils;
var app = require('./../server');
var querystring = require('querystring');
var env = process.env.NODE_ENV;
var logenv = process.env.LOG_ENV;
var bunyan = require('bunyan');
var _ = require('lodash');
var async = require('async');
var disableAllMethods = require('./disable-methods-helper');
var constants = require('./constants');
var router = app.loopback.Router();

var moment = require('moment');
var path = require('path');
var fs = require('fs');
//var log = utils.createBunyanLogger('require-helper');
var xml2js = require('xml2js');
var validator = require('./validator.js');
var g = require('strong-globalize')();
var createPagination = require('giant-piano').default;
var redis = require('redis');
var handlebars = require('handlebars');
var pdf = require('html-pdf');
var uuid = require('node-uuid');
var awsSdk = require('aws-sdk');
var NodeRSA = require('node-rsa');
var ENTITY_MODEL_MAPPING = require('./entity-model-mapping.json');
var ERROR_CODE = require('./error-codes.json');
var crypto = require("crypto");
var SHA256 = require("crypto-js/sha256");
var secretEncryption = _.toUpper(SHA256('doNotEncrypt'));
const multer = require('multer');
const LoopBackContext = require('loopback-context');
const RequestMiddlewareFramework = require('request-middleware-framework');
var paginate = createPagination({
    itemsPerPage: constants.PAGINATION_ITEMS_PER_PAGE,
    maxPages: constants.PAGINATION_MAX_PAGES
});
let request = require('request');
const errorWrapper = utils.errorWrapper;
var catchError = {
    success: false,
    msg: 'Something went wrong'
};

const createBunyanLogger = (loggerName, skipContext) => {
    const logLevelObj = {
        testing: 'warn',
        production: 'info'
    };

    let bunyanConfig = {
        name: loggerName,
        level: env && logLevelObj[env] ? logLevelObj[env] : 'trace'
    };

    let logger = bunyan.createLogger(bunyanConfig);
    if(env === 'test'){
        logger.level(bunyan.FATAL + 1);
    }
    const constructLogObj = (level) => {
        let ctxObj;
        return (...args) => {
            ctxObj = LoopBackContext.getCurrentContext({
                bind: true
            });
            try {
                if (!ctxObj || skipContext) {
                    logger[level](...args);
                } else {
                    logger[level]({
                        apiHash: ctxObj.get('ApiHash'),
                        clientId: ctxObj.get('ClientID'),
                        apiName: ctxObj.get('ApiName'),
                        logType: level
                    }, ...args);
                }
            } catch (error) {
                logger.error('Error in fetching Api Hash');
                logger.error(error);
                logger[level](...args);
            }
        };
    };

    const constructInformativeLog = (level) => {
        let ctxObj;
        return (functionName, action, ...args) => {
            ctxObj = LoopBackContext.getCurrentContext({
                bind: true
            });
            try {
                let errorType = "NA";
                if(level === 'error'){
                    if(args[0] instanceof Error){
                        errorType = 'tech';
                    }else{
                        errorType = 'business';
                    }
                }
                // if(args[0] && _.isObject(args[0]) && _.has(args[0], 'success') && args[0].success === false) {
                //     level = 'error';
                //     errorType = 'business';
                // }
                if (!ctxObj || skipContext) {
                    logger[level]({
                        apiHash: '',
                        clientId: '',
                        apiName: '',
                        logType: level,
                        functionName,
                        action,
                        errorType
                    },...args);
                } else {
                    logger[level]({
                        apiHash: ctxObj.get('ApiHash'),
                        clientId: ctxObj.get('ClientID'),
                        apiName: ctxObj.get('ApiName'),
                        logType: level,
                        functionName,
                        action,
                        errorType,
                    }, ...args);
                }
            } catch (error) {
                logger.error('Error in fetching Api Hash');
                logger.error(error);
                logger[level](...args);
            }
        };
    };

    const logObj = {
        info: constructLogObj('info'),
        trace: constructLogObj('trace'),
        debug: constructLogObj('debug'),
        warn: constructLogObj('warn'),
        error: constructLogObj('error'),
        fatal: constructLogObj('fatal'),
        information: constructInformativeLog('info'),
        errorInfo: constructInformativeLog('error')
    };

    return logObj;

};
const log = createBunyanLogger('require-helper');

function middlewareFunc(options, callback, next) {
    const functionName ='middlewareFunc';
    try {
        let ctxObj = LoopBackContext.getCurrentContext({
            bind: true
        });
        if (ctxObj) {
            let requestHeaders = options.headers || {};
            requestHeaders.apihash = ctxObj.get('ApiHash');
            options.headers = requestHeaders;
        } else {
            log.information(functionName,'check ctx object','ctxObj object not found');
        }
        options.gzip = true;
        options.forever = true;
        var _callback = function (err, response, body) {
            let traceLogObject = {};
            if (options.url || options.uri) {
                traceLogObject = {
                    endpoint: options.baseUrl + (options.url || options.uri),
                    request: JSON.stringify(options.body || options.json),
                    response: JSON.stringify(body),
                    headers: JSON.stringify(options.headers),
                    module: 'PublicAPI'
                };

                if (options.qs) {
                    traceLogObject.params = options.qs;
                }
            }
            if (response && response.statusCode) {
                traceLogObject.responseStatus = response.statusCode;
            }
            if (err) {
                traceLogObject.errorResponse = err;
            }
            addTrace(traceLogObject);
            callback(err, response, body);
        };
    } catch (error) {
        log.errorInfo(functionName,'error in middlewareFunc',error);
    }

    next(options, _callback);
}
request = new RequestMiddlewareFramework(request, middlewareFunc).getMiddlewareEnabledRequest();


if (env === 'production') {
    constants.TENOR_BRAND = constants.TENOR_BRANDS.PRODUCTION;
    constants.REDIS_CACHE = true;
}
try {
    var envSpecificconstants = require('./constants.' + env + '.js')
    if (envSpecificconstants) {
        _.assign(constants, envSpecificconstants);
        log.information('require-helper','constant merge','constants.js and consants.' + env + '.js merge successfully')
    }
} catch (constantError) {
    log.errorInfo('require-helper','constant env not found',errorWrapper('No environment config found for constants env: ' + env));
    log.errorInfo('require-helper','error in fetch constant', constantError);
}



var externalApi = require('./external-api.json');
var consumingApi = require('./consuming-api.json');
var moduleCreds = require('./../credentials/module-creds.json');
var primeCreds = require('./../credentials/prime-creds.json');
var webhookConfig = require('./../config/webhook-config.json');
let rateLimiterConfig = require("./../config/rateLimiterConfig");

if (env && env !== 'test') {
	try {
		externalApi = require('./external-api.' + env + '.json');
		consumingApi = require('./consuming-api.' + env + '.json');
		moduleCreds = require('./../credentials/module-creds.' + env + '.json');
		primeCreds = require('./../credentials/prime-creds.' + env + '.json' );
        webhookConfig = require('./../config/webhook-config.' + env + '.json' );
        rateLimiterConfig = require('./../config/rateLimiterConfig.' + env + '.json');
	} catch (e) {
		log.errorInfo('require-helper','config not found',errorWrapper('No config file found for env: ' + env + '. Using default'));
        log.errorInfo('require-helper','error in config not found',e);
        throw new Error(e)
		// externalApi = require('./external-api.json');
		// consumingApi = require('./consuming-api.json');
		// moduleCreds = require('./../credentials/module-creds.json');
        // primeCreds = require('./../credentials/prime-creds.json');
        // webhookConfig = require('./../config/webhook-config.json');
        // rateLimiterConfig = require('./../config/rateLimiterConfig.json');
	}
}



var coreApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.coreApi.baseUrl + externalApi.coreApi.restApiRoot
};
coreApiDefaults.headers[externalApi.coreApi.authTokenKey] = externalApi.coreApi.authToken;
coreApiDefaults.headers['app'] = 'Servify';
coreApiDefaults.headers.authorization = externalApi.coreApi.accessCode;
var coreApiReq = request.defaults(coreApiDefaults);

var masterApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.masterApi.baseUrl + externalApi.masterApi.restApiRoot
};
masterApiDefaults.headers[externalApi.masterApi.authTokenKey] = externalApi.masterApi.authToken;
masterApiDefaults.headers['app'] = 'Servify';
var masterApiReq = request.defaults(masterApiDefaults);

var logisticsApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.logisticsApi.baseUrl + externalApi.logisticsApi.restApiRoot
};
logisticsApiDefaults.headers[externalApi.logisticsApi.authTokenKey] = externalApi.logisticsApi.authToken;
var logisticsApiReq = request.defaults(logisticsApiDefaults);

var partApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.partApi.baseUrl + externalApi.partApi.restApiRoot
};
partApiDefaults.headers[externalApi.partApi.authTokenKey] = externalApi.partApi.authToken;
partApiDefaults.headers['app-name'] = 'publicApi';
var partApiReq = request.defaults(partApiDefaults);

var billingApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.billingApi.baseUrl + externalApi.billingApi.restApiRoot
};
billingApiDefaults.headers[externalApi.billingApi.authTokenKey] = externalApi.billingApi.authToken;
var billingApiReq = request.defaults(billingApiDefaults);

var aegisApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.aegisApi.baseUrl + externalApi.aegisApi.restApiRoot
};
aegisApiDefaults.headers[externalApi.aegisApi.authTokenKey] = externalApi.aegisApi.authToken;
var aegisApiReq = request.defaults(aegisApiDefaults);

var integrationApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.integrationApi.baseUrl + externalApi.integrationApi.restApiRoot
};
integrationApiDefaults.headers[externalApi.integrationApi.authTokenKey] = externalApi.integrationApi.authToken;
var integrationApiReq = request.defaults(integrationApiDefaults);


var hedwigApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.hedwigApi.baseUrl + externalApi.hedwigApi.restApiRoot
};
hedwigApiDefaults.headers[externalApi.hedwigApi.authTokenKey] = externalApi.hedwigApi.authToken;
var hedwigApiReq = request.defaults(hedwigApiDefaults);

var webApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'primePublic'
    },
    baseUrl: externalApi.webApi.baseUrl + externalApi.webApi.restApiRoot
};
webApiDefaults.headers[externalApi.webApi.authTokenKey] = externalApi.webApi.authToken;
var webApiReq = request.defaults(webApiDefaults);



var templatePaths = {
    // serviceRequestInvoice: __dirname + '/../../templates/invoice/servicerequest-invoice.hbs',
};


var counter2 = 1;

handlebars.registerHelper('counter', function(index) {
    return index + 1;
});

handlebars.registerHelper('counter2', function() {
    return counter2++;
});

handlebars.registerHelper('taxCalculation', function(stateCode1, stateCode2) {
    if (stateCode1 === stateCode2) {
        return false;
    } else {
        return true;
    }
});

handlebars.registerHelper('notCheck', function(param) {
    return !param;
});


function cryptoConversion() {
    var crypto = require("crypto");
    var secret = 'UJAsTvq2QUUFTfjEb5dtYfeYZT8Qn3uFjvWYmqj9sc3fKQPqsz3d4CdezraFpkPP';
    var stringToSign = 'x-date: ' + moment().format(constants.HMAC_DATE_FORMAT) + ' GMT\n' + 'x-host: servify.in\n';
    const functionName = 'cryptoConversion';
    log.information(functionName,'string to sign',stringToSign);
    var encodedSignature = crypto.createHmac("sha256", secret).update(stringToSign).digest("base64");
    log.information(functionName,'encoded signature', encodedSignature);
}

// cryptoConversion();
function customCatchError(errorObj) {
    var error = _.cloneDeep(catchError);

    if (!errorObj) {
        errorObj = {};
    }

    _.forEach(errorObj, function(value, key) {
        //ignore '!=' warning
        if (value !== undefined) {
            error[key] = value;
        }
    });

    //Assigning msg to message if a message is not explicitly set
    if (!errorObj.message)
        error.message = errorObj.msg;

    return error;
}

//Compile handlebar templates
function compileTemplates() {
    const functionName = 'compileTemplates';
    // registerPartials();
    var compiledTemplates = {};
    _.forEach(templatePaths, function(value, key) {
        // console.log('template value ===> ', (fs.readFileSync(value)).toString())
        //Read from fs, convert it to string, then compile it to a handlebar template
        try {
            compiledTemplates[key] = handlebars.compile((fs.readFileSync(value)).toString());
        } catch (e) {
            log.information(functionName,'error in compileTemplates', e);
        }
    });

    return compiledTemplates;
}

handlebars.registerHelper('compareVar', function(var1, var2) {
    if (var1 === var2) {
        return true;
    } else {
        return false;
    }
});

handlebars.registerHelper('getTaxRate', function(ColumnName, taxLine) {
    const functionName = 'getTaxRate';
    log.information(functionName,'ColumnName', ColumnName);
    log.information(functionName,'taxLine', taxLine);
    if (ColumnName === taxLine.TaxType) {
        return taxLine.Rate;
    } else {
        return false;
    }
});

handlebars.registerHelper('getTaxAmount', function(ColumnName, taxLine) {
    const functionName = 'getTaxAmount';
    log.information(functionName,'ColumnName', ColumnName);
    log.information(functionName,'taxLine', taxLine);
    if (ColumnName === taxLine.TaxType) {
        return taxLine.Amount;
    } else {
        return false;
    }
});

handlebars.registerHelper('taxLinesManupulation', function(taxLines, taxesApplied) {
    const functionName = 'taxLinesManupulation';
    log.information(functionName,'taxLines', taxLines);
    log.information(functionName,'taxesApplied', taxesApplied);
    var newTaxLines = [];
    var defaultTaxLine = {
        Rate: '-',
        Amount: '-'
    };
    var taxLineTaxes = _.map(taxLines, 'TaxType');
    _.forEach(taxesApplied, (eachTax, key) => {
        var taxLine;
        if (taxLineTaxes[key] === taxesApplied[key]) {
            taxLine = taxLines[key];
        } else {
            taxLine = _.find(taxLines, {
                TaxType: taxesApplied[key]
            });
            defaultTaxLine.TaxType = taxesApplied[key];
            taxLine = taxLine ? taxLine : defaultTaxLine;
        }
        newTaxLines.push(taxLine);
    });
    return newTaxLines;
});

handlebars.registerHelper('getColspan', function(taxesApplied) {
    var colspan = 2;
    var taxLengthArr = [1, 2];
    if (taxesApplied && taxLengthArr.indexOf(taxesApplied.length) > -1) {
        colspan = 4;
    }
    return colspan;
});

handlebars.registerHelper('getInnerColspan', function(taxesApplied) {
    var colspan = 1;
    var taxLengthArr = [1, 2];
    if (taxesApplied && taxLengthArr.indexOf(taxesApplied.length) > -1) {
        colspan = 2;
    }
    return colspan;
});

var defaultPaginationObj = {
    showFirst: false,
    showPrev: false,
    pages: [],
    showNext: false,
    showLast: false,
    lastPage: 0,
    count: 0
};

function addTrace(data) {
    let endpoint = data.endpoint.split('/');
    endpoint = endpoint[endpoint.length - 2] + '/' + endpoint[endpoint.length - 1];
    let customLogger = createBunyanLogger('trace-log');
    customLogger.information('trace-log','downstream request',data);
}

/**
 * Direct dependencies
 */
exports.app = app;
exports.env = env;
exports._ = _;
exports.async = async;
exports.g = g;
exports.disableAllMethods = disableAllMethods;
exports.router = router;
exports.request = request;
exports.catchError = catchError;
exports.moment = moment;
exports.xml2js = xml2js;
exports.bunyan = bunyan;
exports.handlebars = handlebars;
exports.fs = fs;
exports.path = path;
exports.redis = redis;
exports.constants = constants;
exports.externalApi = externalApi;
exports.consumingApi = consumingApi;
exports.validator = validator;
exports.paginate = paginate;
exports.coreApiReq = coreApiReq;
exports.billingApiReq = billingApiReq;
exports.partApiReq = partApiReq;
exports.logisticsApiReq = logisticsApiReq;
exports.aegisApiReq = aegisApiReq;
exports.integrationApiReq = integrationApiReq;
exports.hedwigApiReq = hedwigApiReq;
exports.masterApiReq = masterApiReq;
exports.moduleCreds = moduleCreds;
exports.webhookConfig = webhookConfig;
exports.primeCreds = primeCreds;
exports.pdf = pdf;
exports.uuid = uuid;
exports.awsSdk = awsSdk;
exports.crypto = crypto;
exports.SHA256 = SHA256;
exports.secretEncryption = secretEncryption;
exports.NodeRSA = NodeRSA;
exports.defaultPaginationObj = defaultPaginationObj;
exports.webApiReq = webApiReq;

/**
 * Helper functions
 */
exports.createBunyanLogger = createBunyanLogger;
exports.customCatchError = customCatchError;
exports.compiledTemplates = compileTemplates();
exports.ENTITY_MODEL_MAPPING = ENTITY_MODEL_MAPPING;
exports.utils = utils;
exports.multer = multer;
exports.LoopBackContext = LoopBackContext;
exports.addTrace = addTrace;
exports.rateLimiterConfig = rateLimiterConfig;
exports.errorWrapper = utils.errorWrapper;