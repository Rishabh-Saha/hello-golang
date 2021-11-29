/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var log = requireHelper.createBunyanLogger('CoreApi');
var disableAllMethods = requireHelper.disableAllMethods;
var _ = requireHelper._;
var aegisApiReq = requireHelper.aegisApiReq;
const utils = require('../../server/utility/utils');
const setHeader = utils.setHeader;

// function setHeader(data) {
//     let headers = {}
//     headers.externalclientid = data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined;
//     if(data.headerObj) {
// 	  data.headerObj.app ? headers.app = data.headerObj.app : null;
// 	  data.headerObj.authorization ? headers.authorization = data.headerObj.authorization : null;
// 	  data.headerObj.module ? headers.module = data.headerObj.module : null;
//     }
//     delete data.headerObj;
//     return headers;
// }

module.exports = function (Aegis) {

    Aegis.getActivationData = (data, _cb) => {
        const functionName = "Aegis.getActivationData";
        aegisApiReq.post({
            uri: 'SoldPlan/getActivatedPlanData',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName,'error from aegis',error);
                return _cb('Error in getActivationData!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.externalPlanCreation = (data, _cb) => {
        const functionName = 'Aegis.externalPlanCreation';
        aegisApiReq.post({
            uri: 'SoldPlan/externalPlanCreation',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in externalPlanCreation!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.getContractDetailsTapsafe = (data, _cb) => {
        const functionName = "Aegis.getContractDetailsTapsafe";
        aegisApiReq.post({
            uri: 'SoldPlan/getContractDetailsTapsafe',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in getContractDetailsTapsafe!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.cancelContract = (data, _cb) => {
        const functionName = "Aegis.cancelContract";
        aegisApiReq.post({
            uri: 'Plan/cancelPlanOrder',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in cancelContract!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.updateContractDetails = (data, _cb) => {
        const functionName = 'Aegis.updateContractDetails';
        aegisApiReq.post({
            uri: 'SoldPlan/updateContractDetails',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in updateContractDetails!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.updateSoldPlanDetails = (data, _cb) => {
        const functionName = 'Aegis.updateSoldPlanDetails';
        aegisApiReq.post({
            uri: 'SoldPlan/updateSoldPlanAttributes',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in updateSoldPlanDetails!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.rejectSoldPlan = (data, _cb) => {
        const functionName = 'Aegis.rejectSoldPlan';
        aegisApiReq.post({
            uri: 'SoldPlan/rejectSoldPlan',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in rejectSoldPlan!');
            } else {
                return _cb(null, body);
            }
        });
    }
    Aegis.activateSoldPlanByInvoice = (data, _cb) => {
        const functionName = 'Aegis.activateSoldPlanByInvoice';
        aegisApiReq.post({
            uri: 'SoldPlan/activateSoldPlanByInvoice',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in activateSoldPlanByInvoice!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.fetchDefaultCustomerForPlan = (data, _cb) => {
        const functionName = 'Aegis.fetchDefaultCustomerForPlan';
        aegisApiReq.post({
            uri: 'Plan/fetchDefaultCustomerForPlan',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in fetchDefaultCustomerForPlan!');
            } else {
                return _cb(null, body);
            }
        });
    };
    Aegis.getSoldPlanList = (data, _cb) => {
        const functionName = 'Aegis.getSoldPlanList';
        aegisApiReq.post({
            uri: 'SoldPlan/getSoldPlanList',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from aegis', error);
                return _cb('Error in getSoldPlanList!');
            } else {
                return _cb(null, body);
            }
        });
    };
};