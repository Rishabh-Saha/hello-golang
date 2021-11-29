const { constants } = require('./environmentFiles');
const createBunyanLogger = require('./createBunyanLogger');
const safePromise = require('./safePromise');
const HttpError = require('../request-helper/httpError');
const { getKey, setKey } = require('../../dal/dbhelpers/redis')
const log = createBunyanLogger('memoize');

const funcName = 'memoize';
const defaultCacheExpiry = constants.CACHE_CLEAR_INTERVAL.DEFAULT_TTL;
const CACHE_PREFIX = constants.CACHE_PREFIX;

//const getCacheName = fn => (...parameters) => `${CACHE_PREFIX}${fn.name}_${Buffer.from(JSON.stringify(parameters)).toString('base64')}`;
const getCacheName = fn => (opts, ...parameters) => `${CACHE_PREFIX}${fn.name}_${opts.useBase64 ? Buffer.from(JSON.stringify(parameters)).toString("base64") : opts.keyName}`;

const asyncCacheFnCall = fn => async (opts, ...parameters) => {
    const cacheName = getCacheName(fn)(opts, ...parameters);
    const output = await fn(...parameters);
    setKey(cacheName, output, opts.ttl ? opts.ttl: defaultCacheExpiry);
    return output;
}

module.exports = fn => async (opts, ...parameters) => {
    log.info(funcName, "function name", fn.name);
    log.info(funcName, "options sent", opts);
    log.info(funcName, "parameters of function", ...parameters);
    // const fetchCache = async cacheKey => await safePromise(getKey(cacheKey));

    const cacheName = getCacheName(fn)(opts, ...parameters);
    log.info(funcName, "cacheName", cacheName);
    const asyncCachedFn = asyncCacheFnCall(fn);

    const [fetchCacheError, fetchedCache] = await safePromise(getKey(cacheName));
    log.info(funcName, "fetchedCache", fetchedCache);
    log.info(funcName, "fetchCacheError", fetchCacheError);

    const cacheFetchingFailed = fetchCacheError || fetchedCache === null;
    if (cacheFetchingFailed || opts.updateTTL) {
        fetchCacheError && log.error(funcName, `${cacheName} cache fetching error`, fetchCacheError);
        !fetchedCache && log.error(funcName, `${cacheName} cache not found`);
        const [error, output] = await safePromise(asyncCachedFn(opts, ...parameters));
        log.info(funcName, "output", output);

        if (error) {
            log.error(funcName, "error in asyncCachedFn", error);
            throw error;
        }
        return output;
    }

    // lazy cache load commented
    // asyncCachedFn(...parameters)
    //     .catch(error => {
    //         log.error(funcName, 'saving cacheName failed for fn lazy caching', error)
    //     });

    if (fetchedCache.isError) {
        delete fetchedCache.isError;
        throw new HttpError(fetchedCache);
    }
    return fetchedCache;
}