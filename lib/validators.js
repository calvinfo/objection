
var _           = require('underscore'),
    errors      = require('./errors');


var Validator = exports.Validator = function (name, schema, options) {

    this.name       = name;
    this.schema     = schema;
    this.options    = options;
};


/**
 * Validate the given object
 * @param  {Object} object object to be validated
 * @return {Array}         array of errors
 */
Validator.prototype.validate = function (object, options) {

    var errs = [];

    _.each(this.schema, function (value, key) {

        var type        = value,
            opts        = { conditional : true };

        if (!_.isString(value)) {

            type                    = value.type;
            opts                    = value;
            opts.conditional        = value.conditional || true;
        }

        var objectVal = object[key],
            validator = validators[type];

        if ((_.isUndefined(objectVal) || _.isNull(objectVal)) && valOptions.required) {

            return errs.push(new errors.ValidationError(key + ' was required',
                                                        'MISSING_KEY'));
        }

        if (validator && _.result(opts, 'conditional')) {

            errs = errs.concat(validator.validate(objectVal, opts));

        } else {
            var error = new errors.ValidationError(key + ' validator not found',
                                                   'SCHEMA_NOT_FOUND');
            errs.push(error);
        }
    });

    return errs;
};


var StringValidator = new Validator('string');

StringValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isString(value))
        errs.push(new errors.ValidationError(value + ' is not a string',
                                             'INVALID_STRING'));

    return errs;
};



var NumberValidator = new Validator('number');

NumberValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isNumber(value))
        errs.push(new errors.ValidationError(value + ' is not a number',
                                             'INVALID_NUMBER'));

    return errs;
};


var BooleanValidator = new Validator('boolean');

BooleanValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isBoolean(value))
        errs.push(new errors.ValidationError(value + ' is not a boolean',
                                             'INVALID_BOOLEAN'));
    return errs;

};


var DateValidator = new Validator('date');

DateValidator.validate = function (value, options) {

    var errs = [];

    if (!_.isDate(value))
        errs.push(new errors.ValidationError(value + ' is not a date',
                                             'INVALID_DATE'));

    return errs;
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