/**
    @module
*/
import FOOTER, { EL } from '../FOOTER.js';
/**
    A Footer that sticks to bottom of page    
    @class
    @extends FOOTER
*/
export default class STICKYFOOTER extends FOOTER {
	/**
	    Constructs a footer stuck to the bottom of the viewpane
	    @param {EL} node The object to contain the table
	    @param {MODEL} model stickyfooter model
	 */
	constructor(node, model) {
		super(node, model);
		this.el.setAttribute('class', 'stickyfooter');
	}
	/**
	    Expands the footer to include context menu
	    @returns {STICKYFOOTER} This Stickyfooter
	*/
	show() {
		this.addClass('active');
		return this;
	}
	/**
	    Shrinks the footer down to basics
	    @returns {STICKYFOOTER} This Stickyfooter
	*/
	hide() {
		this.removeClass('active');
		return this;
	}
}
export { EL, FOOTER };