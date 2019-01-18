/** @module */
import ATTRIBUTES from './ATTRIBUTES.js';
/** A Map like object, representative of an Element Model
    @class
*/
export default class MODEL {
	/** Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
        @param {ATTRIBUTES} description A collection of description attributes
        @todo Consider renaming description to meta
    */
	constructor(attributes = new ATTRIBUTES(), data = new ATTRIBUTES(), description = new ATTRIBUTES()) {
        this.attributes = this.defaultAttributes(attributes);
        this.data = this.defaultAttributes(data);
        this.description = this.defaultAttributes(description);
    }
    /** Resolves appropriate Attributes object based on input
        @param {string|ATTRIBUTES} attributes Attributes
        @returns {ATTRIBUTES} Resolved attributes class
     */
    defaultAttributes(attributes) {
        let attr = null;
        switch (typeof attributes) {
            case 'string':
                attr = new ATTRIBUTES(attributes);
                break;
            case 'object':
                attr = attributes;
                break;
            default:
                console.log('Attributes is not properly defined', attributes, this);
                attr = new ATTRIBUTES();
        }
        return attr;
    }
	/** Sets a property (or a collection of properties) for this MODEL
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
    /** Throws an error if given value is not defined
        @param {any} value Value
        @returns {any} Verified required value
        @throws {Error} Missing Value
    */
    required(value) {
        if (typeof value === 'undefined') {
            console.error('Unable to set required value', this, value);
            throw new Error('Missing required value');
        } else {
            return value;
        }
    }
	/** Sets a property (or a collection of properties) for this Model's ATTRIBUTES
	    @param {string} key Name of property || An object containing key/value pairs
	    @param {any} value Value for property
	    @returns {MODEL} The object MODEL
	*/
	setAttribute(key, value = null) {
		this.attributes.set(key, value);
		return this;
	}
	/** Gets a property from this MODEL
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
	/** Gets a property from this Model's ATTRIBUTES
	    @param {string} key Name of property
	    @returns {any} The value of the given key
	*/
	getAttribute(key) {
		try {
			return this.attributes[key];
		} catch (e) {
			console.log('Unable to get property "' + key + '" of this MODEL.ATTRIBUTES', e);
		}
	}
}
export { ATTRIBUTES };