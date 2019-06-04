/** @module */
/* eslint-disable max-lines-per-function, complexity, max-statements */
import NAVBAR, { MENU, MODEL } from '../nav/navbar/NAVBAR.js';
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
            ['DATA', 'ATTRIBUTES', 'META', 'PROPERTIES', 'METHODS', 'CHILDREN'], false
        );

        /** @type {[MENU]} */
        let [propertiesMenu] = this.options.menu.get('PROPERTIES', 'MENU');
        ['DATA', 'ATTRIBUTES', 'META'].forEach((p) => {
            let t = propertiesMenu.addNavItemIcon(new MODEL().set({
                label: p,
                icon: ICONS[p],
                name: p
            }));
            let m = propertiesMenu.addMenu(new MODEL().set('name', p));
            this.addTabbableElement(t, m);
        });

        /*  This is where you want to add things like CRUD, ELEMENTS etc 
            that exist in CONTAINER.navheader.  The key here is not to repeat
            yourself unnecessarily.  
        */

        /** @type {[MENU]} */
        let [methodsMenu] = this.options.menu.get('METHODS', 'MENU');
        ['ELEMENTS', 'CRUD', 'DOM'].forEach((p) => {
            let t = methodsMenu.addNavItemIcon(new MODEL().set({
                label: p,
                icon: ICONS[p],
                name: p
            }));
            let m = methodsMenu.addMenu(new MODEL().set('name', p));
            this.addTabbableElement(t, m);
        });

        /** @example 
        // Add test tabbable menu
        let isHorizontal = false;
        let optMenuClass = isHorizontal ? 'horizontal' : '';
        let tabOne = methodsMenu.addNavItemIcon(new MODEL().set({
            label: 'ONE',
            icon: ICONS.FLAG,
            name: 'ONE'
        }));
        //let tabbableOne = tabOne.addTabbableElement(methodsMenu.addMenu(new MODEL(optMenuClass).set('name', 'ONE')));

        let subOne = methodsMenu.addMenu(new MODEL(optMenuClass).set('name', 'ONE'));
        this.addTabbableElement(tabOne, subOne);

        // So basically, just create a new submenu (opt) and continue on with the pattern
        let tabTwo = subOne.addNavItemIcon(new MODEL().set({
            label: 'TWO',
            icon: ICONS.FLAG,
            name: 'TWO'
        }));
        let subTwo = subOne.addMenu(new MODEL(optMenuClass).set('name', 'TWO'));
        this.addTabbableElement(tabTwo, subTwo);        
        */
    }
}

/* eslint-enable */