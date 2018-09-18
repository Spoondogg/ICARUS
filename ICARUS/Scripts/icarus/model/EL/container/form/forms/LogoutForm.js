/**
    @module
*/
import FORM, { ATTRIBUTES } from '../FORM.js';
/**
    A Logout Form
    @class
    @extends FORM
*/
export default class LogoutForm extends FORM {
	/**
	    Constructs an Icarus Logout Form
	    @param {APP} node APP element to contain logout form
	 */
	constructor(node) {
		super(node, new MODEL(new ATTRIBUTES({
			'id': 'logoutForm',
			'name': 'logoutForm',
			'method': 'POST',
			'action': '/Account/LogOff'
		})).set({
			'id': 'logoutForm',
			'label': 'Logout Form'
		}));
	}
}