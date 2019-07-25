/** @module */
import FORMELEMENT, { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, LABEL, MODEL } from '../../formelement/FORMELEMENT.js';
import INPUT, { INPUTMODEL } from '../../../input/INPUT.js';
import PROMPT, { DIALOGMODEL, DIV } from '../../../dialog/prompt/PROMPT.js';
import FORMPOSTINDEX from '../../index/classindex/formpostindex/FORMPOSTINDEX.js';
import SPAN from '../../../span/SPAN.js';
/** Represents an INPUT element made up of a delimited list of formpost/container UId's
    @class
    @extends FORMELEMENT
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
        let dataType = this.attributes.name.substring(0, this.attributes.name.length - 2);
		let id = this.attributes.value;
        let btnAdd = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'ADD'));
        btnAdd.el.onclick = () => {
            console.log('Add Tag to FORMPOSTLIST' + id);
            this.launchViewer(className, dataType); //, id, this.input
        }
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
                let prompt = new PROMPT(new DIALOGMODEL(new MODEL(), {
                    container,
                    caller: this,
                    label
                }));
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