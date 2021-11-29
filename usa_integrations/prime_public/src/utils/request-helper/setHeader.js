const setHeader = (data) => {
    let headers = {}
    headers.externalclientid = data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined;
    if (data.headerObj && data.headerObj.app) {
        headers.app = data.headerObj.app;
    } else if (data.externalClient && data.externalClient.ConstantName) {
        headers.app = data.externalClient.ConstantName;
    } else if (data.app) {
        headers.app = data.app;
    } else {
        headers.app = 'PublicApi';
    }
    if(data.headerObj) {
        data.headerObj.authorization ? headers.authorization = data.headerObj.authorization : null;
        data.headerObj.module ? headers.module = data.headerObj.module : null;
        data.headerObj.source ? headers.source = data.headerObj.source : null;
    }
    delete data.headerObj;
    headers.clientName = data.externalClient && data.externalClient.ClientName ? data.externalClient.ClientName : null;
    headers.PartnerID = data.externalClient && data.externalClient.PartnerID ? data.externalClient.PartnerID : null;
    headers.IntegrationID = data.externalClient && data.externalClient.IntegrationID ? data.externalClient.IntegrationID : null;
    return headers;
};

module.exports = setHeader;