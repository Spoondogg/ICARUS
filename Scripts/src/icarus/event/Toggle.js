/** @module */
/** An Element Toggle Event
    @extends CustomEvent
*/
export default class Toggle extends CustomEvent {
	/** An element 'toggle' event that assists in unifying Mouse and Touch Events
	    over Mobile and Desktop Platforms
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('toggle', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}