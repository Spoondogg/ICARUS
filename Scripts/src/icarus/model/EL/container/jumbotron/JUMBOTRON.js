/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../CONTAINER.js';
import DIV from '../../div/DIV.js';
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
        this.addClass('jumbotron');
	}
	/** Override abstract method
        @returns {void}
    */
    construct() {
        return new Promise((resolve, reject) => {
            try {
                if (this.dataId > 0) {
                    this.screen = new DIV(this.body.pane, new MODEL('screen'));
                    this.setScreenColor();
                    this.createEditableElement('header', this.screen);
                    this.createEditableElement('p', this.screen);
                    this.loadBgImage();
                    this.setBgColor();
                }
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
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
                        if (!(ee instanceof TypeError)) {
                            console.warn('Unable to load background image for JUMBOTRON', ee);
                        }
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