const moment = require("moment");
const redis = require("redis");
const requireHelper = require("../utility/require-helper");
const redisConfig = requireHelper.moduleCreds.redis;
const redisClient = redis.createClient(redisConfig);
const rateLimiterConfig = requireHelper.rateLimiterConfig;
const log = requireHelper.createBunyanLogger("rate-limiter");
const constant = requireHelper.constants;
const app = requireHelper.app;
const errorWrapper = requireHelper.errorWrapper;

module.exports = function () {
  return function rateLimiter(req, res, next) {
    const functionName = "rateLimiter";

    const requestObject = getRequestParams(req);
    const clientApi = requestObject.clientApi;
    if(typeof requestObject.clientID === 'undefined' && requestObject.clientApi === 'undefined:/'){
      //GET - API health check by pass here, becouse of No client details found
      return next();
    }
    let intervals;
    try {
      intervals = getIntervalsConfig(requestObject.clientID, requestObject.apiName);
    } catch (e) {
      log.information(functionName, 'intervals not found', e);
      return next();
    }

    const currentRequestTime = moment().unix();
    let rateLimiterData;

    if (!redisClient) {
      log.errorInfo(functionName, "redisClient not found", errorWrapper(redisClient));
      return next();
    }

    app.models.RedisCache.getKey(clientApi, (error, result) => {
      if (error) {
        log.errorInfo(functionName, "error in getting key from redis", errorWrapper(error));
        return next();
      }

      rateLimiterData = result;

      if (!rateLimiterData) {
        //if no record found
        let newRecord = {
          requestTimeStamp: currentRequestTime,
          requestCount: 1,
        };
        try {
          let max_time = intervals.MAX_WINDOW;
          app.models.RedisCache.setExpKey(clientApi, newRecord, max_time, function (error) {
            if (error) {
              log.errorInfo(functionName, "error in set record", error);
            } else {
              log.information(functionName, "record created in redis", newRecord,{"TTL":max_time});
            }
          });
        } catch (error) {
          log.errorInfo(functionName, "error in set record", error);
        }
        return next();
      } else {
        // if record is found, parse it's value and calculate number of requests users has made within the last window
        if (rateLimiterData.requestCount == intervals.MAX_REQUEST_COUNT) {
          let reqObj = {
            clientApi: clientApi,
            MAX_REQUEST_COUNT: intervals.MAX_REQUEST_COUNT,
            MAX_WINDOW: intervals.MAX_WINDOW
          }
          return exceededMaxRequests(reqObj, res, next);
        } else {
          try {
            let total_window = rateLimiterData.requestTimeStamp + intervals.MAX_WINDOW;
            let update_ttl = total_window - currentRequestTime;
            rateLimiterData.requestCount++;
            //rateLimiterData.requestTimeStamp = currentRequestTime;
            app.models.RedisCache.setExpKey(clientApi, rateLimiterData, update_ttl, function (error) {
              if (error) {
                log.errorInfo(functionName, "error in set record", errorWrapper(error));
              } else {
                log.information(functionName, "record created in redis", rateLimiterData,{"TTL":update_ttl});
              }
            })
          } catch (error) {
            log.errorInfo(functionName, "error in set recod", error);
          }
        }
        return next();
      }
    })
  }
}

const getRequestParams = (req) => {
  const clientID = req.headers["client-id"]; //fetching the client id
  const fullPathForApi = req.path; //fetching the full path from the db
  let apiName = fullPathForApi.substr(fullPathForApi.lastIndexOf("/") + 1);
  const fullPathForApiArray = fullPathForApi.split("/"); //creating array by splitting the path
  const modelName = fullPathForApiArray[fullPathForApiArray.length - 2];
  apiName = modelName + "/" + apiName;
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

const exceededMaxRequests = (req, res, next) => {
  const functionName = "rateLimiter.exceededMaxRequests";
  log.information(
    functionName,
    "limit exceeded",
    `${req.clientApi} has exceeded the ${req.MAX_REQUEST_COUNT} requests in ${req.MAX_WINDOW} seconds limit!`
  );
  if (constant.RATE_LIMITER_FLAG) {
    // Block here
    res.status(429).send({
      status: 429,
      success: false,
      message: `You have exceeded the ${req.MAX_REQUEST_COUNT} requests in ${req.MAX_WINDOW} seconds limit!`,
      data: {},
    });
  } else {
    // Move to the api call here
    return next();
  }
};