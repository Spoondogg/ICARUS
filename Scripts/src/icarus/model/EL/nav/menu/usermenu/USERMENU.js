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
    }
    /** Toggles the visibility of the User Menu
        @returns {ThisType} callback
    */
    toggle() {
        return new Promise((resolve, reject) => {
            try {
                $(this.wrapper.el).toggle();
                resolve(this);
            } catch (e) {
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