/** @module */
import EL from '../model/el/EL.js';
/** An Element Open Event
    @extends CustomEvent
*/
export default class Open extends CustomEvent {
	/** An element Open event
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('open', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}
export { EL }