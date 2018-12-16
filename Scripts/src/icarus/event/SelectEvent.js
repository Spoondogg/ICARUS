﻿/** @module */
/** An Element Select Event
    @extends CustomEvent
*/
export default class SelectEvent extends CustomEvent {
    /** An element selection event
        @param {EL} caller Calling node
    */
    constructor(caller) {
        super('select', {
            bubbles: false,
            detail: {
                caller
            }
        });
    }
}