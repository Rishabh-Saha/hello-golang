const requireHelper = require('./../utility/require-helper');
const log = requireHelper.createBunyanLogger('explorer');
module.exports = function mountLoopBackExplorer(server) {
    var explorer;
    const functionName = 'mountLoopBackExplorer';
    try {
        explorer = require('loopback-explorer');
    } catch (err) {
        // Print the message only when the app was started via `server.listen()`.
        // Do not print any message when the project is used as a component.
        server.once('started', function (baseUrl) {
            log.information(functionName,'run npm install',
                'Run `npm install loopback-explorer` to enable the LoopBack explorer'
            );
        });
        return;
    }

    var restApiRoot = server.get('restApiRoot');
    var explorerApp = explorer(server, {
        basePath: restApiRoot
    });
    if (process.env.NODE_ENV === 'production') {
        return;
    } else {
        server.use('/v1/explorer', explorerApp);
        server.once('started', function () {
            var baseUrl = server.get('url').replace(/\/$/, '');
            // express 4.x (loopback 2.x) uses `mountpath`
            // express 3.x (loopback 1.x) uses `route`
            var explorerPath = explorerApp.mountpath || explorerApp.route;
            log.information(functionName,'explorer url','Browse your REST API at %s%s', baseUrl, explorerPath);
        });
    }
};