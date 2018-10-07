/**
    @module
*/
import FORMINPUT, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../FORMINPUT.js';
/**
    Represents an INPUT TOKEN for an Icarus Form
    @class
    @extends FORMINPUT
*/
export default class FORMINPUTTOKEN extends FORMINPUT {
/**
    Constructs a FORMINPUTTOKEN element
    @param {EL} node Parent
    @param {MODEL} model The model
 */
constructor(node, model) {
super(node, new MODEL(new ATTRIBUTES({
'type': 'HIDDEN',
'name': model.attributes.name,
'value': model.token
})));
}
}
export { ATTRIBUTES, EL, FORMINPUT, INPUTTYPES, MODEL };