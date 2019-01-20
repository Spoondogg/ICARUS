/** @module */
import CONTAINER from '../CONTAINER.js';
import HEADER from '../../header/HEADER.js';
import MODEL from '../../../MODEL.js';
/** A word used in a Vocabulary
    @class
    @extends CONTAINER
*/
export default class WORD extends CONTAINER {
	/** Constructs a WORD Container Element
	    @param {DICTIONARY} node The ARTICLE to contain the section
	    @param {MODEL} model The SECTION object retrieves from the server
	*/
	constructor(node, model) {
		super(node, 'DIV', model);
	}
	construct() {
		return this.callback(() => {
			console.log(this);
			this.header = new HEADER(this.body.pane, new MODEL().set('label', this.dataId > 0 ? this.data.value : 'Unknown'), 1);
		});
	}
}