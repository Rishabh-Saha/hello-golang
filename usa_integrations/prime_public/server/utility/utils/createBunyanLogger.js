const bunyan = require('bunyan');
const env = process.env.NODE_ENV;

/**
 * [createBunyanLogger creates a bunyan logger depending on env]
 * @param  {[String]} loggerName [Name of the logger]
 * @return {[Function]}          [bunyan logging function]
 */
module.exports = loggerName => {

    const streams = [{
        stream: process.stdout // log INFO and above to stdout 
    }];

    let bunyanConfig = {};
    switch (env) {
    case 'testing':
        bunyanConfig = {
            name: loggerName,
            streams: [],
            level: 'trace'
        };
        break;
    case 'production':
        bunyanConfig = {
            name: loggerName,
            streams: streams
        };
        break;
    default:
        bunyanConfig = {
            name: loggerName,
            level: 'trace'
        };
    }

    return bunyan.createLogger(bunyanConfig);
}