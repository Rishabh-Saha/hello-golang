const { createBunyanLogger, expressRouter, sendFormattedResponse, customCatchError, errorWrapper } = require('../../utils');
const log = createBunyanLogger('internal-routes');
const { getAllCachedKeys, getCachedKeyValue, rebuildRoute, burstCache, deleteCacheList } = require('../../services/internal-routes');

expressRouter.get('/burstCache', async function (request, response) {
    const functionName = 'burstCache';
    try {
        const result = await burstCache(request.body);
        const message = "Deleted all keys successfully";
        response.status(200).send(await sendFormattedResponse({
            message,
            data: result
        }));
    } catch (error) {
        log.error(functionName, `error in ${functionName}`, error);
        response.status(500).send(await customCatchError({
            errorCode: "SM.WTR.500"
        }));
    }
});

expressRouter.post('/getAllCachedKeys', async function (request, response) {
    const functionName = "getAllCachedKeys";
    try {
        const result = await getAllCachedKeys(request.body);
        log.info(functionName, ' all cached keys ', result);
        const message = "All cached keys";
        response.status(200).send(await sendFormattedResponse({
            message,
            data: result
        }));
    } catch (error) {
        log.error(functionName, `error in ${functionName}`, error);
        response.status(500).send(await customCatchError({
            errorCode: "SM.WTR.500"
        }));
    }
});

expressRouter.post('/deleteCacheList', async function (request, response) {
    const functionName = "deleteCacheList";
    try {
        const result = await deleteCacheList(request.body);
        log.info(functionName, `result of ${functionName}`, result);
        if (!result.success) {
            return response.status(400).send(await customCatchError(result))
        }
        response.status(200).send(await sendFormattedResponse(result));
    } catch (error) {
        log.error(functionName, `error in ${functionName}`, errorWrapper(error));
        response.status(500).send(await customCatchError({
            errorCode: "SM.WTR.500"
        }));
    }
});

expressRouter.route('/rebuildRoute').get(async (request, response) => {
    const functionName = 'rebuildRoute';
    try {
        const routeResult = await rebuildRoute();
        log.info(functionName, 'route result', routeResult);
        response.status(200).send(await sendFormattedResponse({
            message: "Successfully rebuilt routes",
            data: {}
        }));
    } catch (error) {
        log.error(functionName, `error in ${functionName}`, error);
        response.status(500).send(await customCatchError({
            errorCode: "SM.WTR.500"
        }));
    }
});

expressRouter.route('/getCachedKeyValue').post(async (request, response) => {
    const functionName = "getCachedKeyValue";
    try {
        const keyName = request.body.keyName;
        const result = await getCachedKeyValue(request.body);
        if (!result.success) {
            log.error(functionName, 'other module keyname', keyName);
            return response.status(400).send(await customCatchError(result))
        }
        log.info(functionName, `key value for ${keyName}`, result);
        response.status(200).send(await sendFormattedResponse({
            message: result.message,
            data: result.data
        }));
    } catch (error) {
        log.error(functionName, `error in ${functionName}`, error);
        response.status(500).send(await customCatchError({
            errorCode: "SM.WTR.500"
        }));
    }
});

module.exports = expressRouter;