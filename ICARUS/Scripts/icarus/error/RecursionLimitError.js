/**
    @module
*/
import ExtendableError from './ExtendableError.js';
/**
    Thrown if the recursion limit is exceeded
    @class
    @extends ExtendableError
*/
export default class RecursionLimitError extends ExtendableError {
	/**
	    Constructs a Recursion Limit Error
	    @param {string} message
	*/
	constructor(message) {
		super(message);
	}
}