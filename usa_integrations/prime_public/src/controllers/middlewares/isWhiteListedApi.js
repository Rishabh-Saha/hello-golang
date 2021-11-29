const { createBunyanLogger, customCatchError } = require('../../utils');
const log = createBunyanLogger('isWhiteListedApi');

module.exports = async (request, response, next) => {
    
    const canSkipApiWhiteListing = request.body.externalClient.ApiWhitelisting === 0;
    if (canSkipApiWhiteListing) {
        return next();
    }

    const clientDetails =  request.body.externalClient;
    const apiName = clientDetails.apis[request.body.apiName];
    if(apiName){
        return next();
    }
    else{
        log.error('isWhiteListedApi', 'whiteListedAPIError', `${request.body.apiName} isn't whitelisted for ${clientDetails.ClientName}`);
        const formattedResponse = await customCatchError({errorCode:"API.INVALID.401"});

        return response
            .status(401)
            .send(formattedResponse);
    }

};