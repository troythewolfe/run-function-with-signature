var Validator = require('jsonschema').Validator;
var v = new Validator();

class ThrowError {
  constructor(id, message, error) {
    this.id = id;
    this.message = message;
    this.error = error;

    throw new Error(JSON.stringify(this));
  }
}

class SchemaFunction {
  constructor(id, params) {
    this.id = id;
    this.func = params.func;
    this.input = params.input;
    this.inputSchema = params.inputSchema;
    this.outputSchema = params.outputSchema;
    this.options = params.options;
  }

  run(setInput){
    function setIfDefined(option, alt){
        return typeof option !== 'undefined' ? option : alt;
    }

    this.input = setInput || this.input;

    let rr = this.options.responseRequired;

    this.options = {
        responseRequired: setIfDefined(rr, true)
    };

    //make sure they have an id and properties
    if (!this.id) new ThrowError('NO ID', `missing id`);
    if (!this.inputSchema.properties) new ThrowError(this.id, `input missing 'properties' property`);
    if (!this.outputSchema.properties) new ThrowError(this.id, `output missing 'properties' property`);

    //default additionalProperties to false
    this.inputSchema.additionalProperties = this.inputSchema.additionalProperties === undefined
      ? false : this.inputSchema.additionalProperties;
    this.outputSchema.additionalProperties = this.outputSchema.additionalProperties === undefined
      ? false : this.outputSchema.additionalProperties;

    this.inputSchema.id = `${this.id}-input`;
    this.outputSchema.id = `${this.id}-output`;
    this.inputSchema.type = 'object';
    this.outputSchema.type = 'object';

    //validate input
    var inputValidator = new Validator();
    var inputValidation = inputValidator.validate(this.input, this.inputSchema);
    if(inputValidation.errors.length) new ThrowError(this.id, `input validation errors`, inputValidation.errors);

    //run function
    var funcReturn = this.func(this.input);
    if (this.options.responseRequired && !funcReturn) new ThrowError(this.id, `function response undefined`);

    //validate response
    var ouputValidator = new Validator();
    var ouputValidation = ouputValidator.validate(funcReturn, this.outputSchema);
    if(ouputValidation.errors.length) new ThrowError(this.id, `output validation errors`, ouputValidation.errors);

    return funcReturn;
  }
}

/**
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

module.exports = SchemaFunction;
