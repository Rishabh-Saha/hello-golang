const safePromise = require('../helper-functions/safePromise');
const memoize = require('../helper-functions/memoize');
const { getApiLists } = require('../../dal');
const { _ } = require('./require-helper');
const createBunyanLogger = require('./createBunyanLogger');
const log = createBunyanLogger('getApiList');
let apiList = [];

const getApiList = async () => {
    const functionName = 'getApiList';
    log.info(functionName, 'fetch apiList from redis');
    const [error, result] = await safePromise(memoize(getApiLists)({
        useBase64: false,
        keyName: 'apiList'
    }, {
        Active: 1
    }));
    if (error) {
        log.error(functionName, 'error when fetching apiList', error);
        return false;
    }
    apiList = result;
    // FULL api Config
    log.info(functionName, 'fetch full apiList', apiList);
    return apiList;
}

const getAPIConfig = async (apiName) => {
    const functionName = 'getAPIConfig';
    if (!apiList.length) {
        await getApiList();
    }
    const apiConfigData = _.find(apiList, o => o && o.ApiName.toLowerCase() === apiName);
    log.info(functionName, `fetch apiConfig ${apiName}`, apiConfigData);
    return apiConfigData;
}


module.exports = { getApiList, getAPIConfig };