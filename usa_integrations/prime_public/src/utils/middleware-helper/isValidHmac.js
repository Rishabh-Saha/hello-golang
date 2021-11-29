const generateHmac = require('./generateHmac');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const log = createBunyanLogger('isValidHmac');

const isValidHmac = ({ clientHmac, date, host, secret }) => {
    const string = `x-date: ${date}\nx-host: ${host}`;
    const generateHmacParams = { string, secret };
    const serverHmac = generateHmac(generateHmacParams);
    log.info('isValidHmac','serverHmac & clientHmac',`HMAC generated ${serverHmac} while HMAC sent: ${clientHmac}`);
    const isValidHmac = clientHmac === serverHmac;
    return isValidHmac;
}

module.exports = isValidHmac
