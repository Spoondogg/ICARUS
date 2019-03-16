/** @module */
import CONTAINER, { ATTRIBUTES, EL, Expand, INPUTTYPES, MODEL } from '../CONTAINER.js';
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
        this.element = element;
		this.addClass('form-element');
		this.implement(new Hideable(this));
    }
    constructElements() {
        //console.log(this.className + '.constructElements()', this);
        if (this.dataId > 0) {
            this.createEditableElement('label', this.body.pane);
        } else {
            this.label = new LABEL(this.body.pane, new MODEL().set('innerHTML', this.label || this.element));
            console.log('No data exists for ' + this.className);
            this.navheader.el.dispatchEvent(new Expand(this));
        }
    }
	/** If no children supplied...
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
	}
}
export { ATTRIBUTES, CONTAINER, EL, Expand, INPUTTYPES, LABEL, MODEL }