/**
    @module
*/
import EL from '../EL.js';
/**
    An DATALIST element
*/
export default class DATALIST extends EL {
	constructor(node, model) {
		super(node, 'DATALIST', model);
		this.el.setAttributes('id', model.id);
	}
}