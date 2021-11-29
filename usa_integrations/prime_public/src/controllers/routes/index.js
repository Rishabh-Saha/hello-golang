const { app, httpContext } = require('../../utils');

const {
    dataHandler,
    decryption,
    logger,
    isValidHmac,
    isValidRequest,
    isValidToken,
    isWhiteListedApi,
    isWhiteListedIp,
    rateLimiter,
    refreshToken,
    flipkartAuthentication
} = require('../middlewares');

app.use(httpContext.middleware);

app.use('/api/v1',require('../../../server/server.js'));

app.use('/test',
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
    require('./test-routes'));

app.get('/healthCheck', (req,res)=>{
    res.status(200).send('OK');
});

app.use('/couriers', require('./couriers'));

app.use('/financepartners', require('./finance'));

app.use('/flipkart',
    logger,
    //rateLimiter, //Currently not needed response format is different
    flipkartAuthentication,
    dataHandler,
    isWhiteListedIp,
    require('./flipkart'));

app.use('/internal/external-client',
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
    require('./external-internal-route'));

app.use('/internal',
    logger,
    dataHandler,
    rateLimiter,
    isValidRequest,
    isValidHmac,
    isValidToken,
    refreshToken,
    require('./internal-routes'));


app.use('/Auth',
    logger,
    dataHandler,
    rateLimiter,
    isValidRequest,
    isValidHmac,
    isWhiteListedApi,
    isWhiteListedIp,
    decryption,
    require('./auth'));

app.use('/',
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
    require('./common-routes'));

app.use(function(request, response) {
    response.status(404).send({status:404,message:"Invalid API name",success:false,data:{}});
});

module.exports = app;