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
        this.attributes.set('name', attributes.name);
        this.attributes.set('type', attributes.type);
        this.attributes.set('class', attributes.class);
        this.attributes.set('value', attributes.value);        
        this.attributes.set('readonly', attributes.readonly);
        this.attributes.set('placeholder', attributes.placeholder);
    }
}
export { ATTRIBUTES, MODEL }