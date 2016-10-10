var Validator = require('jsonschema').Validator;
var v = new Validator();

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
class SchemaFunction {
  constructor(id, params) {
    this.id = id;
    this.func = params.func;
    this.input = params.input;
    this.inputSchema = params.inputSchema;
    this.outputSchema = params.outputSchema;
  }

  run(setInput){
    this.input = setInput || this.input;

    if (!this.id) new ThrowError('NO ID', `missing id`);

    function validateInput(){
      if (!this.inputSchema) return;

      if (!this.inputSchema.properties)
        new ThrowError(this.id, `input missing 'properties' property`);

      //default additionalProperties to false
      this.inputSchema.additionalProperties = this.inputSchema.additionalProperties === undefined
        ? false : this.inputSchema.additionalProperties;

      this.inputSchema.id = `${this.id}-input`;
      this.inputSchema.type = 'object';

      //validate input
      var inputValidator = new Validator();
      var inputValidation = inputValidator.validate(this.input, this.inputSchema);
      if(inputValidation.errors.length)
        new ThrowError(this.id, `input validation errors`, inputValidation.errors);
    }

    function validateOutput(){
      if (!this.outputSchema) {
        return this.func(this.input);
      }

      if (!this.outputSchema.properties)
        new ThrowError(this.id, `output missing 'properties' property`);

      this.outputSchema.additionalProperties = this.outputSchema.additionalProperties === undefined
        ? false : this.outputSchema.additionalProperties;

      this.outputSchema.id = `${this.id}-output`;
      this.outputSchema.type = 'object';

      //run function
      var funcReturn = this.func(this.input);
      if (!funcReturn)
        new ThrowError(this.id, `function response undefined`);

      //validate response
      var ouputValidator = new Validator();
      var ouputValidation = ouputValidator.validate(funcReturn, this.outputSchema);
      if(ouputValidation.errors.length)
        new ThrowError(this.id, `output validation errors`, ouputValidation.errors);

      return funcReturn;
    }

    validateInput.apply(this);
    return validateOutput.apply(this);
  }
}

/**
 * ThrowError
 * Creates an error object and throws an error
 * @type {class}
 * @param {string} id - string indentifier, can include spaces.
 * @param {object} message - a description of why the error was thrown
 * @param {object} error - the error returned by the validator
**/
class ThrowError {
  constructor(id, message, error) {
    this.id = id;
    this.message = message;
    this.error = error;

    throw new Error(JSON.stringify(this));
  }
}

module.exports = SchemaFunction;
