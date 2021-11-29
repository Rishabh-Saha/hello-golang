const createBunyanLogger = require('./helper-functions/createBunyanLogger');
const safePromise = require('./helper-functions/safePromise');
const errorWrapper = require('./helper-functions/errorWrapper');
const requireHelper = require('./helper-functions/require-helper');
const environmentFiles = require('./helper-functions/environmentFiles');
const shelterHelper = require('./helper-functions/shelter-helper');
const memoize = require('./helper-functions/memoize');
const modifyReqRes = require('./helper-functions/modifyReqRes');
const getValidationErrors = require('./helper-functions/getValidationErrors');
const apiList = require('./helper-functions/apilist');

const isValidHmac = require('./middleware-helper/isValidHmac');
const getClientToken = require('./middleware-helper/getClientToken');
const resetTokenValidity = require('./middleware-helper/resetTokenValidity');
const getClientDetails = require('./middleware-helper/getClientDetails');
const isIPRangeCheck = require('./middleware-helper/ipRangeCheck');

const HttpError = require('./request-helper/httpError');
const traceLog = require('./request-helper/traceLog');
const customCatchError = require('./request-helper/customCatchError');
const downStreamApiCallerFunction = require('./request-helper/downStreamApiFunction');
const sendFormattedResponse = require('./request-helper/sendFormattedResponse');
const restartSlackHook = require('./request-helper/restartSlackHook');
const removeUnnecessaryData = require('./request-helper/removeUnnecessaryData');

module.exports = {
    ...environmentFiles,
    ...requireHelper,
    ...apiList,
    createBunyanLogger,
    customCatchError,
    downStreamApiCallerFunction,
    errorWrapper,
    getClientDetails,
    getClientToken,
    getValidationErrors,
    HttpError,
    isIPRangeCheck,
    isValidHmac,
    memoize,
    modifyReqRes,
    removeUnnecessaryData,
    resetTokenValidity,
    restartSlackHook,
    safePromise,
    sendFormattedResponse,
    shelterHelper,
    traceLog
    
};