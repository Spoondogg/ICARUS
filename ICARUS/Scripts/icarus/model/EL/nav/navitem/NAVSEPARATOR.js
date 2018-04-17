/**
    A horizontal line that separates content inside a navbar dropdown menu
*/
class NAVSEPARATOR extends NAVITEM {
    /**
        A separator for menus
        @param {EL} node The element that will contain this object
     */
    constructor(node) {
        super(node, new MODEL('divider').set({
            'anchor': new MODEL().set({
                'label': ''
            })
        }));
    }    
}