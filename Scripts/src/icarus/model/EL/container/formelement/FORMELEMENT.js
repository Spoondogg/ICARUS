/** @module */
import CONTAINER, { ATTRIBUTES, Collapse, EL, Expand, INPUTTYPES, MODEL } from '../CONTAINER.js';
import Hideable from '../../../../interface/Hideable.js';
import LABEL from '../../label/LABEL.js';
/** An abstract Form Element
    @abstract
    @class
    @extends CONTAINER
*/
export default class FORMELEMENT extends CONTAINER {
	/** Constructs a Form Element
        @param {EL} node Parent Node
        @param {MODEL} model Model
    */
	constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('form-element');
        this.implement(new Hideable(this));
        /** The Form Element Label
            @type {LABEL}
        */
        this.inputLabel = new LABEL(this.body.pane, new MODEL().set('innerHTML', model.label));
        /** The primary INPUT Element and data holder for this Form Element
            @type {INPUT}
        */
        this.input = null;

        //this.body.el.addEventListener('activate', () => {
            //this.getContainer().dispatchToChildren(new Deactivate(this));
            /*console.log('Deactivating ' + this.toString() + '.siblings');
            let [fs] = this.getContainer().getFieldset();
            let [felg] = fs.getFormElementGroup();
            let els = felg.get();
            els.forEach((el) => {
                console.log('EL', el);
                el.body.el.dispatchEvent(new Deactivate(this));
            });*/

            /*
            //let siblings = this.getContainer().get().filter((c) => c.id !== this.id);
            let siblings = this.getContainer().body.pane.get().filter((c) => c.id !== this.id);
            console.log(' - Siblings', siblings);
            siblings.forEach((s) => {
                console.log('  -> Sibling', s.id, s);
                try {
                    //s.body.el.dispatchEvent(new Deactivate(s.body));
                    s.body.removeClass('active');
                } catch (e) {
                    console.log(' XXX+> Unable to remove active class');
                }
            });
            */

            /*for (let child of this.getContainer().el.children) {
                //forEach(dispatchToSiblings(new Deactivate(this));
                //child.dispatchEvent(new Deactivate(this));
                console.log(' - Child', child);
            }*/

            //this.dispatchToSiblings(new Deactivate(this));
            /*let siblings = this.getContainer().get().filter((c) => c.id !== this.id);
            console.log(' - Siblings', siblings);
            siblings.forEach((s) => {
                console.log('  -> Sibling', s.id, s);
                //s.body.el.dispatchEvent(new Deactivate(this));
            });*/
        //});
    }
	/** If no children supplied...
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
    }
}
export { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, INPUTTYPES, LABEL, MODEL }