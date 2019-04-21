/** @module */
import FORMELEMENT, { ATTRIBUTES, EL, LABEL, MODEL } from '../FORMELEMENT.js';
import TEXTAREA from '../../../textarea/TEXTAREA.js';
/** Represents a <TEXTAREA> for an Icarus Form       
    @class
    @extends FORMELEMENT
*/
export default class FORMTEXTAREA extends FORMELEMENT {
    constructElements() {
        return this.chain(() => {
            this.input = new TEXTAREA(this.body.pane, new MODEL(new ATTRIBUTES({
                name: this.attributes.name
            })), this.attributes.value || '');
        });
    }
}
export { ATTRIBUTES, EL, LABEL, MODEL, TEXTAREA }