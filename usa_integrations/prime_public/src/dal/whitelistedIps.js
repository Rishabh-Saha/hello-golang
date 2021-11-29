const { read } = require('./dbhelpers/mysql');
const tableName = 'whitelisted_ips';

const getClientWhitelistedIPs = async (whereCondition = {}, columns = "*") => {
    const result = await read(tableName, columns, whereCondition);
    return result;
};




module.exports = {
    getClientWhitelistedIPs
}