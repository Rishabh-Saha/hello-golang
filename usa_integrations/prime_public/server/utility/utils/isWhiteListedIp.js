const { createBunyanLogger, app } = require('../../../server/utility/require-helper');
const log = createBunyanLogger('isWhiteListedIp');
const safePromise = require("./safePromise");
const HttpError = require("./HttpError");

const isWhiteListedIP = async  ({
    ExternalClientID,
    IPAddress
}) => {
    const [apiFetchingError, apiFetched] = await safePromise(app.models.WhitelistedIP.findOne({
        fields: {
            WhitelistedIPID: true
        },
        where: {
            and:[{
                ExternalClientID,
            },{
                IPAddress,
            },{
                Active: true,
            },{
                Arhive: false,
            }]
        }
    }));
    if (apiFetchingError) {
        log.errorInfo('isWhiteListedIp', 'IP List search failed', apiFetchingError);
        throw apiFetchingError;
    }
    if (!apiFetched) {
        throw new HttpError({
            message: `${IPAddress} is not whitlisted for External Client ID ${ExternalClientID}`,
            errorCode: '401.IP',
            status: 401
        });
    }
    return true;
}

module.exports = isWhiteListedIP;