/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them
*/
class TAB extends LI {
    /**
        Constructs a TAB
        @param {EL} node The element that will contain this object
        @param {MODEL} model The object attributes
        @param {string} innerHtml The object innerHtml
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('nav-item');
        this.anchor = new ANCHOR(this, model.anchor);
    }
}