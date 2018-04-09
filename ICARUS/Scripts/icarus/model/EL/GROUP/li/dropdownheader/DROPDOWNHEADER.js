/**
    A horizontal line that separates content inside a navbar dropdown menu
*/
class DROPDOWNHEADER extends LI {
    /**
        Constructs a Dropdown Header
        @param {EL} node The element that will contain this object
        @param {string} label Text to display
     */
    constructor(node, label) {
        super(node, new MODEL(new ATTRIBUTES('dropdown-header')), label); //label
    }    
}