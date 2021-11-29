'use strict';

const { expressRouter } = require('../../utils');
const bluedart = require('./bluedart');
const bluedartAuthentication = require('../middlewares/bluedart-authentication');
const logger = require('../middlewares/logger');
const rateLimiter = require('../middlewares/rateLimiter');
const dataHandler = require('../middlewares/dataHandler');

expressRouter.use('/Bluedart',
    logger,
    rateLimiter,
    bluedartAuthentication,
    dataHandler,
    bluedart);


module.exports = expressRouter;
