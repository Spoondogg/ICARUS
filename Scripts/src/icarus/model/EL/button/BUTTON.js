/** @module */
import GLYPHICON, { ATTR, ATTRIBUTES, DATA, EL, ICONS, MODEL, MODELS, SPAN } from '../span/GLYPHICON.js';
import { LongclickDelay } from '../../../enums/StyleVars.js';
//import { MODELS } from '../../../enums/MODELS.js';
/** A generic BUTTON Element with an Icon and Label
    @class
*/
export default class BUTTON extends EL {
	/** Construct a generic Button
	    @param {EL} node Node
        @param {ButtonModel} model Model
	*/
    constructor(node, model = MODELS.button()) {
		super(node, 'BUTTON', model);
        this.addClass('btn glyphicon');
        this.icon = new GLYPHICON(this, model);
        this.label = new SPAN(this, MODELS.text(new ATTRIBUTES(), DATA.text(model.data.label)));
        this.label.addClass('button-label');
	}
	/** Sets the label within the button to the given string
        @param {string} [label] A button label
        @param {string} [icon] Glyphicon string or ICON.ENUM
        @returns {void}
    */
	setLabel(label = '', icon = null) {
		this.label.setInnerHTML(label);
		if (icon !== null) {
			this.icon.setIcon(icon);
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
export { ATTR, ATTRIBUTES, DATA, EL, ICONS, MODEL, MODELS, SPAN }