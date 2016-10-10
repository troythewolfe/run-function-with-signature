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

    function setSchemaProperties(id, schema, type){
      if (!schema.properties)
        new ThrowError(id, `${type} missing 'properties' property`);

      //default additionalProperties to false
      schema.additionalProperties = schema.additionalProperties === undefined
        ? false : schema.additionalProperties;

      schema.id = `${id}-${type}`;
      schema.type = 'object';
    }

    function validate(id, input, schema, type){
      var validator = new Validator();
      var validation = validator.validate(input, schema);
      if(validation.errors.length)
        new ThrowError(id, `${type} validation errors`, validation.errors);
    }

    function validateInput(){
      if (!this.inputSchema) return;
      setSchemaProperties(this.id, this.inputSchema, 'input');
      validate(this.id, this.input, this.inputSchema, 'input');
    }

    function validateOutput(){
      if (!this.outputSchema) {
        return this.func(this.input);
      }

      setSchemaProperties(this.id, this.outputSchema, 'output');

      //run function
      var funcReturn = this.func(this.input);
      if (!funcReturn)
        new ThrowError(this.id, `function response undefined`);

      validate(this.id, funcReturn, this.outputSchema, 'output');

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
