const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('trace-log');

const addTrace = (data) => {
    log.info('trace-log','downstream request',data);
}
module.exports = addTrace;