const { httpContext, objectMapper } = require('../helper-functions/require-helper');
const { requestData, responseData } = require('../helper-functions/environmentFiles');
const createBunyanLogger = require('../../utils/helper-functions/createBunyanLogger');
const log = createBunyanLogger('modifyReqRes');

const modifyReqRes = (sendData,type, apiName, clientId)=>{
    const functionName = 'modifyReqRes';
    log.info(functionName, 'data sent in parameters', {sendData: sendData, type: type, apiName: apiName, clientId: clientId});
    let configData = {}
    if(type == "request"){
        configData = requestData
    }else{
        configData = responseData
    }

    if(configData[apiName] &&clientId){
        const transformationData = configData[apiName][clientId]; 
        if(transformationData && transformationData.keys){
            const modifcationKeys = transformationData.keys
            const result = objectMapper(sendData,modifcationKeys);
            return result;
        }
    }
    return sendData;
}

module.exports =  modifyReqRes