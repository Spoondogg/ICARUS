/** A fixed height, full width Container
    @module
*/
import CONTAINER from '../CONTAINER.js';
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
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return this.populate(children);
	}
	/** Returns the parent container for this container or null if it does not exist
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		return this.getProtoTypeByClass('CONTAINER');
	}
	/**
	    Returns the MAIN container
	    @method
	    @returns {MAIN} The MAIN Container
	    @throws Will throw an error 
	*/
	getMain() {
		return this.getProtoTypeByClass('CONTAINER').getMain();
	}
}