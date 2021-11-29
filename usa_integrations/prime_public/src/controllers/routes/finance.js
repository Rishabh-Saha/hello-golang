'use strict';

const { expressRouter } = require('../../utils');
const dmi = require('./dmi');
const dataHandler = require('../middlewares/dataHandler');
const decryption = require('../middlewares/decryption');
const logger = require('../middlewares/logger');
const isValidHmac = require('../middlewares/isValidHmac');
const isValidRequest = require('../middlewares/isValidRequest');
const isValidToken = require('../middlewares/isValidToken');
const isWhiteListedApi = require('../middlewares/isWhiteListedApi');
const isWhiteListedIp = require('../middlewares/isWhiteListedIp');
const rateLimiter = require('../middlewares/rateLimiter');
const refreshToken = require('../middlewares/refreshToken');

expressRouter.use('/dmi',
    logger,
    dataHandler,
    rateLimiter,
    isValidRequest,
    isValidHmac,
    isValidToken,
    isWhiteListedApi,
    isWhiteListedIp,
    decryption,
    refreshToken,
    dmi);


module.exports = expressRouter;