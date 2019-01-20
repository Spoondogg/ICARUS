/** @module */
/** A generic set of ATTRIBUTES for an EL
    @class
    @todo Consider just extending Map()
    @see https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
 */
export default class ATTRIBUTES { // extends Map 
	/** If the 'className' argument is an object, break it out into individual attributes
	    Otherwise, map to className, name, type and value
	    @param {object} className A collection of attributes || className Element class attribute
	    @param {string} name Optional Element name attribute
	    @param {string} type Element type attribute
	    @param {string} value Element value attribute
	 */
	constructor(className, name, type, value) {
		switch (typeof className) {
			case 'string':
				this.set('class', className);
				this.set({
					name,
					type,
					value
				});
				break;
			case 'object':
				for (let attr in className) {
					if (typeof attr === 'string') {
						this.set(attr, className[attr]);
					} else {
						console.warn('Unable to set attribute', attr);
					}
				}
				break;
			case 'undefined':
			default:
				//break;
				//default:
				//console.warn('Unrecognized classname', className);
		}
	}
	/** Gets the specified attribute
	    @param {string} key Attribute key
	    @returns {object} Attribute Object
	 */
	get(key) {
		try {
			return this[key];
		} catch (e) {
			console.warn('No attribute exists for key "' + key + '"', e);
			return null;
		}
	}
	/** Sets the given key to the specified value
	    @param {string} key Attribute name
	    @param {any} value Attribute value
	    @returns {ATTRIBUTES} This attributes Object 
	 */
	set(key, value) {
		/*if (typeof value !== 'undefined' && value !== null) {
			this[key] = value || '';
        }*/
		//this[key] = typeof value !== 'undefined' && value !== null ? value : '';
		//return this;
		if (typeof key === 'string') {
			try {
				this[key] = typeof value !== 'undefined' && value !== null ? value : '';
				return this;
			} catch (e) {
				console.log('Unable to set attribute of this ATTRIBUTES');
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
}