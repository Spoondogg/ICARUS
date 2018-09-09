import LI from '../../group/li/LI.js';
import ANCHOR from '../../anchor/ANCHOR.js';
import ARTICLE from '../../container/article/ARTICLE.js';
/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them  
    
    CORE ITEMS CAN NOT BECOME CONTAINERS...  STOP TRYING TO MAKE THEM THAT WAY
*/
export default class NAVITEMICON extends LI {
    /**
        @param {EL} node The element that will contain this object
        @param {MODEL} model The nav-item json object retrieved from the server
     */
    constructor(node, model) {
        super(node, model);
        this.className = 'NAVITEMICON';
        this.addClass('nav-item-icon');
        this.el.setAttribute('title', model.anchor.label);
        this.anchor = model.anchor ? new ANCHOR(this, model.anchor) : null;
        
        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('MENU', function (model) {
            return this.addMenu(model);
        }.bind(this));
        
        this.addCase('ANCHOR', function (model) {
            return this.addAnchor(model);
        }.bind(this));

        this.addCase('ARTICLE', function (model) {
            return this.addArticle(model);
        }.bind(this));
    }

    /**
        Add a NavItemGroup to this NavItem
        @param {MODEL} model NavBarNav model
        @returns {MENU} The newly created element
     */
    addMenu(model) {
        this.children.push(new MENU(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addAnchor(model) {
        this.children.push(new ANCHOR(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addArticle(model) {
        this.children.push(new ARTICLE(this, model));
        return this.children[this.children.length - 1];
    }
}