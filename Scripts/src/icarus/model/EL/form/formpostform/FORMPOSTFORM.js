/** @module */
import { DATAELEMENTS, createInputModel } from '../../../../enums/DATAELEMENTS.js';
import FORM, { ATTRIBUTES, EL, MODEL } from '../FORM.js';
import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMSELECT from '../../container/formelement/formselect/FORMSELECT.js';
import FORMTEXTAREA from '../../container/formelement/formtextarea/FORMTEXTAREA.js';
import SPAN from '../../span/SPAN.js';
/** A FORM based on a FORMPOST
    @class
    @extends FORMELEMENT
*/
export default class FORMPOSTFORM extends FORM {
    /** Constructs a FORMPOST FORM
        @param {EL} node Parent
	    @param {MODEL} model The model
    */
    constructor(node, model) {
        super(node, model);
        this.setId(3);
        this.setAction('FORMPOST/SET');
        this.addFieldset(new MODEL().set('showNav', 0)).addFormElementGroup(new MODEL().set('showNav', 0));
    }
    construct() {
        //this.createFormPostForm(model.data.className, model.data.dataIdLabel, model.data.id);
        try {
            $.getJSON('/FORMPOST/GET/' + this.model.data.id, (payload) => {
                let inputs = this.generateInputs(payload, this.model.data.className, this.model.data.dataIdLabel);
                this.addInputs(inputs, this.children[0].children[0]);

                // Set values based on existing 
                if (payload.model.jsonResults) {
                    JSON.parse(payload.model.jsonResults).forEach((inp) => {
                        this.el.elements[inp.name].value = inp.value;
                    });
                }

                this.afterSuccessfulPost = (result) => {
                    console.log('FORMPOSTINPUT.save() afterSuccessfulPost resolved', result);
                };
            });
        } catch (e) {
            console.warn(0, 'Unable to construct FORMPOSTFORM', e);
        }
    }
    /** Adds the provided inputs to the FORMPOSTFORM
	    @param {Array<MODEL>} inputs An array of inputs
        @param {CONTAINER} target Target node
	    @returns {void}
	*/
    addInputs(inputs, target) {
        if (inputs) {
            inputs.forEach((i) => this.addInput(i, target));
        }
    }
    /** Adds the input to the FORM 
        @param {MODEL} input An input model
        @param {CONTAINER} target Target node
        @returns {void} 
    */
    addInput(input, target) {
        let inp = null;
        if (input.type === 'FORMPOSTINPUT') {
            inp = new FORMPOSTINPUT(target.body.pane, input);
        } else {
            console.log('FORMINPUT', input);
            switch (input) {
                case 'TEXTAREA':
                    inp = new FORMTEXTAREA(target.body.pane, input);
                    break;
                case 'SELECT':
                    inp = new FORMSELECT(target.body.pane, input);
                    break;
                case 'INPUT':
                    inp = new FORMINPUT(target.body.pane, input);
                    break;
                default:
                    inp = new FORMINPUT(target.body.pane, input);
                    break;
            }
        }
        target.children.push(inp);
    }
	/** Creates an Input Group with an INPUT element inside of it
        @returns {void}
    */
    createInput() {
        if (this.attributes.type === 'HIDDEN') {
            this.collapse();
        }
        if (this.attributes.readonly) {
            this.input.el.setAttribute('readonly', 'readonly');
        }
        let className = this.input.el.form.className.value;
        let dataIdLabel = this.attributes.name;
        let formPostId = this.attributes.value;
        if (formPostId > 0) { //  || this.value > 0
            let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT1');
            btnEdit.el.onclick = () => this.createFormPostForm(className, dataIdLabel, formPostId);
        }
        let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW1');
        btnNew.el.onclick = () => this.createFormPostForm(className, dataIdLabel);
    }
	/** Sets the id of the original FormPostInput to the given value
        @param {number} id Id to set
        @returns {void}
    */
    updateInput(id) {
        this.input.el.value = id;
    }
	/** Returns the default Input array
	    @param {object} data Payload
	    @returns {Array} An array of INPUT models
	*/
    defaultInputArray(data) {
        return [
            createInputModel('INPUT', 'id', data.model.id, 'ID', 'NUMBER', true),
            createInputModel('INPUT', 'shared', data.model.shared, 'shared', 'CHECKBOX')
        ];
    }
    /** Generates the appropriate INPUT(s) for this FORMPOST
        @param {any} payload The FormPost Payload
        @param {string} className The container className
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @returns {Array<MODEL>} An array of MODEL inputs
    */
    generateInputs(payload, className, dataIdLabel) {
        let inputs = this.defaultInputArray(payload);
        this.input.el.setAttribute('value', payload.model.id); // Set INPUT element to model.id 
        switch (dataIdLabel) {
            case 'dataId':
                DATAELEMENTS[className].data.forEach((i) => inputs.push(i));
                break;
            case 'attributesId':
                DATAELEMENTS[className].attributes.forEach((i) => inputs.push(i));
                break;
            case 'descriptionId':
                inputs.push(createInputModel('TEXTAREA', 'description'));
                break;
            default:
                console.log('Unidentified attribute name', dataIdLabel);
        }
        return inputs;
    }
    /** Creates a FORM populated with the state of the given container
        @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @param {number} id Optional FormPost Id to edit
        @returns {Promise<string>} Promise to create a new FormPost DIALOG and return its FORM
    */
    createFormPostForm(className, dataIdLabel, id = 0) {
        return new Promise((resolve, reject) => {
            try {
                $.getJSON('/FORMPOST/Get/' + id, (payload) => {
                    let inputs = this.generateInputs(payload, className, dataIdLabel);
                    try {
                        this.addInputs(inputs, this.children[0].children[0]);

                        // Set values based on existing 
                        if (payload.model.jsonResults) { 
                            JSON.parse(payload.model.jsonResults).forEach((inp) => {
                                this.el.elements[inp.name].value = inp.value;
                            });
                        }

                        this.afterSuccessfulPost = (result) => {
                            console.log('FORMPOSTINPUT.save() afterSuccessfulPost resolved', result);
                        };

                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            } catch (e) {
                console.log(0, 'Unable to retrieve FormPost.', e);
                reject(e);
            }
        });
    }
}
export { ATTRIBUTES, EL, MODEL };