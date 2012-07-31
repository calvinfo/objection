
var objection = require('../'),
    should    = require('should');

describe('Validator Tests', function () {


    describe('#validate()', function () {


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
        });


        it('should validate a simple function validator', function () {

            var validator = objection.map(function (obj) {
                return obj;
            });

            var result = validator.validate(false);

            result.valid.should.be.false;

            result = validator.validate(true);

            result.valid.should.be.true;
        });

        it('should validate nested objects', function () {

            var User = objection.map('User', {
                created : 'date',
                admin : 'boolean',
                username : 'string'
            });

            objection.map('Comment', {
                author : 'User',
                text : 'string',
                votes : 'number'
            });

            objection.map('Post', {
                author : User,
                text : 'string',
                created : 'date'
            });

            var user =  { created : new Date(),
                          admin : true,
                          username : 'calvinfo' };

            var badUser = { created : 0,
                            admin   : 0,
                            username : 'calvinfo' };

            var result = objection.validate('User', user);

            result.valid.should.be.true;

            result.errors.should.have.length(0);

            result = objection.validate('User', badUser);

            result.valid.should.be.false;

            result.errors.should.have.length(2);


            result = objection.validate('Comment', {
                author : user,
                text   : 'hello world',
                votes  : 200
            });

            result.valid.should.be.true;

            result = objection.validate('Comment', {
                author : badUser,
                text   : 'hello world',
                votes  : 200
            });

            result.valid.should.be.false;

            result = objection.validate('Post', {
                author : user,
                text   : 'hello world',
                votes  : 200
            });

            result.valid.should.be.true;

            result = objection.validate('Post', {
                author : badUser,
                text   : 'hello world',
                votes  : 200
            });

            result.valid.should.be.false;
        });


        it('should accept nested functions', function() {

            objection.map('TestObjection', function (val) {
                return val === 'objection'; });

            var validator = objection.map('NestFunc', {

                name : 'string',
                val  : 'TestObjection'
            });

            var result = objection.validate('NestFunc', { name : 'calvin',
                                                          val  : 'objection' });

            result.valid.should.be.true;

            result = validator.validate({ name : 'calvin',
                                          val  : 'objection?!' });

            result.valid.should.be.false;

        });

        it('should accept required arguments', function () {

            objection.map('Required', {

                email : { required : true, type : 'str' },
                name  : 'str'

            });

            var result = objection.validate('Required', { email : 'hello' });
            result.valid.should.be.true;

            result = objection.validate('Required', { email : 'hello',
                                                      name  : 'dog' });
            result.valid.should.be.true;

            result = objection.validate('Required', { name : 'dog' });
            result.valid.should.be.false;
        });

    });

    describe('#validate() - arrays', function () {

        it('should accept arrays', function () {

            objection.map('BasicArrays', {

                steps : []
            });

            var result = objection.validate('BasicArrays', { steps : '4' });
            result.valid.should.be.false;

            result = objection.validate('BasicArrays', { steps : [1,2,'a'] });
            result.valid.should.be.true;

        });


        it('should accept arrays with types', function () {

            objection.map('StringArray', {

                array : ['string']
            });

            var result = objection.validate('StringArray', { array : '4' });
            result.valid.should.be.false;

            result = objection.validate('StringArray', { array : ['b', 2,'a'] });
            result.valid.should.be.false;

            result = objection.validate('StringArray', { array : ['b','c','a'] });
            result.valid.should.be.true;

        });

        it('should accept arrays in object form', function () {

            objection.map('StringArray2', {

                array : { type : ['string'], required : true }
            });

            var result = objection.validate('StringArray2', { array : 4 });
            result.valid.should.be.false;

            result = objection.validate('StringArray2', { array : ['b', 2,'a'] });
            result.valid.should.be.false;

            result = objection.validate('StringArray2', { array : ['b','c','a'] });
            result.valid.should.be.true;

            result = objection.validate('StringArray2', {});
            result.valid.should.be.false;

        });
    });
});