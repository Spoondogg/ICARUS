/** @module */
import FORMELEMENT, { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, LABEL, MODEL } from '../../formelement/FORMELEMENT.js';
import INPUT, { INPUTMODEL } from '../../../input/INPUT.js';
import PROMPT, { DIALOGMODEL, DIV } from '../../../dialog/prompt/PROMPT.js';
import SPAN from '../../../span/SPAN.js';
/** Represents an INPUT element inside a group of form elements
    @class
    @extends FORMELEMENT
*/
export default class FORMPOSTINPUT extends FORMELEMENT {
	constructElements() {
        /** The input-group contains the input element
            @type {DIV}
        */
        this.inputGroup = new DIV(this.body.pane, new MODEL('input-group'));
        /** The primary INPUT Element for this FORMPOSTINPUT
            @type {INPUT}
        */
        this.input = new INPUT(this.inputGroup, new INPUTMODEL(new MODEL(), {
			name: this.attributes.name,
			value: this.attributes.value,
			type: this.attributes.type || 'TEXT',
			readonly: true
        }));
        /** @type {FORM} */
		this.form = null;
		this.createInput();
	}
	/** Creates a Container/Group with an INPUT element inside of it
        @returns {void}
    */
    createInput() {
        if (this.attributes.type === 'HIDDEN') {
            this.body.el.dispatchEvent(new Collapse(this.body));
        } else {
            this.body.el.dispatchEvent(new Expand(this.body));
        }
		if (this.attributes.readonly) {
			this.input.el.setAttribute('readonly', 'readonly');
		}
        let className = this.input.el.form.className.value;
        /** Value arrives from FORMPOSTINPUT button labeld as 'dataId' or 'metaId'
            Remove the 'id'  
            @todo There has to be a more elegant solution here.
            @type {string}
        */
        let type = this.attributes.name.substring(0, this.attributes.name.length - 2);
		let id = this.attributes.value;
		if (id > 0) {
			let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'EDIT'));
            btnEdit.el.onclick = () => this.createForm(className, type, id, this.input);
		}
		let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'NEW'));
        btnNew.el.onclick = () => this.createForm(className, type, 0, this.input);
        let btnLoad = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'LOAD'));
        btnLoad.el.onclick = () => console.log('TODO: Browse FORMPOST(s)');
	}
	/** Creates a FORM that represents a given FORMPOST
	    @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
	    @param {string} type The key (dataId, attributesId, metaId) to add object to
	    @param {UId} [id] FormPost Id to edit
	    @param {INPUT} inputNode The input that spawned this DIALOG
	    @returns {Promise<PROMPT>} Promise to create a new FormPost DIALOG and return it
	*/
	createForm(className, type, id = 0, inputNode = null) {
		return new Promise((resolve, reject) => {
			try {
				let container = typeof this.container === 'undefined' ? this.getContainer().container : this.container;
				console.log('CreateForm', container, typeof container);
				new PROMPT(new DIALOGMODEL(new MODEL(), {
					container,
                    caller: this,
                    label: 'Create FormPost Form'
				})).createForm(new MODEL().set({
					formtype: 'FORMPOST',
					className,
					type,
					id,
					inputNode,
					container,
					caller: this
				})).then((form) => resolve(form.getDialog().show()));
			} catch (e) {
				console.warn('Failed to create FormPost Form', e, this);
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, LABEL, MODEL }