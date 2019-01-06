/** @module */
import DIV, { EL, MODEL } from '../div/DIV.js';
import CONTAINER from '../container/CONTAINER.js';
import Collapsible from '../../../interface/Collapsible/Collapsible.js';
import PANE from './PANE.js';
import Selectable from '../../../interface/Selectable/Selectable.js';
/** A collapsible DIV with an embedded PANE
    @class
    @extends DIV
*/
export default class COLLAPSIBLE extends DIV {
	/** Construct a collapsible DIV with an embedded PANE
        @param {CONTAINER} node Parent
        @param {MODEL} model Object
	*/
	constructor(node, model) {
		super(node, model);
        this.implement(new Collapsible(this));
        this.implement(new Selectable(this));
        this.expand();
        this.pane = new PANE(this, new MODEL());
	}
}
export { CONTAINER, EL, MODEL };