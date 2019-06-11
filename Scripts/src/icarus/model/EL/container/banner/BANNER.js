/** A fixed height, full width Container
    @module
*/
import CONTAINER, { MODEL } from '../CONTAINER.js';
/** A horizontal container with a fixed height and independent scrolling
    designed to be populated with enclosed Containers like Cards, Buttons or NavItemIcons
    @class
    @extends CONTAINER
*/
export default class BANNER extends CONTAINER {
	/** Constructs a Banner that contains CallOuts.
	    @param {CONTAINER} node The model
	    @param {MODEL} model Object Model
	*/
	constructor(node, model) {
		super(node, 'DIV', model, ['CALLOUT', 'THUMBNAIL']);
		this.body.pane.addClass('banner');
	}
}