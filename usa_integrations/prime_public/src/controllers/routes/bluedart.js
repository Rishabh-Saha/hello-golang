'use strict';

const { expressRouter, _, createBunyanLogger, sendFormattedResponse, customCatchError } = require('../../utils');
const log = createBunyanLogger('bluedart');
const { uploadImagesToLogistics } = require('../../services');

expressRouter.route('/uploadFile').post(async (request, response) => {
    const data = request.body;
    const functionName = 'uploadFile';
    try {
        const result = await uploadImagesToLogistics(data);
        if (!result.success) {
            log.error(functionName, `error in response of ${functionName}`, result);
            response.status(result.status).send(await customCatchError(result));
        } else {
            log.info(functionName, `response of ${functionName}`, result);
            response.status(result.status).send(await sendFormattedResponse(result));
        }
    } catch (e) {
        log.error(functionName, `error in catch of ${functionName}`, e);
        response.status(500).send(
            await customCatchError({
                errorCode: "INTERNAL.SERVER.ERROR"
            })
        );
    }
});

module.exports = expressRouter;

