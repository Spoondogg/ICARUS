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
        @param {Array<string>} [containerList] An array of strings representing child Containers that this Container can create
	*/
	constructor(node, model, containerList = ['CALLOUT', 'THUMBNAIL']) {
		super(node, 'DIV', model, containerList);
		this.body.pane.addClass('banner');
    }
    constructElements() {
        return Promise.resolve(this);
    }
}
export { MODEL }