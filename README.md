#run-function-with-signature

// add a slash to the end of the two stars above to uncomment this block
// USAGE
function testFunction(input){
    return {
        c: 'this is my response',
        d: 3,
    }
}

const funcSigReturn = runWithSig(testFunction, {
    //INPUT
    a: 3,
    b: 'string'
}, {
    //INPUT SCHEMA
    id: 'testinput',
    properties: {
        a: {
            type: 'integer'
        },
        b: {
            type: 'string'
        }
    },
    required: ['a', 'b']

}, {
    //INPUT SCHEMA
    id: 'testoutput',
    properties: {
        c: {
            type: 'string'
        },
        d: {
            type: 'integer'
        }
    },
    required: ['c', 'd']

}, { 
    //OPTIONS
    responseRequired: false
});

console.log(funcSigReturn);
