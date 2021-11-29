const { createBunyanLogger, constants, _ } = require('../utils');
const { keys, getKey, deleteKey } = require('../dal/dbhelpers/redis');
const { routing } = require('../controllers/routes/common-routes')
const log = createBunyanLogger('internal-routes');

const getAllCachedKeys = async (data) => {
    let moduleName = '';
    switch (data.moduleName) {
    case 'IntegrationAPI':
        moduleName = constants.INTEGRATION_CACHE_PREFIX;
        break;
    case 'MasterAPI':
        moduleName = constants.MASTER_CACHE_PREFIX;
        break;
    default:
        moduleName = constants.CACHE_PREFIX;
        break;
    }

    const result = await keys(moduleName + '*');
    return result;

}

const getCachedKeyValue = async (data) => {
    const keyName = data.keyName;
    if (!keyName) {
        return {
            success: false,
            message: 'Please send a valid key'
        };
    }

    const exists = _.find(constants.KEYS_ALLOWED_TO_BE_FETCHED, o => {
        return keyName.includes(o);
    });

    if (!exists) {
        return {
            success: false,
            message: 'Please send a permissible key'
        };
    }

    const result = await getKey(keyName);

    return {
        success: true,
        message: "Value for the required cached key",
        data: result
    }
}

const rebuildRoute = async () => {
    const functionName = 'rebuildRoute';
    const deleteCacheListResult = await deleteCacheList({ cacheList: ['getApiLists_apiList'] });
    log.info(functionName, 'result of deleteCacheList', deleteCacheListResult);
    const routeResult = await routing();
    return routeResult;
}

const burstCache = async () => {
    const functionName = "burstCache";
    const result = await keys(constants.CACHE_PREFIX + '*');
    log.info(functionName, 'all keys to be deleted', result);
    result.forEach(async (eachKey) => {
        await deleteKey(eachKey);
    });
    return result;
}

const deleteCacheList = async (data) => {
    const functionName = "deleteCacheList";

    if (!data.cacheList) {
        log.error(functionName, 'error in deleteCacheList', 'Insufficient parameteres');
        return {
            success: false,
            message: "Insufficient parameteres"
        };
    }

    if (!_.isArray(data.cacheList) || !data.cacheList.length) {
        return {
            success: false,
            message: "Invalid cache list"
        };
    }

    const cacheKeyArray = data.cacheList;
    let keysNotDeleted = [];
    let keysDeleted = [];
    let modulePrefix = '';

    switch (data.moduleName) {
        case 'IntegrationAPI':
            modulePrefix = constants.INTEGRATION_CACHE_PREFIX;
            break;
        case 'MasterAPI':
            modulePrefix = constants.MASTER_CACHE_PREFIX;
            break;
        default:
            modulePrefix = constants.CACHE_PREFIX;
            break;
    }

    const deleteEachKey = async (eachKey) => {
        let keyName = modulePrefix + eachKey;
        log.info(functionName, 'key to be deleted', keyName);
        let deleteKeys = await deleteKey(keyName);
        if (!deleteKeys) {
            log.error(functionName, `could not delete the key ${modulePrefix + eachKey}`, deleteKeys);
            keysNotDeleted.push(eachKey);
        } else {
            keysDeleted.push(eachKey);
            log.info(functionName, `deleted the key ${modulePrefix + eachKey}`, deleteKeys);
        }
        return;
    };

    const promises = cacheKeyArray.map(deleteEachKey);
    await Promise.all(promises);

    let message = "Keys have been deleted";
    let status = true;

    if (keysNotDeleted.length === cacheKeyArray.length) {
        message = "Could not delete the keys in the list";
        status = false;
    }

    return {
        success: status,
        message: message,
        data: {
            keysDeleted: keysDeleted,
            keysNotDeleted: keysNotDeleted
        }
    };
}

module.exports = {
    getAllCachedKeys,
    getCachedKeyValue,
    rebuildRoute,
    burstCache,
    deleteCacheList
}