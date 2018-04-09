/**
    A dropdown-menu button that exists in a bootstrap nav-bar    
*/
class DROPDOWN extends NAVITEM {
    /**
        Constructs a Drop Down Nav Item
        @param {EL} node The element that will contain this object
        @param {MODEL} model Nav Item model
     */
    constructor(node, model) {
        super(node, model);
        this.menu = new NAVITEMGROUP(this, new MODEL().set('name', 'menu'));

        // Add all of the given nav items
        try {
            for (let i = 0; i < model.children.length; i++) {
                this.addNavItem(model.children[i]);
            }
        } catch (e) { /*console.log('Unable to add children to dropdown\n' + e.toString());*/ }

    }    

    /**
        Adds a Nav Item to the dropdown menu
        @param {MODEL} model A nav item model
        @returns {NAVITEM} A nav-item
     
    addNavItem(model) {
        this.menu.create('NAVITEM', model); //addListItem(navEl);
        return this.children[this.children.length - 1];
    }*/
}