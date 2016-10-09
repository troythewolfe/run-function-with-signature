var Validator = require('jsonschema').Validator;
var v = new Validator();

function runWithSig(func, input, inputSchema, outputSchema, options) {
    function setIfDefined(option, alt){
        return typeof option !== 'undefined' ? option : alt;
    }

    options = {
        responseRequired: setIfDefined(options.responseRequired, true)
    };

    //make sure they have an id and properties
    if (!inputSchema.id) throw new Error(`input schema missing id`);
    if (!outputSchema.id) throw new Error(`output schema missing id`);
    if (!inputSchema.id) throw new Error(`input schema ${inputShema.id} missing properties`);
    if (!outputSchema.id) throw new Error(`output schema ${inputSchema.id} missing properties`);

    //default additionalProperties to false
    inputSchema.additionalProperties = inputSchema.additionalProperties === undefined ? false : inputSchema.additionalProperties;
    outputSchema.additionalProperties = outputSchema.additionalProperties === undefined ? false : outputSchema.additionalProperties;

    inputSchema.type = 'object';
    outputSchema.type = 'object';

    //validate input
    var inputValidator = new Validator();
    var inputValidation = inputValidator.validate(input, inputSchema);
    if(inputValidation.errors.length) throw new Error(inputValidation.errors);

    //run function
    var funcReturn = func(input);
    if (options.responseRequired && !funcReturn) throw new Error(`output schema for ${outputSchema.id} is undefined`);

    //validate response
    var ouputValidator = new Validator();
    var ouputValidation = ouputValidator.validate(funcReturn, outputSchema);
    if(ouputValidation.errors.length) throw new Error(ouputValidation.errors);

    return funcReturn;
}

module.exports = runWithSig;