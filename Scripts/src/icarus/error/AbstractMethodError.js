/** @module */
import ExtendableError from './ExtendableError.js';
/** If an abstract method is not overridden, an AbstractMethodError will be thrown
    @class
    @extends ExtendableError
*/
export default class AbstractMethodError extends ExtendableError {
	/** Constructs an Abstract Method Error
	    @param {string} message The message to display
        @param {CONTAINER} container Optional container triggers LOADER
    */
	constructor(message, container) {
        super(message);
        console.error(message, container);
	}
}