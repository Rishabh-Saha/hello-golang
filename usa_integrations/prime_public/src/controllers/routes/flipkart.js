'use strict';

const { expressRouter, _, downStreamApiCallerFunction, customCatchError } = require('../../utils');

expressRouter.route('/activate').post(async (request, response) => {
    try {
        const result = await flipkartApi(request);
        response.send(result);
    } catch (e) {
        const data = request.body;
        response.status(500).send(await customCatchError(data))
    }
});

expressRouter.route('/deactivate').post(async (request, response) => {
    try {
        const result = await flipkartApi(request);
        response.send(result);
    } catch (e) {
        const data = request.body;
        response.status(500).send(await customCatchError(data))
    }
})

expressRouter.route('/update').post(async (request, response) => {
    try {
        const result = await flipkartApi(request);
        response.send(result);
    } catch (e) {
        const data = request.body;
        response.status(500).send(await customCatchError(data))
    }
})

const flipkartApi = async (request) => {
    const data = request.body;
    if (request.headers && request.headers["fk-request-id"]) {
        data["fk-request-id"] = request.headers["fk-request-id"];
    }
    return new Promise(async (resolve, reject) => {
        try{
            const result = await downStreamApiCallerFunction(data);
            resolve(result);
        } catch(error){
            reject(error);
        }
    })
}

module.exports = expressRouter;