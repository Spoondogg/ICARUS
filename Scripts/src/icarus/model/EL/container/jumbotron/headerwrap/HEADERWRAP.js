/** @module */
import JUMBOTRON, { MODEL } from '../JUMBOTRON.js'; // ATTRIBUTES
import GLYPHICON from '../../../span/GLYPHICON.js';
import HEADER from '../../../header/HEADER.js';
import { ICONS } from '../../../../../enums/ICONS.js';
import P from '../../../p/P.js';
/** A fixed header
    @class
    @extends JUMBOTRON
*/
export default class HEADERWRAP extends JUMBOTRON {
	/** Constructs a Header with clearfix
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, model);
		this.addClass('headerwrap');
		this.header = new HEADER(this.body.pane, new MODEL('clearfix'));
		this.header.h1 = new HEADER(this.header, new MODEL().set({ 'label': 'Hello World' }), 1);
		this.header.h1.icon = new GLYPHICON(this.header.h1, ICONS.PLUS);
		this.header.p = new P(this.header, new MODEL(), 'Woot to the Woot');
		this.populate(model.children);
	}
}