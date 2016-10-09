#run-function-with-signature

`throw new Error(err)` if the input or output fails validation.

## Usage


```
var runFunction = require('run-function-with-signature');

function testFunction(input){
    return {
        c: 'this is my response',
        d: 3,
    }
}

const functionReturnValue = runFunction(testFunction, {

    //INPUT
    a: 3,
    b: 'string'
    
}, {

    //INPUT SCHEMA
    id: 'testinput',
    properties: {
        a: { type: 'integer' },
        b: { type: 'string' }
    },
    required: ['a', 'b']

}, {

    //OUTPUT SCHEMA
    id: 'testoutput',
    properties: {
        c: { type: 'string' },
        d: { type: 'integer' }
    },
    required: ['c', 'd']

}, { 

    //OPTIONS
    responseRequired: false

});

console.log(functionReturnValue);
```
