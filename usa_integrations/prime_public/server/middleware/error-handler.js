const { createBunyanLogger, _, utils: { HttpError } } = require('./../utility/require-helper');
const { shelterHelper } = require('./../../server/utility/helper');
const { postWebhook } = require('./../utility/utils');
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

module.exports = function() {
    return function customerErrorHandler(error, request, res, next) {
        const sendData = {
            dataToProcess: error,
            clientShelterCreds: _.get(request, 'body.clientShelterCreds')
        };
        const functionName = 'customerErrorHandler';
        const encryptedError = shelterHelper.encrypt(sendData);
        log.errorInfo(functionName,'encrypted Error', encryptedError);
        log.errorInfo(functionName,'error in customerErrorHandler', error);
        if(isHttpError(error)) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if(isSystemError(error)) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if(error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
        return next(encryptedError);
    }
}