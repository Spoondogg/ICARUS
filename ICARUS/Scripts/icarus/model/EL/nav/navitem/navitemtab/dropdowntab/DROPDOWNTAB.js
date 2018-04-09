/**
    A dropdown-menu tab that allows for selection of the tab/article as well
    as a dropdown that shows the relevant sections for this article
*/
class DROPDOWNTAB extends NAVITEMTAB {
    /**
        A dropdown menu tab contains a basic tab as well as a dropdown menu
        @param {EL} node The element that will contain this object
        @param {MODEL} model Drop Down Tab object
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('nav-item dropdown-tab');

        // When clicked, toggle active status
        this.el.onclick = this.toggleMenu.bind(this);

        // A dropdown menu containing nav items
        this.menu = new DROPDOWNMENU(this, new MODEL().set({
            'name': 'menu'
        }));

        this.populate(model.children);
    }

    /**
        Toggle the Menu and button's active state
     */
    toggleMenu() {
        this.toggle('active');
        this.menu.toggle();
    }
}