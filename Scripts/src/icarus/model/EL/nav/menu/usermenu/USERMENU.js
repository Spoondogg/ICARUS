/** @module */
import MENU, { ATTRIBUTES, Activate, EL, Expand, MODEL, NAVBAR } from '../MENU.js'
import DIV from '../../../div/DIV.js';
import { ICONS } from '../../../../../enums/ICONS.js';
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
            class: 'avatar',
            src: this.getAvatar()
        }));
        try {
            this.username = new DIV(this.profile, new MODEL('username').set('innerHTML', localStorage.getItem('name')));
            this.email = new DIV(this.profile, new MODEL('email').set('innerHTML', this.getUser()));
            this.roles = new DIV(this.profile, new MODEL('roles').set('innerHTML', this.getRole()));
        } catch (e) {
            console.warn(e);
        }
        this.createOptions();        
        this.navbar.el.dispatchEvent(new Expand(this.navbar));
    }
    /** Creates the Options Menu for this active user
        @returns {void}
    */
    createOptions() {
        /** @type {NAVBAR} */
        this.navbar = this.node.navbar;
        this.navbar.addClass('options-nav');
        let optionsMenu = this.navbar.addOptionsMenu('OPTIONS', ICONS.USER, 'OPTIONS', ['Profile', 'Settings']);
        optionsMenu.tab.el.dispatchEvent(new Activate(optionsMenu.tab));
        this.options = this.navbar.addTabbableMenu('ACCOUNT', 'ACCOUNT', ICONS.USER, [], true);
        this.options.element.swipeSensitivity = 150;

        if (this.getRole() === 'Guest') {
            this.btnLogin = this.options.element.addNavItemIcon(new MODEL().set({
                label: 'Log In',
                icon: ICONS.USER,
                name: 'log-in'
            }));
            this.btnLogin.el.onclick = () => this.login();
        } else {
            this.btnLogout = this.options.element.addNavItemIcon(new MODEL().set({
                label: 'Log Out',
                icon: ICONS.USER,
                name: 'log-out'
            }));
            this.btnLogout.el.onclick = () => this.logout();
        }
        /* You should probably use OAuth instead */
        this.btnRegister = this.options.element.addNavItemIcon(new MODEL().set({
            label: 'Register',
            icon: ICONS.USER,
            name: 'register'
        }));
        this.btnRegister.el.onclick = () => this.register();
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
	    @returns {Promise<ThisType>} Promise Chain
	*/
	logout() {
		console.log('USERMENU.logout()');
		return this.flip().then(() => this.getMain().logout());
	}
	/** Calls MAIN.login()
	    @returns {Promise<ThisType>} Promise Chain
	*/
	login() {
		console.log('USERMENU.login()');
		return this.flip().then(() => this.getMain().login());
    }
    /** Calls MAIN.register()
	    @returns {Promise<ThisType>} Promise Chain
	*/
    register() {
        console.log('USERMENU.register()');
        return this.flip().then(() => this.getMain().register());
    }
}
export { ATTRIBUTES, EL, MENU, MODEL }