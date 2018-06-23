/**
    MenuList Constructor
    A MENULIST is essentially a UL that is designed to contain List Items (LI)
    Unlike most containers

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class MENULIST extends CONTAINER {
    /**
        Constructs An Unordered List
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'DIV', model, []); //'LISTITEM'
        this.addClass('menulist');
        //this.populate(model.children);
    }

    construct() {
        this.menu = new MENU(this.body.pane, new MODEL('menulist-menu').set({
            'label':this.label
        }));
    }
}