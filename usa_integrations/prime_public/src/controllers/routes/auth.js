'use strict';

const { commonRouter,
    sendFormattedResponse,
    customCatchError,
    createBunyanLogger,
    _
} = require('../../utils');

const { generateToken } = require('./../../services');
const log = createBunyanLogger('auth-routes');

commonRouter.route('/generateToken').post(async (request, response) => {
    const functionName = 'POST-Auth/generateToken';
    try{
        const tokenResult = await generateToken(request.body);
        log.info(functionName, `response of ${functionName}`, tokenResult);
        return response.send(await sendFormattedResponse(tokenResult));
    } catch(error){
        log.error(functionName, `error in ${functionName}`, error);
        return response.send(await customCatchError(error));
    }
});

commonRouter.route('/getToken').get(async(request, response) => {
    const functionName = 'GET-Auth/generateToken';
    try{
        const tokenResult = await generateToken(request.body);
        log.info(functionName, `response of ${functionName}`, tokenResult);
        return response.send(await sendFormattedResponse(tokenResult));
    } catch(error){
        log.error(functionName, `error in ${functionName}`, error);
        return response.send(await customCatchError(error));
    }
});


module.exports = commonRouter;