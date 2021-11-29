var env = process.env.NODE_ENV;
var requireHelper = require('./require-helper');
var app = requireHelper.app;
var _ = requireHelper._;
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('File Helper');
var path = requireHelper.path;
var fastCsv = requireHelper.fastCsv;
var uuid = requireHelper.uuid;
var awsSdk = requireHelper.awsSdk;
var moment = requireHelper.moment;
var customCatchError = requireHelper.customCatchError;
var Handlebars = requireHelper.Handlebars;
var pdf = requireHelper.pdf;
var fs = requireHelper.fs;
var templates = requireHelper.templates;
var primeCreds = requireHelper.primeCreds;
var compiledTemplates = requireHelper.compiledTemplates;
var PDF_CONFIG = constants.PDF_CONFIG;
var s3ParamsDefaults = {};

function getS3Object(data) {
    const functionName = 'getS3Object';
    var module = data.Module || data.headers.module;

    log.information(functionName,'module name', module);
    var AWSstorageInstance = getAws(primeCreds[module].s3);
    var s3 = new AWSstorageInstance.S3({
        computeChecksums: true
    });
    return s3;
}

function getAws(awsCreds) {
    var awsConfig = new awsSdk.Config(awsCreds);
    awsSdk.config.update(awsConfig);
    return awsSdk;
}


function jsonToCsv(data, cb) {
    const functionName = 'jsonToCsv';
    var headers = true;

    //Set headers with the spec if any
    if (data.options && data.options.headers) {
        headers = data.options.headers;
    }

    fastCsv.writeToString(data.csvJson, {
        headers: headers
    }, function (error, result) {
        if (error) {
            log.errorInfo(functionName, 'error in jsonToCsv', error);
            return cb(customCatchError());
        } else {
            return cb(null, result);
        }
    });
}

function joinStrArrayToPath(pathParams) {
    return function (params) {
        var pathJoinArray = [];
        var url = '';

        _.forEach(pathParams, function (str) {
            if (_.isString(params[str])) {
                pathJoinArray.push(params[str]);
            } else {
                pathJoinArray.push(params[str] + '');
            }
        });

        url = path.join.apply(this, pathJoinArray);

        if (params.Extension)
            url += '.' + params.Extension;

        return url;
    };
}

var getFilePathWBucket = joinStrArrayToPath([
    'Bucket',
    'Path',
    'Name'
]);

var getFileUrl = function (params) {
    var url = getFilePathWBucket(params);
    if (params.Domain) {
        url = params.Domain + '/' + url;
    }
    return url;
};

var getFilePathWOBucket = joinStrArrayToPath([
    'Path',
    'Name'
]);

/*
Test object for getFileUrl

log.info(getFileUrl({
	Domain: 'abc.com',
	Bucket: 'xyz',
	Path: '',
	Name: 'somename',
	Extension: 'png'
}));

*/


function htmlFromTemplate(templateName, context) {
    if (!compiledTemplates[templateName]) {
        throw new Error(templateName + ' does not exist in the precompiled template list');
    }
    return compiledTemplates[templateName](context);
}


function getPdfFromHtml(html, callback) {
    const functionName = 'getPdfFromHtml';
    pdf.create(html, PDF_CONFIG).toBuffer(function (error, buffer) {
        if (error) {
            log.errorInfo(functionName,'getPdfFromHtml error', error);
            return callback(customCatchError({
                msg: 'Something went wrong while creating a pdf',
                error: error
            }));
        } else {
            try {
                const data = Buffer.isBuffer(buffer);
                log.information(functionName,'getPdfFromHtml Buffer.isBuffer(buffer):',data);
            }
            catch(error){
                log.errorInfo(functionName, 'error from getPdfFromHtml', error);
            }
            return callback(null, buffer);
        }
    });
}

function generatePdf(templateName, data, context, callback) {

    var html = htmlFromTemplate(templateName, data);

    // fs.writeFileSync(`./${templateName}.html`, html);

    getPdfFromHtml(html, function (err, result) {

        return callback(null, result);
    });
}


function generateHtml(templateName, data) {

    var html = htmlFromTemplate(templateName, data);

    // fs.writeFileSync(`./${templateName}.html`, html);
    var uuidValue = uuid.v1();
    var htmlPath = __dirname + '/../temp_html/invoice-' + uuidValue + '.html';
    fs.writeFileSync(htmlPath, html);
    return htmlPath;
}


var pdfGenerator = function (templateName, data, callback) {

    generatePdf(templateName, data, {}, function (error, buffer) {

        /*fs.writeFile(`./${templateName}.pdf`, buffer, function() {
			log.info('arguments', arguments);
			return callback();
		});*/
        return callback(null, buffer);
    });
};

/*setTimeout(function () {
	var templateName = 'invoice';
	var invoicePdf = generatePdf(templateName);
	invoicePdf({}, function (error, buffer) {
		fs.writeFile(`./${templateName}.pdf`, buffer, function () {
			log.info('arguments', arguments);
		});
	});
}, 1000);*/


function s3FileUpload(params, cb) {
    const functionName = 's3FileUpload'; 
    if (!params.Domain) {
        throw new Error('No Domain sent in the params :', params);
    }
    if (!params.Bucket) {
        throw new Error('No Bucket sent in the params :', params);
    }
    if (!params.Path) {
        throw new Error('No Path sent in the params :', params);
    }
    if (!params.Name) {
        throw new Error('No Name sent in the params :', params);
    }
    if (!params.Extension) {
        throw new Error('No Extension sent in the params :', params);
    }
    if (!params.ContentType) {
        throw new Error('No ContentType sent in the params :', params);
    }
    if (!params.Body) {
        throw new Error('No Body sent in the params :', params);
    }



    var s3Params = {
        Bucket: params.Bucket,
        Key: getFilePathWOBucket(params),
        ContentType: params.ContentType,
        Body: params.Body,
        ACL: 'public-read'
    };
    if (params.ContentEncoding) {
        s3Params.ContentEncoding = params.ContentEncoding;
    }

    if (!s3Params.Key) {
        s3ParamsDefaults.Key = uuid.v1() + '/' + moment().format('YYYYMMDDHHmmssSSS') + params.Extension;
    }
    var s3 = getS3Object(params);

    s3.putObject(s3Params, function (error, s3Result) {
        if (error) {
            log.errorInfo(functionName, 'error in s3FileUpload', error);
            return cb(customCatchError());
        } else {
            log.information(functionName, 'result of s3 putObject', s3Result);
            var fileUrl = getFileUrl(params);
            log.information(functionName, 'result of getFileUrl', fileUrl);
            var result = {
                s3Result: s3Result,
                fileUrl: fileUrl
            };
            return cb(null, result);
        }
    });
}

function getSignedUrl(params, cb) {
    const functionName = 'getSignedUrl';
    var s3 = getS3Object(params);

    var s3Params = {
        Bucket: params.Bucket,
        Key: params.Key,
        ACL: params.ACL,
        ContentType: params.ContentType,
        Expires: 3000
    };
    s3.getSignedUrl('putObject', s3Params, function (error, url) {
        if (url) {
            log.information(functionName, 'signed URL: ', url);
            //data not an object for backward compatibility
            return cb(null, url);
        } else {
            log.errorInfo(functionName,'error in getSignedUrl',error);
            getSignedUrl(params, function (error, urlResult) {
               log.errorInfo(functionName,'result of signed url', error);
               if (urlResult.success) {
                    return cb(null, urlResult);
                } else {
                    return cb(customCatchError());
                }
            });
        }
    });
}

function readFileFromS3(params, cb) {
    var s3 = getS3Object(params);
    delete params.Module;
    s3.getObject(params, function (error, data) {
        if (error) return cb(customCatchError({
            msg: error
        }));
        else return cb(null, data);
    });
}

function generateFileUrl(data) {
    var fileUrl = data.Domain + data.Bucket + '/' + data.Path + '/' + data.Name + '.' + data.Extension;
    return fileUrl;
}

function generateS3Key(data) {
    var fileUrl = data.Path + '/' + data.Name + '.' + data.Extension;
    return fileUrl;
}

exports.s3FileUpload = s3FileUpload;
exports.generateHtml = generateHtml;
exports.generateFileUrl = generateFileUrl;
exports.generateS3Key = generateS3Key;
exports.getSignedUrl = getSignedUrl;
exports.getFilePathWOBucket = getFilePathWOBucket;
exports.getFileUrl = getFileUrl;
exports.jsonToCsv = jsonToCsv;
exports.joinStrArrayToPath = joinStrArrayToPath;
exports.generatePdf = generatePdf;
exports.htmlFromTemplate = htmlFromTemplate;
exports.pdfGenerator = pdfGenerator;
exports.readFileFromS3 = readFileFromS3;