/** @module */
import { ALIGN } from '../../../enums/ALIGN.js';
import BUTTONGROUP from '../group/buttongroup/BUTTONGROUP.js';
import FOOTER from '../footer/FOOTER.js';
//import { SIZE } from '../../../enums/SIZE.js';
/**
    A generic footer that should be placed at the bottom of content
    @class
    @extends FOOTER
*/
export default class FORMFOOTER extends FOOTER {
	/**
	    Constructs a Form Footer
	    @param {EL} node The object to contain the table
	    @param {MODEL} model Object model
	*/
	constructor(node, model) {
		super(node, model);
		this.el.className = 'btn-group-justified form-footer';
        this.buttonGroup = new BUTTONGROUP(this, null, ALIGN.VERTICAL); // Left aligned button group SIZE.MED
	}
}