﻿/**
    A generic object model    
*/
class MODEL {
    /**
        Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
    */
    constructor(attributes, data) {
        this.attributes =
            typeof attributes === 'string'
                ? new ATTRIBUTES(attributes)
                : attributes || new ATTRIBUTES();

        this.data = data || new ATTRIBUTES();
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