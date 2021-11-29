module.exports = ({ validations, data }) => {
    const errors = [];
    const isValueOfType = (value, type) => typeof value === type;
    const isString = value => isValueOfType(value, 'string');
    const isNumber = value => isValueOfType(value, 'number');
    const isBoolean = value => isValueOfType(value, 'boolean');
    const isFunction = value => isValueOfType(value, 'function');
    const isArray = value => Array.isArray(value);
    const isObject = value => !isArray(value) && isValueOfType(value, 'object');
    const validationUtils = {
        isString,
        isNumber,
        isBoolean,
        isFunction,
        isObject,
    }
    validations.map(validation => {
        const value = data[validation.key];
        const individualErrors = [];
        validation.rules.map(rule => {
            if (!rule.isValid(value, validationUtils)) {
                individualErrors.push(rule.getErrorMsg(validation.key))
            }
        })
        individualErrors.length && errors.push({ [validation.key]: individualErrors });
    })
    return errors.length ? errors : false;
}