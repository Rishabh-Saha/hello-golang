require('./config/constants'); 
require('./config/creds');
require('./config/datasource');
require('./config/reqConfig');
require('./config/respConfig');
require('./config/external-api');

require('./utils/helper-functions/apilist');
require('./utils/helper-functions/errorWrapper');
require('./utils/helper-functions/safePromise');
require('./utils/helper-functions/modifyReqRes');
require('./utils/helper-functions/memoize');
require('./utils/middleware-helper/generateHmac');
require('./utils/middleware-helper/getClientDetails');
require('./utils/middleware-helper/isValidHmac');
require('./utils/middleware-helper/ipRangeCheck');
require('./utils/request-helper/downStreamApiFunction');
require('./utils/request-helper/removeUnnecessaryData');
require('./utils/request-helper/setHeader');


require('./dal/externalClients');
require('./dal/apiList');
require('./dal/clientWhitelistedApis');
require('./dal/externalClientShelter');
require('./dal/shelterAlgos');
require('./dal/whitelistedips');
require('./controllers/routes/healthCheckTest');
require('./controllers/routes/auth');

//Have dependencies on auth
require('./controllers/routes/external-internal-route');
require('./controllers/routes/common-routes/requestOTP');
require('./controllers/routes/dmi');
require('./utils/middleware-helper/getClientToken'); 
require('./controllers/routes/internalRoutesTest');
require('./controllers/routes/flipkart');
require('./utils/helper-functions/cache-helper');
