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
    constructor(node, model, innerHtml) {
        super(node, model);
        this.addClass('nav-item');
        this.anchor = new ANCHOR(this, model, innerHtml);
    }
    
    /**
        Sets the achor HREF to the given value
        @param {string} href The url/reference that this anchor points to
    */
    setHref(href) {
        this.anchor.model.href = href;
    }
}