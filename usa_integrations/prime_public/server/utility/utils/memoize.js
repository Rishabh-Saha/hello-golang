const requireHelper = require('../require-helper');
const log = requireHelper.createBunyanLogger('isWhiteListedIp');
const safePromise = require("./safePromise");
const HttpError = require("./HttpError");

const funcName = 'memoize';
const defaultCacheExpiry = requireHelper.constants.CACHE_CLEAR_INTERVAL.DEFAULT_CLIENT_TOKEN_TTL;
const CACHE_PREFIX = requireHelper.constants.CACHE_PREFIX;
const setCache = requireHelper.app.models.RedisCache.setExpKey;
const getCache = requireHelper.app.models.RedisCache.getKey;
const getCacheName = fn => (...parameters) => `${CACHE_PREFIX}${fn.name}_${Buffer.from(JSON.stringify(parameters)).toString('base64')}`;
const getErrorCacheObj = error => ({ ...error, isError: true });

const asyncCacheFnCall = fn => async (...parameters) => {
    const cacheName = getCacheName(fn)(...parameters);
    try {
        const output = await fn(...parameters);
        setCache(cacheName, output, defaultCacheExpiry, error => {
            log.errorInfo(funcName, `"${cacheName}" cache name saving failed!`, error)
        });
        return output;
    } catch (error) {
        setCache(cacheName, getErrorCacheObj(error), defaultCacheExpiry);
        throw error;
    }
}

module.exports = fn => async (...parameters) => {
    const fetchCache = async cacheKey => new Promise((resolve, reject) =>
        getCache(cacheKey, (error, response) => {
            return error ? reject(error) : resolve(response);
        })  
    )

    const cacheName = getCacheName(fn)(...parameters);
    const asyncCachedFn = asyncCacheFnCall(fn);
    
    const [fetchCacheError, fetchedCache] = await safePromise(fetchCache(cacheName));
    
    const cacheFetchingFailed = fetchCacheError || fetchedCache === null;
    if (cacheFetchingFailed) {
        fetchCacheError && log.errorInfo(funcName, `${cacheName} cache fetching error`, fetchCacheError);
        !fetchedCache && log.errorInfo(funcName, `${cacheName} cache not found`);
        const [error, output] = await safePromise(asyncCachedFn(...parameters));
        if (error) {
            setCache(cacheName, getErrorCacheObj(error), defaultCacheExpiry);
            throw error;
        }
        setCache(cacheName, output, defaultCacheExpiry);
        return output;
    }

    // lazy cache load commented
    // asyncCachedFn(...parameters)
    //     .catch(error => {
    //         log.errorInfo(funcName, 'saving cacheName failed for fn lazy caching', error)
    //     });
    
    if (fetchedCache.isError) {
        delete fetchedCache.isError;
        throw new HttpError(fetchedCache);
    }
    return fetchedCache;
}