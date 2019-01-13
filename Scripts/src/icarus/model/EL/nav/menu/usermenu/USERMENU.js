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
        super(node, new MODEL('horizontal').set({
            name: 'USER',
            showHeader: 0,
            collapsed: 0
        }));        
        this.profile = new DIV(this, new MODEL('profile'));
        this.image = new IMG(this.profile, new MODEL({
            class: 'picture',
            src: localStorage.getItem('picture')
        }));
        this.username = new DIV(this.profile, new MODEL('username'), 'Ryan Dunphy');
        this.quote = new DIV(this.profile, new MODEL('quote'), 'Dad Joke Specialist');
        this.details = new DIV(this.profile, new MODEL('details'), 'Lorem Ipsum');

        this.btnLogout = this.addNavItem(new MODEL().set('label', 'Log Out'));
        this.btnLogout.el.onclick = () => this.logout();

        for (let i = 0; i < 5; i++) {
            this.addNavItem(new MODEL().set('label', 'Button[' + i + ']')).el.onclick = () => this.deactivate();
        }
    }
    /** Calls MAIN.logout()
        @returns {Promise<ThisType>} callback
    */
    logout() {
        console.log('USERMENU.logout()');
        return this.flip().then(() => this.getMain().logout());
    }
}
export { ATTRIBUTES, EL, MENU, MODEL };