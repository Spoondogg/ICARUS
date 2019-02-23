/** @module */
import NAVITEM, {
	ATTRIBUTES,
	EL,
	MODEL
} from '../../../nav/navitem/NAVITEM.js';
import HEADER from '../../../header/header.js';
import IMG from '../../../img/IMG.js';
import P from '../../../p/P.js';
import STRING from '../../../../../STRING.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
    @extends CONTAINER
*/
export default class NAVTHUMBNAIL extends NAVITEM { //CONTAINER {
	/** Constructs a Bootstrap Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, model);
		//this.addClass('thumbnail col-xs-12 col-sm-6 col-lg-offset-0');
		this.addClass('thumbnail');
		this.image = new IMG(this.anchor, new MODEL());
		$(this.image.el).insertBefore(this.anchor.label.el);
        this.header = new HEADER(this.anchor, new MODEL().set('innerHTML', model.label));
		this.p = new P(this.anchor, new MODEL().set('innerHTML', new STRING(model.description || 'N/A').truncate(128)));
		this.fetchImage();
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
						$.getJSON('/FORMPOST/Get/' + parseInt(this.data.img), (data) => { // If access granted...
							if (data.model) {
								if (data.model.jsonResults) {
									parsed = JSON.parse(data.model.jsonResults);
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
export {
	ATTRIBUTES,
	EL,
	MODEL
};