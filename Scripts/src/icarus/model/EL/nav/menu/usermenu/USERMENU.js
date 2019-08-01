/** @module */
import MENU, { ATTRIBUTES, Activate, EL, Expand, MODEL, MODELS, NAVBAR } from '../MENU.js'
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
		super(node, new MODEL('usermenu in').set('name', 'USER'));
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
        this.el.dispatchEvent(new Expand(this));
        // override
        this.collapse = () => true;
        this.expand = () => true;
    }
    /** Creates the Options Menu for this active user
        @returns {void}
    */
    createOptions() {
        /** @type {NAVBAR} */
        this.navbar = this.node.navbar;
        this.navbar.addClass('options-nav');
        //let optionsMenu = this.navbar.addOptionsMenu('OPTIONS', ICONS.USER, 'OPTIONS', ['Profile', 'Settings']);
        //optionsMenu.tab.el.dispatchEvent(new Activate(optionsMenu.tab));
        this.account = this.navbar.addTabbableMenu('ACCOUNT', 'ACCOUNT', ICONS.USER, [], true);
        this.account.element.swipeSensitivity = 150;
        if (this.getRole() === 'Guest') {
            this.account.tab.el.style.flexBasis = '20rem'; // this should be a style rule

            this.btnLogin = this.account.element.addNavItemIcon(MODELS.navitem('Log In', ICONS.LOGIN, 'log-in'));
            this.btnLogin.el.addEventListener('activate', () => this.login(this.btnLogin));
            this.btnRegister = this.account.element.addNavItemIcon(MODELS.navitem('Sign Up', ICONS.USER, 'register'));
            this.btnRegister.el.addEventListener('activate', () => this.register(this.btnRegister));
        } else {
            this.btnLogout = this.account.element.addNavItemIcon(MODELS.navitem('Log Out', ICONS.LOGOUT, 'log-out'));
            this.btnLogout.el.addEventListener('activate', () => this.logout());
            // Application Communications, Alerts etc
            this.chat = this.navbar.addTabbableMenu('CHAT', 'CHAT', ICONS.CHAT, [
                MODELS.navitem('Chat One', ICONS.CHAT, 'chat-one'),
                MODELS.navitem('Chat Two', ICONS.CHAT, 'chat-two')
            ], true);
            this.chat.element.swipeSensitivity = 150;
            // User Settings / Options
            this.options = this.navbar.addTabbableMenu('OPTIONS', 'OPTIONS', ICONS.OPTIONS, [
                MODELS.navitem('Styles', ICONS.DOM, 'Styles'),
                MODELS.navitem('Alerts', ICONS.ALERT, 'Alerts'),
                MODELS.navitem('Security', ICONS.LOCK, 'Security')
            ], true);
            this.options.element.swipeSensitivity = 150;
        }
        // Launch Account Tab by default
        this.account.tab.el.dispatchEvent(new Activate(this.account.tab));
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
        @param {EL} caller Caller
	    @returns {Promise<ThisType>} Promise Chain
	*/
	login(caller = this) {
		console.log('USERMENU.login()');
        return this.flip().then(() => this.getMain().login(caller));
    }
    /** Calls MAIN.register()
        @param {EL} caller Caller 
	    @returns {Promise<ThisType>} Promise Chain
	*/
    register(caller = this) {
        console.log('USERMENU.register()');
        return this.flip().then(() => this.getMain().register(caller));
    }
}
export { ATTRIBUTES, EL, MENU, MODEL, NAVBAR }