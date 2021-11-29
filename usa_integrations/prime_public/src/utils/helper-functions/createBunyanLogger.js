const { httpContext, bunyan, env } = require('../helper-functions/require-helper');
const createBunyanLogger = (loggerName, skipContext) => {
    let bunyanConfig = {
        name: loggerName
    };
    
    let logger = bunyan.createLogger(bunyanConfig);
    if(env === 'test'){
        logger.level(bunyan.FATAL + 1);
    }
    
    const constructInformativeLog = (level) => {
        return (functionName, action, ...args) => {
            try {
                let errorType = "NA";
                if(level === 'error'){
                    if(args[0] instanceof Error){
                        errorType = 'tech';
                    }else{
                        errorType = 'business';
                    }
                }
                logger[level]({
                    apiHash: skipContext ? '' : httpContext.get('ApiHash'),
                    clientId: skipContext ? '' : httpContext.get('ClientID'),
                    apiName: skipContext ? '' : httpContext.get('ApiName'),
                    logType: level,
                    functionName,
                    action,
                    errorType,
                }, ...args);

            } catch (error) {
                logger.error('Error in fetching Api Hash');
                logger.error(error);
                logger[level](...args);
            }
        };
    };

    const logObj = {
        info: constructInformativeLog('info'),
        error: constructInformativeLog('error')
    };

    return logObj;

};

module.exports = createBunyanLogger;