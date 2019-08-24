/** @module */
import CONTAINER, { ATTRIBUTES, Activate, EL, Expand, MODEL, Toggle } from '../CONTAINER.js';
import DIV from '../../div/DIV.js';
/** A full width Container with a fixed height
    @see https://getbootstrap.com/docs/3.3/components/#jumbotron }
    @class
    @extends CONTAINER
*/
export default class JUMBOTRON extends CONTAINER {
	/** Constructs large banner with a single title and text block
        @param {CONTAINER} node Node
        @param {ContainerModel} [model] Model        
    */
	constructor(node, model) {
		super(node, 'DIV', model);
        this.addClass('jumbotron');
        this.screen = new DIV(this.body.pane, new MODEL('screen'));
	}
	construct() {
		return this.chain(() => {
			if (this.dataId > 0) {
				this.setScreenColor();
                this.createEditableElement('slogan', this.screen).then((slogan) => {
                    slogan.el.addEventListener('longclick', () => {
                        if (this.getUser() === this.authorId || this.shared === 1) {
                            this.navheader.el.dispatchEvent(new Toggle(this.navheader));
                        }
                    });
                });
				this.createEditableElement('p', this.screen);
				this.loadBgImage();
				this.setBgColor();
				let [tab] = this.navheader.tabs.get(null, 'NAVITEMICON');
				tab.el.dispatchEvent(new Activate(tab));
			} else {
				console.log('No data exists for JUMBOTRON');
				this.navheader.el.dispatchEvent(new Expand(this));
			}
		}, 'Unable to construct JUMBOTRON');
	}
	/** Attempt to retrieve a background image if one is specified in this.data.bgimage
        @returns {Promise<boolean>} Returns true on success
    */
	loadBgImage() {
		if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
            try {
                this.getPayload(parseInt(this.data.bgimage)).then((payload) => {
					try {
						let parsed = JSON.parse(payload.model.jsonResults);
						parsed.filter((p) => p.name === 'base64').map((v) => this.setBgImage(v.value));
						/*for (let p = 0; p < parsed.length; p++) { // Extract the base64 values and create an image
							if (parsed[p].name === 'base64') {
                                this.setBgImage(parsed[p].value);
								break;
							}
						}*/
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
	/** Sets the background image of the jumbotron pane
	    @param {string} url Background image url
	    @returns {void}
	*/
	setBgImage(url) {
		//this.body.pane.el.setAttribute('style', 'background: url(' + url + ');');
		this.body.pane.el.style.backgroundImage = 'url("' + url + '")';
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
export { ATTRIBUTES, EL, MODEL }