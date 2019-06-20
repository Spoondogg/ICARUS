/** @module */
/** A 'Modify' Event indicates that a change has taken place and triggers the appropriate change handlers
    @extends CustomEvent
*/
export default class Modify extends CustomEvent {
	/** A 'Modify' Event indicates that a change has taken place and triggers the appropriate change handlers
	    @param {EL} caller Calling node
	*/
	constructor(caller) {
		super('modify', {
			bubbles: false,
			detail: {
				caller
			}
		});
	}
}