/** @module */
import DIV, { EL, MODEL } from '../div/DIV.js';
import CONTAINER from '../container/CONTAINER.js';
//import Collapse from '../../../event/Collapse.js';
import Collapsible from '../../../interface/Collapsible/Collapsible.js';
//import Expand from '../../../event/Expand.js';
import PANE from './PANE.js';
/** A collapsible DIV with an embedded PANE
    @class
    @extends EL
*/
export default class COLLAPSIBLE extends DIV {
	/** Construct a collapsible DIV
        @param {CONTAINER} node Parent
        @param {MODEL} model Object
	*/
	constructor(node, model) {
		super(node, model);
        this.setClass('container-body'); // collapse in
        this.implement(new Collapsible(this));
        this.expand();
        this.pane = new PANE(this, new MODEL());
	}
}
export { CONTAINER, EL, MODEL };