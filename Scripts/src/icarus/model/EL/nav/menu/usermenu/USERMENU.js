/** @module */
import MENU, { ATTRIBUTES, EL, MODEL } from '../MENU.js'
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
		//this.details = new DIV(this.profile, new MODEL('details').set('innerHTML', 'Lorem Ipsum'));
		this.options = this.addMenu(new MODEL('horizontal').set({
			name: 'USEROPTIONS',
			swipeSensitivity: 150
        }));
        if (this.getRole() === 'Guest') {
            this.btnLogin = this.options.addNavItemIcon(new MODEL().set({
                label: 'Log In',
                icon: ICONS.USER,
                name: 'log-in'
            }));
            this.btnLogin.el.onclick = () => this.login();
        } else {
            this.btnLogout = this.options.addNavItemIcon(new MODEL().set({
                label: 'Log Out',
                icon: ICONS.USER,
                name: 'log-out'
            }));
            this.btnLogout.el.onclick = () => this.logout();            
        }
        
        /* There is no reason to have this available to anyone.  Use OAuth instead */
        this.btnRegister = this.options.addNavItemIcon(new MODEL().set({
            label: 'Register',
            icon: ICONS.USER,
            name: 'register'
        }));
        this.btnRegister.el.onclick = () => this.register();
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