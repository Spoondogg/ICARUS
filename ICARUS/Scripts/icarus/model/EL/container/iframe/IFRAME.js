/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
import EL, { MODEL, ATTRIBUTES } from '../../EL.js';
/**
    Inline Frame
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