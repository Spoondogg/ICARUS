/**
    A generic header that should be placed at the top of content    
*/
class HEADER extends EL {
    /**
        Constructs a Header.
        @param {EL} node The object to contain the header
        @param {string} label The text that is displayed within the header
        @param {number} element Headers can range from H1 to H6. Undefined returns a standard HEADER element
     */
    constructor(node, label, element) {
        element = element ? 'H' + element : 'HEADER';
        super(node, element, new MODEL(new ATTRIBUTES()), label);
    }

    /**
        Adds a button group to this header
        @param {string} className The class
        @returns {BUTTONGROUP} A new ButtonGroup instance
    */
    addButtonGroup(className) {
        return new BUTTONGROUP(this, className);
    }
}