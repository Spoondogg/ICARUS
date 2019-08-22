/** @module */
//import ATTRIBUTES from './ATTRIBUTES.js';
import { ATTR, ATTRIBUTES } from '../enums/ATTR.js';
import { DATA } from '../enums/DATA.js';
import PAYLOAD from './el/form/PAYLOAD.js';
/** A Map like object, representative of an Element Model
    @class
*/
export default class MODEL {
	/** Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
        @param {ATTRIBUTES} meta A collection of description attributes
    */
	constructor(attributes = new ATTRIBUTES(), data = new ATTRIBUTES(), meta = new ATTRIBUTES()) {
        /** A collection of key/value pairs representing custom attributes for this MODEL's Element */
        this.attributes = this.defaultAttributes(attributes);
        /** A collection of key/value pairs representing editable data for this MODEL's Element */
        this.data = this.defaultAttributes(data);
        /** A collection of key/value pairs representing metadata for this MODEL's Class */
		this.meta = this.defaultAttributes(meta);
	}
	/** Resolves appropriate Attributes object based on input
	    @param {string|ATTRIBUTES} attributes Attributes
	    @returns {ATTRIBUTES} Resolved attributes class
	*/
    defaultAttributes(attributes = null) {
        //console.log('defaultAttributes', attributes);
        /** @type {ATTRIBUTES} */
        let attr = null;
		switch (typeof attributes) {
			case 'string':
				attr = new ATTRIBUTES(attributes);
				break;
            case 'object':
                if (attributes.constructor.name === 'ATTRIBUTES') {
                    attr = attributes;
                } else {
                    attr = new ATTRIBUTES(attributes);
                }
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
        @param {boolean} [allowEmpty=true] If true (default) empty values can be added
	    @returns {MODEL} The object MODEL
	*/
	set(key, value, allowEmpty = true) {
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
                if (allowEmpty || key[prop] !== 'undefined') {
                    this[prop] = key[prop];
                }             
			}
		}
		return this;
    }
    /** Appends/Overrides property (or a collection of properties) for the specified Attributes collection
        @description Similar to right join, new values override existing
	    @param {string} attrName Attribute Collection Name
        @param {Object} obj An object containing key/value pairs
	    @param {any} value Value for property
        @param {boolean} [allowEmpty=true] If true (default) empty values can be added
	    @returns {MODEL} The object MODEL
	*/
    append(attrName, obj, value, allowEmpty = true) {
        for (let prop in obj) {
            if (typeof prop === 'string') {
                if (allowEmpty || obj[prop] !== 'undefined') {
                    //this[attrName].set(prop, obj[prop]);
                    this[attrName][prop] = obj[prop];
                }
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
    /** Returns a string representation of this MODEL
	    @returns {string} Classname
	*/
    toString() {
        return this.constructor.name + '()';
    }
	/** Gets a property from Self
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
    /** Performs an AJAX request and calls the given method with the JSON response
        @param {string} url HTTP Request Url
        @param {Function} fn Function that accepts the resulting payload as its only argument
        @param {string} method Request Method (ie: 'POST','GET')
        @returns {Object} A JSON object retrieved from the given url
    */
    getJson(url, fn, method = 'GET') {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let payload = JSON.parse(this.responseText);
                fn(payload);
            }
        };
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    }
    /** Retrieves a Payload matching the given params (if permitted)
        @param {UId} uid Type UId (ie: Formpost(123) = 123)
        @param {string} [type] Payload type (default: FORMPOST)
        @returns {Promise<PAYLOAD>} Promise to resolve a PAYLOAD Class
        @todo Implement a non-jquery version 
        @see https://www.w3schools.com/js/js_json_parse.asp 
        @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    */
    getPayload(uid, type = 'FORMPOST') {
        return new Promise((resolve, reject) => {
            try {
                this.getJson('/' + type + '/GET/' + uid, (payload) => resolve(new PAYLOAD(payload)));
            } catch (e) {
                console.warn('Unable to retrieve payload', type, uid, e);
                reject(e);
            }
        });
    }
}
export { ATTR, ATTRIBUTES, DATA }