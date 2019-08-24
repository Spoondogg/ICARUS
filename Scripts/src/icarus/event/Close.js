/** @module */
import EL from '../model/el/EL.js';
/** An Element Close Event */
export default class Close extends CustomEvent {
	/** An element Close event
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('close', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}
export { EL }