const { createBunyanLogger, shelterHelper, _, HttpError, httpContext } = require('../../utils');
const log = createBunyanLogger('custom-error-handler');

const isSystemError =
    error =>
        error instanceof EvalError ||
        error instanceof RangeError ||
        error instanceof ReferenceError ||
        error instanceof SyntaxError ||
        error instanceof TypeError ||
        error instanceof URIError;

const isHttpError = error => error instanceof HttpError;
let errorResponse = {
    "status": 500,
    "success": false,
    "errorCode": "SM.WTR.500",
    "data": {},
    "message": "Something went wrong",
    "ticketNumber": ""
}
module.exports = async function customerErrorHandler(error, request, res, next) {
    const functionName = 'customErrorHandler-v2';
    log.error(functionName, 'error in customErrorHandler', error);
    const sendData = {
        dataToProcess: error,
        clientShelterCreds: httpContext.get('clientShelterCreds')
    };
    const encryptedError = await shelterHelper.encrypt(sendData);
    log.error(functionName, 'encrypted Error', encryptedError);
    errorResponse.ticketNumber = httpContext.get('ApiHash');
    if (isHttpError(error)) {
        return res.status(500).json(errorResponse);
    }
    if (isSystemError(error)) {
        return res.status(500).json(errorResponse);
    }
    if (error instanceof Error) {
        errorResponse.message = error.message;
        return res.status(500).json(errorResponse)
    }
    return next(encryptedError);
}
