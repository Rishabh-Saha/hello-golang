src
    boot (Not Tested) - No Testcases needed 
    config    
        constants
        creds
        datasource
        reqConfig
        respConfig
        external-api
    controllers
        middlewares
            dataHandler
            isValidHMAC
            isValidRequest
            isValidToken
        routes
            healthCheckTest
            auth
            external-internal-route
            dmi
            internalRoutesTest
            flipkart
            common-routes
            requestOTP
    dal
        external-clients
    services (Not Tested) - No Testcases needed 
    utils
        helper-functions
            apilist
            errorWrapper
            safePromise
            modifyReqRes
            memoize
            cache-helper
        middleware-helper
            generateHmac
            getClientDetails
            isValidHmac
            ipRangeCheck
            getClientToken
        request-helper
            downStreamApiFunctionTest
            removeUnnecessaryData
            setHeader

-----------------------------------------------------------------------------


1) src/config/constants.js
    a) checking if constants exist 
        Description: Going through constants file to ensure all constants exist 
        Expectations:
            - Goes through each constant in list and checks if exists in constants.js 

    b) checking data type of constants
        Description: Going through constants file and checking data type of each variable
        Expectations:
            - Goes through each constant in list and checks data type of variable

2) src/config/creds.json
    a) checking if creds exist 
        Description: goes through creds.json file and checks if objects exist
        Expectations:
            - Goes through each object in list and checks if exists in constants.js 

3) src/config/datasource.json
    a) checking if datasource objects exist 
        Description: goes through datasource.json file and checks if objects exist
        Expectations:
            - Goes through each object in list and checks if exists in datasouce.json 

4) src/config/reqConfig.json 
    a) checking if reqConfig objects exist 
        Description: goes through reqConfig.json file and checks if objects exist
        Expectations:
            - Goes through each object in list and checks if exists in reqConfig.json 

5) src/config/respConfig.json
    a) checking if respConfig objects exist 
        Description: goes through respConfg.json file and checks if objects exist
        Expectations:
            - Goes through each object in list and checks if exists in respConfig.js 

6) src/config/external-api.json
    a) checking if external-api objects exist 
        Description: goes through external-api.json file and checks if objects exist
        Expectations:
            - Goes through each object in list and checks if exists in external-api.json 

7) src/utils/helper-functions/apilist.js 
    a) testing getApiList function 
        Description: Call getApiList function and check response to make sure it returns apiList 
        Expectations:
            - Response returns as an array
            - Each value in array has active flag set to 1
    b) testing getApiConfig function 
        Description: Call getApiConfig function and check response to make sure it returns configuration details
        Expectations:
            - Checks datatype of apiName to make sure it returns as string
            - Checks if apiName is equal to '/Contract/createContract'
            - Checks if ApiMethod is equal to 'POST'
            - Checks if DownStreamMethod is equal to 'POST'
            - Checks if DownStreamModule  is equal to 'CoreApi'
            - Checks if DownStreamApiName  is equal to 'ConsumerProduct/createPublicSoldPlan'
            - Checks if RouteType  is equal to 'common'
            - Checks if active flag is set to 1
    c) testing getApiConfig function with fake endpoint
        Description: Call getApiConfig function and pass it a fake endpoint
        Expectations:
            - Response returns as undefined 

8) src/utils/helper-functions/errorWrapper.js 
    a) testing errorWrapper by passing it a String
        Description: Passing an error message to function to ensure function is working correctly 
        Expectations:
            - Response returns as an Error
            - Response message returns as String
            - Response message is equal to 'There has been an error that occurred'
    b) testing errorWrapper by passing it a Integer
        Description: Passing an Integer to function to ensure function is working correctly
        Expectations:
            - Response returns as an Error
            - Response message is equal to 1
    c) testing errorWrapper by passing it an Object 
        Description: Passing an Integer to function to ensure function is working correctly
        Expectations:
            - Response returns as an Error
    d) testing errorWrapper by passing it a new Error  
        Description: Passing a new Error to function to ensure function is working correctly
        Expectations:
            - Response returns as an Error
            - Response message returns as String
            - Response message is equal to 'Internal Server Error'

9) src/utils/helper-functions/safePromise.js 
    a) Testing safePromise with testFunction 
        Description: testFunction will complete the promise and send a resolved message
        Expectations:
            - Response returns as an Array
            - Second value in array is equal to 'resolved'
    b) Testing safePromise with testFunction reject  
       Description: testFunctionReject will return a failed promise 
       Expectations:
            - First value in array will return with message equal to Error
            - Response returns as an Array 
     c) Testing safePromise with async await function 
        Description: Passing an asynchronous function that calls testFunction to safePromise
        Expectations:
            - Response returns as an Array
            - Second value in array is equal to 'resolved'
     d) Testing safePromise without passing it a function 
       Description: calling safePromise function with empty parameters 
       Expectations:
           - expected testcase to fail - Response message equal "Cannot read property 'then' of undefined"

10) src/utils/helper-functions/modifyReqRes.js 
    a) Testing modifyReqRes with no parameters  
        Description: function will return null if no parameters are sent 
        Expectations:
            - Response returns as Undefined 
    b) Testing modifyReqRes without passing apiName or clientId  
        Description:  calling function with 2 missing parameters, only passing dataObject and type 
        Expectations:
            - Response returns as an Object
            - Response status should equal dataObject status 
            - Response success value  should equal dataObject success value 
            - Response message should equal dataObject message
            - Response keys should equal dataObject keys
            - Response token should equal dataObject token
            - Response ttl should equal dataObject ttl  
    c) Testing modifyReqRes without passing apiName 
        Description:  calling function with 1 missing parameter
        Expectations:
            - Response returns as an Object
            - Response status should equal dataObject status 
            - Response success value  should equal dataObject success value 
            - Response message should equal dataObject message
            - Response keys should equal dataObject keys
            - Response token should equal dataObject token
            - Response ttl should equal dataObject ttl  
    d) Testing modifyReqRes without passing clientId
        Description:  calling function with 1 missing parameter 
        Expectations:
            - Response returns as an Object
            - Response status should equal dataObject status 
            - Response success value  should equal dataObject success value 
            - Response message should equal dataObject message
            - Response keys should equal dataObject keys
            - Response token should equal dataObject token   - Response ttl should equal dataObject ttl  
    e) Testing modifyReqRes with a response object
        Description:  sending correct number of parameters to ensure function works properly
        Expectations:
            - Response returns as an Object
            - Response token should equal responseDataObject token
            - Response ttl  should equal responseDataObject ttl 
    f) Testing modifyReqRes with a request object 
        Description:  sending correct number of parameters to ensure function works properly
        Expectations:
            - Response returns as an Object
            - Response mobileNumber should equal responseDataObject token
            - Response ttl  should equal responseDataObject ttl 

11) src/utils/helper-functions/memoize.js 
    a) Testing memoize function without base64  
        Description: calling memoize function without encoding keyName
        Expectations:
            - Response returns as an Object
            - Response ClientName should equal ‘ServifyTest’
            - Response ExternalClientID should equal 1
            - Call getKey and check response to see  if key has been cached 
    b) Testing memoize function with base64   
        Description:  calling memoize function encode keyName 
        Expectations:
            - Response returns as an Object
            - Response ClientName should equal ‘ServifyTest’
            - Response ExternalClientID should equal 1
            - Call getKey and check response to see  if key has been cached 
    c) Testing memoize function with fake external client 
        Description:  pass fake external client name to ensure function does not cache key 
        Expectations:
            - function should fail 
            - error message should equal “No externalClient found”
            - call getKey and check if response returns null 

12) src/utils/middleware-helper/generateHMAC.js 
    a) Check for an error when no parameters are passed 
        Description: calling generateHMAC without 
        Expectations:
            - Test Case should fail 
            - expect error to return as Error 
    b) Checks for an error against invalid secret  
        Description:  calling generateHMAC with an invalid secret in parameters  
        Expectations:
            - Test Case should fail 
            - expect error to return as Error 
    c) Checks for an error against invalid string 
        Description:  calling generateHMAC with an invalid string in parameters  
        Expectations:
            - Checks if response is not equal to valid HMAC signature 
    d) Checks if HMAC is generated properly 
        Description:  calling generateHMAC with proper  parameters 
        Expectations:
            - Checks if response is equal to valid HMAC signature 

13) src/utils/middleware-helper/getClientDetails.js 
    a) Check for an error in getClientDetails 
        Description: calling function without passing clientId in parameters 
        Expectations:
            - Test Case should fail 
            - expect error to return as Error 
            - expect error message to equal No externalClient found 
    b) Checks for proper response from getClientDetails 
        Description:  calling getClientDetails with ServifyTest in parameters 
        Expectations:
            - Response object should include list of certain keys
            - Response ExternalClientID should be a number
            - Response IntegrationID should be a number 
            - Response ReferenceID should be a string 
            - Response clientName should be a string
            - Response constantName should be a string
            - Response clientSignature should be a string
            - Response ApiWhitelisting should be a number
            - Response PartnerID should be a number
            - Response SourceWhitelisting should be a number
            - Response ips should be a object
            - Response apis should be a object
            - Response external_client_shelter should be a object
            - Response ips should include keys ['ipv4','range-v4','ipv6','range-v6']
            - Response ips should include keys ['IN',’OUT']
            - Response ips.ipv4 should be an Object 
            - Response ips.ipv6 should be an Object 
            - Response ips.range-v4 should be an array
            - Response ips.range-v6 should be an array
            - Response external_client_shelter.IN should be an Object
            - Response external_client_shelter.OUT should be an Object  
            - Response external_client_shelter.IN should include keys ['ShelterAlgoID','ApiDirection','ParamName','ParamValue','ParamType','KeyType']
            - Response external_client_shelter.OUT should include keys 
                ['ShelterAlgoID','ApiDirection','ParamName','ParamValue','ParamType','KeyType']

14) src/utils/middleware-helper/isValidHMAC.js 
    a) Checks for an error when no parameters are passed 
        Description: calling function without any parameters 
        Expectations:
            - Test case should fail 
            - Error should return as Error 
    b) Checks for a true response for a valid HMAC  
        Description:  Calls function with proper parameters 
        Expectations:
            - Checks if response is a boolean 
            - Checks if boolean is equal to true 
    c) Checks for a false response for an invalid HMAC
        Description:  Call function with invalid HMAC signature 
        Expectations:
            - Checks if response is a boolean 
            - Checks if boolean is equal to false 

15) src/utils/middleware-helper/ipRangeCheck.js 
    Refer to : https://github.com/danielcompton/ip-range-check/blob/master/test/test.js

16) src/utils/request-helper/downStreamApiFunctionTest.js 
    a) no api name provided 
        Description: calling function without an apiName
        Expectations:
            - Response should equal { success: true, message: "Invalid API Name", data: {}, status: 404 }
    b) testing api which does not exist 
        Description:  calling function with apiName that does not exist 
        Expectations:
            - Response should equal { success: false, message: "Invalid API Name", data: {}, status: 404 }
    c) calling api without downstream module reference 
        Description:  Call function without downstream module  
        Expectations:
            - Response should equal { success: false, message: "Invalid API Name", data: {}, status: 404 }

17) src/utils/request-helper/removeUnecessaryData.js 
    a) sent a string (ASK ABOUT THIS)
        Description: calling function without parameters
        Expectations:
            - Response should be an object 
    b) no data sent 
        Description:  calling function with empty object in parameters 
        Expectations:
            - Response should be an object 
            - Response object should be empty 
 c) check for non existence of the keys 
        Description:  Call function with data object 
        Expectations:
            - Response should be an object 
            - Check if response externalClient does not exist 
            - Check if response clientShelterCreds does not exist 
            - Check if response headers does not exist 
            - Check if response apiName does not exist 

18) src/utils/request-helper/setHeader.js 
    a) No Parameters passed 
        Description: calling function without parameters
        Expectations:
            - Test case should fail
            - Expect response to be an Error 
    b) Empty header object passed 
        Description:  calling function with empty object in parameters 
        Expectations:
            - Response should be an object 
            - Response externalclientid should equal 1 
            - Response app should equal public 
            - Response PartnerID should equal 10
            - Response IntegrationID should equal 11 
    c) header object passed 
        Description:  Call function with data object in parameters 
        Expectations:
            - Response should be an object 
            - Response externalclientid should equal 1 
            - Response app should equal HeaderApp
            - Response authorization should equal auth
            - Response module  should equal CoreApi
            - Response source  should equal Random 
            - Response clientName  should equal ServifyTest
            - Response partnerID  should equal 10
            - Response IntegrationID should equal 11 
    d) passing app as a direct paramter
        Description:  Call function with data object in parameters 
        Expectations:
            - Response app should be equal to Public 
    e) Passing ConstantName as a parameter 
        Description:  Call function with data object including constantName in parameters 
        Expectations:
            - Response app should be equal to SERVIFY_TEST
    f) Passing app in header as parameter
        Description:  Call function with data object including app in header Object  in parameters 
        Expectations:
            - Response app should be equal to HEADER_APP

19) src/dal/mysql/externalClients.js 
    a) Checks for existence of all columns 
        Description: shows all columns from external clients 
        Expectations:
            - Checks if all columns from SQL table are present in response
   b) Checks externalClientID
        Description: Checks externalClientID field from SQL db 
        Expectations:
            - Checks if externalClientID type is equal to mediumint(6)
            - Checks if externalClientID null  is equal to ‘NO’
            - Checks if externalClientID key is equal to ‘PRI’
            - Checks if externalClientID default is equal to NULL
            - Checks if externalClientID extra is equal to auto_increment
    c) Checks IntegrationID
        Description: Checks IntegrationID field from SQL db 
        Expectations:
            - Checks if IntegrationID type is equal to int(4)
            - Checks if externalClientID null  is equal to ‘YES’
            - Checks if externalClientID default is equal to NULL
    d) Checks ReferenceID
        Description: Checks ReferenceID field from SQL db 
        Expectations:
            - Checks if ReferenceID type is equal to varchar(10)
            - Checks if ReferenceID null  is equal to ‘NO’
            - Checks if ReferenceID default is equal to NULL
    e) Checks ClientName
        Description: Checks ClientName field from SQL db 
        Expectations:
            - Checks if ClientName type is equal to varchar(100)
            - Checks if ClientName null  is equal to ‘NO’
            - Checks if ClientName default is equal to NULL
    f) Checks ConstantName
        Description: Checks ConstantName field from SQL db 
        Expectations:
            - Checks if ConstantName type is equal to varchar(100)
            - Checks if ConstantName null  is equal to ‘NO’
            - Checks if ConstantName default is equal to NULL
    g) Checks ClientSignature
        Description: Checks ClientSignature field from SQL db 
        Expectations:
            - Checks if ClientSignature type is equal to varchar(64)
            - Checks if ClientSignature null  is equal to ‘NO’
            - Checks if ClientSignature default is equal to NULL
    h) Checks ApiWhitelisting
        Description: Checks apiWhitelisting field from SQL db 
        Expectations:
            - Checks if apiWhitelisting type is equal to tinyInt(1)
            - Checks if apiWhitelisting null  is equal to ‘NO’
            - Checks if apiWhitelisting default is equal to NULL
    i) Checks SourceWhitelisting
        Description: Checks SourceWhitelisting field from SQL db 
        Expectations:
            - Checks if apiWhitelisting type is equal to tinyInt(1)
            - Checks if apiWhitelisting null  is equal to ‘NO’
            - Checks if apiWhitelisting default is equal to 1
    j) Checks Active
        Description: Checks Active field from SQL db 
        Expectations:
            - Checks if Active type is equal to tinyInt(1)
            - Checks if Active null  is equal to ‘NO’
            - Checks if apiWhitelisting default is equal to 1
    k) Checks CreatedDate
        Description: Checks CreatedDate field from SQL db 
        Expectations:
            - Checks if CreatedDate type is equal to timestamp
            - Checks if CreatedDate null  is equal to ‘NO’
            - Checks if CreatedDate default is equal to CURRENT_TIMESTAMP
            - Checks if CreatedDate extra is equal to 'on update CURRENT_TIMESTAMP'
    l) Checks UpdatedDate
        Description: Checks UpdatedDate field from SQL db 
        Expectations:
            - Checks if UpdatedDate type is equal to timestamp
            - Checks if UpdatedDate null  is equal to ‘NO’
            - Checks if UpdatedDate default is equal to CURRENT_TIMESTAMP
            - Checks if UpdatedDate extra is equal to 'on update CURRENT_TIMESTAMP'
    m) Checks PartnerID
        Description: Checks PartnerID field from SQL db 
        Expectations:
            - Checks if PartnerID type is equal to mediumint(8) unsigned
            - Checks if PartnerID null  is equal to ‘YES’
            - Checks if PartnerID default is equal to NULL

20) test/controllers/routest/healthCheckTest.js 
    a) healthcheck
        Description: checks the healthCheck route 
        Expectations:
            - Response text should equal ‘OK’
   b) post healthcheck
        Description: checks the healthCheck route for post 
        Expectations:
            - Response status should equal 401
            - Response success value  should equal false
            - Response message should equal Invalid Credentials 
            - Response errorCode should equal "CLIENT.INVALID.401"

20) src/controllers/routes/auth.js 
    a) testing auth/generateToken
        Description: passing header with missing x-host
        Expectations:
            - Response should return as object 
            - Response status should equal to 400
            - Response message should equal to Bad Request
            - Response success value should equal to false
   b) testing auth/generateToken
        Description: passing header with missing x-date
        Expectations:
            - Response should return as object 
            - Response status should equal to 400
            - Response message should equal to Bad Request
            - Response success value should equal to false
   c) testing auth/generateToken
        Description: passing header with missing content-type
        Expectations:
            - Response should return as object 
            - Response status should equal to 200
            - Response message should equal to Success 
            - Response success value should equal to true
   d) testing auth/generateToken
        Description: passing header with missing h-mac
        Expectations:
            - Response should return as object 
            - Response status should equal to 400
            - Response message should equal to Bad Request
            - Response success value should equal to false
   e) testing auth/generateToken
        Description: passing header with future x-date
        Expectations:
            - Response should return as object 
            - Response status should equal to 400
            - Response message should equal to Bad Request
            - Response success value should equal to false
   f) testing auth/generateToken
        Description: passing header with invalid x-date
        Expectations:
            - Response should return as object 
            - Response status should equal to 400
            - Response message should equal to Bad Request
            - Response success value should equal to false
   g) testing auth/generateToken
       Description: passing header with invald host-name
        Expectations:
            - Response should return as object 
            - Response status should equal to 401
            - Response message should equal to Invalid Credentials
            - Response success value should equal to false
   h) testing auth/generateToken
        Description: passing ServifyTestEncrypt with no data
        Expectations:
            - Response should return as object 
            - Response status should equal to 401
   i) testing auth/generateToken
        Description: passing ServifyTestEncrypt with data
        Expectations:
            - Response should return as object 
            - Response status should equal to 401
   j) testing auth/generateToken
        Description: passing correct data to function 
        Expectations:
            - Response should return as object 
            - Response status should equal to 200
            - Response message should equal to Success
            - Response token should be a string 
   k) testing auth/getToken
        Description: calling getToken function 
        Expectations:
            - Response should return as object 
            - Response status should equal to 200
            - Response message should equal to Success
            - Response token should be a string 

21) src/controllers/routes/external-internal-routes.js 
    a) testing internal/external-clients
        Description: Testing api with fake clientID
        Expectations:
            - Response message should equal to Invalid Credentials
            - Response success value should equal to false
            - Response status value should equal to 401
   b) testing internal/external-clients
        Description: Testing api with proper data
        Expectations:
            - Response message should equal to Client Details Fetched Successfully 
            - Response ClientName value should equal to ServifyTest
            - Response ExternalClientID value should equal to 1

22) src/controllers/routes/RequetOTP.js 
    a) testing common route function 
        Description: testing requestOTP function 
        Expectations:
            - Response allowResend should be of type boolean
            - Response app value should equal to Oneplus
   b) testing common route function 
        Description: testing requestOTP function with fake data 
        Expectations:
            - Response success value  should be false
            - Response message value should equal to Insufficient Parameters
   c) testing common route function 
        Description: testing requestOTP function with client-session-id
        Expectations:
            - Response success value  should be false
            - Response message value should equal to Bad Request 
   d) testing common route function 
        Description: testing requestOTP function with invalid client-session-id
        Expectations:
            - Response success value  should be false
            - Response message value should equal to "Token is either invalid or expired, please generate again!"

23) src/controllers/routes/dmi.js
    a) testing recieveEMandateDetails
        Description: hitting recieveEMandateDetails api 
        Expectations:
            - Response data should be of type Object 
            - Response status value should equal to 200
            - Response success value  should be true
    b) testing recieveOfferDetails
        Description: hitting recieveOfferDetails api 
        Expectations:
            - Response data should be of type Object 
            - Response status value should equal to 400
            - Response success value  should be false
    c) testing recieveKYCDetails
        Description: hitting recieveOfferDetails api 
        Expectations:
            - Response data should be of type Object 
            - Response status value should equal to 400
            - Response success value  should be false

24) src/utils/middleware-helper/getClientToken.js
    a) testing getClientToken
        Description: checks for response with no parameters sent 
        Expectations:
            - Response data should be Null
    b) testing getClientToken
        Description: checks response with proper data in parameters 
        Expectations:
            - Response data should be of type String
            - Response should be of length 36 
    c) testing getClientToken
        Description: checks response with invalid data sent in parameters 
        Expectations:
            - Response data should be Null

25) src/controllers/routes/internal-routes.js
    a) testing getAllCachedKeys
        Description: testing internal/getAllCachedKeys function api 
        Expectations:
            - Response success value should be equal to true 
            - Response status value should be equal to 200
            - Response message should be equal to all cached keys
    b) testing deleteCacheList
        Description: testing internal/deleteCacheList function api 
        Expectations:
            - Response success value should be equal to true 
            - Response status value should be equal to 200
    c) testing rebuildRoutes
        Description: testing internal/rebuildRoutes function api 
        Expectations:
            - Response success value should be equal to true 
            - Response status value should be equal to 200
            - Response message should be equal to Successfully Rebuilt Routes
    d) testing getAllCachedKeyValue
        Description: testing internal/getAllCachedKeyValue function api 
        Expectations:
            - Response success value should be equal to true 
            - Response status value should be equal to 200
            - Response message should be equal to Value for the required cached key
    a) testing burstCache
        Description: testing internal/getAllCachedKeys function api 
        Expectations:
            - Response success value should be equal to true 
            - Response status value should be equal to 200
            - Response message should be equal to Deleted all keys successfully 

26) src/controllers/routes/flipKart.js
    a) testing flipKart functions
        Description: testing flipKart activate function
        Expectations:
            - Response message should be of type String 
            - Response status value should equal to ACTIVATION_FAILED
            - Response error should be of type Array 
    b) testing flipKart functions
        Description: testing flipKart update function
        Expectations:
            - Response message should be of type String 
            - Response status value should equal to EDIT_FAILED
            - Response error should be of type Array 

27) src/utils/helper-functions/cache-helper.js
    a) testing deleteCacheList functions
        Description: testing deleteCacheList with a string 
        Expectations:
            - Response success value should be false 
    b) testing deleteCacheList functions
        Description: testing deleteCacheList with an array 
        Expectations:
            - Response success value should be false 
    c) testing deleteCacheList functions
        Description: testing deleteCacheList without passing data
        Expectations:
            - Response success value should be false 
            - Response message should be of type string
            - Response message should be equal to Insufficient Parameters  
    d) testing deleteCacheList functions
        Description: testing deleteCacheList with public data
        Expectations:
            - Response should be of type object 
            - Response success should be of type boolean
            - Response message should be of type string
            - Response data should be of type object
            - Response data should include keys ['keysDeleted','keysNotDeleted']
            - If response success value is true then check if keysDeleted has values else check keysNotDeleted
    e) testing deleteCacheList functions
        Description: testing deleteCacheList is running properly 
        Expectations:
            - Response should be of type object 
            - Response success should be of type boolean
            - Response message should be of type string
            - Response data should be of type object
            - Response data should include keys ['keysDeleted','keysNotDeleted']
             If response success value is true then check if keysDeleted has values else check keysNotDeleted
    f) testing deleteCacheList functions
        Description: testing deleteCacheList with IntegrationAPI data
        Expectations:
            - Response should be of type object 
            - Response success should be of type boolean
            - Response message should be of type string
            - Response data should be of type object
            - Response data should include keys ['keysDeleted','keysNotDeleted']
            - If response success value is true then check if keysDeleted has values else check keysNotDeleted
    g) testing burstCache functions
        Description: testing if burstCache returns proper response 
        Expectations:
            - Response should be of type Array 
 







