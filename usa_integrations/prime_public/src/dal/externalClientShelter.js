const { execute } = require('./dbhelpers/mysql');

const getExternalClientShelter = async (clientID) => {
    const sqlQuery = `SELECT ecs.ShelterAlgoID, ecs.ApiDirection, ecsc.ParamName, ecsc.ParamValue, ecsc.ParamType, ecsc.KeyType
        FROM external_client_shelter AS ecs
        LEFT JOIN external_client_shelter_creds AS ecsc ON ecsc.ExternalClientShelterID = ecs.ExternalClientShelterID and ecsc.Active = 1
        WHERE ecs.ExternalClientID = ${clientID} AND ecs.Active = 1;`
    return await execute(sqlQuery);

};




module.exports = {
    getExternalClientShelter
}