/** @module */
import BUTTONGROUP, { BUTTON } from '../../../group/buttongroup/BUTTONGROUP.js';
import NAVITEM, { ATTRIBUTES, Collapse, EL, Expand, MODEL } from '../../../nav/navitem/NAVITEM.js';
import DIV from '../../../div/DIV.js';
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
        @param {string} model.subsections Delimited string of uids
        @param {string} model.authorId Author Id
        @param {string} model.label The Thumbnail label
        @param {string} model.description Description
        @param {string} model.tags Comma delimited list of tag uids
        @param {string} classType The class that this thumbnail represents
    */
	constructor(node, model, classType = 'MODEL') {
		super(node, model);
        this.addClass('nav-item-thumbnail');
        //this.image = new IMG(this.anchor, new MODEL('thumbnail-image'));
        this.image = new GLYPHICON(this.anchor, ICONS[classType]).addClass('thumbnail-image');
		$(this.image.el).insertBefore(this.anchor.label.el);
        this.header = new HEADER(this.anchor, new MODEL().set('innerHTML', model.label + ' (' + classType + ' # ' + model.id + ')'));
        let descString = model.description + ' (' + model.tags + ')'
        this.p = new P(this.anchor, new MODEL().set('innerHTML', new STRING(descString || 'N/A').truncate(128)));
        this.addThumbDetails(model);
        this.addTags(model);
        this.menu = this.addMenu(new MODEL('horizontal thumbnail-menu'));
        this.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));

		//this.fetchImage(); // Only if IMG exists
    }
    addTags(model) {
        this.tagGroup = new BUTTONGROUP(this.anchor, new MODEL('tag-group'));
        if (typeof model.tags === 'undefined') {
            this.tagGroup.addButton('#0', ICONS.TAG);
        } else {
            model.tags.split(',').forEach((t) => this.tagGroup.addButton('#' + t, ICONS.TAG));
        }
    }
    addThumbDetails(model) {
        this.detail = new DIV(this.anchor, new MODEL('detail'));
        this.detail.authorId = new DIV(this.detail, new MODEL('left').set('innerHTML', model.authorId));
        this.detail.rating = new BUTTONGROUP(this.detail, new MODEL('right star-group'));
        this.detail.rating.addButton('', ICONS.STAREMPTY);
        this.detail.rating.addButton('', ICONS.STAREMPTY);
        this.detail.rating.addButton('', ICONS.STAR);
        this.detail.rating.addButton('', ICONS.STAR);
        this.detail.rating.addButton('', ICONS.STAR);
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
export { ATTRIBUTES, BUTTON, EL, MODEL }