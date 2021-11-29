const  { networkInterfaces } = require('os');
const { moment, createBunyanLogger} = require('./../utils');
const log = createBunyanLogger('get-boot-details');
const getBootDetails = () => {
    const functionName = 'getBootDetails';
    const interfaces = networkInterfaces();
    let privateIp;
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                privateIp = net.address;
                break;
            }
        }
    }
    // set the default process ID if not set by PM2
    const INSTANCE_ID = process.env.pm_id || process.env.NODE_APP_INSTANCE || process.env.INSTANCE_ID || 0;
    // set timestamp and format the date string
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let PORT;
    if (process.env && process.env.PORT) {
        PORT = process.env.PORT;
    } else {
        PORT = 8063;
        log.error(functionName, 'unable to find env base port using defalt port');
    }
    return {
        privateIp,
        INSTANCE_ID,
        currentTime,
        PORT
    }
}

module.exports =  getBootDetails;