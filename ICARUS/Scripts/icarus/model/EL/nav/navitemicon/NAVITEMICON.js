/**
    @module
*/
import LI from '../../group/li/LI.js';
import ANCHOR from '../../anchor/ANCHOR.js';
import ARTICLE from '../../container/article/ARTICLE.js';
/**
    A navigation item that populates a Bootstrap 3 navbar.
    @description Nav items can be single buttons or dropdowns with nav items nested within them  
    @class
    @extends LI
*/
export default class NAVITEMICON extends LI {
	/**
	    @constructs NAVITEMICON
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
		this.addCase('MENU', (model) => {
			return this.addMenu(model);
		});
		this.addCase('ANCHOR', (model) => {
			return this.addAnchor(model);
		});
		this.addCase('ARTICLE', (model) => {
			return this.addArticle(model);
		});
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
	addArticle(model) {
		this.children.push(new ARTICLE(this, model));
		return this.children[this.children.length - 1];
	}
}