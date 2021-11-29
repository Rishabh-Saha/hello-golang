const { execute } = require('./dbhelpers/mysql');

const getClientWhitelistedApis = async (clientID) => {
    const sqlQuery = `SELECT apl.ApiName FROM client_whitelisted_apis as cwa
    inner join api_list as apl on apl.ApiId = cwa.ApiId
    Where cwa.ExternalClientID = ${ clientID };`
    return await execute(sqlQuery);
};




module.exports = {
    getClientWhitelistedApis
}