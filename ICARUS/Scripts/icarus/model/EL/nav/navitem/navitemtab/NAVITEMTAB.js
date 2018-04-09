/**
    A TAB like button that is added to a NAVBAR with a corresponding
    CARET that toggles a submenu
*/
class NAVITEMTAB extends NAVITEM {
    /**
        A tab that appears in a nav group
        @param {EL} node The element that will contain this object
        @param {MODEL} model The nav-item json object retrieved from the server
        @param {string} label Sets the innerHTML of this list-item
     */
    constructor(node, model) {
        super(node, model, true);
        this.addClass('dropdown-toggle');
        this.caret = new CARET(this.anchor);
    }
}