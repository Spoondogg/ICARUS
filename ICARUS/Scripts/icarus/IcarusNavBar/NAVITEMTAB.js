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

        this.addClass('nav-item');
        this.addClass('dropdown-toggle');

        /*
        this.attributes['href'] = '#';
        this.attributes['data-toggle'] = 'dropdown';
        this.attributes['role'] = 'button';
        this.attributes['aria-haspopup'] = true;
        this.attributes['aria-expanded'] = true;
        */


        //this.anchor = new ANCHOR(this, model);
        
        /*
        new MODEL(new ATTRIBUTES({
                'href': '#',
                'class': 'dropdown-toggle',
                'data-toggle': 'dropdown', 'role': 'button',
                'aria-haspopup': 'true', 'aria-expanded': 'true'
            }))
        */
        this.caret = new CARET(this.anchor);
        //new EL(this.anchor, 'SPAN', new MODEL(new ATTRIBUTES('caret')));
    }
}