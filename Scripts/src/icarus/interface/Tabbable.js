/** @module */
import Switchable, { Activate, Deactivate, EL, IFACE } from './Switchable.js';
import { MODELS } from '../enums/MODELS.js';
/** An interface for Tab driven Events.  
    @description An element is tabbable when it can be activated/deactivated by a separate element
    @class
*/
export default class Tabbable extends Switchable {
	/** A series of Tab-Switch Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        @param {EL} tab Switchable element bound to node
        @param {ClickableOptions} [options] Options
	*/
    constructor(node, tab, options = MODELS.clickableOptions()) {
        super(node, 'tabbable');
        this.options = options;
        tab.el.addEventListener('activate', () => {
            if (!node.hasClass('active')) {
                node.el.dispatchEvent(new Activate(node));
            }
        });
        tab.el.addEventListener('deactivate', () => {
            if (node.hasClass('active')) {
                node.el.dispatchEvent(new Deactivate(node));
            }
        });

        if (typeof node.tabs === 'undefined') {
            /** @type {Array<EL>} An array of tabs that are bound to this element */
            node.parentTabs = [];
        }
        node.parentTabs.push(tab);

        /** Adds active state to node
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.activate = () => node.chain(() => {
            if (!node.hasClass('active')) {
                if (this.options.deactivateSiblings) {
                    console.log(node.toString() + ' deactivating siblings');
                    //let deactivate = new Deactivate(tab);
                    //tab.dispatchToSiblings(deactivate, 'active');
                }
                node.addClass('active');

                console.log(node.toString() + ': Activating parent tabs', node.parentTabs.filter((t) => !t.hasClass('active')));
                //node.parentTabs.forEach((t) => t.el.dispatchEvent(new Activate(t)));
            }
        });

        /** Overrides Switchable method to include deactivating parent tabs
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.deactivate = () => {
            if (node.hasClass('active')) {
                node.chain(() => {
                    node.get()
                        .filter((c) => c.hasClass('active'))
                        .forEach((c) => c.el.dispatchEvent(new Deactivate(c)));
                    node.removeClass('active');
                    /** Deactivates this container's reference in the document map
                        NOTE: This is bad.  It references something CONTAINER specific
                        @returns {Promise<ThisType>} Promise Chain
                    */
                    try {
                        node.deactivateReference();
                    } catch (e) {
                        if (!(e instanceof TypeError)) {
                            console.error(this.toString() + '.deactivateReference()', e);
                        }
                    }

                    // deactivate parent tabs
                    console.log('Deactivating parent tabs', node.parentTabs);
                    //node.parentTabs.forEach((t) => t.el.dispatchEvent(new Deactivate(t)));
                });
            }
        }
	}
}
export { Activate, Deactivate, EL, IFACE, Switchable }