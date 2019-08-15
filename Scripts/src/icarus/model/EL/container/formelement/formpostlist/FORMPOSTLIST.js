/** @module */
import FORMELEMENT, { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, LABEL, MODEL } from '../../formelement/FORMELEMENT.js';
import PROMPT, { DIV } from '../../../dialog/prompt/PROMPT.js';
import SPAN, { MODELS } from '../../../span/SPAN.js';
import FORMPOSTINDEX from '../../index/classindex/formpostindex/FORMPOSTINDEX.js';
import INPUT from '../../../input/INPUT.js';
/** Represents an INPUT element made up of a delimited list of formpost/container UId's
    @class
*/
export default class FORMPOSTLIST extends FORMELEMENT {
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
        new SPAN(this.inputGroup, MODELS.text('ADD')).addClass('input-group-addon').then((btnAdd) => {
            btnAdd.el.onclick = () => {
                console.log('Add Tag to FORMPOSTLIST' + id);
                this.launchViewer(className, dataType); //, id, this.input
            }
        });
	}
	/** Creates a prompt containing a list of available tags
	    @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
	    @param {string} label Label for FORMPOSTINDEX header
	    @param {UId} [formId] Form Id for formpostindex
        @param {string} [query] Optional querystring
	    param {INPUT} [inputNode] The input that spawned this DIALOG
	    @returns {Promise<PROMPT>} Promise to create a new FormPost DIALOG and return it
	*/
    launchViewer(className, label = 'Tags', formId = 10128, query = '') {
        //inputNode = null
        return new Promise((resolve, reject) => {
			try {
				let container = typeof this.container === 'undefined' ? this.getContainer().container : this.container;
				console.log('CreateForm', container, typeof container);
                let prompt = new PROMPT(MODELS.dialog(label, '', true, container, this, this.getLoader()));
                let formPostIndex = new FORMPOSTINDEX(prompt.body.pane, new MODEL().set({
                    container: prompt.getContainer(),
                    data: {
                        header: label
                    }
                }), {
                    classType: 'FORMPOST',
                    query,
                    formId,
                    caller: this
                });
                formPostIndex.body.el.dispatchEvent(new Expand(formPostIndex));
                prompt.show();
			} catch (e) {
				console.warn('Failed to create Tag chooser', e, this);
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, LABEL, MODEL }