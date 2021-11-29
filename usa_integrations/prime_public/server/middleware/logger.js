var env = process.env.NODE_ENV;
var app = require('../server');
const requireHelper = require('../utility/require-helper');
const log = requireHelper.createBunyanLogger('logger');
const LoopBackContext = requireHelper.LoopBackContext;
const uuid = requireHelper.uuid;
module.exports = function() {
    //To-DO Define 403 and 401 errors instead of 500
    var logError = new Error('Logging failed');
    return function(req, res, next) {
        const functionName = "request-logger";
        let body = JSON.parse(JSON.stringify(req.body));
        let ctxObj = LoopBackContext.getCurrentContext({
            bind: true
        });
        try {
            let apiID = req.headers.apihash || req.headers.apiID || uuid.v4();
            let clientID = req.headers['client-id'];
            const rp = req.path;
            let apiName = rp.substr(rp.lastIndexOf('/') + 1);
            let rpArr = rp.split('/');
            const modelName = rpArr[rpArr.length - 2];
            // var unAuthObj = _.cloneDeep(unAuth); //_.cloneDeep because _.assign mutates
            apiName = modelName + '/' + apiName;
            ctxObj.set('ApiHash', apiID);
            ctxObj.set('ClientID', clientID);
            ctxObj.set('ApiName',apiName);
            body = JSON.stringify(body);
        } catch (error) {
            log.errorInfo(functionName,'error in logger',error);
            log.errorInfo(functionName,'error in logger','Error in setting ApiHash or stringifying the request payload');
        }
        log.information(functionName,'request path',req.path)
        log.information(functionName,'request body send by client',req.body);
        next();
    }
}
