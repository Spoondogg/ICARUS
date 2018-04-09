/**
    A group that contains drop down menu items.
    
 */
class DROPDOWNMENUGROUP extends GROUP {

    /**
        Construct a dropdown menu group
        @param {GROUP} node The parent node/group
        @param {MODEL} model The objkect model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('dropdown-group');

        this.header = new DROPDOWNHEADER(this, model.label);

        this.addCase('NAVITEM', function (element, model) {
            return this.addNavItem(model);
        }.bind(this));

        this.addCase('NAVSEPARATOR', function (element, model) {
            return this.addNavSeparator();
        }.bind(this));
    }

    /**
        Adds a Nav Item to this Drop Down Menu Group
        @param {MODEL} model Nav Item Model
        @returns {NAVITEM} A nav item
     */
    addNavItem(model) {
        model = model || new MODEL(new ATTRIBUTES(), 'Nav Item');
        this.children.push(
            new NAVITEM(this, model) //, model.hasDropdown
        );
        return this.children[this.children.length - 1];
    }

    /**
        Adds a Separator (UI Only)        
    */
    addNavSeparator() {
        let obj = new NAVSEPARATOR(this);
    }
}