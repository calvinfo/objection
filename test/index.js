
var objection = require('../'),
    should    = require('should');

describe('Validator Tests', function () {


    describe('#validate()', function () {

        /*
        it('should validate a simple validator of each type', function () {

            var validator = objection.map({

                date    : 'date',
                string  : 'string',
                number  : 'number',
                boolean : 'boolean'
            });

            var result = validator.validate({

                date    : new Date(),
                string  : '',
                number  : 0,
                boolean : true
            });

            result.valid.should.be.true;

            result = validator.validate({
                date    : 'test',
                string  : 0,
                number  : 'test',
                boolean : 'test'
            });

            result.valid.should.be.false;
            result.errors.should.have.length(4);
        });*/


        it('should validate a simple function validator', function () {

            var validator = objection.map(function (obj) {
                return obj;
            });

            var result = validator.validate(false);

            result.valid.should.be.false;

            result = validator.validate(true);

            result.valid.should.be.true;
        });
    });



});