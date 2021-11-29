var DEFAULT_TTL = 15 * 24 * 60 * 60; //15 days in seconds
var DEFAULT_IMAGE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
var PAGINATION_ITEMS_PER_PAGE = 10;
var PAGINATION_MAX_PAGES = 5;
var DEFAULT_TX_ISOLATION_LEVEL = 'READ COMMITTED';
var DEFAULT_TX_TIMEOUT = 15000;
var SLACK_HOOK = 'https://hooks.slack.com/services/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';
var DEFAULT_LANGUAGE_CODE = 'en';
var CACHE_PREFIX = 'public_';
const MASTER_CACHE_PREFIX = 'master_';

var BRAND_ARRAY = {
    GODREG: 15,
    APPLE: 4
};
var FILE_REQUEST_TYPE = {
    EXPORT: 1,
    IMPORT: 2
};

var FILE_REQUEST_STATUS = {
    PENDING: 1,
    IN_PROGRESS: 2,
    SUCCESSFUL: 3,
    FAILED: 4
};
var DATE_SQL_FORMAT = 'YYYY-MM-DD HH:mm:ss';
var HMAC_DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss';

var DEFAULT_CHARGE_PARAMS = {
    TAX_SLAB: 18,
    CHARGE_CODE: '998716',
    CHARGE_CODE_TYPE: 'SAC'
};

var SERVIFY_CREDS = {
    SUBSCRIPTION_ID: 2,
    ORGANIZATION_ID: 2,
    ORDER_STATUS_ID: 2
};

var TENOR_BRANDS = {
    DEFAULT: 98,
    PRODUCTION: 103
};

var TENOR_BRAND = TENOR_BRANDS.DEFAULT;

var ISSUE_VALIDITY_STATUS_ARR = [1, 2];
var CLAIM_DOCUMENT_UPLOAD_HOST = 'http://baar.in/admin/api/uploadDocument';

var APP_ARRAY = {
    LENOVO: 'Lenovo',
    SYSKA: 'Syska',
    PUPA: 'PupaServis',
    VODAFONE: 'Vodafone',
    APPLE_CARE: 'AppleCare',
    MAPLE_CARE: 'MapleCare',
    NYASA_CARE: 'NyasaCare',
    VENUS_CARE: 'VenusCare',
    IDELTA_CARE: 'IdeltaCare',
    NGRT_CARE: 'NGRTCare',
    PLANET_CARE: 'PlanetCare',
    AMPLE_CARE: 'AmpleCare',
    TRESOR_CARE: 'TresorCare',
    CONSUMER_WEB: 'Consumer-Web',
    B2X: 'B2X',
};

var DOA_STATUS = {
    APPLICABLE: 'applicable',
    CERTIFICATE: 'certificate',
    ELIGIBLE: 'eligible',
    NOT_APPLICABLE: 'not applicable',
    REPLACEMENT: 'replacement'
};


var APPLE_APP_ARRAY = [
    'AppleCare',
    'MapleCare',
    'NyasaCare',
    'VenusCare',
    'IdeltaCare',
    'NGRTCare',
    'PlanetCare',
    'AmpleCare',
    'TresorCare',
];

var PRODUCT_SUBCATEGORY = {
    APPLE: 12
};

var DELIVERY_MODES = {
    SERVIFLY: {
        ID: 1,
        Name: 'Servifly'
    },
    FEDEX: {
        ID: 2,
        Name: 'Fedex'
    },
    DELHIVERY: {
        ID: 3,
        Name: 'Delhivery'
    },
    SERVIFLYOUTSTATION: {
        ID: 4,
        Name: 'Servifly Outstation'
    },
    OTHER: {
        ID: 5,
        Name: 'Other'
    },
    BLUEDART: {
        ID: 6,
        Name: 'Bluedart'
    },
    UPS: {
        ID: 7,
        Name: 'Ups'
    },
};

var PART_STATUS_ARR = {
    REQUESTED: {
        ID: 1,
        TEXT: 'requested'
    },
    PENDING: {
        ID: 2,
        TEXT: 'pending'
    },
    ORDERED: {
        ID: 3,
        TEXT: 'ordered'
    },
    ISSUED: {
        ID: 4,
        TEXT: 'issued'
    },
    RECEIVED: {
        ID: 5,
        TEXT: 'received'
    },
    DOA: {
        ID: 6,
        TEXT: 'doa'
    },
    REJECTED: {
        ID: 7,
        TEXT: 'rejected'
    },
    CANCELLED: {
        ID: 8,
        TEXT: 'cancelled'
    },
    RETURNED: {
        ID: 9,
        TEXT: 'returned'
    },
    DEFECTIVE: {
        ID: 10,
        TEXT: 'defective'
    },
    HANDOVER: {
        ID: 11,
        TEXT: 'handover'
    },
    RETURN_CUSTOMER: {
        ID: 12,
        TEXT: 'returnCustomer'
    },
    FAULTLESS: {
        ID: 13,
        TEXT: 'faultless'
    },
    CONSUMED: {
        ID: 14,
        TEXT: 'consumed'
    },
};

var PDF_CONFIG = {
    'format': 'A3', // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    'orientation': 'portrait', // portrait or landscape
};

var ISSUE_MASTER_ID_FOR_OTHER = 293;
var PRODUCT_LEVEL_PRICECHART_IDS = [10, 11, 12, 16, 14];

var CACHE_CLEAR_INTERVAL = {
    DEFAULT_CLIENT_TOKEN_TTL: 60 /*seconds*/ * 15 /*minutes*/ ,
    EXTERNAL_CLIENT_SHELTER: 1000 /*miliseconds*/ * 60 /*seconds*/ * 15 /*minutes*/ ,
    EXTERNAL_CLIENTS: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    WHITELISTED_IPS: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    REQUEST_TYPE: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    REQUEST_MOVEMENT_TYPE: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    COVER_TYPE: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SERVICE_TYPE_STATUS_MAPPING: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SERVICE_API_CONFIG: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SLOT_LIST: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    DOCUMENT_MASTER: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    PART_TRANSACTION_STATUS: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    CHECK_LIST: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    CHECK_LIST_LINES: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    CHECK_LIST_LINE_MAPPING: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    STATUS_FLOW: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    ERROR_CODES: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    TEMPLATE_ACTIONS: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    ACTION_STATUS_MAPPING: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    NOTIFICATION_CONFIG: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    NOTIFICATION_TYPES: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    ENTITY_REALM: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    ROLE_TYPE: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    PINCODE_MASTER: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    CONFIGURATION_PARAMETER: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    CHARGE_TYPE: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    FULFILMENT_FLOW: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SERVICE_CHARGE_MATRIX: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SERVICE_CHARGE_ACTION: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
    SOURCE_LIST: 1000 /*miliseconds*/ * 60 /*seconds*/ * 5 /*minutes*/ ,
};

var AUTH_TOKEN_ALIASES = ['authorization', 'authToken', 'access_token'];
var TOKEN_SOURCES = ['query', 'body', 'cookies', 'headers'];
const EXTERNAL_CLIENT_DATA_FETCHING_ROUTE = '/internal/external-client';
var OPEN_ROUTES = {
    AUTH: ['/', '/external-client', '/ApiList/insertAllApis', '/RedisCache/burstCache'],
    TOKEN: ['/', '/external-client', '/Auth/generateToken', '/ApiList/insertAllApis', '/RedisCache/burstCache']
};

var INVENTORY_MANAGEMENT_ACTIONS = {
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

var AUDIT_LOG_QUEUE = 'audit_log_servify';

/*var ONEPLUS_BENEFITS_ACTIONS = {
	OPENID_CHECK: 'OPENID_CHECK',
	REQUEST_OTP: 'REQUEST_OTP',
	VERIFY_OTP: 'VERIFY_OTP',
	ADD_CONSUMER: 'ADD_CONSUMER',
	ADD_CONSUMER_PRODUCT: 'ADD_CONSUMER_PRODUCT',
	ACTIVATE_BENEFITS: 'ACTIVATE_BENEFITS'
};*/
const RESPONSE_HANDLER = ["SAMSUNG_STAG","SAMSUNG_SF_STAG"];
const HMAC_THRESHOLD = 7200; //in seconds
const FUTURE_DATE_HMAC_THRESHOLD = 120; //in seconds

const SERVER_VARIABLES = {
    keepAliveTimeout: 0,   // value in ms
    headersTimeout: 125000 // value in ms
}

const PROCESS_EXIT_TIME = 10000;
const RATE_LIMITER_FLAG = false;

exports.AUDIT_LOG_QUEUE = AUDIT_LOG_QUEUE;
exports.HMAC_DATE_FORMAT = HMAC_DATE_FORMAT;
exports.INVENTORY_MANAGEMENT_ACTIONS = INVENTORY_MANAGEMENT_ACTIONS;
exports.DEFAULT_TTL = DEFAULT_TTL;
exports.DEFAULT_IMAGE_TTL = DEFAULT_IMAGE_TTL;
exports.PAGINATION_ITEMS_PER_PAGE = PAGINATION_ITEMS_PER_PAGE;
exports.PAGINATION_MAX_PAGES = PAGINATION_MAX_PAGES;
exports.AUTH_TOKEN_ALIASES = AUTH_TOKEN_ALIASES;
exports.CACHE_PREFIX = CACHE_PREFIX;
exports.TOKEN_SOURCES = TOKEN_SOURCES;
exports.OPEN_ROUTES = OPEN_ROUTES;
exports.PDF_CONFIG = PDF_CONFIG;
exports.CACHE_CLEAR_INTERVAL = CACHE_CLEAR_INTERVAL;
exports.SLACK_HOOK = SLACK_HOOK;
exports.APP_ARRAY = APP_ARRAY;
exports.BRAND_ARRAY = BRAND_ARRAY;
exports.APPLE_APP_ARRAY = APPLE_APP_ARRAY;
exports.ISSUE_MASTER_ID_FOR_OTHER = ISSUE_MASTER_ID_FOR_OTHER;
exports.DELIVERY_MODES = DELIVERY_MODES;
exports.PRODUCT_LEVEL_PRICECHART_IDS = PRODUCT_LEVEL_PRICECHART_IDS;
exports.SERVIFY_CREDS = SERVIFY_CREDS;
exports.ISSUE_VALIDITY_STATUS_ARR = ISSUE_VALIDITY_STATUS_ARR;
exports.DATE_SQL_FORMAT = DATE_SQL_FORMAT;
exports.DEFAULT_LANGUAGE_CODE = DEFAULT_LANGUAGE_CODE;
exports.CLAIM_DOCUMENT_UPLOAD_HOST = CLAIM_DOCUMENT_UPLOAD_HOST;
exports.DOA_STATUS = DOA_STATUS;
exports.TENOR_BRANDS = TENOR_BRANDS;
exports.TENOR_BRAND = TENOR_BRAND;
exports.DEFAULT_TX_OPTIONS = {
    isolationLevel: DEFAULT_TX_ISOLATION_LEVEL,
    // timeout: DEFAULT_TX_TIMEOUT
};
exports.RESPONSE_HANDLER = RESPONSE_HANDLER;
exports.EXTERNAL_CLIENT_DATA_FETCHING_ROUTE = EXTERNAL_CLIENT_DATA_FETCHING_ROUTE;
// exports.ONEPLUS_BENEFITS_ACTIONS = ONEPLUS_BENEFITS_ACTIONS;
exports.HMAC_THRESHOLD = HMAC_THRESHOLD;
// exports.ONEPLUS_BENEFITS_ACTIONS = ONEPLUS_BENEFITS_ACTIONS;
exports.SERVER_VARIABLES = SERVER_VARIABLES;
exports.PROCESS_EXIT_TIME = PROCESS_EXIT_TIME;
exports.RATE_LIMITER_FLAG = RATE_LIMITER_FLAG;
exports.MASTER_CACHE_PREFIX = MASTER_CACHE_PREFIX;
exports.FUTURE_DATE_HMAC_THRESHOLD = FUTURE_DATE_HMAC_THRESHOLD;