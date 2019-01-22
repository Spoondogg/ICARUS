/** @module */
import CONTAINER, {	ATTRIBUTES,	EL,	MODEL, createInputModel } from '../CONTAINER.js';
import FORMINPUT, {	FORMELEMENT } from './forminput/FORMINPUT.js';
import FORMPOSTINPUT from './formpostinput/FORMPOSTINPUT.js';
import FORMSELECT from './formselect/FORMSELECT.js';
import FORMTEXTAREA from './formtextarea/FORMTEXTAREA.js';
/** A container made up of a group of form elements
    @class
    @extends CONTAINER
*/
export default class FORMELEMENTGROUP extends CONTAINER {
	/** Constructs a Form Element Group
	    @param {EL} node The parent
	    @param {MODEL} model datamodel
    */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.addClass('form-element-group');
		this.navBar.menu.list.get('ELEMENTS').empty();
		['FORMELEMENT', 'FORMINPUT'].forEach((c) => this.addContainerCase(c)); // 'FORMSELECT', 'FORMTEXTAREA'
	}
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return this.callback(() => {
			if (this.dataId > 0) {
				this.createEditableElement('header', this.body.pane).then((header) => $(header.el).insertBefore(this.body.pane.el));
			}
			this.populate(children);
		});
		/*return new Promise((resolve, reject) => {
		    try {
		        if (this.dataId > 0) {
		            this.createEditableElement('header', this.body.pane).then((header) => $(header.el).insertBefore(this.body.pane.el));
		        }
		        this.populate(children).then(() => resolve(this));
		    } catch (e) {
		        reject(e);
		    }
		});*/
	}
	/** Adds the given array of FORMELEMENT(s) to this group
	    @param {Array<FORMELEMENT>} inputs A list of inputs
	    @returns {ThisType} Returns this FORMELEMENTGROUP
	*/
	addInputElements(inputs) {
		return new Promise((resolve, reject) => {
			try {
				resolve(inputs.forEach((i) => this.addInputElement(i)));
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Adds the given FORMELEMENT to this group
	    @param {MODEL} input A FORM INPUT MODEL
	    @returns {FORMELEMENT} A FORMELEMENT object
	*/
	addInputElement(input) {
		return new Promise((resolve, reject) => {
			try {
				let inp = null;
				if (input.type === 'FORMPOSTINPUT') {
					inp = new FORMPOSTINPUT(this.body.pane, input);
				} else {
					switch (input.element) {
						case 'TEXTAREA':
							inp = new FORMTEXTAREA(this.body.pane, input);
							break;
						case 'SELECT':
							inp = new FORMSELECT(this.body.pane, input);
							break;
						case 'INPUT':
							inp = new FORMINPUT(this.body.pane, input);
							break;
						default:
							inp = new FORMINPUT(this.body.pane, input);
							break;
					}
				}
				resolve(this.addChild(inp));
			} catch (e) {
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, createInputModel, EL, FORMELEMENT,	FORMELEMENTGROUP, MODEL }