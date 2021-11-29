var env = process.env.NODE_ENV;
if (env === 'testing') {
    require('events').EventEmitter.prototype._maxListeners = 15;
}

const requireHelper = require('../utility/require-helper');
const log = requireHelper.createBunyanLogger('schema');

module.exports = function (server) {
    var app = server;
    var ds = app.dataSources.mysql;
     /*
		Discover db models from mysql tables
    */
    var discoverModelsWrapper = function (model) {
        const functionName = 'discoverModelsWrapper';
        ds.discoverAndBuildModels(model, {
            visited: {},
            associations: true
        }, function (err, models) {
            if (err) {
                log.errorInfo(functionName, 'error in discoverModelsWrapper',error);
            } else {
                for (var key in models) {
                    if (models.hasOwnProperty(key)) {
                            log.information(functionName, 'Key Name', key); 
                            log.information(functionName, 'result from database', JSON.stringify(models[key].definition.rawProperties));    
                    }
                }
            }
        });
    };

    var discoverMultipleModels = function (modelsArray) {
        modelsArray.forEach(function (model) {
            discoverModelsWrapper(model);
        });
    };

    // discoverMultipleModels([]);
};