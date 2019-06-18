/** @module */
import CONTAINER, { HEADER, MODEL } from '../../CONTAINER.js';
/** Contains a high level view of the specified CONTAINER Class if it is available to the user
    @class
*/
export default class CLASSVIEWER extends CONTAINER {
	/** Constructs a CLASSVIEWER Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
        @param {string} classType Default class to display
	*/
    constructor(node, model, classType = 'MAIN') {
        super(node, 'DIV', model, [classType]);
        this.addClass('classviewer');
        this.classType = classType;
        this.header = new HEADER(this.body, new MODEL().set('innerHTML', classType + ' viewer'));
    }
    construct() {
        return Promise.resolve(this);
    }
}