const { createBunyanLogger, _, customCatchError, shelterHelper, modifyReqRes, httpContext } = require('../../utils');
const log = createBunyanLogger("decryption");

module.exports = async (request, response, next) => {
    const functionName = 'decryption';
    log.info(functionName, 'in decryption middleware')
    let decryptedRequestBody;
    if(request["method"] === 'GET'){
        log.info(functionName,"bypass the decryption middleware","request method is GET")
        return next();
    }
    const apiName = httpContext.get('ApiName');
    const clientID = httpContext.get('ClientID');
    if (request.is('multipart/form-data')) {
        // decryptedRequestBody = request.body;
        decryptedRequestBody = modifyReqRes(request.body,'request',apiName, clientID);
    } else {
        const sendData = {
            dataToProcess: request.body,
            clientShelterCreds: httpContext.get('clientShelterCreds')
        }

        decryptedRequestBody = await shelterHelper.decrypt(sendData);
        decryptedRequestBody = modifyReqRes(decryptedRequestBody,'request',apiName, clientID);
    }
    
    log.info(functionName, 'decryptedRequestBody', decryptedRequestBody);
    if (!_.isEmpty(decryptedRequestBody) 
    && (decryptedRequestBody.success === false) 
    && (decryptedRequestBody.success !== undefined) 
    && !(decryptedRequestBody.success)) {
        const formattedResponse = await customCatchError({errorCode:'DECRYPTION.ERROR.401'});
        return response
            .status(401)
            .send(formattedResponse);
    } else {
        delete request.body['$data'];
        request.body = {
            ...decryptedRequestBody,
            ...request.body
        };
        next();
    }
};
