'use strict';

const { expressRouter,
    sendFormattedResponse,
    customCatchError,
    createBunyanLogger,
    _,
    downStreamApiCallerFunction } = require('../../utils');
const log = createBunyanLogger('dmi');


expressRouter.route('/receiveOfferDetails').post(async(request, response) => {
    const functionName = 'receiveOfferDetails';
    try{
        const result = await downStreamApiCallerFunction(request.body);
        if (!result.success) {
            log.error(functionName, `error in response of ${functionName}`, result);
            response.send(await customCatchError(result));
        } else {
            log.info(functionName, `response of ${functionName}`, result);
            response.send(await sendFormattedResponse(result));
        }
    } catch(error){
        log.error(functionName, `error in response of ${functionName}`, error);
        response.send(await customCatchError(error));
    }
});


expressRouter.route('/receiveKYCDetails').post(async(request, response) => {
    const functionName = 'receiveKYCDetails';
    try{
        const result = await downStreamApiCallerFunction(request.body);
        if (!result.success) {
            log.error(functionName, `error in response of ${functionName}`, result);
            response.send(await customCatchError(result));
        } else {
            log.info(functionName, `response of ${functionName}`, result);
            response.send(await sendFormattedResponse(result));
        }
    } catch(error){
        log.error(functionName, `error in response of ${functionName}`, error);
        response.send(await customCatchError(error));
    }
});

expressRouter.route('/receiveEMandateDetails').post(async(request, response) => {
    const functionName = 'receiveEMandateDetails';
    try{
        const result = await downStreamApiCallerFunction(request.body);
        if (!result.success) {
            log.error(functionName, `error in response of ${functionName}`, result);
            response.send(await customCatchError(result));
        } else {
            log.info(functionName, `response of ${functionName}`, result);
            response.send(await sendFormattedResponse(result));
        }
    } catch(error){
        log.error(functionName, `error in response of ${functionName}`, error);
        response.send(await customCatchError(error));
    }
});


module.exports = expressRouter;