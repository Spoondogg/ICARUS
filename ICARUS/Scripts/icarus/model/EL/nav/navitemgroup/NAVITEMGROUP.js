/**
    Nav item within navbar
*/
class NAVITEMGROUP extends UL {
    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {MODEL} model The json object representing this element        
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('nav navbar-nav');

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('DROPDOWNTAB', function (element, model) {
            return this.addDropDownTab(model);
        }.bind(this));

        this.addCase('DROPDOWNMENU', function (element, model) {
            return this.addDropDownMenu(model);
        }.bind(this));

        this.addCase('NAVITEMGROUP', function (element, model) {
            return this.addNavItemGroup(model);
        }.bind(this));

        this.addCase('NAVITEM', function (element, model) {
            return this.addNavItem(model);
        }.bind(this));

        this.addCase('NAVSEPARATOR', function (element, model) {
            return this.addNavSeparator();
        }.bind(this));

        this.addCase('NAVBARCOLLAPSE', function (element, model) {
            return this.addNavBarCollapse(model);
        }.bind(this));
    }

    /**
        Adds a drop down tab to the nav-bar that relates to the given article model
        @param {MODEL} model The article element
        param {string} label Label visible on this tab
        @returns {DROPDOWNTAB} A dropdown tab
    */
    addDropDownTab(model) {
        let dropDownTab = null;
        try {
            dropDownTab = new DROPDOWNTAB(this, model);
            dropDownTab.anchor.el.onclick = function () {
                $(this).toggleClass('active');
            };
        } catch (e) {
            console.log('Unable to create dropdown tab.\n' + e);
            console.log(e);
        }
        this.children.push(dropDownTab);
        return this.addGroup(this.children[this.children.length - 1]);
    }

    /**
        Adds a drop down tab to the nav-bar that relates to the given article model
        @param {MODEL} model The article element
        param {string} label Label visible on this tab
        @returns {DROPDOWNTAB} A dropdown tab
    */
    addModalTab(model) {
        let modalTab = null;
        try {
            modalTab = new MODALTAB(this, model);
            modalTab.anchor.el.onclick = function () {
                //$('.dropdown-tab').removeClass('active');
                $(this).toggleClass('active');
            };
        } catch (e) {
            console.log('Unable to create modal tab.\n' + e);
        }
        this.children.push(modalTab);
        return this.addGroup(this.children[this.children.length - 1]);
    }

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {NAVITEM} Nav Item with Anchor
    */
    addNavItemGroup(model) {
        this.children.push(new NAVITEMGROUP(this, model));
        return this.addGroup(this.children[this.children.length - 1]);
    } 

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {DROPDOWNMENU} Nav Item with Anchor
    */
    addDropDownMenu(model) {
        this.children.push(new DROPDOWNMENU(this, model));
        return this.addGroup(this.children[this.children.length - 1]);
    } 

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {NAVITEM} Nav Item with Anchor
    */
    addNavItem(model) {
        this.children.push(new NAVITEM(this, model)); //model.url, model.label
        return this.addGroup(this.children[this.children.length - 1]);
    } 

    /**
        Adds a Separator (UI Only)        
    */
    addNavSeparator() {
        let obj = new NAVSEPARATOR(this);
    }

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {NAVBARCOLLAPSE} Nav Item with Anchor
    */
    addNavBarCollapse(model) {
        this.children.push(new NAVBARCOLLAPSE(this, model));
        return this.addGroup(this.children[this.children.length - 1]);
    } 

    /**
        Sets this tab as active
        @returns {boolean} true if successful
     */
    setActive() {
        try {
            $('.dropdown-tab').removeClass('active');
            $(this).toggleClass('active');
            return true;
        } catch (e) {
            console.log('Unable to set this Item Group as active.');
            console.log(e);
            return false;
        }
    }
}