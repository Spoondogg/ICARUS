/** @module */
import NAVITEM, { ATTRIBUTES, Collapse, EL, Expand, MODEL } from '../../../nav/navitem/NAVITEM.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
import HEADER from '../../../header/header.js';
import { ICONS } from '../../../../../enums/ICONS.js';
import P from '../../../p/P.js';
import STRING from '../../../../../STRING.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
*/
export default class NAVTHUMBNAIL extends NAVITEM {
	/** Constructs a THUMBNAIL displaying details of a given CONTAINER
        @param {CONTAINER} node The model
        @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.label The Thumbnail label
        @param {string} classType The class that this thumbnail represents
    */
	constructor(node, model, classType = 'MODEL') {
		super(node, model);
        this.addClass('nav-item-thumbnail');
        //this.image = new IMG(this.anchor, new MODEL('thumbnail-image'));
        this.image = new GLYPHICON(this.anchor, ICONS[classType]).addClass('thumbnail-image');
		$(this.image.el).insertBefore(this.anchor.label.el);
        this.header = new HEADER(this.anchor, new MODEL().set('innerHTML', classType + ' # ' + model.id));
        this.p = new P(this.anchor, new MODEL().set('innerHTML', new STRING(model.label || 'N/A').truncate(128)));
        this.menu = this.addMenu(new MODEL('horizontal thumbnail-menu'));
        this.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));

		//this.fetchImage(); // Only if IMG exists
    }
	/** Retrieve a FormPost for the given MAIN and sets this image source
	    @returns {void}
	*/
	fetchImage() {
		if (this.dataId > 0 || this.dataId === -1) {
			let parsed = null;
			if (this.data.img) {
				if (Number.isInteger(parseInt(this.data.img))) { // If this.data.img is integer, retrieve relevant formpost
					try { // Test to see if the formpost can be retrieved
                        this.getPayload(parseInt(this.data.img)).then((payload) => { // If access granted...
							if (payload.model) {
								if (payload.model.jsonResults) {
									parsed = JSON.parse(payload.model.jsonResults);
									let img = {}; // Extract the base64 values and create an image
									parsed.forEach(({
										name,
										value
									}) => {
										img[name] = value;
										if (name === 'base64') {
											this.image.el.src = img[name];
										}
									});
									if (this.data.showImageDetails) {
										this.showImageDetails(img);
									}
								}
							}
						});
					} catch (e) {
						console.log('Unable to retrieve FormPost.', e);
					}
				} else {
					this.image.el.setAttribute('src', this.data.img);
				}
			}
		}
	}
	/** Appends image metadata to thumbnail
	    @param {object} img An image model
	    @returns {void}
	*/
	showImageDetails(img) {
		try {
			this.header.el.innerHTML = img.filename;
			this.p.el.innerHTML = 'Id: ' + img.id + '<br>Filesize: ' + img.fileSize + 'kb (' + img.dimX + ' x ' + img.dimY + ')<br>' + img.fileType;
		} catch (ee) {
			console.log('Unable to set Thumbnail attributes', img);
		}
	}
}
export { ATTRIBUTES, EL, MODEL }