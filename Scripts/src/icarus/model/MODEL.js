/**
    @module
*/
import ATTRIBUTES from './ATTRIBUTES.js';
/**
    A Map like data structure
    @todo Consider just extending Map()
    @see https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
    @class
*/
export default class MODEL {
	/**
		    Constructs a generic MODEL
		    @param {ATTRIBUTES} attributes A collection of attributes
		    @param {ATTRIBUTES} data A collection of data attributes
		    @param {ATTRIBUTES} description A collection of description attributes
	        @todo Consider renaming description to meta
		*/
	constructor(attributes, data, description) {
		this.attributes = typeof attributes === 'string' ? new ATTRIBUTES(attributes) : attributes || new ATTRIBUTES();
		this.data = data || new ATTRIBUTES();
		this.description = description || new ATTRIBUTES();
	}
	/**
	    Sets a property (or a collection of properties) for this MODEL
	    @param {string} key Name of property || An object containing key/value pairs
	    @param {any} value Value for property
	    @returns {MODEL} The object MODEL
	*/
	set(key, value) {
		if (typeof key === 'string') {
			try {
				this[key] = typeof value === 'undefined' ? key : value;
				return this;
			} catch (e) {
				console.log('Unable to set property of this MODEL');
				throw e;
			}
		}
		for (let prop in key) {
			if (typeof prop === 'string') {
				this[prop] = key[prop];
			}
		}
		return this;
	}
	/**
	    Gets a property from this MODEL
	    @param {string} key Name of property
	    @returns {any} The value of the given key
	*/
	get(key) {
		try {
			return this[key];
		} catch (e) {
			console.log('Unable to get property "' + key + '" of this MODEL.', e);
		}
	}
}
export { ATTRIBUTES };