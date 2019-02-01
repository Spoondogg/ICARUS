/** @module */
import CONTAINER, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../CONTAINER.js';
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
		this.addClass('form-element'); //this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0');
		//this.navbar.header.menu.get('ELEMENTS').empty();
		this.label = new LABEL(this.body.pane, model.label || element);
	}
}
export { ATTRIBUTES, CONTAINER, EL, INPUTTYPES, LABEL, MODEL }