/** @module */
import BUTTONGROUP, { BUTTON, ICONS } from '../../group/buttongroup/BUTTONGROUP.js';
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
import NAVITEM from '../navitem/NAVITEM.js';
/** A search input wrapped in a generic HTMLForm
    @todo Create a proper search type INPUT element
    @class
    @extends NAVITEM
*/
export default class NAVSEARCH extends NAVITEM {
	/** Construct a NAVSEARCH
	    @param {EL} node Parent Node
        @param {MODEL} model Model
	*/
	constructor(node, model) {
        super(node, model);
        this.addClass('nav-item-search');
		/*this.form = new EL(this, 'FORM', new MODEL(new ATTRIBUTES({
			name: 'q',
			//method: 'POST',
			action: '#'
		})));*/
		//this.form.addClass('navbar-search');
		//this.inputGroup = new EL(this.form, 'DIV', new MODEL('input-group'));
		this.input = new EL(this, 'INPUT', new MODEL(new ATTRIBUTES({
			type: 'text',
			placeholder: 'Search',
			name: 'q'
        })));
        this.button = new BUTTON(this, '', ICONS.SEARCH);
        this.buttonGroup = new BUTTONGROUP(this, new MODEL('input-buttons'));
        //this.btnSearchType = this.buttonGroup.addButton('CLASS', ICONS.CLASSVIEWER);
        //this.btnSearch = this.buttonGroup.addButton('', ICONS.SEARCH);

        /*this.inputGroup.btnGroup = new EL(this.inputGroup, 'DIV', new MODEL('input-group-btn'));
		this.inputGroup.btnGroup.btn = new EL(this.inputGroup.btnGroup, 'BUTTON', new MODEL(new ATTRIBUTES({
			class: 'btn btn-default',
			type: 'submit'
		})));
		this.inputGroup.btnGroup.btn.icon = new EL(this.inputGroup.btnGroup.btn, 'I', new MODEL('glyphicon glyphicon-search'));*/
	}
}
export { ATTRIBUTES, EL, MODEL, NAVITEM }