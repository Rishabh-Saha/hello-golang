/* jshint node:true */
'use strict';
var requireHelper = require('./../../server/utility/require-helper');
var middlewareHelper = require('./../../server/utility/middleware-helper');
var utils = require('./../../server/utility/utils');
var modelHelper = require('./../../server/utility/model-helper');
var helper = require('./../../server/utility/helper');
var shelterHelper = helper.shelterHelper;
var Unhandlederror = requireHelper.app;
var constants = requireHelper.constants;
var http = requireHelper.http;
var request = requireHelper.request;
var zxcvbn = requireHelper.zxcvbn;
var env = requireHelper.env;
var app = requireHelper.app;
var moment = requireHelper.moment;
var xml2js = requireHelper.xml2js;
var bunyan = requireHelper.bunyan;
var async = requireHelper.async;
var log = requireHelper.createBunyanLogger('Utils');
var disableAllMethods = requireHelper.disableAllMethods;
var async = requireHelper.async;
var validatorFunctions = utils.validatorFunctions;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var externalApiParams = requireHelper.externalApiParams;
var DEFAULT_LANGUAGE_CODE = constants.DEFAULT_LANGUAGE_CODE;
var AUDIT_LOG_QUEUE = constants.AUDIT_LOG_QUEUE;
var secretEncryption = requireHelper.secretEncryption;
var webhookConfig = requireHelper.webhookConfig;

//log.information('utils',"on boot webhook config fetch", webhookConfig);

var catchError = {
	status: 200,
	success: false,
	errorCode: 'SM.WTR.001',
	// globalCode: 'SM.WTR.001',
	message: 'Something went wrong', // for developer response
	msg: 'Something went wrong',
	content: 'Something went wrong',
	data: {}
};

var gsxProd = request.defaults({
	headers: {
		'content-type': 'application/json',
		'accept': 'application/json',
		'app': 'gsxApp'
	}
});

var GLOBAL_CODE_LIST = {};


function getContentFromGlobalCode(codeObj) {
	var error = _.cloneDeep(catchError);
	if (!codeObj) {
		codeObj = {};
	}
	if (typeof codeObj === 'string') {
		codeObj = {
			globalCode: codeObj
		};
	}

	if (_.isEmpty(GLOBAL_CODE_LIST)) {
		try {
			GLOBAL_CODE_LIST = require('./../../server/language/global-codes.json');
		} catch (e) {
			GLOBAL_CODE_LIST = {};
		}
	}


	if (!codeObj.languageCode) {
		codeObj.languageCode = DEFAULT_LANGUAGE_CODE;
	}

	// console.log('GLOBAL_CODE_LIST', GLOBAL_CODE_LIST);
	// console.log('codeObj.languageCode+'.'+codeObj.globalCode', '['' + codeObj.languageCode + '']['' + codeObj.globalCode + '']')
	var globalObj = _.get(GLOBAL_CODE_LIST, '[' + codeObj.languageCode + '][' + codeObj.globalCode + ']');
	// var globalObj = GLOBAL_CODE_LIST[codeObj.languageCode][codeObj.globalCode];
	// console.log('GLOBAL_CODE_LIST ====> ', GLOBAL_CODE_LIST);
	// console.log('globalObj ====> ', globalObj);
	if (!globalObj) {
		globalObj = error;
	}
	return globalObj;
}

function customCatchError(errorObj, data) {
	const functionName = 'customCatchError';
	log.information(functionName,'error object', errorObj);
	log.information(functionName,'data of customCatchError', data);
	if (errorObj && errorObj['$data']) {
		return errorObj;
	}
	var error = _.cloneDeep(catchError);
	if (!errorObj) {
		errorObj = {};
	}
	// var globalObj = getContentFromGlobalCode(errorObj);
	// error.errorCode = globalObj.globalCode;
	// error.msg = globalObj.content;
	if (typeof errorObj === 'string') {
		error.msg = errorObj;
		error.message = errorObj;
	} else {
		_.forEach(errorObj, function (value, key) {
			//ignore '!=' warning
			if (value !== undefined) {
				error[key] = value;
			}
		});
	}
	if (typeof errorObj === 'object' && _.isEmpty(errorObj.message))
		error.message = errorObj.msg;

	delete error.content;
	delete error.msg;

	var sendData = {
		dataToProcess: error,
		clientShelterCreds: _.get(data, 'clientShelterCreds')
  };

	log.information(functionName,'send data to custom catch error', JSON.stringify(sendData));
	postWebhook(error, 'response');
	var encryptedError = shelterHelper.encrypt(sendData);
	log.information(functionName,'sendData customCatchError encrypt', encryptedError);
	// recordResponseLog(error);
	return encryptedError;
}


function sendFormattedResponse(data) {
	const functionName = 'sendFormattedResponse';
	var successObj = _.cloneDeep(catchError);
	successObj.success = true;
	if (data.data) {
		successObj.data = data.data;
		successObj.msg = data.msg;
	} else {
		successObj.data = data;
		successObj.msg = 'Success';
	}
	successObj.message = successObj.msg;
	if (data.message) {
		successObj.message = data.message;
	}
	delete successObj.errorCode;
	delete successObj.globalCode;
	delete successObj.content;
	delete successObj.msg;
	//recordResponseLog(successObj);
	// postWebhook(successObj, 'response');
	var sendData = {
		dataToProcess: successObj,
		clientShelterCreds: data.clientShelterCreds
  };
  
	log.information(functionName,'success object', successObj);
	log.information(functionName,'data to encryption', JSON.stringify(data));
	delete data.clientShelterCreds;
	log.information(functionName,'data in secret key',data.secretEncryption);
	log.information(functionName,'secret key',secretEncryption);
	if (data.secretEncryption && data.secretEncryption === secretEncryption) {
		var returnObj = successObj;
		delete data.secretEncryption
	} else {
		postWebhook(successObj, 'response');
		var returnObj = shelterHelper.encrypt(sendData);
	}
	log.information(functionName,'final success object', successObj);
	log.information(functionName,'final return object', returnObj);
	return returnObj;
}

function recordResponseLog(responseData) {
	var sendData = {
		msgArray: [{
			headers: {},
			body: {
				Action: 'updateLog',
				params: {
					ApiHash: responseData.ApiHash,
					responseBody: responseData,
					ResponseTimestamp: moment().format('YYYY-MM-DD hh:mm:ss')
				}
			}
		}],
		queueName: AUDIT_LOG_QUEUE
	};
	delete responseData.ApiHash;
	middlewareHelper.hedwigPublishMessage(sendData, (error, result) => {});
	return;
}

function postWebhook(data, dataType) {
	const functionName = 'postWebhook';
	var sendData = {
		WebhookDetails: []
	};
	_.forEach(webhookConfig, (value) => {
		log.information(functionName,'webhookConfig', value);
		if (value.dataToLog && value.dataToLog[dataType]) {
			var eachWebhook = {
				WebhookUrl: value.WebhookUrl,
				WebhookType: value.WebhookType,
				RequestHeaders: value.RequestHeaders,
				RequestMethod: value.RequestMethod,
				WebhookPostData: data
			};
			sendData.WebhookDetails.push(eachWebhook);
		} else {
			//Return
		}
	});
	if (sendData.WebhookDetails && sendData.WebhookDetails.length) {
		app.models.Integration.postWebhook(sendData, (error, result) => {
			log.information(functionName,'Webhook post error', error);
			log.information(functionName,'Webhook post result', error);
		});
	} else {
		return;
	}
}

function convertDate(dateTime, sourceTimeZone, destTimeZone) {
	const functionName = 'convertDate';
	log.information(functionName, 'date to be convert', dateTime); 
	log.information(functionName, 'typeof dateTime', typeof dateTime);
	if (typeof dateTime === 'string') {
		if (dateTime.indexOf('+') !== -1 || dateTime.lastIndexOf('-') === 22) {
			return '' + moment(dateTime).utcOffset(destTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toString();
		}
	} else {
		var date = moment(dateTime).format('YYYY-MM-DD');
		var time = moment(dateTime).format('HH:mm:ss');
		return '' + moment(date + 'T' + time + sourceTimeZone).utcOffset(destTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toString();
	}
}


function looksLike(string, key) {
	var rex = {
		'partNumber': /^([A-Z]{1,2})?\d{3}\-?(\d{4,5}|[A-Z]{2})(\/[A-Z])?$/i,
		'serialNumber': /^[A-Z0-9]{11,12}$/i,
		'imeiNumber': /^\d{15}$/,
		'eeeCode': /^[A-Z0-9]{3,4}$/, // only match ALL-CAPS!
		'returnOrder': /^7\d{9}$/,
		'repairNumber': /^\d{12}$/,
		'dispatchId': /^[A-Z]+\d{9}$/,
		'alternateDeviceId': /^\d{15}$/,
		'diagnosticEventNumber': /^\d{23}$/
	};
	if (string.match(rex[key]) && string.match(rex[key]).length > 0) {
		return true;
	}
	return false;
}


var validatorFunctions = {
	
	presence: function (data, keys) {
		/*
		    Returns missing keys from a set of data.
		    Nested keys can be checked too.
		    Ex. To check for 'b' in {a: {b: '1'}} the key will be 'a.b' or ['a','b']
		 */
		var missingKeys = [];

		_(keys).forEach(function (key) {
			if ((_.isString(_.get(data, key)) && !_.get(data, key)) || !_.has(data, key)) {
				missingKeys.push(key);
			}
		});

		return missingKeys;
	},
	inArray: function (value, checkIn) {
		/*
		    Returns a boolean based on the presence of given value in the array
		 */
		var boo = false;
		if (checkIn.indexOf(value) > -1) {
			boo = true;
		}
		return boo;
	},
	minimumAllowedLength: function (value, minLength) {
		/*
		    Returns a boolean based on length of the array
		 */
		return (value ? _.gte(value.length, minLength) : false);
	},
	maximumAllowedLength: function (value, maxLength) {
		/*
		    Returns a boolean based on the length of the array
		 */
		return (value ? _.lte(value.length, maxLength) : false);
	},
	equalsLength: function (value, length) {
		/*
		    Returns a boolean based on the length of the array
		 */
		return _.eq(value.length, length);
	},
	isNumber: _.isNumber,
	isString: _.isString,
	isArray: _.isArray,
	isBoolean: _.isBoolean,
	isPlainObject: _.isPlainObject,
	isDateValid: function (value, parsingOptions) {
		const functionName = 'validatorFunctions.isDateValid';
		/*
		    Returns boolean based a valid Date String is provided
		*/
		if (parsingOptions && !_.isArray(parsingOptions)) {
			log.errorInfo(functionName,'isDateValid should be an array',error);
			return false;
		}
		var d = parsingOptions ? moment(value, parsingOptions) : moment(value);
		return d.isValid();
	},
	getPasswordScore: function (value) {
		/*
		    Returns score for a password [0,1,2,3,4] (Weak -> Strong)
		 */
		return zxcvbn(value).score;
	},
	isPasswordStrong: function (value) {
		/*
		    Returns a boolean based on score of the password
		 */
		var score = this.getPasswordScore(value);
		return (score && score >= 3);
	},
	trimAll: function (T, modifier) {
		var self = this;
		if (T && T.logData) {
			delete T.logData;
		}
		if (_.isArray(T)) {
			// For all String values in an array
			var arr = [];
			_.forEach(T, function (item) {
				arr.push(self.trimAll(item, modifier));
			});
			return arr;
		} else if (_.isObject(T)) {
			//For all string values in an Object
			_.forEach(T, function (value, key) {
				T[key] = self.trimAll(value, modifier);
			});
			return T;
		} else if (_.isString(T)) {
			var value = 'default';
			if (modifier) {
				value = _.trim(T, modifier);
			} else {
				value = _.trim(T);
			}
			return value;
		} else {
			return T;
		}
	},
	GSXValidation: function (T) {
		var self = this;
		var keysTobeValidated = ['partNumber', 'serialNumber', 'imeiNumber', 'eeeCode', 'returnOrder', 'repairNumber', 'dispatchId', 'alternateDeviceId', 'diagnosticEventNumber'];

		var invalidKeys = [];
		if (_.isArray(T)) {
			// For all String values in an array
			_.forEach(T, function (item) {
				invalidKeys.push(self.GSXValidation(item));
			});
			return invalidKeys;
		} else if (_.isObject(T)) {
			//For all string values in an Object
			_.forEach(T, function (value, key) {
				if (keysTobeValidated.indexOf(key) > -1) {
					if (!looksLike(value, key)) {
						invalidKeys.push(key);
					}
				}
			});
			return invalidKeys;
		} else {
			return invalidKeys;
		}
	},
	atleastOnePresent: function (data, keys) {
		/*
		    Returns a boolean if atleast one key is present in data
		 */
		return _.some(_.intersection(keys, _.keys(data)));
	}

};

function hasSufficientParameters(data, checks) {
	/*
	{
	    keys: [],   //Array of keys
	    type: 'presence',
	    against: ''
	},
	{
	    key: '',
	    type: 'inArray',
	    against: []
	},
	{
	    key: '',
	    type: 'minimumAllowedLength',
	    against: 0
	},
	{
	    key: '',
	    type: 'maximumAllowedLength',
	    against: 0
	},
	{
	    key: '',
	    type: 'equalsLength',
	    against: 0
	},
	{
	    key: '',
	    type: 'isNumber'
	},
	{
	    key: '',
	    type: 'isString'
	},
	{
	    key: '',
	    type: 'isArray'
	}
	*/


	if (!data) {
		return {
			status: 422,
			message: 'Data is missing!',
			success: false,
			msg: 'Insufficient parameteres',
			data: data
		};
	}

	var missingKeys = [];
	var unexpectedValues = [];
	var invalidValues = [];
	var validKeys = [];

	_(checks).forEach(function (check) {
		if (check.type === 'presence') {
			missingKeys = _.concat(missingKeys, validatorFunctions.presence(data, check.keys));
		} else if (check.type === 'GSXValidation') {
			invalidValues = _.concat(invalidValues, validatorFunctions.GSXValidation(data));
		} else if (check.type === 'atleastOnePresent') {
			if (!validatorFunctions.atleastOnePresent(data, check.keys)) {
				validKeys = check.keys;
			}
		} else {
			var value = _.get(data, check.key); //Gets the value at a specific path
			if (value && !(validatorFunctions[check.type](value, check.against))) {
				unexpectedValues.push(check.key);
			}
		}
	});

	if ((missingKeys.length > 0) || (unexpectedValues.length > 0) || (invalidValues.length > 0)) {
		return {
			status: 422,
			message: 'Insufficient parameteres',
			success: false,
			msg: 'Insufficient parameteres',
			data: {
				missingKeys: missingKeys,
				unexpectedValues: _.pull(unexpectedValues, missingKeys),
				invalidValues: invalidValues,
				validKeys: validKeys
			}
		};
	} else if (validKeys.length > 0) {
		return {
			status: 422,
			message: 'Insufficient parameteres',
			success: false,
			msg: 'Atleast one of the validKeys is requried',
			data: {
				validKeys: validKeys
			}
		};
	} else {
		return {
			success: true,
			msg: 'Expected keys and values are present',
			data: {}
		};
	}
}

function arrayToCSV(array) {
	var csv = '(';
	_.forEach(
		array,
		function (val, i) {
			if (_.isNumber(val)) {
				csv += val + ',';
			} else {
				csv += '\'' + val + '\',';
			}
		});
	csv = csv.slice(0, -1);
	csv += ')';
	return csv;
}



function buildSelect(fieldsObj) {
	if (fieldsObj === 0) {
		return 'COUNT(*)';
	}
	var clause = '';
	var len;
	if (typeof fieldsObj === 'string') {
		return fieldsObj;
	}
	if (Array.isArray(fieldsObj)) {
		if (fieldsObj[0] === 1) {
			clause = 'DISTINCT ';
			fieldsObj = fieldsObj.slice(1, len);
		}
		len = fieldsObj.length;
		fieldsObj.forEach(function (table) {
			clause += table + '.*, ';
		});
		return clause.slice(0, -2);
	} else {
		len = Object.keys(fieldsObj).length;
		if (fieldsObj['distinct'] && fieldsObj['distinct'] === true) {
			clause = 'DISTINCT ';
			delete fieldsObj['distinct'];
		}
		_(fieldsObj).forEach(function (fields, table) {
			//console.log(fields, 'fields');
			fields.forEach(function (i) {
				if (Array.isArray(i)) {
					if (i[0] && i[0] === 1) {
						clause += i + ', ';
					}
				} else if (typeof i === 'object') {
					clause += i['Function'] + '(' + table + '.' + i['Column'] + '), ';
				} else {
					clause += table + '.' + i + ', ';
				}

			});
		});
		return clause.slice(0, -2);
	}
}

function buildFrom(fieldsObj) {
	const functionName = 'buildFrom';
	var clause, fieldArray;
	if (!Array.isArray(fieldsObj)) {
		return fieldsObj;
	} else {
		clause = fieldsObj[0];
		var len = fieldsObj.length;
		var prev = fieldsObj[0];
		var curr = '';
		var join = '';
		for (var i = 1; i < len; i += 1) {
			prev = fieldsObj[i][0];
			curr = fieldsObj[i][1];
			join = 'INNER JOIN';
			if (fieldsObj[i].length === 4) {
				log.information(functionName,'fields object', fieldsObj[i]);
				join = fieldsObj[i][3];
			}
			clause += ' ' + join + ' ' + curr + ' ON ';
			fieldArray = fieldsObj[i][2].split(',');
			for (var j = fieldArray.length - 1; j >= 0; j--) {
				if (j < fieldArray.length - 1) {
					clause += ' and ';
				}
				clause += prev + '.' + fieldArray[j] + ' = ' + curr + '.' + fieldArray[j];
			}
			prev = curr;
		}
	}
	return clause;
}



function buildWhere(fieldsObj) {
	const functionName = 'buildWhere';
	var clause = [];
	var groupclause = [];
	_(fieldsObj).forEach(function (condArray, table) {
		var groupedOrOperators = _.groupBy(_.filter(_.filter(condArray, function (c) {
			return c.length > 3;
		}), function (g) {
			return (g[3] === 'OR');
		}), function (o) {
			return o[4];
		});
		_(groupedOrOperators).forEach(function (array, key) {
			var arrClause = {};
			arrClause[key] = [];
			_(array).forEach(function (arr) {
				var value = arr[2];
				var operator = arr[1];
				if (Array.isArray(arr[2])) {
					if (arr[2].length === 0) {
						operator = 'IS';
						value = ' NULL';
					} else {

						value = '(' + arr[2].toString() + ')';

					}
				}
				if (value) {
					arrClause[key].push(table + '.' + arr[0] + ' ' + operator + ' ' + value);
				}
			});
			if (arrClause[key] !== undefined && arrClause[key].length > 2) {
				var query1 = '(' + arrClause[key][0] + ')' + ' OR ' + '(' + arrClause[key][1] + ')';
				var query2 = '(' + arrClause[key][2] + ')' + ' OR ' + '(' + arrClause[key][3] + ')';
				groupclause.push('(' + query1 + ' OR ' + query2 + ')');
			} else {
				if (arrClause[key][0] && arrClause[key][1])
					groupclause.push('(' + arrClause[key][0] + ' OR ' + arrClause[key][1] + ')');
			}
			//}
		});
		_(condArray).forEach(function (array) {
			if (array.length < 4) {
				var value = array[2];
				var operator = array[1];
				if (Array.isArray(array[2])) {
					if (array[2].length === 0) {
						operator = 'IS';
						value = ' NULL';
					} else {



						value = '(' + array[2].toString() + ')';


					}
				}
				if (value) {
					clause.push(table + '.' + array[0] + ' ' + operator + ' ' + value);
				}
			}
		});
	});
	log.information(functionName, 'build function group clause', groupclause);
	log.information(functionName, 'build function clause', clause);
	return _.union(clause, groupclause);
}


function buildQuery(fromObj, whereObj, selectObj, optObj) {
	var whereClause = whereObj === null ? null : buildWhere(whereObj);
	var selectClause = selectObj === null ? '*' : buildSelect(selectObj);
	var fromClause = buildFrom(fromObj);
	var optClause = optObj === null ? null : optObj;
	log.trace('whereClause', whereClause);
	var query = 'SELECT ' + selectClause + ' FROM ' + fromClause + ' WHERE 1';
	if (whereClause) {

		whereClause.forEach(function (clause) {
			query += ' AND ' + clause;
		});
	}
	if (optClause) {
		query += ' ' + optClause;
	}
	log.trace('query', query);
	return query + ';';
}

function arrayToCSV(array) {
	var csv = '(';
	_(array).forEach(
		function (val, i) {
			log.trace(i);
			csv += '\'' + val + '\',';
		});
	csv = csv.slice(0, -1);
	csv += ')';

	return csv;
}


function closestMatch(data, cb) {
	if (!data.matchingString || !data.comparisonArray) return true;
	var distance, match, matchID, matchLowerCase;
	var input = data.matchingString.toLowerCase();
	var arr = data.comparisonArray;
	for (var i = 0, candidate; candidate <= arr[i]; i++) {
		if (input === candidate.ProductName) {
			return cb(null, {
				success: true,
				msg: 'Match found',
				data: {
					ProductName: candidate.ProductName,
					ProductID: candidate.ProductID
				}
			});
		} else {
			var measurement = sift(input, candidate.ProductName.toLowerCase());
			if ((distance === undefined) || (distance !== undefined && measurement < distance)) {
				distance = measurement;
				matchLowerCase = candidate.ProductName.toLowerCase();
				match = candidate.ProductName;
				matchID = candidate.ProductID;
			}

		}
	}
	if (input.indexOf(matchLowerCase) > -1) {
		return cb(null, {
			success: true,
			msg: 'Match found',
			data: {
				ProductName: match,
				ProductID: matchID
			}
		});
	} else {
		return cb(null, {
			success: false,
			msg: 'No match found'
		});
	}
}

function sift(str1, str2) {
	var len1 = str1.length;
	var len2 = str2.length;
	var lcs = 0;
	var c = 0;
	if (!len1) return len2;
	if (!len2) return len1;
	while ((c < len1) && (c < len2)) {
		if (str1.charAt(c) === str2.charAt(c)) lcs++;
		c++;
	}
	return (len1 + len2) / 2 - lcs;

}

function truncateDecimal(value, truncateBy) {
	var multiplier = Math.pow(10, truncateBy);
	var multipliedValue = value * multiplier;
	var roundedValue = _.floor(multipliedValue);
	var truncatedValue = roundedValue / multiplier;
	return (truncatedValue);
}


function convertToBool(data, keyArr) {
	var booleanValueArr = {
		'Y': 1,
		'N': 0,
		'YES': 1,
		'NO': 0
	};
	_.forEach(keyArr, function (value, key) {
		if (data[value]) {
			data[value] = booleanValueArr[_.toUpper(data[value])];
		} else {
			data[value] = 0;
		}
	});
	return data;
}

function convertFromBool(data, keyArr) {
	const functionName  = 'convertFromBool';
	var booleanValueArr = {
		'1': 'Y',
		'0': 'N',
		'true': 'Y',
		'false': 'N',
	};
	_.forEach(keyArr, function (value, key) {
		if (data[value]) {
			data[value] = booleanValueArr[_.toString(data[value])];
		} else {
			data[value] = 'N';
		}
	});
	return data;
}

function convertObjectsToArray(data, keys) {
	if (!keys) {
		if (_.isPlainObject(data)) {
			return [data];
		}
	} else {
		_.forEach(keys, function (value) {
			var obj = _.get(data, value);
			if (obj && _.isPlainObject(obj)) {
				_.set(data, value, [obj]);
			}
		});
	}
	return data;
}

function replaceStrings(string, replaceObj) {
	_.forEach(replaceObj, function (value, key) {
		string = string.replace(new RegExp('@{{' + key + '}}', 'g'), value);
	});
	return string;
}

function makeThirdPartyRequest(data, cb) {
	if (!data.requestURI) {
		return cb('Please provide valid request URL !');
	}
	var requestMethod = 'POST';
	var requestHeaders = {};
	var requestBody = {};
	var requestURI = '';

	if (data.requestMethod) {
		requestMethod = data.requestMethod;
	}
	if (data.requestHeaders) {
		requestHeaders = data.requestHeaders;
	}
	if (data.requestBody) {
		requestBody = data.requestBody;
	}

	if (data.requestBody) {
		requestURI = data.requestURI;
	}

	var options = {
		method: requestMethod,
		body: requestBody,
		headers: requestHeaders,
		url: requestURI,
	};

	request(options, function (error, response, body) {
		if (error) {
			return cb('Error occured while fetching data !');
		}
		return cb(null, body);
	});
}

function sendResponse(data) {
  const functionName = 'sendResponse';
  log.information(functionName, 'data sendResponse', data);
  let finalData = {};
	if (data && data['$data']) {
		return data;
	}
	
	if (!data) {
		finalData = {};
	}

	if(data.msg){
		finalData.message = data.msg;
	}
	if(!data.success){
		finalData.error = data.error || {};
	}
  
	if (typeof data === 'string') {
		finalData.message = data;
	} else {
		_.forEach(data, function (value, key) {
			//ignore '!=' warning
			if (value !== undefined) {
				finalData[key] = value;
			}
		});
	}
  delete finalData.status;
  delete finalData.success;
  delete finalData.msg;
  delete finalData.messageCode;
  delete finalData.languagecode;
  delete finalData.app;
  
	var sendData = {
		dataToProcess: finalData,
		clientShelterCreds: _.get(finalData, 'clientShelterCreds')
	};
  log.information(functionName, 'sendData sendResponse', sendData);
  
  // postWebhook(data, 'response');
  delete finalData.clientShelterCreds;
  var encryptedError = shelterHelper.encrypt(sendData);
	log.information(functionName, 'sendData sendResponse encrypt', encryptedError);
	return encryptedError;
}

function removeUnnecessaryData (data) {
    let obj = Object.assign({},data);
    delete obj.externalClient;
    delete obj.clientShelterCreds;
    delete obj.headers;
    obj.externalClient = {
      ExternalClientID : data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined
    };
    obj.ExternalClientID = obj.externalClient.ExternalClientID;
    return obj;
}


function setHeader (data) {
    let headers = {}
    headers.externalclientid = data.externalClient && data.externalClient.ExternalClientID ? data.externalClient.ExternalClientID : undefined;
    if (data.headerObj && data.headerObj.app) {
        headers.app = data.headerObj.app;
    } else if (data.externalClient && data.externalClient.ConstantName) {
        headers.app = data.externalClient.ConstantName;
    } else if (data.app) {
        headers.app = data.app;
    } else {
        headers.app = 'PublicApi';
    }
    if(data.headerObj) {
        data.headerObj.authorization ? headers.authorization = data.headerObj.authorization : null;
        data.headerObj.module ? headers.module = data.headerObj.module : null;
        data.headerObj.source ? headers.source = data.headerObj.source : null;
    }
    delete data.headerObj;
    headers.clientName = data.externalClient && data.externalClient.ClientName ? data.externalClient.ClientName : null;
    headers.PartnerID = data.externalClient && data.externalClient.PartnerID ? data.externalClient.PartnerID : null;
    headers.IntegrationID = data.externalClient && data.externalClient.IntegrationID ? data.externalClient.IntegrationID : null;
    return headers;
}

exports.truncateDecimal = truncateDecimal;
exports.closestMatch = closestMatch;
exports.hasSufficientParameters = hasSufficientParameters;
exports.buildQuery = buildQuery;
exports.arrayToCSV = arrayToCSV;
exports.convertDate = convertDate;
exports.customCatchError = customCatchError;
exports.sendFormattedResponse = sendFormattedResponse;
exports.postWebhook = postWebhook;
exports.validatorFunctions = validatorFunctions;
exports.gsxProd = gsxProd;
exports.convertToBool = convertToBool;
exports.convertFromBool = convertFromBool;
exports.replaceStrings = replaceStrings;
exports.looksLike = looksLike;
exports.convertObjectsToArray = convertObjectsToArray;
exports.makeThirdPartyRequest = makeThirdPartyRequest;
exports.sendResponse = sendResponse;
exports.removeUnnecessaryData = removeUnnecessaryData;
exports.setHeader = setHeader;