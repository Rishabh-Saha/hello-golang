const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const { constants } = require('../helper-functions/environmentFiles');
const CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
const log = createBunyanLogger('resetTokenValidity');
const { _ } = require('../helper-functions/require-helper');
const { setKey } = require('../../dal/dbhelpers/redis');
const CACHE_PREFIX = constants.CACHE_PREFIX;

const resetTokenValidity = async(data) => {
    const functionName = 'resetTokenValidity'
    log.info(functionName,'resetTokenValidity data', data);
    const prefix = 'clientAuth_';
    const key =  _.get(data, 'headers.ExternalClientID');
    const keyName = CACHE_PREFIX+prefix+key;

    return await setKey(keyName, data.token, CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL);
};

module.exports = resetTokenValidity;