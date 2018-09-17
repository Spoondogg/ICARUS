/**
    @module
*/

/**
    A generic set of ATTRIBUTES for an EL
    @class
    @extends Object
    @todo Consider just extending Map()
 */
export default class ATTRIBUTES extends Object { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
    /**
        If the 'className' argument is an object, break it out into individual attributes
        Otherwise, map to className, name, type and value

        @param {object} className A collection of attributes || className Element class attribute
        @param {string} name Optional Element name attribute
        @param {string} type Element type attribute
        @param {string} value Element value attribute
     */
    constructor(className, name, type, value) {
        super();
        switch (typeof className) {
            case 'string':            
                this.set('class', className);
                this.set('name', name);
                this.set('type', type);
                this.set('value', value);
                break;

            case 'object':
                for (let attr in className) {
                    this.set(attr, className[attr]);
                }
                break;                
        }        
    }

    /**
        Gets the specified attribute
        @param {string} key Attribute key
        @returns {object} Attribute Object
     */
    get(key) {
        let obj = null;
        try {
            obj = this[key];
        } catch (e) {
            console.warn('No attribute exists for key "' + key + '"');
        }
        return obj;
    }

    /**
        Sets the given key to the specified value
        @param {string} key Attribute name
        @param {any} value Attribute value
        @returns {ATTRIBUTES} This attributes Object 
     */
    set(key, value) {
        if (value !== undefined && value !== null) {
            this[key] = value || '';
        }
        return this;
    }
}