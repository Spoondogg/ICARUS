/**
    @module
*/
import CONTAINER, { MODEL } from '../../CONTAINER.js';
import P from '../../../p/P.js';
/**
    List Item Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)
    @class
    @extends CONTAINER    
*/
export default class LISTITEM extends CONTAINER {
	/**
	    Constructs A List Item
	    @param {EL} node Parent Node
	    @param {MODEL} model Object MODEL
	 */
	constructor(node, model) {
		super(node, 'LI', model, ['LIST']);
		this.populate(model.children);
	}
    construct() {
        return new Promise((resolve, reject) => {
            try {
                if (this.dataId > 0 || this.dataId === -1) {
                    if (this.data.p) {
                        this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
                    }
                }
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
	}
}