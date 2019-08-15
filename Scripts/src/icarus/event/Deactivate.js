/** @module */
/** An Element Deactivate Event */
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