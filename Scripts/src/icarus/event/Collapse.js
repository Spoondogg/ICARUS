/** @module */
import EL from '../model/el/EL.js';
/** An Element Collapsing Event
    @extends CustomEvent
*/
export default class Collapse extends CustomEvent {
	/** An element collapsing event
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('collapse', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}
export { EL }