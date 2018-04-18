/**
    A Bootstrap 3 Nav Menu that is fixed to the top of the page.
    See https://getbootstrap.com/docs/3.3/components/#nav
*/
class NAVBAR extends NAV {
    /**
        Constructs a Navigation Panel.
        @param {EL} node The element that will contain this object
        @param {MODEL} model The object
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-nav');
        
        this.header = new NAVHEADER(this, new MODEL().set({
            'className': 'NAVHEADER',
            'name': 'header',
            'label': node.label
        }));
    }
}