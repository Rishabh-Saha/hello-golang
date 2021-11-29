const { getApiLists } = require('./apiList');
const { getClientWhitelistedApis } = require('./clientWhitelistedApis');
const { getExternalClients, getTableDetails } = require('./externalClients');
const { getExternalClientShelter } = require('./externalClientShelter');
const { getShelterAlgos } = require('./shelterAlgos');
const { getWhitelistedIps, getClientWhitelistedIPs } = require('./whitelistedIps');
const { getAllShelterAlgos } = require('./shelterAlgos');

module.exports = {
    getApiLists,
    getClientWhitelistedApis,
    getExternalClients,
    getExternalClientShelter,
    getShelterAlgos,
    getWhitelistedIps, 
    getTableDetails,
    getAllShelterAlgos,
    getClientWhitelistedIPs
}