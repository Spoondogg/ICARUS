/** @module */
import FORM from '../form/FORM.js';
//import FORMINPUTTOKEN from '../formelement/forminput/forminputtoken/FORMINPUTTOKEN.js';
/**
    Represents the data object to be submitted to the server for validation.
    @class    
*/
export default class FORMPOST {
	/**
	    @param {FORM} form The form that generated this FORMPOST
	 */
	constructor(form) {
		/**
		    The form token
		    @type {string}
		*/
		//this.token = form.getToken(); //TOKEN.getToken().value; // __RequestVerificationToken
		this.id = form.id;
        this.formId = form.id;
		this.label = form.el.getAttribute('name');
		// An ordered array of key/value pairs as they appear in the FORM
		this.results = form.getResultsAsArray();
		this.message = '';
	}
	/**
	    Serialize the form into a JSON object key/value
	    @returns {object} Form Results as an Object
	*/
	getResultsAsObject() {
		let obj = {};
		try {
			this.results.forEach((item) => { //index
				if (typeof obj[item.name] === 'undefined') { // New
					obj[item.name] = item.value || '';
				} else { // Existing
					if (!obj[item.name].push) {
						obj[item.name] = [obj[item.name]];
					}
					obj[item.name].push(item.value || '');
				}
			});
		} catch (e) {
			console.warn('Unable to parse FormPost into an object', e);
		}
		return obj;
	}
}