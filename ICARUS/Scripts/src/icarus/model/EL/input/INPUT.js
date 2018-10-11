/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** An INPUT element */
export default class INPUT extends EL {
	constructor(node, model) {
		super(node, 'INPUT', model);
	}
}
export { ATTRIBUTES, EL, MODEL }