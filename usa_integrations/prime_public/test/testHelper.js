const { _ } = require('../src/utils')
const app = require('../src/boot')
const clientID = 'ServifyTest';
const hmacSignature = 'q9Y3R2PIS8VV7dMaksasT8THUORK+2qZdWzLjP7wRFQ=';
const contentType = 'application/json';
const xDate = 'Sat, 21 Nov 2020 01:22:57 GMT';
const xHost = 'servify.com';

module.exports = {
    app,
    clientID, 
    hmacSignature,
    contentType, 
    xDate, 
    xHost,
    _
}

