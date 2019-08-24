/** @module */
import FORMINPUT, {	MODEL } from '../FORMINPUT.js'; // EL
import FORMTEXTAREA from '../../formtextarea/FORMTEXTAREA.js';
/** A file INPUT element for a FORM Container
    @class
*/
export default class FORMINPUTFILE extends FORMINPUT {
	/** Constructs an INPUT element
	    @param {EL} node Node
	    @param {ContainerModel} [model] Model
	*/
	constructor(node, model) {
		super(node, new MODEL({
			type: 'FILE',
			name: model.attributes.name
		}));
		/** @property {TEXTAREA} base64 A textarea to hold a base64 encoded string */
		this.base64 = new FORMTEXTAREA(this.body.pane, new MODEL().set('name', 'base64'));
		this.dataElements.push(new MODEL({
			name: 'accept',
			type: 'text'
		}).set({
			element: 'INPUT',
			label: 'accept'
		}));
	}
}
export { FORMINPUT, MODEL }