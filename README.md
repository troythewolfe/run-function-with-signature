#run-function-with-signature

`throw new Error(err)` if the input or output fails validation.

## Usage


```
var SchemaFunction = require('run-function-with-signature');

/**/
// USAGE
let myFunc = new SchemaFunction('test function', { options: {
    // available options
    //responseRequired: false,
  },
});

myFunc.inputSchema = {
  properties: {
      a: { type: 'integer' },
      b: { type: 'string' },
  },
  required: ['a', 'b'],
}

myFunc.func = () => {
  return {
    c: 'this is my response',
    d: 3,
  }
}

myFunc.outputSchema = {
  properties: {
      c: { type: 'string' },
      d: { type: 'integer' },
  },
  required: ['c', 'd'],
}

//To export as standard function
function myRunFunction(input){
  return myFunc.run(input);
}

const returnFromTheFunc = myRunFunction({
  a: 3,
  b: 'string',
});

console.log(returnFromTheFunc);
/**/
```
