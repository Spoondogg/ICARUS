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
        if (attributes.name) {
            this.attributes.set('name', attributes.name);
        }
        if (attributes.type) {
            this.attributes.set('type', attributes.type);
        }
        if (attributes.class) {
            this.attributes.set('class', attributes.class);
        }
        if (attributes.value) {
            this.attributes.set('value', attributes.value);
        }
        if (attributes.readonly) {
            this.attributes.set('readonly', attributes.readonly);
        }
        if (attributes.placeholder) {
            this.attributes.set('placeholder', attributes.placeholder);
        }
    }
}
export { ATTRIBUTES, MODEL }