/** @module */
/** A generic INTERFACE for an EL element
    @class
*/
export default class IFACE {
	/** Construct a generic Interface 
        @param {EL} node Parent Element
    */
    constructor(node) { //eventOn, eventOff
        this.node = node;
        /** A collection of methods available on this interface
            @property {object} methods
        */
        this.methods = {};
        /** A collection of events available on this interface
            @property {object} events
        */
        this.events = {};
        /** A collection of handlers available on this interface
            @property {object} handlers
        */
        this.handlers = {};
    }    
}