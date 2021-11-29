// require('../../scripts');
module.exports = function enableViewsDirectory(server) {
    var loopback = server.loopback;

    // Some config init
    server.set('views', __dirname + '/../views');
    server.set('view engine', 'ejs');

};