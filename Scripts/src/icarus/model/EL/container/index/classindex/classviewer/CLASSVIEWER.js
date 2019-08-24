/** @module */
import CONTAINER from '../../../CONTAINER.js';
/** An abstract Viewer for the specified Class
    A Container that is capable of loading the specified classType into itself
    @class
*/
export default class CLASSVIEWER extends CONTAINER {
	/** A Container that is designed to spawn containers of a specified type
	    @param {CONTAINER} node Node
	    @param {ContainerModel} [model] Model
        @param {string} classType Default class to display
        @param {string} [query] Optional Query String
	*/
    constructor(node, model, classType = 'MAIN', query = null) {
        super(node, 'DIV', model, [classType]);
        this.addClass('classviewer');
        this.classType = classType;
        this.query = query;
        this.container = this.required(model.container);
    }
    construct() {
        return Promise.resolve(this);
    }
}