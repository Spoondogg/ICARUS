/** @module */
import CONTAINER, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../CONTAINER.js';
import Hideable from '../../../../interface/Hideable.js';
import LABEL from '../../label/LABEL.js';
/** An abstract Form Element
    @abstract
    @class
    @extends CONTAINER
*/
export default class FORMELEMENT extends CONTAINER {
	/** Constructs a Form Element
        @param {FORMELEMENTGROUP} node The parent
        @param {string} element INPUT, SELECT, TEXTAREA
        @param {MODEL} model the data model
    */
	constructor(node, element, model) {
		super(node, 'DIV', model);
		this.addClass('form-element');
		this.implement(new Hideable(this));
		this.label = new LABEL(this.body.pane, new MODEL().set('innerHTML', model.label || element));
	}
	/** If no children supplied...
	    @returns {Promise<ThisType>} callback
	*/
	ifEmpty() {
		return Promise.resolve(this);
	}
}
export { ATTRIBUTES, CONTAINER, EL, INPUTTYPES, LABEL, MODEL }