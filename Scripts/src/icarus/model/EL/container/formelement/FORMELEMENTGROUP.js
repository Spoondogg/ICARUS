/** @module */
import CONTAINER, { ATTRIBUTES, EL, Expand, MODEL, createInputModel } from '../CONTAINER.js';
import FORMINPUT, { FORMELEMENT } from './forminput/FORMINPUT.js';
import FORMPOSTINPUT from './formpostinput/FORMPOSTINPUT.js';
import FORMSELECT from './formselect/FORMSELECT.js';
import FORMTEXTAREA from './formtextarea/FORMTEXTAREA.js';
import Hideable from '../../../../interface/Hideable.js';
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
		this.implement(new Hideable(this));
		this.navheader.menus.get('OPTIONS', 'MENU')[0].get('ELEMENTS', 'MENU')[0].empty();
		['FORMINPUT'].forEach((c) => this.addContainerCase(c)); // 'FORMSELECT', 'FORMTEXTAREA' //'FORMELEMENT', 
	}
	constructElements() {
		if (this.dataId > 0) {
			this.createEditableElement('header', this.body.pane);
		} else {
			console.log('No data exists for ' + this.className);
			this.navheader.el.dispatchEvent(new Expand(this));
		}
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
export { ATTRIBUTES, CONTAINER, createInputModel, EL, Expand, FORMELEMENT, FORMELEMENTGROUP, MODEL }