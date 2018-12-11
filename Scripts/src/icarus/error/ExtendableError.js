/** @module */
/** An extendable Error abstraction
    @abstract
    @class
    @extends Error
    @see https://stackoverflow.com/a/32749533/722785
*/
export default class ExtendableError extends Error {
	/** Constructs an Error
	    @param {string} message The error message
	*/
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}
	}
}