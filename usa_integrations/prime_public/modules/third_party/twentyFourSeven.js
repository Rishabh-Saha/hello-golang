var env = process.env.NODE_ENV;
var requireHelper = require('./../../server/utility/require-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var fileHelper = require('./../../server/utility/file-helper');
var constants = requireHelper.constants;
var log = requireHelper.createBunyanLogger('FileRecord');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var customCatchError = requireHelper.customCatchError;
var hasSufficientParameters = utils.hasSufficientParameters;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var s3BaseUrl = requireHelper.s3BaseUrl;
var FILE_REQUEST_TYPE = constants.FILE_REQUEST_TYPE;
var FILE_REQUEST_STATUS = constants.FILE_REQUEST_STATUS;
var momentAcceptedFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ssSSSZ', 'DD-MM-YYYY'];
var catchError = {
    status: 500,
    msg: 'Error in fetching data'
};


module.exports = function(TwentyFourSeven) {
    TwentyFourSeven.requestFulfillment = function(data, cb) {
        try {
            var requestObject = {};
            requestObject.ReferenceID = data.ReferenceID;
            const functionName = "TwentyFourSeven.requestFulfillment";
            async.auto({
                //To be moved to middleware 
                fieldValidations: function(autoCallback) {
                    var checkFields = ['Status', 'RequestObject'];
                    var statusConfig = [{
                        StatusCode: 'PNDNG_ASGN',
                        Status: 'Pending for assignment',
                        CheckFields: [{
                            FieldName: 'Reason',
                            Type: 'String',
                            AllowedValues: ['CNC', 'ENA'],
                            IsRequired: true
                        }, {
                            FieldName: 'Remarks',
                            Type: 'String',
                            IsRequired: true
                        }]
                    }, {
                        StatusCode: 'SRVC_ACC',
                        Status: 'Service accepted'
                    }, {
                        StatusCode: 'ENG_TRIP_START',
                        Status: 'Serviceman journey initiated'
                    }, {
                        StatusCode: 'ENG_RCHD',
                        Status: 'Serviceman reached'
                    }, {
                        StatusCode: 'RESCHED_RQST',
                        Status: 'Reschedule request',
                        CheckFields: [{
                            FieldName: 'ScheduledFromTime',
                            IsRequired: true
                        }, {
                            FieldName: 'ScheduledToTime',
                            IsRequired: true
                        }]
                    }, {
                        StatusCode: 'SRVC_FIN',
                        Status: 'Service completed'
                    }, {
                        StatusCode: 'SRVC_CNCL',
                        Status: 'Service cancelled',
                        CheckFields: [{
                            FieldName: 'Reason',
                            Type: 'String',
                            AllowedValues: ['CIA', 'CNA', 'MRR'],
                            IsRequired: true
                        }, {
                            FieldName: 'Remarks',
                            Type: 'String',
                            IsRequired: true
                        }]
                    }];
                    var requestObj = _.assign(data, data.RequestObject);
                    var statusObj = _.find(statusConfig, function(status) {
                        return status.StatusCode == data.Status
                    })
                    if (!statusObj) {
                        autoCallback({
                            success: false,
                            msg: 'Invalid details',
                            data: {}
                        })
                    } else {
                        data.Status = statusObj.Status;
                        //check required fields
                        var requiredFields = _.map(_.filter(statusObj.CheckFields, function(field) {
                            return field.IsRequired
                        }), 'FieldName');
                        utils.hasSufficientParams(data.RequestDetails, requiredFields, [], [], function(error, sufficientResult) {
                            if (error) {
                                autoCallback({
                                    success: false,
                                    msg: 'Invalid details',
                                    data: {}
                                })
                            } else {
                                //check field types and values
                                async.map(statusObj.CheckFields, function(field, mapCallback) {
                                    if (field.AllowedValues && data.RequestDetails[field.FieldName]) {
                                        if (field.AllowedValues.indexOf(data.RequestDetails[field.FieldName]) > -1) {
                                            mapCallback()
                                        } else {
                                            mapCallback({
                                                success: false,
                                                msg: 'Invalid details',
                                                data: {}
                                            })
                                        }
                                    } else {
                                        mapCallback()
                                    }
                                }, function(error, mapResult) {
                                    if (error) {
                                        autoCallback(error)
                                    } else {
                                        autoCallback()
                                    }
                                })
                            }
                        })

                    }
                },
                fulfillRequest: ['fieldValidations', function(autoCallback, result) {
                    data = _.assign(data, data.RequestDetails);

                    externalRequest[0].requestObj.post({
                        url: externalApiParams.core.url + '/Onsite/onsiteRequestFulfillment',
                        json: data
                    }, function(error, response, body) {
                        log.information(functionName,"result from coreApi", body)
                        if (error || !body || !body.success || !body.data) {
                            return cb(null, {
                                success: false,
                                status: 444,
                                error: {}
                            })
                        } else {
                            returnObj = {};
                            returnObj.ReferenceID = body.data.ReferenceID;
                            returnObj.Status = body.data.Status;
                            returnObj.ScheduledDateTime = body.data.ScheduledDateTime;
                            returnObj.ScheduledFromTime = body.data.ScheduledFromTime;
                            returnObj.ScheduledToTime = body.data.ScheduledToTime;
                            return cb(null, {
                                success: true,
                                msg: 'success',
                                data: returnObj
                            })
                        }
                    })
                }]
            }, function(error, autoResult) {
                if (error) {
                    return cb(null, error)
                }
            })

        } catch (error) {
            return cb(null, {
                success: false,
                status: 444,
                error: {}
            })
        }
    }
}