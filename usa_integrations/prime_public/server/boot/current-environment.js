var env = process.env.NODE_ENV;
const requireHelper = require('../utility/require-helper');
const log = requireHelper.createBunyanLogger('environment');


if (!env) {
    env = 'default';
}


module.exports = function (server) {
    var app = server;
    log.information("boot","current environment","The current environment of this application is - " + env);

};