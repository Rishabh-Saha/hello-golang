const { customCatchError, _, constants, moment, createBunyanLogger, getValidationErrors } = require('../../utils');
const HMAC_THRESHOLD = constants.HMAC_THRESHOLD;
const HMAC_DATE_FORMAT = constants.HMAC_DATE_FORMAT;
const FUTURE_DATE_HMAC_THRESHOLD = constants.FUTURE_DATE_HMAC_THRESHOLD;
const log = createBunyanLogger('isValidRequest');
// var DEFAULT_LANGUAGE_CODE = constants.DEFAULT_LANGUAGE_CODE;
const OPEN_ROUTES = constants.OPEN_ROUTES;
const HMAC_EXCEPTION_CLIENTS = constants.HMAC_EXCEPTION_CLIENTS;

module.exports = async (request, response, next) => {
    const validations = [
        {
            key: 'client-id',
            rules: [
                {
                    isValid: value => !!value,
                    getErrorMsg: key => `${key} is missing`
                },
                {
                    isValid: value => typeof value === 'string',
                    getErrorMsg: key => `${key} should be a string`
                }
            ]
        },
        {
            key: 'x-host',
            rules: [
                {
                    isValid: value => !!value,
                    getErrorMsg: key => `${key} is missing`
                },
                {
                    isValid: value => typeof value === 'string',
                    getErrorMsg: key => `${key} should be a string`
                },
                {
                    isValid: value => value && value.indexOf('.') > -1,
                    getErrorMsg: key => `${key} should be a valid hostname`
                },
            ]
        },
        {
            key: 'x-date',
            rules: [
                {
                    isValid: value => !!value,
                    getErrorMsg: key => `${key} is missing`
                },
                {
                    isValid: value => {
                        const date = value && moment(value.split(' GMT')[0], HMAC_DATE_FORMAT, true);
                        const isValidDate = date && date.isValid();
                        if (!isValidDate) {
                            return false;
                        }
                        return true;
                    },
                    getErrorMsg: key => `${key} should be a valid date`
                },
                {
                    isValid: value => {
                        const timezone = value && _.reverse(value.split(' '))[0];
                        const isGmt = timezone === 'GMT';
                        if (!isGmt) {
                            return false;
                        }
                        return true;
                    },
                    getErrorMsg: key => `${key} should be of valid timezone`
                },
                {//TODO should it be moved to isValidHMAC middleware?
                    isValid: value => {
                        const date = moment(value);
                        const validPastDateRange = moment().subtract(HMAC_THRESHOLD, 's');
                        const isExpiredDate = date.isBefore(validPastDateRange);
                        if (isExpiredDate) {
                            log.info('isValidRequest', 'Expired x-date',`Old x-date: ${value} sent by client: ${request.headers['client-id']}`);
                            if(HMAC_EXCEPTION_CLIENTS[request.headers['client-id']] === true){
                                return true;
                            }
                            return false;
                        }
                        const validFutureDateRange = moment().add(FUTURE_DATE_HMAC_THRESHOLD,'s');
                        const isFutureDate = date.isAfter(validFutureDateRange);
                        if(isFutureDate) {
                            log.info('isValidRequest', 'Future x-date',`Future x-date: ${value} sent by client: ${request.headers['client-id']}`);
                            if(HMAC_EXCEPTION_CLIENTS[request.headers['client-id']] === true){
                                return true;
                            }
                            return false;
                        }
                        return true;
                    },
                    getErrorMsg: key => `${key} - invalid date`
                }
            ]
        },
        {
            key: 'hmac-signature',
            rules: [
                {
                    isValid: value => !!value,
                    getErrorMsg: key => `${key} is missing`
                },
                {
                    isValid: value => typeof value === 'string',
                    getErrorMsg: key => `${key} should be a string`
                }
            ]
        },
    ];

    if (!(OPEN_ROUTES.TOKEN.indexOf(request.body['apiName']) > -1)) {
        validations.push({
            key: 'client-session-id',
            rules: [
                {
                    isValid: value => !!value,
                    getErrorMsg: key => `${key} is missing`
                },
                {
                    isValid: value => typeof value === 'string',
                    getErrorMsg: key => `${key} should be a string`
                }
            ]
        });
    }

    const validationErrors = getValidationErrors({ validations, data: request.headers });
    if (validationErrors) {
        log.error('isValidRequest','errors while validating request',validationErrors);
        const formattedResponse = await customCatchError({errorCode:"DATA.BAD_REQUEST.400"});
        return response.status(400).send(formattedResponse);
    }

    next();
}