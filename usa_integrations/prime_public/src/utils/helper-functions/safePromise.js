module.exports =
    promise =>
        promise.then(response => [null, response]).catch(error => [error]);
