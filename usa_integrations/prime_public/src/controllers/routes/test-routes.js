const { createBunyanLogger,
    fs,
    expressRouter,
    request
} = require('../../utils');
const log = createBunyanLogger('test-routes');


expressRouter.get('/unableToFindKey', (req, res) => {
    const encryptionKeyContent = fs.readFileSync('/opt/Application/prime/publicApiSetup/creds/rsa/test_servify/unknown_key.pem');
    log.error('unableToFindKey', 'encryptionKeyContent', encryptionKeyContent);
    if (encryptionKeyContent) {
        res.send({
            success: true,
            msg: "Found the key"
        })
    } else {
        res.send({
            success: false,
            msg: 'Unable to find the key'
        });
    }
});

expressRouter.get('/unableToFindKeyWithCatch', (req, res) => {
    try {
        const encryptionKeyContent = fs.readFileSync('/opt/Application/prime/publicApiSetup/creds/rsa/test_servify/unknown_key.pem');
        log.error('unableToFindKeyWithCatch', 'encryptionKeyContent', encryptionKeyContent);
        if (encryptionKeyContent) {
            res.send({
                success: true,
                msg: "Found the key"
            })
        } else {
            res.send({
                success: false,
                msg: 'Unable to find the key'
            });
        }
    } catch (error) {
        log.error('unableToFindKeyWithCatch', 'encryptionKeyContent', error);
        res.send({
            success: false,
            msg: 'Unable to find the key'
        });
    }
});

//should stop the server
expressRouter.get('/promiseReject', (req, res) => {
    Promise.reject();
});

expressRouter.get('/throwError', (req, res) => {
    throw new Error("Thowing a manual error");
});

expressRouter.get('/referenceError', (req, res) => {
    notAvailableFunction();
});

expressRouter.get('/htmlResponse', (req, res) => {
    request('http://35.183.246.49', (error, response, body) => {
        log.error('htmlResponse', 'body', body);
        if (error) {
            res.send(error);
        } else {
            body.clientShelterCreds = 'some_random_value';
            res.send(body);
        }
    });
});

expressRouter.get('/htmlResponseWithCatch', (req, res) => {
    request('http://35.183.246.49', (error, response, body) => {
        log.error('htmlResponseWithCatch', 'body', body);
        if (error) {
            res.send(error);
        } else {
            try {
                body.clientShelterCreds = 'some_random_value';
                log.error('htmlResponseWithCatch', 'new body', body);
                res.send(body);
            } catch (error) {
                log.error('htmlResponseWithCatch', 'error', error);
                res.send(error);
            }
        }
    });
})

module.exports = expressRouter;