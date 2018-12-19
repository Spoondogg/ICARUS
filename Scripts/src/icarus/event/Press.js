/** @module */
/** An Element Press Event
    @extends CustomEvent
*/
export default class Press extends CustomEvent {
    /** An element 'press' event that assists in unifying Mouse and Touch Events
        over Mobile and Desktop Platforms
        @param {EL} caller Calling node
    */
    constructor(caller) {
        super('press', {
            bubbles: true,
            detail: {
                caller
            }
        });
    }
}