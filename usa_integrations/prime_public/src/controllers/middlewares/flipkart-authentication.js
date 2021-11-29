const {
    createBunyanLogger,
    creds,
    httpContext,
    customCatchError
} = require('../../utils');
const log = createBunyanLogger('flipkart-authentication');


module.exports = async function (request, response, next) {
    const functionName = "flipkart-authentication";
    const {
        authorization
    } = request.headers;
    const reference_id = request.body && request.body.reference_id ? request.body.reference_id : null;
    const flipkartCreds = creds.flipkart;
    const secretCode = flipkartCreds && flipkartCreds.LicenseKey ? flipkartCreds.LicenseKey : null;
    request.headers["client-id"] = flipkartCreds.clientName;
    httpContext.ns.set('ClientID', flipkartCreds.clientName);
    
    if (!secretCode) {
        log.error(functionName, "no authorization token key set", new Error("no authorization token key set"));
        return response.status(401).send(await customCatchError({
            reference_id,
            errorCode: "NO_SECRET_CODE"
        }));
    }  
    if (!authorization) {
        log.error(functionName, 'no authorization token key sent', new Error('No authorization token key sent'));
        return response.status(401).send(await customCatchError({
            reference_id,
            errorCode: "AUTHORIZATION_FAILED"
        }));
    } 
    if (secretCode !== authorization) {
        log.error(functionName, "secret key mismatch", new Error("Incorrect authorization token key sent"));
        return response.status(401).send(await customCatchError({
            reference_id,
            errorCode: 'MISMATCH_CODE'
        }));
    } 
    if(!flipkartCreds.clientName){
        log.error(functionName,"missing clientName in config",flipkartCreds);
        return response.status(500).send(await customCatchError({
            reference_id,
            errorCode: 'INTERNAL.SERVER.ERROR'
        }));
    }
    log.info(functionName, "authorization token key matches", "authorization token key matches");
    next();

}