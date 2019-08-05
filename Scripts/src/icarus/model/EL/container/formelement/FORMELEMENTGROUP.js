/** @module */
import CONTAINER, { ATTRIBUTES, DATAELEMENTS, EL, Expand, MODEL } from '../CONTAINER.js';
import FORMINPUT, { FORMELEMENT } from './forminput/FORMINPUT.js';
import FORMPOSTINPUT from './formpostinput/FORMPOSTINPUT.js';
import FORMPOSTLIST from './formpostlist/FORMPOSTLIST.js';
import FORMSELECT from './formselect/FORMSELECT.js';
import FORMTEXTAREA from './formtextarea/FORMTEXTAREA.js';
import Hideable from '../../../../interface/Hideable.js';
/** A container made up of a group of form elements
    @class
    @extends CONTAINER
*/
export default class FORMELEMENTGROUP extends CONTAINER {
	/** Constructs a Form Element Group
	    @param {EL} node Node
	    @param {ContainerModel} model Model
    */
	constructor(node, model) {
        super(node, 'DIV', model, DATAELEMENTS.get('FORMELEMENTGROUP').containers);
		this.addClass('form-element-group');
        this.implement(new Hideable(this));
	}
	constructElements() {
		if (this.dataId > 0) {
            this.createEditableElement('header', this.childLocation);
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
    /** Constructs a FORMPOSTINPUT for this FORMELEMENTGROUP
	    @param {ContainerModel} model Model
	    @returns {FORMPOSTINPUT} A FORMPOSTINPUT
	*/
    addFormPostInput(model) {
        return this.addChild(new FORMPOSTINPUT(this.childLocation, model));
    }
    /** Constructs a FORMPOSTINPUT for this FORMELEMENTGROUP
	    @param {ContainerModel} model Model
	    @returns {FORMPOSTLIST} A FORMPOSTLIST
	*/
    addFormPostList(model) {
        return this.addChild(new FORMPOSTLIST(this.childLocation, model));
    }
    /** Constructs a FORMTEXTAREA for this FORMELEMENTGROUP
	    @param {ContainerModel} model Model
	    @returns {FORMTEXTAREA} A FORMTEXTAREA
	*/
    addFormTextArea(model) {
        return this.addChild(new FORMTEXTAREA(this.childLocation, model));
    }
    /** Constructs a FORMSELECT for this FORMELEMENTGROUP
	    @param {ContainerModel} model Model
	    @returns {FORMSELECT} A FORMSELECT
	*/
    addFormSelect(model) {
        return this.addChild(new FORMSELECT(this.childLocation, model));
    }
    /** Constructs a FORMINPUT for this FORMELEMENTGROUP
	    @param {ContainerModel} model Model
	    @returns {FORMINPUT} A FORMINPUT
	*/
    addFormInput(model) {
        return this.addChild(new FORMINPUT(this.childLocation, model));
    }
	/** Adds the given FORMELEMENT to this group
	    @param {ContainerModel} model A FORM INPUT MODEL
	    @returns {FORMELEMENT} A FORMELEMENT object
        @todo Consider making a FORMINPUTFACTORY
	*/
    addInputElement(model) {
		return new Promise((resolve, reject) => {
			try {
                let input = null;
                switch (model.type) {
                    case 'FORMPOSTINPUT':
                        input = this.addFormPostInput(model);
                        break;
                    case 'FORMPOSTLIST':
                        input = this.addFormPostList(model);
                        break;
                    default:
                        switch (model.element) {
                            case 'TEXTAREA':
                                input = this.addFormTextArea(model);
                                break;
                            case 'SELECT':
                                input = this.addFormSelect(model);
                                break;
                            case 'INPUT':
                                input = this.addFormInput(model);
                                break;
                            default:
                                input = this.addFormInput(model);
                                break;
                        }
                }
                resolve(input);
			} catch (e) {
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, Expand, FORMELEMENT, FORMELEMENTGROUP, FORMINPUT, FORMPOSTINPUT, FORMPOSTLIST, FORMSELECT, FORMTEXTAREA, MODEL }