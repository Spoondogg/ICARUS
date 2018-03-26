/**
    A generic EL model    
*/
class MODEL {
    /**
        Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
    */
    constructor(attributes) {
        this.attributes =
            typeof attributes === 'string'
                ? new ATTRIBUTES(attributes)
                : attributes || new ATTRIBUTES();
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