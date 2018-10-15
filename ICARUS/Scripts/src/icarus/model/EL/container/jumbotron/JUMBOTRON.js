/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../CONTAINER.js';
import DIV from '../../div/DIV.js';
import HEADER from '../../header/HEADER.js';
import P from '../../p/P.js';
/** A full width Container with a fixed height
    @see https://getbootstrap.com/docs/3.3/components/#jumbotron }
    @class
    @extends CONTAINER
*/
export default class JUMBOTRON extends CONTAINER {
	/** Constructs a Bootstrap style Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model        
    */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.body.pane.addClass('jumbotron');
	}
	/** Override abstract method
        @returns {void}
    */
	construct() {
		if (this.dataId > 0) {
			this.screen = new DIV(this.body.pane, new MODEL('screen'));
            this.setScreenColor();
			this.header = new HEADER(this.screen, new MODEL().set({ 'label': this.data.header }));
            this.createTextblock();
			this.loadBgImage();
            this.setBgColor();
		}
    }
    /** Creates the primary textblock for this Jumbotron 
        @returns {void}
    */
    createTextblock() {
        try {
            if (this.data.p.length > 0) {
                this.p = new P(this.screen, new MODEL(), this.htmlDecode(this.data.p));
            }
        } catch (e) {
            console.log('Unable to create textblock', e);
        }
    }
	/** Attempt to retrieve a background image if one is specified in this.data.bgimage
        @returns {Promise<boolean>} Returns true on success
    */
	loadBgImage() {
		if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
			try {
				$.getJSON('/FORMPOST/Get/' + parseInt(this.data.bgimage), (data) => {
					try {
						let parsed = JSON.parse(data.model.jsonResults);
						for (let p = 0; p < parsed.length; p++) { // Extract the base64 values and create an image
							if (parsed[p].name === 'base64') {
                                this.body.pane.el.setAttribute('style', 'background: url(' + parsed[p].value + ');');
                                break;
							}
						}
					} catch (ee) {
						console.log('Unable to load background image for JUMBOTRON', ee);
					}
				});
			} catch (e) {
				console.log('Unable to retrieve FormPost.', e);
			}
		}
    }
    /** Sets the background color of the jumbotron pane 
        @returns {void}
    */
    setBgColor() {
        if (this.data.bgcolor && this.data.bgcolor !== '.') {
            this.body.pane.el.style.backgroundColor = this.data.bgcolor;
        }
    }
    /** Sets the screen background color 
        @returns {void}
    */
    setScreenColor() {
        if (this.data.screencolor && this.data.screencolor !== '.') {
            this.screen.el.setAttribute('style', 'background-color: ' + this.data.screencolor + ';');
        }
    }
}
export { ATTRIBUTES, EL, MODEL };