/** @module */
import CONTAINER from '../../../CONTAINER.js';
/** An abstract Viewer for the specified Class
    A Container that is capable of loading the specified classType into itself
    @class
*/
export default class CLASSVIEWER extends CONTAINER {
	/** Constructs a CLASSVIEWER Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
        @param {string} classType Default class to display
        @param {string} [query] Optional Query String
	*/
    constructor(node, model, classType = 'MAIN', query = null) {
        super(node, 'DIV', model, [classType]);
        this.addClass('classviewer');
        this.classType = classType;
        this.query = query;
    }
    construct() {
        return Promise.resolve(this);
    }
}