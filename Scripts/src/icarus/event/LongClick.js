/** @module */
/** An Element LongClick Event
    @extends CustomEvent
*/
export default class LongClick extends CustomEvent {
	/** An element 'long click' event that assists in unifying Mouse and Touch Events
	    over Mobile and Desktop Platforms
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('longclick', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}