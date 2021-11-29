const fs = require('fs'),
    request = require('request');
const createBunyanLogger = require('../utility/require-helper').createBunyanLogger
const log = createBunyanLogger('routes');

module.exports = function(app) {

/*  app.get('/test/unableToFindKey', (req, res) => {
        const encryptionKeyContent = fs.readFileSync('/opt/Application/prime/publicApiSetup/creds/rsa/test_servify/unknown_key.pem');
        log.errorInfo('unableToFindKey','encryptionKeyContent',encryptionKeyContent);
        if(encryptionKeyContent){
            res.send({
                success: true,
                msg: "Found the key"
            })
        }else{
            res.send({
                success: false,
                msg: 'Unable to find the key'
            });
        }
    });

    app.get('/test/unableToFindKeyWithCatch', (req, res) => {
        try {
            const encryptionKeyContent = fs.readFileSync('/opt/Application/prime/publicApiSetup/creds/rsa/test_servify/unknown_key.pem');
            log.errorInfo('unableToFindKeyWithCatch','encryptionKeyContent',encryptionKeyContent);
            if(encryptionKeyContent){
                res.send({
                    success: true,
                    msg: "Found the key"
                })
            }else{
                res.send({
                    success: false,
                    msg: 'Unable to find the key'
                });
            }
        } catch (error) {
            log.errorInfo('unableToFindKeyWithCatch','encryptionKeyContent',error);
            res.send({
                success: false,
                msg: 'Unable to find the key'
            });
        } 
    });

    //should stop the server
    app.get('/test/promiseReject', (req, res) => {
        Promise.reject();
    });

    app.get('/test/throwError', (req, res) => {
        throw new Error("Thowing a manual error");
    });

    app.get('/test/referenceError', (req, res) => {
        notAvailableFunction();
    });

    app.get('/test/htmlResponse', (req, res) => {
        request('http://35.183.246.49', (error, response, body) => {
            log.errorInfo('htmlResponse','body',body);
            if(error){
                res.send(error);
            }else{
                body.clientShelterCreds = 'some_random_value';
                res.send(body);
            }
        });
    });

    app.get('/test/htmlResponseWithCatch', (req, res) => {
        request('http://35.183.246.49', (error, response, body) => {
            log.errorInfo('htmlResponseWithCatch','body',body);
            if(error){
                res.send(error);
            }else{
                try {
                    body.clientShelterCreds = 'some_random_value';
                    log.errorInfo('htmlResponseWithCatch','new body',body);
                    res.send(body);
                } catch (error) {
                    log.errorInfo('htmlResponseWithCatch','error',error);
                    res.send(error);
                }
            }
        });
    });*/
};
