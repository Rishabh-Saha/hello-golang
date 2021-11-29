/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var log = requireHelper.createBunyanLogger('WebApp');
var webApiReq = requireHelper.webApiReq;
var utils = require('./../../server/utility/utils');
var removeUnnecessaryData = utils.removeUnnecessaryData;
var setHeader = utils.setHeader;

module.exports = function (WebApp) {
    WebApp.getUrlWithTokenAndParams = (data, _cb) => {
        const functionName = "WebApp.getUrlWithTokenAndParams";
        var requestObj = {
            uri: 'ExternalClient/getUrlWithTokenAndParams',
            json: removeUnnecessaryData(data),
            headers: setHeader(data)
        };
        log.information(functionName,'request object of getUrlWithTokenAndParams',JSON.stringify(requestObj));
        webApiReq.post(requestObj,function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from webApp',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
};
