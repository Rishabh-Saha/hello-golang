const { createBunyanLogger, creds, httpContext, customCatchError } = require('../../utils');
const log = createBunyanLogger('bluedart-authentication');


module.exports = async (request, response, next) => {
    const functionName = "authentication";
    const { licensekey } = request.headers;
    const rp = request.baseUrl + request.url;
    request.body.apiName = rp;
    request.headers["client-id"] = creds.bluedart.clientName;
    httpContext.ns.set('ClientID', creds.bluedart.clientName);
    const bluedartCreds = creds.bluedart;
    const secretCode = bluedartCreds.LicenseKey;
    if (!licensekey) {
        log.error(functionName, 'No license key sent', new Error('No license key sent'));
        return response.status(401).send(await customCatchError({ errorCode: "NO_LICENSE_KEY" }));
    }

    if (!secretCode) {
        log.error(functionName, "No secretCode key set", new Error("No secretCode key set"));
        return response.status(401).send(await customCatchError({errorCode: "NO_LICENSE_KEY"}));
    }

    if (secretCode !== licensekey) {
        log.error(functionName, "Secret key mismatch", new Error("Incorrect license key sent"))
        return response.status(401).send(await customCatchError({ errorCode: "MISMATCH_CODE" }));
    }

    log.info(functionName, "license key matches", "license key matches");
    next();
}
