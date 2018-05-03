/**
    Nav item within navbar
*/
class MENU extends UL {
    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {MODEL} model The json object representing this element        
     */
    constructor(node, model) {
        super(node, model);
        //this.className = 'MENU'; 
        this.addClass('nav navbar-nav');

        if (model.showHeader) {
            this.header = new HEADER(this, new MODEL().set({
                'label': model.name
            })).el.onclick = this.toggleCollapse.bind(this);
        }
        this.collapse = new EL(node, 'DIV', new MODEL(
            new ATTRIBUTES('container-body collapse')
        ));

        this.addCase('MENU', function (model) {
            return this.addMenu(model);
        }.bind(this));

        this.addCase('NAVITEM', function (model) {
            return this.addNavItem(model);
        }.bind(this));

        this.addCase('NAVSEPARATOR', function (model) {
            return this.addNavSeparator();
        }.bind(this));
    }

    /**
        Toggles the collapsed state of the 'COLLAPSE'
     */
    toggleCollapse() {
        $(this.collapse.el).collapse('toggle');
    }

    /**
        Collapses the container's body
        @returns {boolean} true if hidden
    */
    hide() {
        try {
            $(this.collapse.el).collapse('hide');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
        Expands the container's body
    */
    show() {
        try {
            $(this.collapse.el).collapse('show');
        } catch (e) {
            console.log(e);
        }
    }

    /**
        Constructs a MENU
        @param {MODEL} model Object model
        @returns {MENU} Nav Item with Anchor
    */
    addMenu(model) {
        this.children.push(new MENU(this, model));
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
        Adds an array of Nav Items
        @param {Array} navItems An array of NAVITEM
     */
    addNavItems(navItems) {
        for (let i = 0; i < navItems.length; i++) {
            this.addNavItem(navItems[i]);
        }
    }

    /**
        Adds a Separator (UI Only)        
    */
    addNavSeparator() {
        let obj = new NAVSEPARATOR(this);
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