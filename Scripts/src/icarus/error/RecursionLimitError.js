/** @module */
import ExtendableError from './ExtendableError.js';
/** Thrown if the recursion limit is exceeded
    @class
*/
export default class RecursionLimitError extends ExtendableError {
    /** Constructs a Recursion Limit Error
		@param {string} message An error message
	    @param {Error} e An error
	*/
    constructor(message = 'A RecursionLimitError occurred', e) {
        super(message + '\n' + e.message);
    }
}