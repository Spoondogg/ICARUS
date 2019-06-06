/** @module */
/* eslint-disable max-lines-per-function, complexity, max-statements */
import NAVBAR, { Activate, Deactivate, MODEL } from '../nav/navbar/NAVBAR.js';
import { ICONS } from '../../../enums/ICONS.js';
/** A REFERENCE represents a collection of menus and tabs representing the MODEL
    of its given CONTAINER as part of the document-map
    @class
*/
export default class REFERENCE extends NAVBAR { // CONTAINERREFERENCE extends REFERENCE
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
}
/* eslint-enable */