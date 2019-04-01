/** @module */
import LIST, { ATTRIBUTES, EL, MODEL } from '../LIST.js';
import DD from './dd/DD.js';
import DT from './dt/DT.js';
/** A Description List (DL) acts like a Dictionary with terms and descriptions
    @class
    @extends LIST
*/
export default class DL extends LIST {
	/** Constructs a Description List (DL)
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'DL', model);
		this.addConstructor('DT', () => this.addDT(model));
		this.addConstructor('DD', () => this.addDD(model));
	}
	/** Construct a Description Term (DT) and append to this element's children
	    @param {MODEL} model Model
	    @returns {DT} A Term (DT)
	*/
	addDT(model) {
		return this.addChild(new DT(this, model));
	}
	/** Construct a Description Term Definition (UL) and append to this element's children
	    @param {MODEL} model Model
	    @returns {DD} An Definition (DD)
	*/
	addDD(model) {
		return this.addChild(new DD(this, model));
	}
}
export { ATTRIBUTES, DD, DL, EL, LIST, MODEL }