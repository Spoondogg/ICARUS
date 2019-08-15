/** @module */
import ExtendableError from './ExtendableError.js';
/** Thrown if the recursion limit is exceeded
    @class
*/
export default class TokenError extends ExtendableError {
	/** Constructs a Token Error
		@param {string} message An error message
	    @param {Error} e An error
	*/
	constructor(message, e) {
		super(message + '\n' + e.message);
	}
}