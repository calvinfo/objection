Objection
-------------

A simple object validator for node. (Still under development)

Installation
=======

        $ npm install objection


Motivation
=======

I've found many times running application servers in node that I want to validate the user input. I liked Mongoose's style of providing methods to validate schema - but I found it to be a bit more heavyweight than what I was looking for. Objection is designed to be simple, lightweight, and easy to use.

Usage
=====

#### Declaration

Mapping your schema is easy, and flexible.

```javascript

var objection = require('objection');

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

```

##### Validation

Validation is also simple, and can be done either through the module or directly through the validators. Each validation returns an object with a valid field and an array of errors.

```javascript

var result = objection.validate('Post', {
    
    author : {
        username : 'calvinfo'
    },

    text : 'Hello world'
});

result.valid; // true
result.errors; // []
```