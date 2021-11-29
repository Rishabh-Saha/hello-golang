let { env, request, _, RequestMiddlewareFramework } = require('./require-helper');
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger('environmentFiles');
const requestMiddleware = require('../request-helper/requestMiddleware');

//switching to environment files
let externalApi = require('../../config/external-api.json');
let creds = require('../../config/creds.json');
let rateLimiterConfig = require("../../config/rateLimiterConfig");
let datasource = require('../../config/datasource.json');
let constants = require('../../config/constants');
const responseData = require('../../config/respConfig.json')
const requestData = require('../../config/reqConfig.json')

if (env && env !== 'test') {
    try {
        externalApi = require('../../config/external-api.' + env);
        creds = require('../../config/creds.' + env);
        rateLimiterConfig = require('../../config/rateLimiterConfig.' + env);
        datasource = require('../../config/datasource.' + env);
        constants = require('../../config/constants.' + env + '.js');
    } catch (e) {
        log.error('require-helper', `error in config enviornment ${env}`, e);
        throw new Error(e);
    }
}
request = new RequestMiddlewareFramework(request, requestMiddleware).getMiddlewareEnabledRequest();

//coreAPI
let coreApiDefaults = {
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
const coreApiReq = request.defaults(coreApiDefaults);

//logisticsAPI
let logisticsApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.logisticsApi.baseUrl + externalApi.logisticsApi.restApiRoot
};
logisticsApiDefaults.headers[externalApi.logisticsApi.authTokenKey] = externalApi.logisticsApi.authToken;
const logisticsApiReq = request.defaults(logisticsApiDefaults);


//partsAPI
let partApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.partApi.baseUrl + externalApi.partApi.restApiRoot
};
partApiDefaults.headers[externalApi.partApi.authTokenKey] = externalApi.partApi.authToken;
partApiDefaults.headers['app-name'] = 'publicApi';
const partApiReq = request.defaults(partApiDefaults);

//billingAPI
let billingApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.billingApi.baseUrl + externalApi.billingApi.restApiRoot
};
billingApiDefaults.headers[externalApi.billingApi.authTokenKey] = externalApi.billingApi.authToken;
const billingApiReq = request.defaults(billingApiDefaults);


//aegisAPI
let aegisApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'publicApi'
    },
    baseUrl: externalApi.aegisApi.baseUrl + externalApi.aegisApi.restApiRoot
};
aegisApiDefaults.headers[externalApi.aegisApi.authTokenKey] = externalApi.aegisApi.authToken;
const aegisApiReq = request.defaults(aegisApiDefaults);


//webappAPI
let webApiDefaults = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'module': 'primePublic'
    },
    baseUrl: externalApi.webApi.baseUrl + externalApi.webApi.restApiRoot
};
webApiDefaults.headers[externalApi.webApi.authTokenKey] = externalApi.webApi.authToken;
const webApiReq = request.defaults(webApiDefaults);

module.exports = {
    aegisApiReq,
    billingApiReq,
    constants,
    coreApiReq,
    creds,
    datasource,
    externalApi,
    logisticsApiReq,
    partApiReq,
    rateLimiterConfig,
    requestData,
    responseData,
    webApiReq
}