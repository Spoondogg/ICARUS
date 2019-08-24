/** @module */
import GLYPHICON, { ATTRIBUTES, DATA, MODELS } from '../../../span/GLYPHICON.js';
import JUMBOTRON, { MODEL } from '../JUMBOTRON.js'; // ATTRIBUTES
import HEADER from '../../../header/HEADER.js';
import { ICONS } from '../../../../../enums/ICONS.js';
import P from '../../../p/P.js';
/** A fixed header
    @class
*/
export default class HEADERWRAP extends JUMBOTRON {
	/** Constructs a Header with clearfix
        @param {CONTAINER} node Node
        @param {ContainerModel} [model] Model
    */
	constructor(node, model) {
		super(node, model);
		this.addClass('headerwrap');
		this.header = new HEADER(this.body.pane, new MODEL('clearfix'));
		this.header.h1 = new HEADER(this.header, MODELS.text('Hello World'), 1);
        this.header.h1.icon = new GLYPHICON(this.header.h1, MODELS.icon(new ATTRIBUTES(), DATA.icon(ICONS.PLUS)));
		this.header.p = new P(this.header, MODELS.text('Woot to the Woot'));
	}
}