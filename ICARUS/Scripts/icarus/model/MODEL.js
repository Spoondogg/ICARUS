import ATTRIBUTES from './ATTRIBUTES.js';
export { ATTRIBUTES };
/**
    A Map like data structure
    TODO: Consider just extending Map() 
*/
export default class MODEL { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
    /**
        Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
        @param {ATTRIBUTES} description A collection of description attributes
    */
    constructor(attributes, data, description) {
        this.attributes =
            typeof attributes === 'string'
                ? new ATTRIBUTES(attributes)
                : attributes || new ATTRIBUTES();

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
                this[key] = value;
                return this;
            } catch (e) {
                console.log('Unable to set property of this MODEL.');
                console.log(e);
            }

        } else {
            for (let prop in key) {
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
            console.log('Unable to get property "'+key+'" of this MODEL.');
            console.log(e);
        }
    }
}