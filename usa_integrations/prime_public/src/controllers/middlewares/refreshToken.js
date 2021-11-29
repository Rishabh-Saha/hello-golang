const { constants, _, resetTokenValidity } = require('../../utils');
const OPEN_ROUTES = constants.OPEN_ROUTES;

module.exports = async (request, _response, next) => {
    const {
        headers: { "client-session-id": token },
    } = request;
    if (OPEN_ROUTES.TOKEN.indexOf(request.body['apiName']) > -1) {
        return next();
    }
    const resetTokenParams = {
        headers: {
            ExternalClientID: request.body.externalClient.ExternalClientID,
        },
        token,
    };
    await resetTokenValidity(resetTokenParams);
    next();
};
