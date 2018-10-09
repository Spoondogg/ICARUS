/**
    @module
*/
import FORM, { ATTRIBUTES, MODEL } from '../FORM.js';
/**
    A Registration Form
    @class
    @extends FORM
*/
export default class RegistrationForm extends FORM {
	/**
	    Constructs an Icarus Logout Form
	    @param {APP} node APP element to contain registration form
	 */
	constructor(node) {
		// EVERY SINGLE APP requires a LOGOUT form, although it may be possible to
		// create the form on demand rather than clogging up the DOM
		super(node, new MODEL(new ATTRIBUTES({
			'id': 'registrationForm',
			'name': 'registrationForm',
			'method': 'POST',
			'action': '/Account/Register'
		})).set({
			'id': 'registrationForm',
			'label': 'Register'
		}));
	}
}