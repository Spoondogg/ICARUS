/**
    The OPTIONS drop down that is right aligned to the NAVBAR
*/
class OPTIONSDROPDOWN extends DROPDOWNTAB {
    /**
        Constructs a dropdown tab
        @param {EL} node The parent object (navbar menu)
     */
    constructor(node) {
        super(node, new MODEL(new ATTRIBUTES('dropdown'), 'OPTIONS-XYZ'));
    }

    addNavItemGroup(model) {
        this.children.push(new NAVITEMGROUP(this, model, model.alignRight));
        return this.children[this.children.length - 1];
    }
}