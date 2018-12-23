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
        //this.navBar.header.menu.getGroup('ELEMENTS').empty();
        this.label = new LABEL(this.body.pane, model.label || element);
	}
	/** Construct with an associated LABEL element
        Sets a default label of '__NoLabel' if none is provided
        @returns {Promise<ThisType>} callback
    */
	construct() {
        Promise.resolve(this);
    }
    /** Sets the label of this element to the given value.
        @param {string} label The name to be set
        @returns {ThisType} Returns this object for method chaining
    
    setLabel(label) {
        this.navBar.menu.tab.anchor.setInnerHTML(label);
        this.lbl.setInnerHTML(label);
        this.input.el.setAttribute('name', label);
        return this;
    }*/
}
export { ATTRIBUTES, CONTAINER, EL, INPUTTYPES, LABEL, MODEL }; //CONTAINER