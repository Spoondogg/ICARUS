/** @module */
import CONTAINER from '../../container/CONTAINER.js';
/** A collection of words
    @class
*/
export default class DICTIONARY extends CONTAINER {
	/** Construct a DICTIONARY Container
	    @param {MAIN} node Node
	    @param {ContainerModel} [model] Model
	*/
	constructor(node, model) {
		super(node, 'DIV', model, ['WORD']);
    }
    constructElements() {
        return Promise.resolve(this);
    }
}