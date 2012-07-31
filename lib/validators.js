
var _           = require('underscore'),
    errors      = require('./errors');


var Validator = exports.Validator = function (type, schema, options) {

    this.type       = type;
    this.options    = options;

    if (_.isFunction(schema)) {

        this.fn = schema;
    } else if (_.isObject(schema)) {

        this.schema = schema;
    }
};


/**
 * Validate the given object
 * @param  {Object} object object to be validated
 * @return {Array}         array of errors
 */
Validator.prototype.validate = function (object, options, callback) {

    if (_.isFunction(options)) {

        callback = options;
        options  = {};
    }

    var errs = [];

    // If we already have a function instead, just execute it.
    if (this.fn) {

        errs = executeFn(this.fn, object, options);

    } else {

        // Look through each piece of the schema and validate it.
        _.each(this.schema, function (value, key) {

            errs = errs.concat(validateItem(value, key, object));
        });
    }

    var output = { valid     : _.isEmpty(errs),
                   errors    : errs };


    if (callback) {
        return callback(null, output);
    } else {
        return output;
    }
};


/**
 * Executes the validator function on the object and options.
 * Used internally when the validator is just described with a function.
 * @param  {Function} fn
 * @param  {Object}   object
 * @param  {Object}   options
 * @return {Array}    errs
 */
var executeFn = function (fn, object, options) {

    var errs   = [],
        result = fn(object, options);

    if (_.isBoolean(result)) {

        if (!result)
            errs.push(new errors.ValidationError(this.type + ' error',
                                                 'INVALID'));

    } else {
        errs = errs.concat(result.errors);
    }

    return errs;
};


/**
 * Validates an individual item.
 * @param  {Mixed}  validationEntry object, string or array which defines
 * @param  {String} key             the key in the object
 * @param  {Object} object          full object to validate
 * @return {ARray}  errs
 */
var validateItem = function (validationEntry, key, object) {

    var type = validationEntry,
        opts = {},
        errs = [];

    // Must use the object form instead.
    if (!_.isString(validationEntry) && !_.isArray(validationEntry)) {

        type = validationEntry.type;
        opts = validationEntry;
    }

    var validator = validators[type],
        objectVal = object[key];

    // Check required.
    if (_.isUndefined(objectVal) || _.isNull(objectVal)) {

        if (opts.required) {
            return errs.push(new errors.ValidationError(key + ' was required',
                                                    'MISSING_KEY'));
        }

    } else {

        if (validator) {

            errs = errs.concat(validator.validate(objectVal, opts).errors);

        } else {
            var error = new errors.ValidationError(key + ' validator not found',
                                                   'SCHEMA_NOT_FOUND');
            errs.push(error);
        }
    }

    return errs;
};


var StringValidator = new Validator('string');

StringValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isString(value))
        errs.push(new errors.ValidationError(value + ' is not a string',
                                             'INVALID_STRING'));

    return { valid     : _.isEmpty(errs),
             errors    : errs };
};



var NumberValidator = new Validator('number');

NumberValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isNumber(value))
        errs.push(new errors.ValidationError(value + ' is not a number',
                                             'INVALID_NUMBER'));

    return { valid     : _.isEmpty(errs),
             errors    : errs };
};


var BooleanValidator = new Validator('boolean');

BooleanValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isBoolean(value))
        errs.push(new errors.ValidationError(value + ' is not a boolean',
                                             'INVALID_BOOLEAN'));
    return { valid     : _.isEmpty(errs),
             errors    : errs };

};


var DateValidator = new Validator('date');

DateValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isDate(value))
        errs.push(new errors.ValidationError(value + ' is not a date',
                                             'INVALID_DATE'));

    return { valid     : _.isEmpty(errs),
             errors    : errs };
};


var validators = exports.validators = {

    'string'    : StringValidator,
    'str'       : StringValidator,
    'number'    : NumberValidator,
    'num'       : NumberValidator,
    'boolean'   : BooleanValidator,
    'bool'      : BooleanValidator,
    'date'      : DateValidator

};