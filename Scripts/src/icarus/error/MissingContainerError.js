/** @module */
import ExtendableError from './ExtendableError.js';
/** Thrown if the specified Container is null/undefined
    @class
*/
export default class MissingContainerError extends ExtendableError {
	/** Constructs a MissingContainerError
		@param {string} message An error message
	    @param {Error} e An error
	*/
	constructor(message, e) {
		super(message + '\n' + e.message);
	}
}