var crypto = require('crypto');

module.exports =
    ({ string, secret, algorithm = "sha256", encoding = "base64", charset }) => 
        crypto
            .createHmac(algorithm, secret)
            .update(string, charset)
            .digest(encoding)