
var ValidationError = exports.ValidationError = function (message, code) {

    this.message    = message;
    this.code       = code;

};


ValidationError.prototype.toString = function () {

    return [this.code, this.message].join(':');
};