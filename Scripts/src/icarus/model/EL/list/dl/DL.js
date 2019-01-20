/** @module */
import LIST, {
	ATTRIBUTES,
	EL,
	MODEL
} from '../LIST.js';
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
		this.addCallback('DT', () => this.addDT(model));
		this.addCallback('DD', () => this.addDD(model));
	}
	/** Construct a Description Term (DT) and append to this element's children
	    @param {MODEL} model Model
	    @returns {DT} A Term (DT)
	*/
	addDT(model) {
		this.children.push(new DT(this, model));
		return this.children[this.children.length - 1];
	}
	/** Construct a Description Term Definition (UL) and append to this element's children
	    @param {MODEL} model Model
	    @returns {DD} An Definition (DD)
	*/
	addDD(model) {
		this.children.push(new DD(this, model));
		return this.children[this.children.length - 1];
	}
}
export {
	ATTRIBUTES,
	DD,
	DL,
	EL,
	LIST,
	MODEL
};