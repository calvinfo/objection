
var _           = require('underscore'),
    validators  = require('./validators');


/**
 * Maps a validator object, uses a name if specified.
 * @param  {String} name    name of the validation description
 * @param  {Object} object  validation description
 * @param  {Object} options
 */
exports.map = function (name, object, options) {

    if (_.isObject(name)) {

        object  = name;
        options = object;
        name    = null;
    }

    var validator = new validators.Validator(name, object, options);

    if (name)
        validators.validators[name] = validator;

    return validator;
};


/**
 * Validates the object based upon the provided name.
 * @param  {String|Validator} validator   name or actual validator
 * @param  {Object}           object      object to be validated
 * @return {Object}                       { hasErrors : boolean,
 *                                          errors    : Array }
 */
exports.validate = function (validator, object, options) {


    if (!_.isFunction(validator)) {

        validator = validators.validators[validator];
    }


    var errors = validator.validate(object);

    return {
        valid     : _.isEmpty(errors),
        errors    : errors
    };

};


/**
 * Returns only the fields found in the object (useful for extending)
 * @param  {[type]} name    [description]
 * @param  {[type]} object  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.clean = function (validator, object, options) {

    if (!_.isFunction(validator)) {

        validator = validators.validators[validator];
    }


    return validator.clean(object, options);

};
