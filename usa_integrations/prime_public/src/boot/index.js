const 
    express = require('express'),
    bodyParser = require('body-parser');

//PM2 Error Logger
require('pmx').init({
    http: true
});
const { createBunyanLogger, constants, restartSlackHook, errorWrapper, Raven } = require('../utils');
const getBootDetails = require('./getBootDetails');
const log = createBunyanLogger('Server')
const env = process.env.NODE_ENV;
const functionName = 'server.start';
const serverName = process.env.SERVER_NAME || 'PublicApi Prime';
let { privateIp, INSTANCE_ID, currentTime, PORT } = getBootDetails();

// Create global app object
const app = express();
const PROCESS_EXIT_TIME = constants.PROCESS_EXIT_TIME;

let errorOfProdModules = null;
if (env === 'production') {
    try {
        require('./prodModules');
    } catch (e) {
        errorOfProdModules = e;
    }
}
if (errorOfProdModules) {
    log.error(functionName, 'errorOfProdModules', errorOfProdModules);
}

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('../controllers/routes/index'));

app.use(require('../controllers/middlewares/error-handler'));


if(process.env.TEST_PORT){
    PORT = process.env.TEST_PORT;
}
// finally, let's start our server...
var server = app.listen(PORT, function () {
    log.info(functionName, 'Listening on port ', server.address().port);
    log.info(functionName, 'server startup log', `server ${serverName} restarted at ${currentTime} |  PrivateIP: ${privateIp} | ProcessID: ${INSTANCE_ID}`);
    if (env && env === 'production') {
        var obj = {
            slackHook: constants.RESTART_SLACK_HOOK_URL,
            body: {
                ServerUpdate: serverName + ' Server (PrivateIP: ' + privateIp + ') | ProcessID: ' + INSTANCE_ID + ' REGION: ' + constants.REGION + ' Restarted At ' + currentTime
            }
        };
        restartSlackHook(obj);
    }
});


server.keepAliveTimeout = constants.SERVER_VARIABLES.keepAliveTimeout;
server.headersTimeout = constants.SERVER_VARIABLES.headersTimeout;

//error handlers
process
    .on('unhandledRejection', (err) => {
        log.error('unhandledRejection','reason for exiting the server',err);
        app.stop = (() => {
            log.error('unhandledRejection', 'server closed', errorWrapper("Http server closed"));
            server.close();
            setTimeout(() => {
                log.error('unhandledRejection', 'process exiting', errorWrapper("exiting process"));
                process.exit(1);
            }, PROCESS_EXIT_TIME)
        });
        app.stop();
    })
    .on('uncaughtException', err => {
        log.error('uncaughtException','uncaught exception',err);
    });


process.on('beforeExit', code => {
    // Can make asynchronous calls
    setTimeout(() => {
        log.error(functionName, 'process exit', errorWrapper(`Process will exit with code: ${code}`));
        process.exit(code)
    }, 1000)
});

module.exports = app;
