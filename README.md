#run-function-with-signature (SchemaFunction)

## Description

Name your function (ex. 'My Special Function With Signatures'), write your function body, optionally write a schema to validate the function's parameter object and/or the function's response object.

If anything fails validation, `throw new Error(err)`.

Set properties on construction using the 'params' parameter or set properties after construction using 'instance.property = value;' syntax.

Export as simple, single property function.

## API

```
var SchemaFunction = require('run-function-with-signature');

/**
 * SchemaFunction
 * Creates a function that will validate it's input and output against provided schemas.
 * @type {class}
 * @param {string} id - string indentifier, can include spaces.
 * @param {object} params - an object to set the properties on construction
 * @param {function} params.func - the function that this object runs
 * @param {object} params.input - the input object for params.func
 * @param {object} params.inputSchema - json schema describing the input object
 * @param {object} params.outputSchema - json schema describing the output object
 * @return {object} An instance of SchemaFunction
**/

## Usage

/**/
let myFunc = new SchemaFunction('test function', { func: (input) => {

    console.log(input);

    return {
      c: 'this is my response',
      d: 3,
    }
  }
});

myFunc.inputSchema = {
  properties: {
      a: { type: 'integer' },
      b: { type: 'string' },
  },
  required: ['a', 'b'],
};

myFunc.outputSchema = {
  properties: {
      c: { type: 'string' },
      d: { type: 'integer' },
  },
  required: ['c', 'd'],
};

// Export as function
function myRunFunction(input){
  return myFunc.run(input);
}

const returnFromTheFunc = myRunFunction({
  a: 3,
  b: 'string',
});

// returns { c: 'this is my response', d: 3 }
console.log(returnFromTheFunc);
/**/
```
