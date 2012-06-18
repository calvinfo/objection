
var _           = require('underscore'),
    validators  = require('./validators');


/**
 * Maps a validator object to the given name.
 * @param  {String} name   name of the validation description
 * @param  {Object} object validation description
 */
exports.map = function (name, object, options) {

    var validator = new validators.Validator(name, object, options);

    validators.validators[name] = validator;
};


/**
 * Validates the object based upon the provided name.
 * @param  {String} name
 * @param  {Object} object object to be validated
 * @return {Array}         returns an array of errors
 */
exports.validate = function (name, object) {

    var validator = validators.validators[name];

    var errors = validator.validate(object);

    return {

        hasErrors : _.isEmpty(errors),
        errors    : errors
    };

};