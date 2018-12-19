/** @module */
/** An Element Click Event for EL.clickHandler()
    @extends CustomEvent
*/
export default class ClickEvent extends CustomEvent {
    /** An element click event
        @param {EL} caller Calling node
    */
    constructor(caller) {
        super('click', {
            bubbles: true,
            detail: {
                caller
            }
        });
    }
}