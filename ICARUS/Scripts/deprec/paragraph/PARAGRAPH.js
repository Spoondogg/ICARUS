/** @module */
import CONTAINER, { MODEL } from '../CONTAINER.js';
import FORMPOSTINPUT from '../formelement/formpostinput/FORMPOSTINPUT.js';
import HEADER from '../../header/HEADER.js';
import P from '../../p/P.js';
/** A block of text
    @class
    @deprecated Replaced with TEXTBLOCK
    @extends CONTAINER
*/
export default class PARAGRAPH extends CONTAINER {
	/** Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, 'DIV', model, ['IMAGE']);
		this.addClass('textblock');
		this.body.pane.addClass('paragraph');
		this.populate(model.children);
	}
	/** Constructs a Paragraph Container
        @returns {void}
	*/
	construct() {
		if (this.dataId > 0) {
			if (this.data.p) {
                let d = this.getDateCreated();
				this.header = new HEADER(this.body.pane, new MODEL().set({
					'label': d.date + ' - ' + d.time
				}));
				this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
			}
		} else {
			let formPostInput = new FORMPOSTINPUT(this, new MODEL().set({
				'inputs': this.inputs
			}));
			formPostInput.newAttributes(this, 'dataId', this);
		}
	}
}