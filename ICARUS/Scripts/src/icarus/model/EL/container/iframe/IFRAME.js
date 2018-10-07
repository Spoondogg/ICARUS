/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../CONTAINER.js';
/**
    An Inline Frame
    @description Creates a Container with an iFrame inside it.  I really don't like iFrames.
    @deprecated Don't use iframes.  Stop that right now.
    @class
    @extends CONTAINER
*/
export default class IFRAME extends CONTAINER {
	/**
	    Constructs an iframe
	    @param {CONTAINER} node The model
	    @param {MODEL} model Object Model
	 */
	constructor(node, model) {
		super(node, 'DIV', model);
		//this.populate(model.children);
	}
	/**
        @todo Remove inline styles
        @returns {void}
    */
	construct() {
		this.frame = new EL(this.body.pane, 'IFRAME', new MODEL(new ATTRIBUTES({
			'width': '100%',
			'border': 0,
			'frameborder': 0,
			'style': 'height:calc(100vh - 142px);'
		})));
	}
}