'use strict';

const { commonRouter,
    sendFormattedResponse,
    customCatchError,
    createBunyanLogger,
    downStreamApiCallerFunction
} = require('../../utils');


const log = createBunyanLogger('common-routes');
const {getApiList} = require('./../../utils/');

const routing = async () => {
    const apiList = await getApiList();
    if (!apiList) {
        log.error('routing', 'error when fetching apiList', apiList);
        return false;
    }
    const commonApis = apiList.filter(o => o && o.RouteType === 'common');
    commonApis.map((value) => {
        const { ApiName, ApiMethod } = value;
        commonRouter[ApiMethod.toLowerCase()](ApiName, async (request, response) => {
            const functionName = ApiName;
            try{
                log.info(functionName, `input to ${functionName}`, request.body);
                const result = await downStreamApiCallerFunction(request.body);
                if (!result.success) {
                    log.error(functionName, `error in response of ${functionName}`, result);
                    response.status(result.status).send(await customCatchError(result));
                } else {
                    log.info(functionName, `response of ${functionName}`, result);
                    response.status(200).send(await sendFormattedResponse(result));
                }
            } catch(error){
                log.error(functionName, `error in common route ${functionName}`, error);
                response.status(500).send(await customCatchError({errorCode:'SM.WTR.500'}));
            }
        })
    });
    return true;
}

routing();

module.exports = commonRouter;
module.exports.routing = routing;