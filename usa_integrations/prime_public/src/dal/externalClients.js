const { read, execute } = require('./dbhelpers/mysql');
const tableName = 'external_clients';

const getExternalClients = async (whereCondition = {}, columns = "*") => {
    const result = await read(tableName, columns, whereCondition);
    return result;
};


const getTableDetails = async (query) => {
    return await execute(query)
}

module.exports = {
    getExternalClients,
    getTableDetails
}