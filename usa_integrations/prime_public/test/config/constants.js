const constants = require('../../src/config/constants');
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('Constants', function(){

    it('checking if constants exist', function(){
        assert.exists(constants.DEFAULT_LANGUAGE_CODE, 'Default Language exists');
        assert.exists(constants.CACHE_PREFIX, 'Cache Prefix exists'); 
        assert.exists(constants.MASTER_CACHE_PREFIX, 'Master Cache Prefix exists');
        assert.exists(constants.INTEGRATION_CACHE_PREFIX, 'Integration Cache Prefix exists'); 
        assert.exists(constants.HMAC_DATE_FORMAT, 'HMAC date format exists'); 
        assert.exists(constants.CACHE_CLEAR_INTERVAL, 'cache clear interval exists'); 
        assert.exists(constants.OPEN_ROUTES, 'open routes exists'); 
        assert.exists(constants.RESPONSE_HANDLER, 'response handler exists'); 
        assert.exists(constants.HMAC_THRESHOLD, 'HMAC threshold exists'); 
        assert.exists(constants.SERVER_VARIABLES, 'Server Variable exists');
        assert.exists(constants.PROCESS_EXIT_TIME, 'Process Exit Time exists'); 
        assert.exists(constants.RATE_LIMITER_FLAG, 'Rate Limiter Flag exists');
        assert.exists(constants.INVENTORY_MANAGEMENT_ACTIONS,'Inventory Management Actions exist');
        assert.exists(constants.RESTART_SLACK_HOOK_URL,'Restart Slack Hook');
        assert.exists(constants.FLIPKART_ERROR_CODE, 'flipkart error code exists');
        assert.exists(constants.SHELTER_ALGO, 'shelter algo exists');
        assert.exists(constants.RESPONSE_MESSAGES, 'Response messages exists');
        assert.exists(constants.FLIPKART_MESSAGES, 'Flipkart messages exists');
        assert.exists(constants.PORT, 'Port number exists');
        assert.exists(constants.KEYS_ALLOWED_TO_BE_FETCHED, 'Keys to be fetched exists');
        assert.exists(constants.HMAC_EXCEPTION_CLIENTS, 'HMAC Exception Clients exists');
    })

    it('checking data type of constants',function(){
        assert.typeOf(constants.DEFAULT_LANGUAGE_CODE, 'string', 'DEFAULT_LANGUAGE_CODE is a string');
        assert.typeOf(constants.CACHE_PREFIX, 'string', 'CACHE_PREFIX is a string'); 
        assert.typeOf(constants.MASTER_CACHE_PREFIX, 'string', 'MASTER_CACHE_PREFIX is a string');
        assert.typeOf(constants.INTEGRATION_CACHE_PREFIX, 'string', 'INTEGRATION_CACHE_PREFIX is a string'); 
        assert.typeOf(constants.HMAC_DATE_FORMAT, 'string' ,'HMAC_DATE_FORMAT is a string'); 
        assert.typeOf(constants.CACHE_CLEAR_INTERVAL,'object','CACHE_CLEAR_INTERVAL is a object'); 
        assert.typeOf(constants.OPEN_ROUTES, 'object', 'OPEN_ROUTES is a object'); 
        assert.typeOf(constants.RESPONSE_HANDLER, 'array', 'RESPONSE_HANDLER is a array'); 
        assert.typeOf(constants.HMAC_THRESHOLD,'number','HMAC_THRESHOLD is a number'); 
        assert.typeOf(constants.SERVER_VARIABLES,'object' ,'SERVER_VARIABLE is a object');
        assert.typeOf(constants.PROCESS_EXIT_TIME,'number', 'PROCESS_EXIT_TIME is a number'); 
        assert.typeOf(constants.RATE_LIMITER_FLAG,'boolean', 'RATE_LIMITER_FLAG is a boolean');
        assert.typeOf(constants.INVENTORY_MANAGEMENT_ACTIONS,'object', 'INVENTORY_MANAGEMENT_ACTIONS is a object');
        assert.typeOf(constants.RESTART_SLACK_HOOK_URL,'string', 'RESTART_SLACK_HOOK_URL is a string');
        assert.typeOf(constants.FLIPKART_ERROR_CODE,'object', 'FLIPKART_ERROR_CODE is a object');
        assert.typeOf(constants.SHELTER_ALGO,'object', 'SHELTER_ALGO is a object');
        assert.typeOf(constants.RESPONSE_MESSAGES,'object', 'RESPONSE_MESSAGE is a object');
        assert.typeOf(constants.FLIPKART_MESSAGES,'object', 'FLIPKART_MESSAGES is a object');
        assert.typeOf(constants.PORT,'number', 'PORT is a number');
        assert.typeOf(constants.KEYS_ALLOWED_TO_BE_FETCHED,'array', 'KEYS_ALLOWED_TO_BE_FETCHED is a array');
        assert.typeOf(constants.HMAC_EXCEPTION_CLIENTS,'object', 'HMAC_EXCEPTION_CLIENTS is a object');
    })

})

