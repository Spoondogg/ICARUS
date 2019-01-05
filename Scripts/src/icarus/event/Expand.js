/** @module */
/** An Element Expansion Event
    @extends CustomEvent
*/
export default class Expand extends CustomEvent {
    /** An element expansion event
        @param {EL} caller Calling node
    */
    constructor(caller) {
        super('expand', {
            bubbles: false,
            detail: {
                caller
            }
        });
    }
}