const { createBunyanLogger, expressRouter } = require('../../utils');
const log = createBunyanLogger('internal-routes');

expressRouter.get('/', async function (req, res) {
    const functionName = "external-client";
    const {
        body: {
            externalClient: {
                ClientName,
                ConstantName,
                PartnerID,
                ExternalClientID,
                IntegrationID,
            },
        },
    } = req;
    const data = {
        ClientName,
        ConstantName,
        PartnerID,
        ExternalClientID,
        IntegrationID,
    };
    const success = true;
    const message = "Client details fetched successfully";
    log.info(functionName, `result of ${functionName}`, {success,message,data});
    res.status(200).send({
        success,
        message,
        data
    });
});

module.exports = expressRouter;