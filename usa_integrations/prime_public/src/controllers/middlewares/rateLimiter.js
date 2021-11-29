const {
    moment,
    redis,
    createBunyanLogger,
    rateLimiterConfig,
    datasource,
    constants,
    customCatchError
} = require('../../utils');
const redisConfig = datasource.redis;
const redisClient = redis.createClient(redisConfig);
const log = createBunyanLogger("rate-limiter");
const { getKey, setKey } = require('./../../dal/dbhelpers/redis');

module.exports = async (request, response, next) => {
    const {
        baseUrl,
        path,
        headers
    } = request;
    const ratelimiter = await rateLimiterFunc({
        baseUrl: baseUrl,
        path: path,
        headers: headers
    });

    if (!ratelimiter.success) {
        const formattedResponse = await customCatchError({errorCode:"API.LIMIT.429"});
        response.status(429).send(formattedResponse);
    } else {
        next();
    }
}

const rateLimiterFunc = async (data) => {
    const functionName = "rateLimiter";
    const requestObject = await getRequestParams(data);
    const clientApi = requestObject.clientApi;
    if (typeof requestObject.clientID === 'undefined' && requestObject.clientApi === 'undefined:/') {
        //GET - API health check by pass here, becouse of No client details found
        return {
            success: true
        };
    }
    let intervals;
    try {
        intervals = await getIntervalsConfig(requestObject.clientID, requestObject.apiName);
    } catch (e) {
        log.error(functionName, 'intervals not found', e);
        return {
            success: true
        };
    }
    const currentRequestTime = moment().unix();
    if (!redisClient) {
        log.error(functionName, "redisClient not found");
        return {
            success: true
        };
    }
    let isExitsData = await getKey(clientApi);
    if (!isExitsData) {
        //if no record found
        let newRecord = {
            requestTimeStamp: currentRequestTime,
            requestCount: 1,
        };
        try {
            let max_time = intervals.MAX_WINDOW;
            const setKeyOfRateLimiter = await setKey(clientApi, newRecord, max_time);

            if (setKeyOfRateLimiter) {
                log.info(functionName, "record created in redis", newRecord, {
                    "TTL": max_time
                });
            }
        } catch (error) {
            log.error(functionName, "error in set record", error);
        }
        return {
            success: true
        };
    } else {
        // if record is found, parse it's value and calculate number of requests users has made within the last window
        if (isExitsData.requestCount == intervals.MAX_REQUEST_COUNT) {
            let reqObj = {
                clientApi: clientApi,
                MAX_REQUEST_COUNT: intervals.MAX_REQUEST_COUNT,
                MAX_WINDOW: intervals.MAX_WINDOW
            }
            const limitexceeded = await exceededMaxRequests(reqObj);
            return limitexceeded;
        } else {
            try {
                let total_window = isExitsData.requestTimeStamp + intervals.MAX_WINDOW;
                let update_ttl = total_window - currentRequestTime;
                isExitsData.requestCount++;
                const setKeyOfRateLimiter = await setKey(clientApi, isExitsData, update_ttl);
                if (setKeyOfRateLimiter) {
                    log.info(functionName, "record created in redis", isExitsData, {
                        "TTL": update_ttl
                    });
                }
            } catch (error) {
                log.error(functionName, "error in set recod", error);
            }
        }
        return {
            success: true
        };
    }
}
const getRequestParams = (req) => {
    const clientID = req.headers["client-id"]; //fetching the client id
    let apiName = req.baseUrl + req.path.toString().substring(1, req.path.length);
    const clientApi = clientID + ":" + apiName; //data will be saved in redisClient in this format
    return {
        clientApi: clientApi,
        clientID: clientID,
        apiName: apiName,
    };
};

const getIntervalsConfig = (clientID, apiName) => {
    let MAX_REQUEST_COUNT;
    let MAX_WINDOW;
    //criteria for the client and api
    if (
        rateLimiterConfig &&
        rateLimiterConfig[clientID] && // client level
        rateLimiterConfig[clientID][apiName] && // client and api level
        rateLimiterConfig[clientID][apiName]["window"] // client and api level value fetching
    ) {
        MAX_WINDOW = rateLimiterConfig[clientID][apiName]["window"]; // getting the window value from client + api level
    } else if (
        rateLimiterConfig &&
        rateLimiterConfig[clientID] &&
        rateLimiterConfig[clientID].default &&
        rateLimiterConfig[clientID].default.window // if client exists but api doesn't in the config
    ) {
        MAX_WINDOW = rateLimiterConfig[clientID].default.window;
    } else {

        MAX_WINDOW = rateLimiterConfig.default.window; // setting the default value if client or api not found
    }

    if (
        rateLimiterConfig &&
        rateLimiterConfig[clientID] && // client level
        rateLimiterConfig[clientID][apiName] && // client and api level
        rateLimiterConfig[clientID][apiName]["hits"] // client and api level value fetching
    ) {
        MAX_REQUEST_COUNT = rateLimiterConfig[clientID][apiName]["hits"]; // getting the hits value from client + api level
    } else if (
        rateLimiterConfig &&
        rateLimiterConfig[clientID] &&
        rateLimiterConfig[clientID].default &&
        rateLimiterConfig[clientID].default.hits // if client exists but api doesn't in the config
    ) {
        MAX_REQUEST_COUNT = rateLimiterConfig[clientID].default.hits;
    } else {

        MAX_REQUEST_COUNT = rateLimiterConfig.default.hits; // setting the default value if client or api not found
    }
    return {
        MAX_WINDOW: MAX_WINDOW,
        MAX_REQUEST_COUNT: MAX_REQUEST_COUNT,
    };
};

const exceededMaxRequests = (req) => {
    const functionName = "rateLimiter.exceededMaxRequests";
    log.info(
        functionName,
        "limit exceeded",
        `${req.clientApi} has exceeded the ${req.MAX_REQUEST_COUNT} requests in ${req.MAX_WINDOW} seconds limit!`
    );
    if (constants.RATE_LIMITER_FLAG) {
        // Block here
        return {
            success: false,
            message: `You have exceeded the ${req.MAX_REQUEST_COUNT} requests in ${req.MAX_WINDOW} seconds limit!`
        };
    } else {
        // Move to the api call here
        return {
            success: true
        };
    }
};