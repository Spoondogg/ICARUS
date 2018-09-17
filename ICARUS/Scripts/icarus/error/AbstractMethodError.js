/**
    Error thrown when an abstract method is not overridden
    @module
*/
import ExtendableError from './ExtendableError.js';
/**
    If an abstract method is not overridden, an AbstractMethodError will be thrown
    @class
    @extends ExtendableError
*/
export default class AbstractMethodError extends ExtendableError {
    /**
        Constructs an Abstract Method Error
        @param {string} message
    */
    constructor(message) {
        super(message);
    }
}