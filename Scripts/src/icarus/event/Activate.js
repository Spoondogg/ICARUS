/** @module */
import EL from '../model/el/EL.js';
/** An Element Activate Event */
export default class Activate extends CustomEvent {
	/** An element activation event
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('activate', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}
export { EL }