/** @module */
/** Represents a standardized data object that can be POSTed and validated
    @class    
*/
export default class FORMPOST {
	/** Constructs a FORMPOST for the given form
	    @param {FORM} form The form that generated this FORMPOST
    */
	constructor(form) {
		this.id = form.id;
		this.formId = form.id;
		//this.label = form.el.getAttribute('name');
		this.results = form.getResultsAsArray(); // An ordered array of key/value pairs as they appear in the FORM
		this.message = '';
		/* eslint-disable-next-line no-underscore-dangle */
		this.__RequestVerificationToken = this.results[this.results.length - 1].value;
	}
	/** Serialize the form into a JSON object key/value
	    @returns {Promise<object>} Form Results as an Object
	*/
    getResultsAsObject() {
        return new Promise((resolve, reject) => {
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
                reject(e);
            }
            resolve(obj);
        });
	}
}