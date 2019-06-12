/** @module */
import MENU, { Expand, MODEL } from '../../../nav/menu/MENU.js';
import BANNER from '../BANNER.js';
import HEADER from '../../../header/HEADER.js';
/** Contains a high level view of the specified CONTAINER Class if it is available to the user
    @class
    @extends BANNER
*/
export default class CLASSVIEWER extends BANNER {
	/** Constructs a CLASSVIEWER Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
        @param {string} classType Default class to display
	*/
    constructor(node, model, classType = 'MAIN') {
		super(node, model);
        this.addClass('classviewer');
		this.classType = classType;
	}
    construct() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.h1 = new HEADER(this.body.pane, new MODEL().set('innerHTML', this.data.classType + ' viewer'), 1);
                this.menu = new MENU(this.body.pane, new MODEL());
                let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetContainerParents'];
                for (let m = 0; m < methods.length; m++) {
                    this.menu.addNavItem(new MODEL().set('label', this.data.classType + '.' + methods[m] + '()')).el.onclick = () => {
                        window.open(new URL(window.location.href).origin + '/' + this.data.classType + '/' + methods[m]);
                    };
                }
                this.menu.el.dispatchEvent(new Expand(this.menu));
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
	}
}