/** @module */
import EL, { MODEL } from '../../../../EL.js';
/** A Column that exists inside a Row */
export default class COLUMN extends EL {
	/** Constructs a table column element (ie: TH or TD) 
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
        super(node, model.group === 'THEAD' ? 'TH' : 'TD', model);
        this.type = model.type;
        this.value = model.value;
    }
}
export { EL, MODEL }