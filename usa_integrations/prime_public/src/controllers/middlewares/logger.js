
const { createBunyanLogger, uuid, httpContext, Raven, constants } = require('../../utils');
const log = createBunyanLogger('logger');

module.exports = (request, response, next) => {
    const functionName = "request-logger";
    httpContext.ns.bindEmitter(request);
    httpContext.ns.bindEmitter(response);
    try {
        const apiID = request.headers.apihash || uuid.v4();
        const clientID = request.headers['client-id'];
        const apiName = request.baseUrl + request.path;

        httpContext.ns.set('ApiHash', apiID);
        httpContext.ns.set('ClientID', clientID);
        httpContext.ns.set('ApiName', apiName.toLowerCase());
        Raven.setContext({
            "tags": {
                "ApiHash": apiID,
                "Region": constants.REGION
            }
        });
    } catch (error) {
        log.error(functionName, 'error in logger', error);
        log.error(functionName, 'error in logger', 'Error in setting ApiHash or stringifying the request payload');
    }
    log.info(functionName, 'V2 APIName', request.path)
    log.info(functionName, 'request sent by client', {body: request.body, headers: request.headers});
    next();
}