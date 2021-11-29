const { _, httpContext }  = require('../helper-functions/require-helper');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('sendFormattedResponse');
const shelterHelper = require('../helper-functions/shelter-helper');
const modifyReqRes  = require('../helper-functions/modifyReqRes');

const sendFormattedResponse = async data => {
    const functionName = 'sendFormattedResponse';
    log.info(functionName, 'success object', data);
    const successObj = formResponse(data);
    log.info(functionName, 'final success object', successObj);

    var sendData = {
        dataToProcess: successObj,
        clientShelterCreds: httpContext.get('clientShelterCreds')
    };
    log.info(functionName, 'final response for encryption', sendData);

    const returnObj = await shelterHelper.encrypt(sendData);
    if (!returnObj['$data'] && !returnObj['success']) {
        returnObj.ticketNumber = httpContext.get('ApiHash');
    }

    log.info(functionName, 'final response object', returnObj);
    return returnObj;
}

const formResponse = (successObj) => {
    const apiName = httpContext.get('ApiName');
    const clientID = httpContext.get('ClientID')

    let response = {
        status: 200,
        success: true,
        message: 'Success', 
        data: {}
    };

    if (successObj.message) response.message = successObj.message;
    if (successObj.msg && !successObj.message) response.message = successObj.msg;
    if (successObj.data) {
        response.data = modifyReqRes(successObj.data, 'response',apiName,clientID);
    } else {
        response.data = modifyReqRes(successObj, 'response',apiName,clientID);
    }

    return response;
};

module.exports = sendFormattedResponse;