var app = require('../server');
var async = require('async');
var bunyan = require('bunyan');
var moment = require('moment');
var utils = require('./../../server/utility/utils');
var fieldValidations = require('./../../server/utility/field-validations');
var errorCodes = require('./../../server/utility/error-codes');
var env = process.env.NODE_ENV;
var _ = require('lodash');
const requireHelper = require('../utility/require-helper');
const log = requireHelper.createBunyanLogger('Validator');
module.exports = function () {
    return function (req, res, next) {
        const functionName = "Validator";
        var path = req.path.toString();
        log.information(functionName,'restApiRoot', app.get('restApiRoot'));
        var endpoint = path.replace(app.get('restApiRoot'), '');
        log.information(functionName,'end point', endpoint);
        if (!req.Source) {
            req.Source = 'Default';
        }
        next();
        // utils.validateAndMapKeys(req.body, endpoint, req.Source, function (validatorResult) {
        //  log.info('validatorResult', validatorResult);
        //  if (!validatorResult || !validatorResult.validationArray || !validatorResult.validationArray.length) {
        //      if (validatorResult && (validatorResult.missingBody)) {
        //          var returnObj = errorCodes['INSUF_PARAM'];
        //          next(returnObj)
        //      } else {
        //          next();
        //      }
        //  } else {
        //      var missingFields = [];
        //      var invalidFields = [];
        //      _.forEach(validatorResult.validationArray, function (val) {
        //          if (val.IsInvalid) {
        //              invalidFields.push(val.FieldName)
        //          }
        //          if (val.IsMissing) {
        //              missingFields.push(val.FieldName)
        //          }
        //      })
        //      var returnObj = {};
        //      if (missingFields && missingFields.length) {
        //          returnObj = errorCodes['INSUF_PARAM'];
        //          returnObj.data = {}
        //          returnObj.data.params = missingFields;
        //          log.info('returnObj', returnObj)
        //      }
        //      if (invalidFields && invalidFields.length && _.isEmpty(returnObj)) {
        //          returnObj = errorCodes['INV_PARAM'];
        //          returnObj.data = {}
        //          returnObj.data.params = invalidFields;
        //      }
        //      if (_.isEmpty(returnObj)) {
        //          req.body = validatorResult.mappedObject;
        //          next()
        //      } else {
        //          next(returnObj)
        //      }
        //  }
        // })
    }
}