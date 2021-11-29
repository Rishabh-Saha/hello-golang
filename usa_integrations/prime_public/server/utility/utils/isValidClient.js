const requireHelper = require('../../../server/utility/require-helper');
const log = requireHelper.createBunyanLogger('isWhiteListedIp');
const safePromise = require("./safePromise");
const HttpError = require("./HttpError");

const isValidClient = async ClientName => {
    const [clientFetchingError, client] = await safePromise(requireHelper.app.models.ExternalClient.findOne({
        fields: {
            ClientName: true,
            ConstantName: true,
            PartnerID: true,
            ExternalClientID: true,
            IntegrationID: true,
            ClientSignature: true,
            SourceWhitelisting: true,
            ApiWhitelisting: true,
        },
        where: {
            and: [{
                ClientName,
            }, {
                Active: true,
            }, {
                Arhive: false,
            }]
        }
    }));
    
    if (clientFetchingError) {
        log.errorInfo('isValidClient', 'clientFetchingError', clientFetchingError);
        throw clientFetchingError;
    }
    
    if (!client) {
        throw new HttpError({
            message: `No active and unarchived ${ClientName} not found. Please check if registered`,
            errorCode: '403.Client',
            status: 403
        });
    }
    
    return client.__data;
}

module.exports = isValidClient;