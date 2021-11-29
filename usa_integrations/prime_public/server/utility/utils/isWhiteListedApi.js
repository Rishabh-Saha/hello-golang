const { createBunyanLogger } = require('../../../server/utility/require-helper');
const getApiId = require("./getApiId");
const getWhileListedApiDetails = require("./getWhileListedApiDetails");
const safePromise = require("./safePromise");
const HttpError = require("./HttpError");
const log = createBunyanLogger('isWhiteListedApi');

const funcName = 'isWhiteListedApi';
const isWhiteListedApi = async ({
    ApiName,
    ExternalClientID,
    RestAction
}) => {
    const [apiFetchingError, apiFetched] = await safePromise(getApiId({
        ApiName
    }));
    if (apiFetchingError) {
        log.errorInfo(funcName, 'api-list-search-error', apiFetchingError);
        throw apiFetchingError;
    }
    if (!apiFetched) {
        throw new HttpError({
            message: `${RestAction}@${ApiName} is not whitlisted`,
            errorCode: '401.Api',
            status: 401
        });
    }
    const {
        ApiId
    } = apiFetched;
    const [whiteListedApiFetchingError, whiteListedApiFetched] = await safePromise(getWhileListedApiDetails({
        ExternalClientID,
        ApiId,
        RestAction
    }));
    if (whiteListedApiFetchingError) {
        log.errorInfo(funcName, 'whitelisted-api-list-search-error', whiteListedApiFetchingError);
        throw whiteListedApiFetchingError;
    }
    if (!whiteListedApiFetched) {
        throw new HttpError({
            message: `${RestAction}@${ApiName} is not whitlisted for External Client ID ${ExternalClientID}`,
            errorCode: '401.Api.Client',
            status: 401
        });
    }
    return true;
}

module.exports = isWhiteListedApi;
