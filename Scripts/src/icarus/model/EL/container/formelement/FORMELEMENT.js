/** @module */
import CONTAINER, { ATTRIBUTES, Collapse, EL, Expand, INPUTTYPES, MODEL } from '../CONTAINER.js';
import Hideable from '../../../../interface/Hideable.js';
import LABEL from '../../label/LABEL.js';
/** An abstract Form Element
    @abstract
    @class
    @extends CONTAINER
*/
export default class FORMELEMENT extends CONTAINER {
	/** Constructs a Form Element
        @param {EL} node Parent Node
        @param {MODEL} model Model
    */
	constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('form-element');
        this.implement(new Hideable(this));
        /** The Form Element Label
            @type {LABEL}
        */
        this.inputLabel = new LABEL(this.body.pane, new MODEL().set('innerHTML', model.label));
        /** The primary INPUT Element and data holder for this Form Element
            @type {INPUT}
        */
        this.input = null;
    }
	/** If no children supplied...
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
    }   
}
export { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, INPUTTYPES, LABEL, MODEL }