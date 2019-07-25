import MODEL, { ATTRIBUTES } from '../../MODEL.js';
/** INPUTMODEL Additional Properties
    @typedef {Object} attributes Properties
    @property {Name} name Element Name Attribute
    @property {string} type Element Type Attribute
    @property {string} [class] Element ClassName Attribute
    @property {any} [value] Element Value Attribute
    @property {boolean} [readonly=false] Element ReadOnly Attribute
    @property {string} [placeholder] Element Placeholder Attribute
*/
export default class INPUTMODEL extends MODEL {
    /** An INPUT MODEL
        @param {MODEL} model MODEL
        @param {attributes} attributes Attributes
    */
    constructor(model, attributes) {
        super(model.attributes, model.data, model.meta);        
        ['name', 'type', 'class', 'value', 'readonly', 'placeholder', 'autocomplete'].forEach(
            (attribute) => {
                if (typeof attributes[attribute] !== 'undefined') {
                    this.attributes.set(attribute, attributes[attribute]);
                }
            }
        );
    }
}
export { ATTRIBUTES, MODEL }