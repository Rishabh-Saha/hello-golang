const { coreApiReq, webApiReq, aegisApiReq, partApiReq, logisticsApiReq, billingApiReq } = require('../helper-functions/environmentFiles');
const {  _ } = require('../helper-functions/require-helper');
const createBunyanLogger = require('../helper-functions/createBunyanLogger');
const setHeader = require('./setHeader');
const log = createBunyanLogger('downStreamApiCallerFunction');
const removeUnnecessaryData = require('../request-helper/removeUnnecessaryData');
const {getAPIConfig} = require('./../helper-functions/apilist');

const downStreamApiCallerFunction = async (data) => {
    const functionName = "downStreamApiCallerFunction";
    //Add validation to check if apiConfigData has all the values
    log.info(functionName,'ApiName',data.apiName);
    if(!data.apiName){
        return { success: false, message: "Something went wrong", data: {}, status: 500 }; 
    }
    const apiConfigData = await getAPIConfig(data.apiName.toLowerCase());
    log.info(functionName, 'apiConfigData', apiConfigData);
    if(!apiConfigData){
        log.error(functionName, `no api configuration found for this api`, data.apiName); 
        return { success: false, message: "Something went wrong", data: {}, status: 500 }; 
    }
    let requestCall;
    switch (apiConfigData.DownstreamModule) {
    case "CoreApi":
        requestCall = coreApiReq;
        break;
    case "WebApp":
        requestCall = webApiReq;
        break;
    case "Aegis":
        requestCall = aegisApiReq;
        break;
    case "Parts":
        requestCall = partApiReq;
        break;
    case "Logistics":
        requestCall = logisticsApiReq;
        break;
    case "Billing":
        requestCall = billingApiReq;
        break;
    default:
        requestCall = {};
    }
    if (_.isEmpty(requestCall)) {
        log.error(functionName, `error from downStreamApiCallerFunction`, 'no request call found'); 
        return { success: false, message: "Invalid REST action", data: {}, status: 404 };
    } else {
        return new Promise(async (resolve,reject)=>{
            const sendData = await removeUnnecessaryData(data);
            const sendHeaders = await setHeader(data);
            requestCall[apiConfigData.DownstreamMethod.toLowerCase()](
                {
                    uri: apiConfigData.DownstreamApiName,
                    json: sendData,
                    headers: sendHeaders,
                },
                function (error, response, body) {
                    if (error) {
                        log.error(apiConfigData.DownstreamApiName, `error from ${apiConfigData.DownstreamModule}`, error);
                        reject({ success: false, message: "Error occurred while fetching data", data: {}, status: 500});
                    } else if(!body) {
                        log.error(apiConfigData.DownstreamApiName, 'No body found', apiConfigData.DownstreamModule);
                        reject({ success: false, message: "Error occurred while fetching data", data: {}, status: 500 });
                    } else {
                        log.info(apiConfigData.DownstreamApiName, `result of ${apiConfigData.DownstreamModule}`, body);
                        if(!body.success && !body.status && response["statusCode"] === 200){
                            body.status = 400;
                        } else if(!body.success && !body.status && response["statusCode"] !== 200){
                            body.status = response["statusCode"];
                        } else if(body.success && !body.status){
                            body.status = 200;
                        }
                        
                        if(body.success && body.status != response["statusCode"]) {
                            log.info(functionName,`downstream HTTP code ${body.status} is different`, response["statusCode"]);
                        }
                        resolve(body);
                    }
                }
            );
        })
    }
};

module.exports = downStreamApiCallerFunction;