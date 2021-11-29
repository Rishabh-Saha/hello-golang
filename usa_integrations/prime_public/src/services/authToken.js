'use strict';
const { _, constants, moment, createBunyanLogger, uuid, safePromise, memoize } = require('./../utils');
const log = createBunyanLogger('generateToken');
const CACHE_CLEAR_INTERVAL = constants.CACHE_CLEAR_INTERVAL;
const { getKey } = require('./../dal/dbhelpers/redis')
const CACHE_PREFIX = constants.CACHE_PREFIX;

const generateToken = async (data) => {
    const functionName = 'generateToken';
    log.info(functionName, 'data', data);
    const clientId = _.get(data, 'externalClient.ExternalClientID');
    const [error, externalClientToken] = await safePromise(memoize(clientAuth)({
        useBase64: false,
        keyName: clientId,
        updateTTL: true,
        ttl: constants.CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL
    }, {
        keyName: clientId
    }));
    if (error) {
        log.error(functionName, `error in ${functionName}`, error);
        throw error;
    } else {
        log.info(functionName, `result of ${functionName}`, externalClientToken);
        return {
            token: externalClientToken,
            ttl: moment().unix() + (CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL)
        };
    }
}

module.exports = generateToken;

const clientAuth = async data => {
    const authKey = CACHE_PREFIX + "clientAuth_" + data.keyName;
    const token = uuid.v1();
    const oldToken = await getKey(authKey);
    if (oldToken) {
        return oldToken;
    } else {
        return token;
    }
}