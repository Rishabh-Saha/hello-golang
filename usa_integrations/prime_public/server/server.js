var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var dbenv = process.env.DB_ENV;
const helper = require('./utility/require-helper');
var log = helper.createBunyanLogger('Server')
const functionName = 'server.start';


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) throw err;
    if (dbenv == 'atlas') {
        log.information(functionName, 'database env', dbenv);
        var models = app.models();
        models.forEach(function (model) {
            if (model.getDataSource() && model.getDataSource().connector && model.getDataSource().connector.name && model.getDataSource().connector.name === 'mysql') {
                model.attachTo(app.dataSources.atlas);
            }
        });
    }
});
