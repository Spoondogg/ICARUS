/**
    A horizontal line that separates content inside a navbar dropdown menu
*/
class NAVSEPARATOR extends LI {
    /**
        A separator for menus
        @param {EL} node The element that will contain this object
     */
    constructor(node) {
        super(node, new MODEL(new ATTRIBUTES({
            'role': 'separator',
            'class': 'divider nav-item'
        })));
    }    
}