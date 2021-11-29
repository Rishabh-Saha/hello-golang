const { getKey } = require('../../dal/dbhelpers/redis');
const { _ } = require('../helper-functions/require-helper');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('getClientToken');
const { constants } = require('../helper-functions/environmentFiles');
const CACHE_PREFIX = constants.CACHE_PREFIX;

const getClientToken = async (data) => {
    const prefix = "clientAuth_";
    const key = _.get(data, 'headers.ExternalClientID');
    const tokenKey = CACHE_PREFIX+prefix+key;
    log.info('getClientToken','send data', tokenKey);
    return await getKey(tokenKey);
};

module.exports = getClientToken;