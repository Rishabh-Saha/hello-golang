
const removeUnnecessaryData = (data) => {
    let obj = Object.assign({}, data);
    delete obj.externalClient;
    delete obj.clientShelterCreds;
    delete obj.headers;
    delete obj.apiName;
    // obj.externalClient = {
    //     ExternalClientID: data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined
    // };
    // obj.ExternalClientID = obj.externalClient.ExternalClientID;
    return obj;
}

module.exports = removeUnnecessaryData;