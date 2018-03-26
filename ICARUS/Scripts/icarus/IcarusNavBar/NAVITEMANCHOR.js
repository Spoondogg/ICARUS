/**
    Streamlines NavItem creation (overloaded) to accept more accessable args    
*/
class NAVITEMANCHOR extends NAVITEM {
    /**
        Constructs a nav item link, which is a TAB with an anchor to select the tab,
        as well as a CARET that toggles a dropdown menu.

        @param {EL} node The navItem parent element
        @param {MODEL} model Object Model
     */
    constructor(node, model) { // url, label
        model = model || new MODEL(new ATTRIBUTES(), '__UnknownNavItemAnchor');
        super(node, model);
    }
}