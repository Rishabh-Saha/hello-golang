/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
const utils = require('../../server/utility/utils');
var log = requireHelper.createBunyanLogger('CoreApi');
var coreApiReq = requireHelper.coreApiReq;
const setHeader = utils.setHeader;
// function setHeader (data) {
//     let headers = {}
//     headers.externalclientid = data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined;
//     if (data.headerObj && data.headerObj.app) {
//         headers.app = data.headerObj.app;
//     } else if (data.externalClient && data.externalClient.ConstantName) {
//         headers.app = data.externalClient.ConstantName;
//     } else if (data.app) {
//         headers.app = data.app;
//     } else {
//         headers.app = 'PublicApi';
//     }  
//     if(data.headerObj) {
//         data.headerObj.authorization ? headers.authorization = data.headerObj.authorization : null;
//         data.headerObj.module ? headers.module = data.headerObj.module : null;
//         data.headerObj.source ? headers.source = data.headerObj.source : null;
//     }
//     headers.clientName = data.externalClient && data.externalClient.ClientName ? data.externalClient.ClientName : null;
//     delete data.headerObj;
//     return headers;
// }

function removeUnnecessaryData (data) {
    let obj = Object.assign({},data);
    delete obj.externalClient;
    delete obj.clientShelterCreds;
    delete obj.headers;
    delete obj.PartnerID;
    delete obj.IntegrationID;
    delete obj.LanguageCode;
    delete obj.apiName;
    return obj;
}
module.exports = function (CoreApi) {

    CoreApi.getDiagnosisConfig = (data, _cb) => {
        const functionName = 'CoreApi.getDiagnosisConfig';
        coreApiReq.get({
            uri: 'AppConfig/getDiagnosisConfig',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching diagnosis config data !');
            } else {
                return _cb(null, body);
            }
        });
    };
    
    CoreApi.addDiagnosisData = (data, _cb) => {
        const functionName = 'CoreApi.addDiagnosisData';
        coreApiReq.post({
            uri: 'Diagnosis/addDiagnosisData',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while pushing diagnosis data !');
            } else {
                return _cb(null, body);
            }
        });
    };
    
    CoreApi.getPriceEstimate = (data, _cb) => {
        const functionName = 'CoreApi.getPriceEstimate';
        coreApiReq.post({
            uri: 'TradeInRequest/getPriceEstimate',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };
  
    CoreApi.getQuote = (data, _cb) => {
        const functionName = 'CoreApi.getQuote';
        coreApiReq.post({
            uri: 'TradeInRequest/getQuote',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };
  
    CoreApi.processQuote = (data, _cb) => {
        const functionName = 'CoreApi.processQuote';
        coreApiReq.post({
            uri: 'TradeInRequest/processQuote',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getPartnerDeviceConditions = (data, _cb) => {
        const functionName = 'CoreApi.getPartnerDeviceConditions';
        coreApiReq.post({
            uri: 'TradeInRequest/getPartnerDeviceConditions',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getFunctionalConditions = (data, _cb) => {
        const functionName = 'CoreApi.getFunctionalConditions';
        coreApiReq.post({
            uri: 'TradeInRequest/getFunctionalConditions',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getBrandAndProductDetails = (data, _cb) => {
        const functionName = 'CoreApi.getBrandAndProductDetails';
        coreApiReq.post({
            uri: 'TradeInRequest/getBrandAndProductDetails',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getBrandsForTradeIn = (data, _cb) => {
        const functionName = 'CoreApi.getBrandsForTradeIn';
        coreApiReq.post({
            uri: 'TradeInRequest/getBrandsForTradeIn',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getProducts = (data, _cb) => {
        const functionName = 'CoreApi.getProducts';
        coreApiReq.post({
            uri: 'TradeInRequest/getProducts',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };
  

    CoreApi.getTradeInRequestDetails = (data, _cb) => {
        const functionName = 'CoreApi.getTradeInRequestDetails';
        coreApiReq.post({
            uri: 'v1/TradeIn/getDetailsForThirdParty', //'TradeInRequest/getTradeInRequestDetails',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.cancelTradeInRequest = (data, _cb) => {
        const functionName = 'CoreApi.cancelTradeInRequest';
        coreApiReq.post({
            uri: 'v1/TradeIn/cancelForThirdParty', //'TradeInRequest/cancelTradeInRequest',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            } else {
                return _cb(null, body);
            }
        });
    };

    CoreApi.getConsumerFromOpenID = (data,_cb) => {
        const functionName = "CoreApi.getConsumerFromOpenID";
        coreApiReq.post({
            uri: 'Consumer/getConsumerFromOpenID',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                log.information(functionName,'result from coreApi',body);
                return _cb(null, body);
            }
        })
    };

    CoreApi.requestOTP = (data,_cb) => {
        const functionName = "CoreApi.requestOTP";
        coreApiReq.post({
            uri: 'Consumer/requestOTP',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.verifyOtp = (data,_cb) => {
        const functionName = "CoreApi.verifyOtp";
        coreApiReq.post({
            uri: 'Otp/verifyOtp',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createOrUpdateExternalConsumer = (data,_cb) => {
        const functionName = "CoreApi.createOrUpdateExternalConsumer";
        coreApiReq.post({
            uri: 'Consumer/createOrUpdateExternalConsumer',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createOrUpdateExternalConsumerProduct = (data,_cb) => {
        const functionName = "CoreApi.createOrUpdateExternalConsumerProduct";
        coreApiReq.post({
            uri: 'ConsumerProduct/createOrUpdateExternalConsumerProduct',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.activateBenefits = (data,_cb) => {
        const functionName = "CoreApi.activateBenefits";
        coreApiReq.post({
            uri: 'ConsumerProduct/activateBenfits',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.fetchSlots = (data, _cb) => {
        const functionName = "CoreApi.fetchSlots";
        coreApiReq.post({
            uri: 'ConsumerServicerequest/fetchSlotsForExternalService',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        });
    };

    CoreApi.checkServiceAvailablity = (data, _cb) => {
        const functionName = 'CoreApi.checkServiceAvailablity';
        coreApiReq.post({
            uri: 'ConsumerServicerequest/checkServiceAvailablityForClient',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createServiceRequest = (data, _cb) => {
        const functionName = "CoreApi.createServiceRequest";
        coreApiReq.post({
            uri: 'ConsumerServicerequest/primeServiceRequest',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getClaimList = (data, _cb) => {
        const functionName = "CoreApi.getClaimList";
        coreApiReq.post({
            uri: 'Claim/getClaimList',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getClaimDetails = (data, _cb) => {
        const functionName = "CoreApi.getClaimDetails";
        coreApiReq.post({
            uri: 'Claim/getClaimDetails',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.updateClaimStatus = (data, _cb) => {
        const functionName = "CoreApi.updateClaimStatus";
        coreApiReq.post({
            uri: 'Claim/updateClaimStatus',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.updateClaimExpenditure = (data, _cb) => {
        const functionName = 'CoreApi.updateClaimExpenditure';
        coreApiReq.post({
            uri: 'APINAME',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.retailPlanSale = (data,_cb) => {
        const functionName = 'CoreApi.retailPlanSale';
        coreApiReq.post({
            uri: 'ConsumerProduct/retailPlanSale',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createConsumerProduct = (data,_cb) => {
        const functionName = 'CoreApi.createConsumerProduct';
        coreApiReq.post({
            uri: 'ConsumerProduct/addOrFetchDevice',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName, 'error from coreApi', error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getDevicePlansFromImei = (data,_cb) => {
        const functionName = 'CoreApi.getDevicePlansFromImei';
        coreApiReq.post({
            uri: 'ConsumerProduct/getDevicePlansFromImei',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.retailPlanPurchase = (data,_cb) => {
        const functionName = "CoreApi.retailPlanPurchase";
        coreApiReq.post({
            uri: 'ConsumerProduct/retailPlanPurchase',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createComplimentaryPlan = (data,_cb) => {
        const functionName = 'CoreApi.createComplimentaryPlan';
        coreApiReq.post({
            uri: 'ConsumerProduct/createComplimentaryPlan',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createVoucher = (data,_cb) => {
        const functionName = 'CoreApi.createVoucher'
        coreApiReq.post({
            uri: 'Voucher/createVouchers',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.fetchDetailsByPlan = (data,_cb) => {
        const functionName = 'CoreApi.fetchDetailsByPlan';
        coreApiReq.post({
            uri: 'ConsumerServiceRequest/fetchDetailsByPlan',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.trackContractTapsafe = (data,_cb) => {
        const functionName = 'CoreApi.trackContractTapsafe';
        coreApiReq.post({
            uri: 'ConsumerServicerequest/trackContractTapsafe',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName,'error from coreApie',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createContract = (data,_cb) => {
        const functionName = 'CoreApi.createContract';
        coreApiReq.post({
            uri: 'Consumer/createContract',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getPlanDetailsByMobileNumber = (data,_cb) => {
        const functionName = 'CoreApi.getPlanDetailsByMobileNumber';
        coreApiReq.post({
            uri: 'CarrierIntegration/getPlanDetailsByMobileNumber',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.captureVoucherSaleData = (data,_cb) => {
        const functionName = 'CoreApi.captureVoucherSaleData';
        coreApiReq.post({
            uri: 'Voucher/captureVoucherSaleData',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.checkAccountBalance = function (data, cb) {
        const functionName = "CoreApi.checkAccountBalance";
        coreApiReq.post({
            uri: 'PaytmPayment/checkAccountBalance',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName,'error from coreApi', error);
                return cb('Error occured while fetching data !');
            } else {
                return cb(null, body);
            }
        });
    };

    CoreApi.unlinkPaymentAccount = function (data, cb) {
        const functionName = 'CoreApi.unlinkPaymentAccount';
        coreApiReq.post({
            uri: 'PaytmPayment/unlinkAccount',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorinfo(functionName,'error from coreApi', error);
                return cb('Error occured while fetching data !');
            } else {
                return cb(null, body);
            }
        });
    };
    CoreApi.fetchDiagnosisResult = (data,_cb) => {
        const functionName = "CoreApi.fetchDiagnosisResult";
        coreApiReq.post({
            uri: 'Diagnosis/fetchDiagnosisResult',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
    
    CoreApi.checkWalletBalanceAndDebitAmount = function (data, cb) {
        const functionName = "CoreApi.checkWalletBalanceAndDebitAmount";
        coreApiReq.post({
            uri: 'PaytmPayment/checkWalletBalanceAndDebitAmount',
            json: data,
            headers: setHeader(data)
        }, function (error, response, body) {
            if (error) {
                log.errorInfo(functionName, 'error from coreApi', error);
                return cb('Error occured while fetching data !');
            } else {
                return cb(null, body);
            }
        });
    };

    CoreApi.checkICloudLockAndFakeIphone = (data,_cb) => {
        const functionName = "CoreApi.checkICloudLockAndFakeIphone";
        coreApiReq.post({
            uri: 'ConsumerProduct/checkICloudLockAndFakeIphone',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.updateServiceRequestStatus = (data, _cb) => {
        const functionName = 'CoreApi.updateServiceRequestStatus';
        coreApiReq.post({
            uri: 'ConsumerServiceRequest/updateServiceRequestStatus',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName, 'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                log.information(functionName, 'updateServiceRequestStatus body', body);
                return _cb(null, body);
            }
        });
    };

    CoreApi.getServiceRequestDetails = (data, _cb) => {
        const functionName = 'CoreApi.getServiceRequestDetails';
        coreApiReq.post({
            uri: 'ConsumerServiceRequest/getServiceRequestDetails',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                log.information(functionName, 'getServiceRequestDetails body', body);
                return _cb(null, body);
            }
        });
    };
    
    CoreApi.getServiceStatus = (data, cb) => {
        const functionName = 'CoreApi.getServiceStatus';
        coreApiReq.post({
            uri: 'WebApp/serviceStatus',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorinfo(functionName,'error from coreApi',error);
                return cb('Error occured while fetching data !');
            } else {
                log.information(functionName, 'getServiceStatus result', body);
                return cb(null, body);
            }
        })
    };

    CoreApi.getLogisticStatus = (data, cb) => {
        const functionName = "CoreApi.getLogisticStatus";
        coreApiReq.post({
            uri: 'WebApp/getLogisticStatus',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return cb('Error occured while fetching data !');
            } else {
                log.information(functionName,'result from coreApi',body);
                return cb(null, body);
            }
        })
    };

    CoreApi.checkSoldPlanEligibility = (data, _cb) => {
        let functionName = 'CoreApi.checkSoldPlanEligibility';
        coreApiReq.post({
            uri: 'ConsumerProduct/checkPlanEligibilityForThirdParty',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getClaimStatus = (data, _cb) => {
        let functionName = 'CoreApi.getClaimStatus';
        coreApiReq.post({
            uri: 'Prime/claimRequest',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
    CoreApi.getContractDetailsbyIMEI = (data, _cb) => {
        let functionName = 'CoreApi.getContractDetailsbyIMEI';
        coreApiReq.post({
            uri: 'ConsumerProduct/getWarrantyDetailsbyIMEI',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };


    CoreApi.getContractDetails = (data, _cb) => {
        let functionName = 'CoreApi.getContractDetails';
        coreApiReq.post({
            uri: 'Prime/planActivated',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
    CoreApi.getDiagnosisStatusList = (data, _cb) => {
        let functionName = 'CoreApi.getDiagnosisStatusList';
        coreApiReq.post({
            uri: 'Diagnosis/getDiagnosisStatusListGateway',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.getSoldContractDetails = (data, _cb) => {
        let functionName = 'CoreApi.getSoldContractDetails';
        coreApiReq.post({
            uri: 'Prime/planPurchased',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
    CoreApi.getDiagnosisDetails = (data, _cb) => {
        let functionName = 'CoreApi.getDiagnosisDetails';
        coreApiReq.post({
            uri: 'Diagnosis/getDiagnosisDetailsGateway',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };
    CoreApi.isServifyConsumer = (data, _cb) => {
        let functionName = 'CoreApi.isServifyConsumer';
        coreApiReq.post({
            uri: 'Prime/isServifyConsumer',
            json: data,
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

    CoreApi.createPublicSoldPlan = (data, _cb) => {
        let functionName = 'CoreApi.createPublicSoldPlan';
        coreApiReq.post({
            uri: 'ConsumerProduct/createPublicSoldPlan',
            json: removeUnnecessaryData(data),
            headers: setHeader(data)
        },function(error,response,body){
            if(error){
                log.errorInfo(functionName,'error from coreApi',error);
                return _cb('Error occured while fetching data !');
            }else{
                return _cb(null, body);
            }
        })
    };

};