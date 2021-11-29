const { datasource } = require('../../utils/helper-functions/environmentFiles');
const primeConfig = datasource.mysql_prime;
const {
    // createConfiguration,
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection,
    initConnection
} = require('./package');

initConnection(primeConfig);

module.exports = {
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection
};
