const { _, safePromise, memoize, getClientDetails, createBunyanLogger, customCatchError, httpContext  } = require('../../utils');
const log = createBunyanLogger('dataHandler');

module.exports = async (request, response, next) => {
    const functionName = 'dataHandler';
    const rp = request.baseUrl + request.url;
    const apiName = rp;
    const clientIp = _.split(request.headers['x-forwarded-for'], ',')[0];
    const clientName = request.headers["client-id"];

    if(!clientName){
        log.error(functionName,'client not received',clientName);
        const formattedResponse = await customCatchError({errorCode:"CLIENT.INVALID.401"});
        return response
            .status(401)
            .send(formattedResponse);
    }
    // public_getClientDetails_SAMSUNG_SF
    const [externalClientFetchingError, externalClient] = await safePromise(memoize(getClientDetails)({
        useBase64: false,
        keyName: clientName
    },clientName));
    log.info(functionName, 'externalClient', externalClient);
    
    if (externalClientFetchingError) {
        log.error(functionName, 'externalClientFetchingError', JSON.stringify(externalClientFetchingError));
        const formattedResponse = await customCatchError({errorCode:'SM.WTR.500'});
        return response
            .status(500)
            .send(formattedResponse);
    }

    if (!externalClient) {
        const formattedResponse = await customCatchError({errorCode:'CLIENT.INVALID.401'});
        return response
            .status(401)
            .send(formattedResponse);
    }
    request.body.apiName = apiName;
    request.clientIP = clientIp;
    request.clientSessionID = request.headers['client-session-id'];
    request.body.externalClient = externalClient;
    if(externalClient && externalClient.external_client_shelter){
        httpContext.set('clientShelterCreds', externalClient.external_client_shelter);
    }
    next();
};