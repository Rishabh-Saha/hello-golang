require('./utils/helper-functions/apilist');
require('./utils/helper-functions/memoize');
require('./utils/middleware-helper/getClientDetails');
require('./utils/request-helper/downStreamApiFunction');


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
require('./services/internalRoutes');