/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var log = requireHelper.createBunyanLogger('Billing');
var billingApiReq = requireHelper.billingApiReq;
const utils = require('../../server/utility/utils');
const setHeader = utils.setHeader;
// function setHeader (data) {
//     let headers = {}
//     headers.externalclientid = data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined;
//     if(data.headerObj) {
//         data.headerObj.app ? headers.app = data.headerObj.app : null;
//         data.headerObj.authorization ? headers.authorization = data.headerObj.authorization : null;
//         data.headerObj.module ? headers.module = data.headerObj.module : null;
//     }
//     delete data.headerObj;
//     return headers;
// }

function removeUnnecessaryData (data) {
    let obj = Object.assign({},data);
    delete obj.externalClient;
    delete obj.clientShelterCreds;
    delete obj.headers;
    obj.externalClient = {
        ExternalClientID : data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined
    };
    return obj;
}

module.exports = function (Billing) {
    Billing.updateClaimExpenditure = (data, _cb) => {
        const functionName = "Billing.updateClaimExpenditure";
        var requestObj = {
            uri: 'ExternalThirdPartyCharges/addExternalCharges',
            json: removeUnnecessaryData(data),
            headers: setHeader(data)
        };
        log.information('updateClaimExpenditure','requestObj',JSON.stringify(requestObj));
        billingApiReq.post(requestObj,function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error in billing', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
};
