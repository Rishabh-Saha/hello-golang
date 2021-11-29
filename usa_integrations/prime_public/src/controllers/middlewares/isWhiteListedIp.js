const { customCatchError, createBunyanLogger, isIPRangeCheck } = require('../../utils');
const log = createBunyanLogger('isWhiteListedIp');

module.exports = async (request, response, next) => {
    const canSkipIpWhiteListing = request.body.externalClient.SourceWhitelisting === 0;

    if (canSkipIpWhiteListing) {
        return next();
    }
    const clientDetails = request.body.externalClient;
    const clientIPs = clientDetails.ips;

    let isIPAllowed = false;
    let ipType = null;

    if (clientIPs['ipv4'][request.clientIP]) {
        isIPAllowed = true;
        ipType = 'ipv4';
    }
    if (clientIPs['range-v4'].length && !isIPAllowed) {
        isIPAllowed = isIPRangeCheck(request.clientIP, clientIPs['range-v4']);
        ipType = isIPAllowed ? 'range-v4' : null;
    }
    if (clientIPs['ipv6'][request.clientIP] && !isIPAllowed) {
        isIPAllowed = true;
        ipType = 'ipv6';
    }
    if (clientIPs['range-v6'].length && !isIPAllowed) {
        isIPAllowed = isIPRangeCheck(request.clientIP, clientIPs['range-v6'])
        ipType = isIPAllowed ? 'range-v6' : null;
    }

    if (isIPAllowed) {
        log.info('isWhiteListedIP', `${request.clientIP} is whitelisted, it's type is`, ipType);
        return next();
    }
    else {
        log.error('isWhiteListedIP', 'whiteListedIpError', `${request.clientIP} isn't whitelisted for ${clientDetails.ClientName}`);
        //reference_id currently applicable only for flipkart
        const reference_id = request.body && request.body.reference_id ? request.body.reference_id : null;
        const formattedResponse = await customCatchError({errorCode:"IP.INVALID.401",reference_id:reference_id});

        return response
            .status(401)
            .send(formattedResponse);
    }
};