const { crypto } = require('../helper-functions/require-helper');

module.exports =
    ({ string, secret, algorithm = "sha256", encoding = "base64", charset }) => 
        crypto
            .createHmac(algorithm, secret)
            .update(string, charset)
            .digest(encoding)