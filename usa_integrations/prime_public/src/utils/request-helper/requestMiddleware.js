const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const { _, httpContext } = require('../helper-functions/require-helper');
const log = createBunyanLogger('middleware-function');
const addTrace = require('./traceLog');

const middlewareFunc = (options, responseObject, next) => {
    const functionName = 'middlewareFunc';
    try {
        if (httpContext) {
            let requestHeaders = options.headers || {};
            requestHeaders.apihash = httpContext.get('ApiHash');
            options.headers = requestHeaders;
        } else {
            log.info(functionName, 'check ctx object', 'ctxObj object not found');
        }
        options.gzip = true;
        options.forever = true;
        var traceLogs = function (err, response, body) {
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
            responseObject(err, response, body);
        };
    } catch (error) {
        log.error(functionName, 'error in middlewareFunc', error);
    }

    next(options, traceLogs);
}

module.exports = middlewareFunc;
