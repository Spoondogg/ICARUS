/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
import LABEL from '../../label/LABEL.js';
import EL from '../../EL.js';
/**
    A generic Form Element.

    @description Icarus form elements represent generic required values
    for INPUT, SELECT or TEXTAREA items. This object is
    generally passed into the Input, Select
    or TextArea to set its values.

    @class
    @extends CONTAINER
*/
export default class FORMELEMENT extends CONTAINER {
	/**
	    Constructs a Form Element 
	    @param {FORMELEMENTGROUP} node The parent
	    @param {string} element INPUT, SELECT, TEXTAREA
	    @param {MODEL} model the data model
	 */
	constructor(node, element, model) {
		model.hasSidebar = 0;
		super(node, 'DIV', model);
		this.addClass('form-element');
		//this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0');
	}
	/**
	    Construct with an associated LABEL element
	    Sets a default label of '__NoLabel' if none is provided
	*/
	construct() {
		this.label = new LABEL(this.body.pane, this.label ? this.label : this.attributes.name ? this.attributes.name : '__NoLabel');
	}
}