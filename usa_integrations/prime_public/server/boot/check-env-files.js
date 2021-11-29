var env = process.env.NODE_ENV;

try {
    if (env && env!=='test') {
        const datasource = require('../datasources.' + env);
        const config = require('../config.' + env);
        const consumingApi = require('../utility/consuming-api.' + env);
        const externalApi = require('../utility/external-api.' + env);
        const moduleCreds = require('../credentials/module-creds.' + env);
        const primeCreds = require('../credentials/prime-creds.' + env);
        const webhookConfig = require('../config/webhook-config.' + env);
        const constants = require('../utility/constants.' + env + '.js');
    }
} catch (e) {
    throw new Error('One of the config file is missing for the env:', env);
}