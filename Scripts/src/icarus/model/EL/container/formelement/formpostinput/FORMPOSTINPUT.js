/** @module */
import FORMELEMENT, { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, LABEL, MODEL } from '../../formelement/FORMELEMENT.js';
import PROMPT, { DIV } from '../../../dialog/prompt/PROMPT.js';
import SPAN, { MODELS } from '../../../span/SPAN.js';
import INPUT from '../../../input/INPUT.js';
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
        this.input = new INPUT(this.inputGroup, MODELS.input('INPUT', MODELS.inputAttributes(
            this.attributes.name,
            this.attributes.value,
            this.attributes.type || 'TEXT',
			true
        )));
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
        let dataType = this.attributes.name.substring(0, this.attributes.name.length - 2);
		let id = this.attributes.value;
		if (id > 0) {
            new SPAN(this.inputGroup, MODELS.text('EDIT')).addClass('input-group-addon').then((btnEdit) => {
                btnEdit.el.onclick = () => this.createForm(className, dataType, id, this.input);
            });
		}
        new SPAN(this.inputGroup, MODELS.text('NEW')).addClass('input-group-addon').then((btnNew) => {
            btnNew.el.onclick = () => this.createForm(className, dataType, 0, this.input);
        });
        new SPAN(this.inputGroup, MODELS.text('LOAD')).addClass('input-group-addon').then((btnLoad) => {
            btnLoad.el.onclick = () => {
                console.log('TODO: Browse FORMPOST(s) via FORMPOSTINDEX');
                let dialog = new PROMPT(MODELS.dialog(
                    'FormPost: ClassName: ' + className + ', DataType: ' + dataType, '', true,
                    this.getContainer(), this, this.getLoader()
                ));
                dialog.showDialog();
            }
        });
	}
	/** Creates a FORM that represents a given FORMPOST
	    @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
	    @param {string} type The key (dataId, attributesId, metaId) to add object to
	    @param {UId} [id] FormPost Id to edit
	    @param {INPUT} [inputNode] The input that spawned this DIALOG
        @param {MODEL} [model] Optional MODEL to use for population
	    @returns {Promise<PROMPT>} Promise to create a new FormPost DIALOG and return it
	*/
	createForm(className, type, id = 0, inputNode = null, model = new MODEL()) {
        return new Promise((resolve, reject) => {
			try {
				let container = typeof this.container === 'undefined' ? this.getContainer().container : this.container;
				console.log('CreateForm', container, typeof container);
                let dialog = new PROMPT(MODELS.dialog(
                    className + '.' + type + '(' + id + ') ', '', true,
                    container, this, this.getLoader()
                ));
                dialog.createForm(new MODEL().set({
                    data: model.data,
                    //attributes: model.attributes,
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