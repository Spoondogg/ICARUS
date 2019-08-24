import CONTAINER, { EL, MODEL } from '../container/CONTAINER.js';
/** DIALOGMODEL Additional Properties
    @typedef {Object} props Properties
    @property {CONTAINER} container The DIALOG Container Reference
    @property {EL} caller A Switchable Element that called this DIALOG
    @property {string} label A DIALOG Label
    @property {string} [text] DIALOG Text 
    @deprecated See DATAELEMENTS.MODELS
*/
export default class DIALOGMODEL extends MODEL {
    /** A DIALOG MODEL
        @param {DialogModel} model Model
        @param {props} props Object Properties
    */
    constructor(model, props) {
        super(model.attributes, model.data, model.meta);
        /** The DIALOG Container
            @type {CONTAINER} 
        */
        this.container = this.required(props.container);
        /** A Switchable Element
            @type {EL}
        */
        this.caller = this.required(props.caller);
        /** Dialog Label
            @type {string}
        */
        this.label = this.required(props.label);
        /** Dialog Text
            @type {string}
        */
        this.text = props.text;
    }
}
export { CONTAINER, EL, MODEL }