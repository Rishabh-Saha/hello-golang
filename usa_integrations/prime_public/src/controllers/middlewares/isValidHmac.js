const { customCatchError,isValidHmac, createBunyanLogger } = require('../../utils');
const log = createBunyanLogger("hasValidHmac");

module.exports =  async(request, response, next) => {
    const requestHeaders = request.headers;
    const { externalClient } = request.body;
    const validHmac = isValidHmac({
        secret: externalClient.ClientSignature,
        clientHmac: requestHeaders['hmac-signature'],
        date: requestHeaders['x-date'],
        host: requestHeaders['x-host'],
        clientName: externalClient.ClientName
    });

    if (!validHmac) {
        log.error('isValidHmac', `hmac mismatch error for the request headers`, request.headers);
        const formattedResponse = await customCatchError({errorCode:"HMAC.INVALID.401"});
        return response
            .status(401)
            .send(formattedResponse);
    }
    next();
};