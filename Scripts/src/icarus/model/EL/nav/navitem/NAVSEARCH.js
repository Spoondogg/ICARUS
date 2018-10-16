/**
    @module
*/
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
import NAVITEM from '../navitem/NAVITEM.js';
/**
    A search input wrapped in a FORM that filter's the
    contents of a given GROUP
    @todo Create a proper search type INPUT element
    @class
    @extends NAVITEM
 */
export default class NAVSEARCH extends NAVITEM {
	/**
	    Construct a NAVSEARCH
	    @param {EL} node Parent Node
	 */
	constructor(node) {
		super(node, new MODEL());
		this.form = new EL(this, 'FORM', new MODEL(new ATTRIBUTES({
			'name': 'q',
			'method': 'POST',
			'action': '#'
		})));
		this.form.addClass('navbar-search');
		this.inputGroup = new EL(this.form, 'DIV', new MODEL('input-group'));
		this.inputGroup.q = new EL(this.inputGroup, 'INPUT', new MODEL(new ATTRIBUTES({
			'type': 'text',
			'class': 'form-control',
			'placeholder': 'Search',
			'name': 'q'
		})));
		this.inputGroup.btnGroup = new EL(this.inputGroup, 'DIV', new MODEL('input-group-btn'));
		this.inputGroup.btnGroup.btn = new EL(this.inputGroup.btnGroup, 'BUTTON', new MODEL(new ATTRIBUTES({
			'class': 'btn btn-default',
			'type': 'submit'
		})));
		this.inputGroup.btnGroup.btn.icon = new EL(this.inputGroup.btnGroup.btn, 'I', new MODEL('glyphicon glyphicon-search'));
	}
}
export { ATTRIBUTES, EL, MODEL, NAVITEM };