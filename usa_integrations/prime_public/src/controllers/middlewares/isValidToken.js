
const {safePromise, createBunyanLogger, customCatchError, constants, _ , getClientToken} = require('../../utils');
const log = createBunyanLogger("isValidToken");
const funcName = 'isValidToken';
const OPEN_ROUTES = constants.OPEN_ROUTES;

module.exports = async (request, response, next) => {
    const clientToken = request.clientSessionID;

    const { externalClient, apiName } = request.body;
    if (OPEN_ROUTES.TOKEN.indexOf(apiName) > -1) {
        return next();
    }

    if (!clientToken) {
        log.error(funcName, 'client token not found in request headers', request.headers);
        const formattedResponse = await customCatchError({errorCode:"TOK.EXP.401"});
        return response.status(401).send(formattedResponse);
    }

    const tokenData = {}
    tokenData.headers = {};
    tokenData.headers.ExternalClientID = externalClient.ExternalClientID;
    const [error, serverToken] = await safePromise(getClientToken(tokenData));

    if (error) {
        log.error(funcName, 'getClientTokenPromise error', error);
        const formattedResponse = await customCatchError({errorCode:"TOK.EXP.401"});
        return response.status(401).send(formattedResponse);
    }

    if (serverToken !== clientToken) {
        log.error(funcName, 'mismatched-token', `server token: ${serverToken} mismatches with client token: ${clientToken}`);
        const formattedResponse = await customCatchError({errorCode:"TOK.EXP.401"});
        return response.status(401).send(formattedResponse);
    }

    next();
}