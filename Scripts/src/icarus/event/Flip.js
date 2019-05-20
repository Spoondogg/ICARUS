/** @module */
/** A Switch 'Flip' Event
    @extends CustomEvent
*/
export default class Flip extends CustomEvent {
	/** An switch 'flip' event that assists in unifying Mouse and Touch Events
	    over Mobile and Desktop Platforms
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('flip', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}