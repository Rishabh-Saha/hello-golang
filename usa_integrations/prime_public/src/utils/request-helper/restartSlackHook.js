const { request } = require('../helper-functions/require-helper');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const functionName = 'restartSlackHook';
const log = createBunyanLogger('server.restart');

const restartSlackHook = (obj) => {
    request({
        url: obj.slackHook,
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
        },
        body: {
            text: '```' + JSON.stringify(obj.body) + '```'
        }
    }, function (err) {
        if (!err) {
            log.info(functionName, 'posted on slack', 'server restarted');
            return true;
        } else {
            log.error(functionName, 'unable to post on slack', err);
            return false;
        }
    });
}

module.exports = restartSlackHook;