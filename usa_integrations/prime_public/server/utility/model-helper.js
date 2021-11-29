var app = require('./../server');
var requireHelper = require('./require-helper');
var utils = require('./utils');
var constants = requireHelper.constants;
var _ = requireHelper._;
var paginate = requireHelper.paginate;
var customCatchError = requireHelper.customCatchError;
var defaultPaginationObj = requireHelper.defaultPaginationObj;
var env = requireHelper.env;

function modelExists(model) {
    if (!model)
        throw new Error('No model sent');

    if (!_.isFunction(model))
        throw new Error('model is not a function');

    return true;
}

function methodExists(model, methodPath) {
    modelExists(model);

    if (!_.has(model, methodPath))
        throw new Error('model does not have a ' + methodPath + ' key');

    if (!_.isFunction(_.get(model, methodPath)))
        throw new Error('model.' + methodPath + ' is not a function');

    return true;
}

function getModelName(model) {
    var modelName = _.get(model, 'definition.name');
    if (!modelName)
        throw new Error('model does not have a name');
    if (!_.isString(modelName))
        throw new Error('model "definition.name" is not a string');

    return modelName;
}

function getModelPlural(model) {
    var modelName = getModelName(model);
    var plural = _.get(model, 'settings.plural');
    if (!plural)
        throw new Error(modelName + ': model does not have a plural');
    if (!_.isString(plural))
        throw new Error(modelName + ': model "settings.plural" is not a string');

    return plural;
}


function getIdNameOrDefault(model) {
    var rawProperties = _.get(model, 'definition.rawProperties');
    var id = 'id';
    if (rawProperties) {
        _.forEach(rawProperties, function (value, key) {
            if (_.has(value, 'id') && value.id)
                id = key;
        });
    }
    return id;
}

function create(model) {
    const functionName = 'create';
    methodExists(model, 'create');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (createObj, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName,'error from cb function in create', error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of create',result);
                return callback(null, {
                    status: 200,
                    message: 'A ' + modelName + ' was created successfully',
                    success: true,
                    msg: 'A ' + modelName + ' was created successfully',
                    data: result
                });
            }
        }

        var args = [];
        args.push(createObj);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.create.apply(model, args);
    };
}

function findById(model) {
    const functionName = 'findById';
    methodExists(model, 'findById');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);
    var idName = getIdNameOrDefault(model);

    return function (id, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName, 'error from cb function in findById',error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of findById',result);
                return callback(null, result);
            }
        }

        var args = [];
        args.push(id);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.findById.apply(model, args);
    };
}

function count(model) {
    const functionName = 'count';
    methodExists(model, 'count');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (filter, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName,'error from cb function in count',error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of count',result);
                return callback(null, result);
            }
        }

        var args = [];
        args.push(filter);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.count.apply(model, args);
    };
}

function find(model) {
    const functionName = 'find';
    methodExists(model, 'find');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (filter, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName, 'error from cb function in find', error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of find',result);
                return callback(null, result);
            }
        }

        var args = [];
        args.push(filter);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.find.apply(model, args);
    };
}

function findOne(model) {
    const functionName = 'findOne';
    methodExists(model, 'findOne');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (filter, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName, 'error from cb function in findOne', error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of findOne',result);
                return callback(null, result);
            }
        }

        var args = [];
        args.push(filter);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.findOne.apply(model, args);
    };
}

function exists(model) {
    const functionName = 'exists';
    methodExists(model, 'exists');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (id, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName, 'error from cb function in exists', error);
                return callback(customCatchError());
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of exists',result);
                return callback(null, result);
            }
        }

        var args = [];
        args.push(id);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.exists.apply(model, args);
    };
}


function oneExists(model) {
    const functionName = 'oneExists';
    methodExists(model, 'findOne');
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);

    return function (filter, txnObj, callback) {
        if (!_.isFunction(callback)) {
            if (_.isFunction(txnObj)) {
                callback = txnObj;
                txnObj = undefined;
            } else {
                throw new Error('create', modelName, 'needs a callback function as the second or the third parameter');
            }
        }

        function _cb(error, result) {
            if (error) {
                log.errorInfo(functionName,'error from cb function in oneExists',error);
                return callback(null, false);
            } else {
                log.information(functionName,'model name',modelName);
                log.information(functionName,'result of oneExists',result);
                return callback(null, true);
            }
        }

        var args = [];
        args.push(filter);
        if (txnObj) args.push(txnObj);
        args.push(_cb);

        model.findOne.apply(model, args);
    };
}

function getEntitiesRes(model) {

    modelExists(model);
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);
    var plural = getModelPlural(model);

    return function (data) {
        var resObj = {
            success: true,
            status: 200,
            data: {}
        };

        if (data.length === 0) {
            resObj.msg = 'No ' + plural + ' found';
            resObj.message = 'No ' + plural + ' found';
            resObj.data[_.lowerFirst(plural)] = data;
        } else {
            resObj.msg = 'Success';
            resObj.message = 'Success';
            resObj.data[_.lowerFirst(plural)] = data;
        }

        return resObj;
    };
}

function paginateData(model) {

    modelExists(model);
    var modelName = getModelName(model);
    var log = requireHelper.createBunyanLogger(modelName);
    var plural = getModelPlural(model);
    var getResObj = getEntitiesRes(model);

    return function (data, count, currentPage, callback) {

        if (!_.isArray(data))
            throw new Error('data should be an array');

        if (!_.isNumber(count))
            throw new Error('count should be a number');

        if (count < 0)
            throw new Error('count should not be less than 0');

        if (!_.isNumber(currentPage))
            throw new Error('currentPage should be a number');

        if (currentPage <= 0)
            throw new Error('currentPage should be greater than 0');

        var resObj = getResObj(data);

        if (count === 0) {
            resObj.data.pagination = defaultPaginationObj;
        } else {
            var pagination = paginate({
                currentPage: currentPage,
                totalItems: count
            });
            resObj.data.pagination = pagination;
            resObj.data.pagination.currentPage = currentPage;
            resObj.data.pagination.count = count;
        }

        return callback(null, resObj);
    };
}


exports.modelExists = modelExists;
exports.methodExists = methodExists;
exports.getModelName = getModelName;
exports.getModelPlural = getModelPlural;
exports.getIdNameOrDefault = getIdNameOrDefault;
exports.create = create;
exports.findById = findById;
exports.count = count;
exports.find = find;
exports.findOne = findOne;
exports.exists = exists;
exports.oneExists = oneExists;
exports.paginateData = paginateData;
exports.getEntitiesRes = getEntitiesRes;