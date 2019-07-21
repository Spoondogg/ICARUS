/** @module */
import NAVBAR, { Activate, Deactivate, MODEL } from '../nav/navbar/NAVBAR.js';
import { ICONS } from '../../../enums/ICONS.js';
/** A REFERENCE represents a collection of menus and tabs representing the MODEL
    of its given CONTAINER as part of the document-map
    @class
*/
export default class REFERENCE extends NAVBAR { // CONTAINERREFERENCE extends REFERENCE
    /** Constructs a Navigation Panel
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
    */
    constructor(node, model) {
        super(node, model);
        /** @type {CONTAINER} */
        this.container = this.required(model.container);
        /** @type {Name} */
        this.name = this.required(model.name);
        this.addClass('reference');
        this.options = this.addOptionsMenu(
            this.container.label, ICONS[this.container.className], this.container.toString(),
            ['PROPERTIES', 'METHODS', 'CHILDREN'], false
        );

        this.createReferencePlaceholder(model);
        
        let { tab } = this.options;
        this.el.addEventListener('deactivate', () => this.chain(() => {
            if (tab.hasClass('active')) {
                tab.el.dispatchEvent(new Deactivate(tab));
            }
        }));
        /** Activates REFERENCE tab and scrolls to CONTAINER */
        tab.el.addEventListener('longclick', () => this.chain(() => {
            tab.el.dispatchEvent(new Activate(tab));
            let main = this.getMain();
            main.focusBody();
            this.container.scrollTo();
            this.container.el.dispatchEvent(new Activate(this.container));
        }));

        this.container.constructReference(this);
    }
    /** Creates a temporary NAVITEMICON that acts as a placeholder for a subsection reference.
        This is done in order to ensure that references are loaded in the appropriate order
        when they are called asynchronously
        @param {MODEL} model Model
        @returns {void}
    */
    createReferencePlaceholder(model) {
        // create children temp placeholders with corresponding UId
        //console.log('model.container.className', model.container.className);
        if (typeof model.container.subsections !== 'undefined' && model.container.subsections.length > 0 && model.container.subsections[0] !== '0') {
            let childrenMenu = this.options.menu.getMenu('CHILDREN');
            //console.log(this.toString() + ' Adding ' + model.container.toString() + ' children reference placeholders', model.container.subsections);
            model.container.subsections.forEach((s) => {
                childrenMenu.addNavItemIcon(new MODEL().set({
                    id: 'ref_' + s,
                    label: s,
                    icon: ICONS.ALERT,
                    name: s + ' placeholder'
                }));
            });
        }
    }
}
export { MODEL }