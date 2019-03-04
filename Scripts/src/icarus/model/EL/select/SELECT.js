/** @module */
import EL, { MODEL } from '../EL.js';
/** A SELECT element */
export default class SELECT extends EL {
    /** A Select Element Constructor
        @param {EL} node Node
        @param {MODEL} model Model
    */
	constructor(node, model) {
		super(node, 'SELECT', model);
	}
}