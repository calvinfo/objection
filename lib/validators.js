
var _           = require('underscore'),
    errors      = require('./errors');


var Validator = exports.Validator = function (name, schema, options) {

    this.name       = name;
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

        var result = this.fn(object, options);

        if (_.isBoolean(result)) {

            if (!result)
                errs.push(new errors.ValidationError());

        } else {
            errs = errs.concat(result.errors);
        }

    } else {

        // Look through each piece of the schema and validate it.
        _.each(this.schema, function (value, key) {

            var type        = value;

            // Determine whether this validator should be applied.
            var opts        = {};

            // Must use the object form instead.
            if (!_.isString(value)) {

                type                    = value.type;
                opts                    = value;
            }

            var objectVal = object[key],
                validator = validators[type];

            if ((_.isUndefined(objectVal) || _.isNull(objectVal)) && opts.required) {

                return errs.push(new errors.ValidationError(key + ' was required',
                                                            'MISSING_KEY'));
            }

            if (validator) {

                errs = errs.concat(validator.validate(objectVal, opts).errors);

            } else {
                var error = new errors.ValidationError(key + ' validator not found',
                                                       'SCHEMA_NOT_FOUND');
                errs.push(error);
            }
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