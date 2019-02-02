/** @module */
/** An Element Swipe Event
    @extends CustomEvent
*/
export default class Swipe extends CustomEvent {
	/** An element 'swipe' event for gestures and touch screens
	    @param {EL} caller Calling node
        @param {string} direction The direction of the swipe
	*/
	constructor(caller, direction) {
		super('swipe', {
			bubbles: false,
			detail: {
				caller,
				direction
			}
		});
	}
}