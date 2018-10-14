/**
    @module
*/
import MENU, { ATTRIBUTES, MODEL } from './MENU.js';
import NAVSEARCH, { NAVITEM } from '../navitem/NAVSEARCH.js';
/**
    A vertical navitemgroup with a search panel
    @class
    @extends MENU
 */
export default class SIDEBARMENU extends MENU { // NAVBAR
	/**
		    A vertical navitemgroup with a search panel
		    @param {CONTAINERBODY} node The CONTAINERBODY to contain the sidebar
		    @param {MODEL} model The text that is displayed within the footer
	        @todo NAVSEARCH needs improvement
		 */
	constructor(node, model) {
		super(node, model);
		//this.wrapper.addClass('sidebar');
		this.addClass('sidebar navbar-inverse collapse'); //active
		this.search = new NAVSEARCH(this);
		this.search.el.style.display = 'none';
		this.search.inputGroup.q.el.onkeypress = function() {
			this.menu.addClass('in');
		}.bind(this);
		this.toggleButton = new NAVITEM(this, new MODEL(new ATTRIBUTES('toggle')).set({
            'label': '<span class="caret"></span>'
		}));
		this.toggleButton.el.style.display = 'none';
		this.toggleButton.anchor.addClass('toggle-wide noselect');
		this.toggleButton.el.onclick = this.toggleDocumentMap.bind(this);
		this.menu = new MENU(this, new MODEL('collapse in').set({
			'name': 'document-map'
		}));
	}
	/**
		    Show / Hide the Document Map Menu
	        @returns {void}
		*/
	toggleDocumentMap() {
		//this.menu.toggle('in');
		$(this.menu.el).collapse('toggle');
	}
}