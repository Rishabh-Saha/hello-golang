const { read } = require('./dbhelpers/mysql');
const tableName = 'api_list';

const getApiLists = async (whereCondition = {}, columns = "*") => {
    const result = await read(tableName, columns, whereCondition);
    return result;
};



module.exports = {
    getApiLists
}