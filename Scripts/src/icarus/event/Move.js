/** @module */
/** A 'Move' Event indicates that the node has been relocated in the DOM
    @extends CustomEvent
*/
export default class Move extends CustomEvent {
	/** A 'Move' Event indicates that the node has been relocated in the DOM
	    @param {EL} caller Calling node
        @param {number} direction Move Direction (0=up,1=right,2=down,3=left)
	*/
	constructor(caller, direction = 0) {
		super('move', {
			bubbles: false,
			detail: {
                caller,
                direction
			}
		});
	}
}