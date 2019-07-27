/** @module */
import GLYPHICON, { EL, ICONS, MODEL, SPAN } from '../span/GLYPHICON.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A generic BUTTON Element with an Icon and Label
    @class
    @extends EL
*/
export default class BUTTON extends EL {
	/** Construct a generic Button
	    @param {EL} node Node
        @param {ButtonModel} model Model
	*/
    constructor(node, model = MODELS.BUTTON()) {
		super(node, 'BUTTON', model);
        this.addClass('btn glyphicon');
        this.setAttribute('type', model.attributes.buttonType || 'BUTTON');
        this.icon = new GLYPHICON(this, model.attributes.glyphicon);
        this.label = new SPAN(this, new MODEL('button-label').set('innerHTML', model.attributes.label));
	}
	/** Sets the label within the button to the given string
        @param {string} [label] A button label
        @param {string} [glyphicon] Glyphicon string or ICON.ENUM
        @returns {void}
    */
	setLabel(label = '', glyphicon = null) {
		this.label.setInnerHTML(label);
		if (glyphicon !== null) {
			this.icon.setIcon(glyphicon);
		}
    }
    /** Creates a default button model
        @returns {function(): ButtonModel} ButtonModel Constructor
    */
    createModel() {
        return this.makeStruct([
            ['deactivateSiblings', false],
            ['delay', 200],
            ['longClickDelay', LongclickDelay],
            ['stopPropagation', true]
        ]);
    }
}
export { EL, ICONS, MODEL, SPAN }