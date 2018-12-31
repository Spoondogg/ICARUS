/** @module */
import MENU, { ATTRIBUTES, MODEL } from '../MENU.js'
import DIV from '../../../div/DIV.js';
import IMG from '../../../img/IMG.js';
/** User Menu 
    @class
    @extends EL
*/
export default class USERMENU extends MENU {
	/** Constructs a User Menu
	    @param {UL} node The object to contain this element
	    @param {MODEL} model The element's attributes
	*/
	constructor(node) {
        super(node, new MODEL('horizontal').set({
            name: 'USER',
            showHeader: 0,
            collapsed: 0,
            wrapperClass: 'usermenu'
        }));
        this.hide();
        
        this.profile = new DIV(this.wrapper, new MODEL('profile'));
        this.image = new IMG(this.profile, new MODEL({
            class: 'picture',
            src: localStorage.getItem('picture')
        }));
        this.username = new DIV(this.profile, new MODEL('username'), 'Ryan Dunphy');
        this.quote = new DIV(this.profile, new MODEL('quote'), 'Dad Joke Specialist');
        this.details = new DIV(this.profile, new MODEL('details'), 'Lorem Ipsum');
        $(this.el).insertAfter(this.profile.el);

        this.btnLogout = this.addNavItem(new MODEL().set('label', 'Log Out'));
        this.btnLogout.el.onclick = () => this.logout();

        for (let i = 0; i < 5; i++) {
            this.addNavItem(new MODEL().set('label', 'Button[' + i + ']')).el.onclick = () => this.toggle();
        }
    }
    /** Calls MAIN.logout()
        @returns {Promise<ThisType>} callback
    */
    logout() {
        console.log('USERMENU.logout()');
        return this.toggle().then(() => this.getMain().then((main) => main.logout()));
    }
    /** Toggles the visibility of the User Menu
        @returns {ThisType} callback
    */
    toggle() {
        return new Promise((resolve, reject) => {
            try {
                console.log(' - toggle usermenu');
                $(this.wrapper.el).toggle();
                resolve(this);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
    /** Collapses the User Menu
	    @returns {Promise<ThisType>} callback
	*/
    hide() {
        return new Promise((resolve, reject) => {
            try {
                $(this.wrapper.el).toggle('hide');
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Expands the User Menu
        @returns {Promise<ThisType>} callback
    */
    show() {
        return new Promise((resolve, reject) => {
            try {
                $(this.wrapper.el).toggle('show');
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }
}
export { ATTRIBUTES, MENU, MODEL };