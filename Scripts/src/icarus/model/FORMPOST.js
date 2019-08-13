/** @module */
/** Represents a standardized data-structure based on an HTML Form that can be POSTed and validated
    @class    
*/
export default class FORMPOST {
	/** Constructs a FORMPOST for the given form
        @param {UId} formId Form UId
        @param {Array} formResults Form Results An ordered array of key/value pairs as they appear in the FORM (form.getResultsAsArray())
    */
	constructor(formId, formResults) {
        this.id = formId;
        /** The FORM UId that this FORMPOST belongs to */
        this.formId = formId;
        //this.shared = 1;
        //this.isPublic = 1;
        this.results = formResults;
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