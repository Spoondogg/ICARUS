/** @module */
import EL from '../model/el/EL.js';
/** An Element Deactivate Event
    @extends CustomEvent
*/
export default class Deactivate extends CustomEvent {
	/** An element deactivation event
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('deactivate', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}
export { EL }