const { getExternalClients, getExternalClientShelter, getClientWhitelistedApis, getClientWhitelistedIPs } = require('../../dal');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('getClientDetails');
const { _ } = require('../helper-functions/require-helper');
const functionName = 'getClientDetails';

const getClientDetails = async (clientName) => {
    log.info(functionName, 'clientName', clientName);

    let externalClientInfo = await getExternalClients({
        ClientName: clientName,
        Active: 1,
        Archived: 0
    }, 'ExternalClientID,IntegrationID,ReferenceID,ClientName,ConstantName,ClientSignature,ApiWhitelisting,PartnerID,SourceWhitelisting');
    externalClientInfo = externalClientInfo[0];

    if (!(externalClientInfo && externalClientInfo.ExternalClientID)) {
        throw new Error('No externalClient found');
    }

    const externalClientShelterAndCreds = await getExternalClientShelter(externalClientInfo.ExternalClientID);

    const external_client_shelter = {
        'IN': externalClientShelterAndCreds.find(e => e.ApiDirection === 'IN') || {},
        'OUT': externalClientShelterAndCreds.find(e => e.ApiDirection === 'OUT') || {}
    }

    let clientWhitelistedApis = {};
    if (externalClientInfo.ApiWhitelisting) {
        let clientWhitelistedApiList = await getClientWhitelistedApis(externalClientInfo.ExternalClientID);
        _.forEach(clientWhitelistedApiList, (o) => {
            clientWhitelistedApis[o.ApiName] = true;
        });
    }

    let clientWhitelistedIPs = {
        'ipv4': {},
        'range-v4': [],
        'ipv6': {},
        'range-v6': []
    };
    if (externalClientInfo.SourceWhitelisting) {
        let clientWhitelistedIPList = await getClientWhitelistedIPs({
            ExternalClientID: externalClientInfo.ExternalClientID,
            Active: 1,
            Archived: 0
        }, 'Address, AddressType');

        _.forEach(clientWhitelistedIPList, (o) => {
            switch (o.AddressType) {
            case 'ipv4':
                clientWhitelistedIPs['ipv4'][o.Address] = true;
                break;
            case 'range-v4':
                clientWhitelistedIPs['range-v4'].push(o.Address);
                break;
            case 'ipv6':
                clientWhitelistedIPs['ipv6'][o.Address] = true;
                break;
            case 'range-v6':
                clientWhitelistedIPs['range-v6'].push(o.Address);
                break;
            default:
                break;
            }
        });
    }
    log.info(functionName, "external_client_shelter", external_client_shelter);
    let returnObj = {
        ...externalClientInfo,
        ips: clientWhitelistedIPs,
        apis: clientWhitelistedApis,
        external_client_shelter
    };
    return returnObj;
};

module.exports = getClientDetails;
