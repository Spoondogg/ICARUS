/** @module */
import MENU, { ATTRIBUTES, EL, MODEL } from '../MENU.js'
import DIV from '../../../div/DIV.js';
import IMG from '../../../img/IMG.js';
/** User Menu 
    @class
    @extends MENU
*/
export default class USERMENU extends MENU {
	/** Constructs a User Menu
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
    constructor(node) {
        super(node, new MODEL('in').set('name', 'USER'));
        this.overrideMenuDefaults();
        this.profile = new DIV(this, new MODEL('profile'));
        this.image = new IMG(this.profile, new MODEL({
            class: 'picture',
            src: localStorage.getItem('picture')
        }));
        this.username = new DIV(this.profile, new MODEL('username'), 'Ryan Dunphy');
        this.quote = new DIV(this.profile, new MODEL('quote'), 'Dad Joke Specialist');
        this.details = new DIV(this.profile, new MODEL('details'), 'Lorem Ipsum');
        this.options = this.addMenu(new MODEL('horizontal').set({
            name: 'USEROPTIONS',
            swipeSensitivity: 150
        }));
		this.btnLogout = this.options.addNavItem(new MODEL().set('label', 'Log In'));
		this.btnLogout.el.onclick = () => this.login();
		this.btnLogout = this.options.addNavItem(new MODEL().set('label', 'Log Out'));
		this.btnLogout.el.onclick = () => this.logout();
		for (let i = 0; i < 5; i++) {
			this.options.addNavItem(new MODEL().set('label', 'Button[' + i + ']')).el.onclick = () => this.deactivate();
		}
        this.options.expand();
    }

	/** The USERMENU slides in and should be expanded at all times 
	    @returns {void}
	*/
	overrideMenuDefaults() {
		this.el.removeEventListener('activate', this.expand);
		this.el.removeEventListener('deactivate', this.collapse);
		this.expand();
	}
	/** Calls MAIN.logout()
	    @returns {Promise<ThisType>} callback
	*/
	logout() {
		console.log('USERMENU.logout()');
		return this.flip().then(() => this.getMain().logout());
	}
	/** Calls MAIN.login()
	    @returns {Promise<ThisType>} callback
	*/
	login() {
		console.log('USERMENU.login()');
		return this.flip().then(() => this.getMain().login());
	}
}
export { ATTRIBUTES, EL, MENU, MODEL }