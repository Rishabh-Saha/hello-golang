const generateHmac = require("./generateHmac");

const isValidHmac = ({ clientHmac, date, host, secret }) => {
    const string = `x-date: ${date}\nx-host: ${host}`;
    const generateHmacParams = { string, secret };
    const serverHmac = generateHmac(generateHmacParams);
    const isValidHmac = clientHmac === serverHmac;
    return isValidHmac;
}

module.exports = isValidHmac
