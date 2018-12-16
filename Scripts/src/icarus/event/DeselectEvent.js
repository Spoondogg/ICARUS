/** @module */
/** An Element Deselect Event
    @extends CustomEvent
*/
export default class DeselectEvent extends CustomEvent {
    /** An element deselection event
        @param {EL} caller Calling node
    */
    constructor(caller) {
        super('deselect', {
            bubbles: false,
            detail: {
                caller
            }
        });
    }
}