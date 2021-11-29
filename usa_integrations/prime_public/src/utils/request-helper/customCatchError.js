const { _, httpContext } = require('../helper-functions/require-helper');
const { creds, constants } = require('../helper-functions/environmentFiles');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('customCatchError');
const shelterHelper = require('../helper-functions/shelter-helper');
const flipkartCreds = creds.flipkart;
const bluedartCreds = creds.bluedart;
const flipkartErrorCodes = constants.FLIPKART_ERROR_CODE;
const flipkartMessages = constants.FLIPKART_MESSAGES;
const responseMessages = constants.RESPONSE_MESSAGES; 
const bluedartMessages = constants.BLUEDART_MESSAGES;

const customCatchError = async (errorObj) => {
    const functionName = 'customCatchError';
    log.info(functionName, 'error object', errorObj);
    if (errorObj && errorObj['$data']) {
        return errorObj;
    }
    if(httpContext.get('ClientID') && httpContext.get('ClientID') === flipkartCreds.clientName) {
        const error = await flipkartResponse(errorObj);
        log.info(functionName, 'flipkart final error object', error);
        return error;
    }

    if(httpContext.get('ClientID') && httpContext.get('ClientID') === bluedartCreds.clientName) {
        const error = await bluedartResponse(errorObj);
        log.info(functionName, 'bluedart final error object', error);
        return error;
    }

    const error = await formResponse(errorObj);
    log.info(functionName, 'final error object', errorObj);
    const sendData = {
        dataToProcess: error,
        clientShelterCreds: httpContext.get('clientShelterCreds')
    };

    log.info(functionName, 'send data to custom catch error', JSON.stringify(sendData));
    let encryptedError = await shelterHelper.encrypt(sendData);
    if(!encryptedError['$data']){
        encryptedError.ticketNumber = httpContext.get('ApiHash');
    }

    log.info(functionName, 'sendData customCatchError encrypt', encryptedError);
    return encryptedError;
}

const formResponse = (errorObj) => {
    let response = {
        status: 400,
        success: false,
        errorCode: 'SM.WTR.001',
        message: 'Something went wrong',
        data: {},
        ticketNumber: ''
    };
    
    if(errorObj.status) response.status = errorObj.status;
    if(errorObj.errorCode) response.errorCode = errorObj.errorCode;
    if(errorObj.message) response.message = errorObj.message;
    
    if(errorObj.msg && !errorObj.message) response.message = errorObj.msg;
    
    if(!errorObj.message && !errorObj.msg && responseMessages[errorObj.errorCode]) {
        response.message = responseMessages[errorObj.errorCode].message;
    }
    if(!errorObj.status && responseMessages[errorObj.errorCode]) {
        response.status = responseMessages[errorObj.errorCode].status;
    }

    if(errorObj.data) response.data = errorObj.data;
    response.ticketNumber = httpContext.get('ApiHash');
    return response;
};

const flipkartResponse = (errorObj) => {

    const reference_id = errorObj && errorObj.reference_id ? errorObj.reference_id : null;
    const apiName = httpContext.get('ApiName');
    const code = errorObj && errorObj.errorCode ? errorObj.errorCode : "REQUEST_ERROR"
    const message = errorObj && errorObj.errorCode ? flipkartMessages[errorObj.errorCode].message : "Something went wrong"

    return {
        "reference_id": reference_id,
        "error": [
            {
                code,
                message
            }
        ],
        "status": flipkartErrorCodes[apiName]
    }
};

const bluedartResponse = (errorObj) => {
    let response = {
        status: 400,
        success: false,
        errorCode: 'SM.WTR.001',
        message: 'Something went wrong',
        data: {},
        ticketNumber: ''
    };
    if(errorObj.status) response.status = errorObj.status;
    if(errorObj.errorCode) response.errorCode = errorObj.errorCode;
    if(errorObj.message) response.message = errorObj.message;
    
    if(errorObj.msg && !errorObj.message) response.message = errorObj.msg;
    
    if(!errorObj.message && !errorObj.msg && [errorObj.errorCode]) {
        response.message = bluedartMessages[errorObj.errorCode].message;
    }
    if(!errorObj.status && bluedartMessages[errorObj.errorCode]) {
        response.status = bluedartMessages[errorObj.errorCode].status;
    }

    if(errorObj.data) response.data = errorObj.data;
    response.ticketNumber = httpContext.get('ApiHash');
    return response;
}

module.exports = customCatchError;
