/**
    A drop down menu for toggle buttons
    @param {EL} node The parent element
*/
class DROPDOWNMENU extends NAVITEMGROUP { // UL || POSIBLE NAVITEMGROUP
    /**
        A drop down menu (UL) for toggle buttons
        @param {EL} node The parent element
        @param {MODEL} model A set of key/value pairs for this element's model
     */
    constructor(node, model) {
        super(node, model);
        this.className = 'DROPDOWNMENU';

        this.addClass('dropdown-menu navbar-inverse');

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('DROPDOWNMENUGROUP', function (model) {
            return this.addDropDownMenuGroup(model);
        }.bind(this));
    }
    
    /**
        Adds a Drop Down Menu Group to this GROUP
        @param {MODEL} model Object model
        @returns {DROPDOWNMENUGROUP} A dropdown menu group
     */
    addDropDownMenuGroup(model) {
        this.children.push(new DROPDOWNMENUGROUP(this, model));
        return this.addGroup(this.children[this.children.length - 1]);
    }    
}