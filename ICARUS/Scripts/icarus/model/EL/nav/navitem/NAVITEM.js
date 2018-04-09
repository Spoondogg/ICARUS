/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them    
*/
class NAVITEM extends LI {
    /**
        @param {EL} node The element that will contain this object
        @param {MODEL} model The nav-item json object retrieved from the server
        @param {boolean} hasDropdown If true, a dropdown is created
     */
    constructor(node, model) {

        // Override the LI label and instead pass label to anchor
        let label = model.label;
        model.label = null;

        super(node, model);
        this.addClass('nav-item');
        
        this.anchor = new ANCHOR(this,
            new MODEL(
                new ATTRIBUTES({
                    'class': 'nav-link',
                    'href': model.url
                })
            ).set({
                'label': label
            })
        );

        

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('NAVITEMGROUP', function (element, model) {
            return this.addNavItemGroup(model);
        }.bind(this));

        this.addCase('DROPDOWNMENU', function (element, model) {
            return this.addDropDownMenu(model);
        }.bind(this));

    }

    /**
        Add a NavItemGroup to this NavItem
        @param {MODEL} model NavBarNav model
        @returns {NAVITEMGROUP} The newly created element
     */
    addNavItemGroup(model) {
        this.children.push(new NAVITEMGROUP(this.anchor, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add a NavItemGroup to this NavItem
        @param {MODEL} model NavBarNav model
        @returns {NAVITEMGROUP} The newly created element
     */
    addDropDownMenu(model) {
        this.children.push(new DROPDOWNMENU(this.anchor, model));
        return this.children[this.children.length - 1];
    }
}