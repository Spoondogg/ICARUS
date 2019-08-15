/** @module */
/** An Element Open Event */
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