var _ = require('lodash');
var moment = require('moment');


/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is a number
---------------------------------------------------------------------------------------------------- */
function isNumber(value) {
    return _.isNumber(value) ? true : ' must be a number';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is a string
---------------------------------------------------------------------------------------------------- */
function isString(value) {
    return _.isString(value) ? true : ' must be a string';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is a boolean
---------------------------------------------------------------------------------------------------- */
function isBoolean(value) {
    return _.isBoolean(value) ? true : ' must be a boolean';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is an array
---------------------------------------------------------------------------------------------------- */
function isArray(value) {
    return _.isArray(value) ? true : ' must be an array';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is present in a given array
---------------------------------------------------------------------------------------------------- */
function inArray(expectedArray) {
    if (!_.isArray(expectedArray)) throw new Error('The expectedArray param must be an array');
    return function (value) {
        return (expectedArray.indexOf(value) > -1) ? true : ' is not present in the expected values [' + expectedArray.toString() + ']';
    };
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is an object
---------------------------------------------------------------------------------------------------- */
function isObject(value) {
    return _.isObject(value) ? true : ' must be an object';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is a date
---------------------------------------------------------------------------------------------------- */
function isDate(value) {
    return _.isObject(value) ? true : ' must be a date';
}

/* ----------------------------------------------------------------------------------------------------
      Checks if the key sent is a date
---------------------------------------------------------------------------------------------------- */
function isDateString(dateFormatArray) {
    if (!_.isArray(dateFormatArray)) throw new Error('The dateFormatArray param must be an array');
    return function (value) {
        try {
            var parsedDate = moment(value, dateFormatArray);
            return parsedDate.isValid() ? true : ' is not in a valid format. Formats: [' + dateFormatArray.toString() + ']';
        } catch (e) {
            return ' could not be parsed as a date with formats: [' + dateFormatArray.toString() + ']';
        }
    };
}


/* ----------------------------------------------------------------------------------------------------
      validates the above functions which are passed as arguments
---------------------------------------------------------------------------------------------------- */
function multiple() { //Send functions as arguments!
    var fnArray = arguments;
    var fnArrayLength = fnArray.length;
    for (var i = 0; i < fnArrayLength; i++) {
        var fnCheck = _.isFunction(fnArray[i]);
        if (!fnCheck) {
            throw new Error('All fnArray must be a function');
        }
    }

    return function (value) {
        var errors = [];
        for (var i = 0; i < fnArrayLength; i++) {
            var res = fnArray[i](value);
            if (res !== true) {
                errors.push(res);
            }
        }

        if (errors.length > 0)
            return errors.toString();
        else
            return true;
    };
}


/* ----------------------------------------------------------------------------------------------------
      Creates a validator function by passing a validator object
---------------------------------------------------------------------------------------------------- */
function create(validatorObj, optionalFields) {
    return function (data) {
        if (!_.isObject) throw new Error('data sent should be an object');

        var errors = [];

        _.forEach(validatorObj, function (fn, key) {
            if (!_.has(data, key)) {
                if (optionalFields.indexOf(key) > -1) {
                    return;
                } else {
                    errors.push('{' + key + '} is a mandatory field');
                    return;
                }
            } else {
                var validatorFn = _.get(validatorObj, key);
                var validatorRes = validatorFn(_.get(data, key));
                if (validatorRes === true)
                    return;
                else
                    errors.push('{' + key + '}' + validatorRes);
            }
        });

        if (errors.length > 0)
            return errors;
        else
            return true;
    };
}

/*
----------------------------------------------------------------------------------------------------
Example:
----------------------------------------------------------------------------------------------------

Validator object:

var validatorObject = {
      id: isNumber,
      name: isString,
      mandatoryField: isString,
      fKeyId: multiple(isNumber, inArray([1, 2, 3])),
      incorrectOptionalBool: isBoolean,
      active: isBoolean,
      archived: isBoolean,
      createdDate: isDateString(['yyyy-mm-dd'])
};


var objValidator = create(validatorObject, ['archived', 'incorrectOptionalBool']);
setTimeout(function () {
      console.log(objValidator({
            id: '1',
            name: 1,
            fKeyId: 4,
            incorrectOptionalBool: 'true',
            active: 1,
      }));
}, 1000);
*/


exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isArray = isArray;
exports.inArray = inArray;
exports.isObject = isObject;
exports.isDate = isDate;
exports.isDateString = isDateString;
exports.multiple = multiple;
exports.create = create;