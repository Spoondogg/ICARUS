import ATTRIBUTES from './ATTRIBUTES.js';
import FORMPOST from './FORMPOST.js';
/** @module */
/** Represents a standardized response from API get() calls
    @class    
*/
export default class PAYLOAD extends ATTRIBUTES {
    constructor(obj) {
        super();
        /** Name of the Class that this Payload represents
            @type {string}
        */
        this.className = null;// = obj.className;
        /** Result code generated on the server
            @type {number}
        */
        this.result = null;// = obj.result;
        /** Message generated on the server
            @type {string}
        */
        this.message = null;// = obj.message;
        /** The Payload model resembles a FORMPOST 
            @type {FORMPOST}
        */
        this.model = null;
        /** The Payload exception holds exception details (if they exist)
            @type {Error} 
        */
        this.exception = null;
        /** The Payload innerException holds inner-exception details (if they exist)
            @type {Error} 
        */
        this.innerException = null;

        // Map values from obj
        this.set(obj);
    }
    /** Retrieves the Payload Class name 
        @returns {string} This class name
    */
    getClassName() {
        return this.className;
    }
    /** Retrieves the Payload Result Code
        @returns {number} Payload Result Code
    */
    getResult() {
        return this.result;
    }
    /** Retrieves the Payload Message that was generated on the server
        @returns {string} Payload Message
    */
    getMessage() {
        return this.message;
    }
    /** Retrieves the Payload Model that was generated on the server
        @returns {FORMPOST} Payload Model
    */
    getModel() {
        return this.model;
    }
    /** Retrieves the Payload Exception that was generated on the server (if exists)
        @returns {Error} An exception/error
    */
    getException() {
        return this.exception;
    }
    /** Retrieves the Payload InnerException that was generated on the server (if exists)
        @returns {Error} An exception/error
    */
    getInnerException() {
        return this.innerException;
    }
}
export { ATTRIBUTES, FORMPOST }