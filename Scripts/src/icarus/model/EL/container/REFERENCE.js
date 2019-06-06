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

        this.constructReference();
    }
    /** Constructs the Reference menus based on its CONTAINER
        @returns {void}
    */
    constructReference() {
        try {
            let propertiesMenu = this.options.menu.getMenu('PROPERTIES');
            ['DATA', 'ATTRIBUTES', 'META'].forEach((p) => {
                let t = propertiesMenu.addNavItemIcon(new MODEL().set({
                    label: p,
                    icon: ICONS[p],
                    name: p
                }));
                let m = propertiesMenu.addMenu(new MODEL().set('name', p));
                this.addTabbableElement(t, m);
            });

            let methodsMenu = this.options.menu.getMenu('METHODS');
            ['ELEMENTS', 'CRUD', 'DOM'].forEach((p) => {
                let t = methodsMenu.addNavItemIcon(new MODEL().set({
                    label: p,
                    icon: ICONS[p],
                    name: p
                }));
                let m = methodsMenu.addMenu(new MODEL().set('name', p));
                this.addTabbableElement(t, m);
            });
            this.container.addCrudItems(methodsMenu.getMenu('CRUD'));
            this.container.addDomItems(methodsMenu.getMenu('DOM'));
            this.container.addElementItems(methodsMenu.getMenu('ELEMENTS'), this.container.containerList);
        } catch (e) {
            console.warn('Unable to add REFERENCE items', e);
        }
    }
}
/* eslint-enable */