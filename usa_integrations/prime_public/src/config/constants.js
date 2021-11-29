const DEFAULT_LANGUAGE_CODE = 'en';
const CACHE_PREFIX = 'public_';
const MASTER_CACHE_PREFIX = 'master_';
const INTEGRATION_CACHE_PREFIX = 'integration:';

const HMAC_DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss';

const CACHE_CLEAR_INTERVAL = {
    DEFAULT_CLIENT_TOKEN_TTL: 60 /*seconds*/ * 15 /*minutes*/,
    DEFAULT_TTL: -1
};

const OPEN_ROUTES = {
    TOKEN: ['/', '/external-client','/Auth/generateToken','/Auth/getToken']
};

const RESPONSE_HANDLER = ["SAMSUNG_STAG", "SAMSUNG_SF_STAG"];
const HMAC_THRESHOLD = 7200; //in seconds

const SERVER_VARIABLES = {
    keepAliveTimeout: 0, // value in ms
    headersTimeout: 125000 // value in ms
}

const PROCESS_EXIT_TIME = 10000;
const RATE_LIMITER_FLAG = false;

const FUTURE_DATE_HMAC_THRESHOLD = 120; // in seconds

const INVENTORY_MANAGEMENT_ACTIONS = {
    STO_AUDIT: 'STO_AUDIT',
    STO_DELIVERY: 'STO_DELIVERY',
    PO_AUDIT_AND_INVOICE: 'PO_AUDIT_AND_INVOICE',
    PO_INVOICE: 'PO_INVOICE',
    PO_AUDIT: 'PO_AUDIT',
    PO_DELIVERY: 'PO_DELIVERY',
    RO_AUDIT: 'RO_AUDIT',
    RO_RECEIVED: 'RO_RECEIVED',
    CREATE_PARTS: 'CREATE_PARTS',
    RO_RECEIVED_WITHOUT_SHIPMENT_DETAILS: 'RO_RECEIVED_WITHOUT_SHIPMENT_DETAILS'
};

const RESTART_SLACK_HOOK_URL = 'https://hooks.slack.com/services/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';

const FLIPKART_ERROR_CODE = {
    '/flipkart/activate': 'ACTIVATION_FAILED',
    '/flipkart/deactivate': 'DEACTIVATION_FAILED',
    '/flipkart/update': 'EDIT_FAILED'
}

const SHELTER_ALGO = {
    "1" :{
        ShelterAlgoID: '1',
        ConstantName: 'RSA',
        Active: 1
    },
    "2":{
        ShelterAlgoID: '2',
        ConstantName: 'AES-256-GCM',
        Active: 1
    },
    "3":{
        ShelterAlgoID: '3',
        ConstantName: 'NO-ENCRYPTION',
        Active: 1
    }
}

const RESPONSE_MESSAGES = {
    'SM.WTR.001': {
        status: 400,
        message: 'Something went wrong'
    },
    'CLIENT.INVALID.401': {
        status: 401,
        message: 'Invalid credentials'
    },     
    'HMAC.INVALID.401': {
        status: 401,
        message: 'Invalid credentials'
    },
    'DATA.BAD_REQUEST.400': {
        status: 400,
        message: 'Bad request'
    },  
    'PUBLIC_KEY.INVALID.401': {
        status: 401,
        message: 'Invalid client public key'
    },
    'DECRYPTION.ERROR.401': {
        status: 401,
        message: 'Invalid credentials'
    },
    'IP.INVALID.401': {
        status: 401,
        message: 'Invalid credentials'
    },
    'API.INVALID.401': {
        status: 401,
        message: 'Invalid credentials'
    },
    'TOK.EXP.401': {
        status: 401,
        message: 'Token is either invalid or expired, please generate again!'
    },
    'API.LIMIT.429': {
        status: 429,
        message: 'You have exceeded the number of requests'
    },
    'SM.WTR.500': {
        status: 500,
        message: 'Internal server error'
    }
}

const FLIPKART_MESSAGES = {
    'IP.INVALID.401': {
        code: 'REQUEST_ERROR',
        message: 'IP is not whitelisted with Servify, please contact Servify.'
    },
    'NO_SECRET_CODE': {
        code: 'REQUEST_ERROR',
        message: 'Something went wrong'
    },
    'AUTHORIZATION_FAILED': {
        code: 'AUTHORIZATION_FAILED',
        message: 'No authorization token key sent'
    },
    'MISMATCH_CODE': {
        code: 'AUTHORIZATION_FAILED',
        message: 'Not authorized'
    },
    'INTERNAL.SERVER.ERROR': {
        code: 'REQUEST_ERROR',
        message: 'Internal server error'
    }
}

const BLUEDART_MESSAGES = {
    'NO_LICENSE_KEY': {
        status: 401,
        code: 'REQUEST_ERROR',
        message: 'Something went wrong'
    },
    'MISMATCH_CODE': {
        status: 401,
        code: 'AUTHORIZATION_FAILED',
        message: 'Not authorized'
    },
    'INTERNAL.SERVER.ERROR': {
        status: 500,
        code: 'REQUEST_ERROR',
        message: 'Internal server error'
    }
}
const SENTRY_DSN = "https://0dbafe70c95f49209105b941a42efcd8@o117067.ingest.sentry.io/5823394";
const SENTRY_ENV = 'production';
const REGION = 'default';


/* ===================================== ENV constant add here ================= */
const PORT = 8063;
const KEYS_ALLOWED_TO_BE_FETCHED = [
    "public_getClientDetails",
    "public_getApiLists_apiList"
];
const HMAC_EXCEPTION_CLIENTS = {
    "ServifyTest" : true,
    "ServifyTest_Encrypt" : true,
    "DMI" : true
}



/* ===================================== Constant exports here ================= */
exports.HMAC_DATE_FORMAT = HMAC_DATE_FORMAT;
exports.CACHE_PREFIX = CACHE_PREFIX;
exports.OPEN_ROUTES = OPEN_ROUTES;
exports.CACHE_CLEAR_INTERVAL = CACHE_CLEAR_INTERVAL;
exports.DEFAULT_LANGUAGE_CODE = DEFAULT_LANGUAGE_CODE;
exports.RESPONSE_HANDLER = RESPONSE_HANDLER;
exports.HMAC_THRESHOLD = HMAC_THRESHOLD;
exports.SERVER_VARIABLES = SERVER_VARIABLES;
exports.PROCESS_EXIT_TIME = PROCESS_EXIT_TIME;
exports.RATE_LIMITER_FLAG = RATE_LIMITER_FLAG;
exports.MASTER_CACHE_PREFIX = MASTER_CACHE_PREFIX;
exports.FUTURE_DATE_HMAC_THRESHOLD = FUTURE_DATE_HMAC_THRESHOLD;
exports.SHELTER_ALGO = SHELTER_ALGO;
exports.INVENTORY_MANAGEMENT_ACTIONS = INVENTORY_MANAGEMENT_ACTIONS;
exports.RESTART_SLACK_HOOK_URL = RESTART_SLACK_HOOK_URL;
exports.FLIPKART_ERROR_CODE = FLIPKART_ERROR_CODE;
exports.RESPONSE_MESSAGES = RESPONSE_MESSAGES;
exports.FLIPKART_MESSAGES = FLIPKART_MESSAGES;
exports.INTEGRATION_CACHE_PREFIX = INTEGRATION_CACHE_PREFIX;
exports.KEYS_ALLOWED_TO_BE_FETCHED = KEYS_ALLOWED_TO_BE_FETCHED;
exports.BLUEDART_MESSAGES = BLUEDART_MESSAGES;

/* ===================================== ENV constant exports here ================= */

exports.PORT = PORT;
exports.HMAC_EXCEPTION_CLIENTS = HMAC_EXCEPTION_CLIENTS;
exports.SENTRY_DSN = SENTRY_DSN;
exports.SENTRY_ENV = SENTRY_ENV;
exports.REGION = REGION;
