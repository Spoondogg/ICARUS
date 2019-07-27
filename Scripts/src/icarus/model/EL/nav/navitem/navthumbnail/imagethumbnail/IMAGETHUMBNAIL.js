/** @module */
import NAVTHUMBNAIL, { ATTRIBUTES, EL, MODEL } from '../NAVTHUMBNAIL.js';
import IMG from '../../../../img/IMG.js';
//import UL from '../../../../list/ul/UL.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
*/
export default class IMAGETHUMBNAIL extends NAVTHUMBNAIL {
	/** Constructs a THUMBNAIL displaying details of a given CONTAINER
        @param {CONTAINER} node The model
        @param {MODEL} model The Thumbnail model
        @param {UId} model.id Unique Identifier that this thumbnail represents
        param {UId} model.formId Unique Identifier that this thumbnail represents
        @param {string} model.authorId Author Id
        @param {int} model.shared Shared status
        @param {int} model.isPublic Public status
        @param {int} model.status Status
        @param {string} model.dateCreated Date Created
        @param {string} model.dateLastModified Date LastModified
        param {object} model.xmlResults Shared status
        @param {object} model.jsonResults JSON Results
    */
	constructor(node, model) {
		super(node, model);
        this.addClass('nav-item-thumbnail-image');
    }
    /** Constructs a thumbnail that represents the given image formpost model
        @param {MODEL} model Model
        @returns {void}
    */
    constructThumbnail(model) {
        this.header.setInnerHTML('Image UId: ' + model.id);
        try {
            if (model.jsonResults) {
                let parsed = JSON.parse(model.jsonResults);
                let img = {}; // Extract the base64 values and create an image
                parsed.forEach(({
                    name,
                    value
                }) => {
                    img[name] = value;
                    //list.addLI().setInnerHTML(name + ' = ' + value);
                    if (name === 'base64') {
                        //console.log('Setting base64', value);
                        let image = new IMG(this.anchor, new MODEL('thumbnail-image'));
                        image.setAttribute('src', value);
                        $(image.el).insertBefore(this.anchor.label.el);
                    }
                });
                this.showImageDetails(img);
            }
        } catch (e) {
            console.error('Unable to parse image', e);
        }
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
            this.header.setInnerHTML(img.filename);
            this.p.setInnerHTML('Id: ' + img.id + '<br>Filesize: ' + img.fileSize + 'kb (' + img.dimX + ' x ' + img.dimY + ')<br>' + img.fileType);
        } catch (ee) {
            console.log('Unable to set Thumbnail attributes', img);
        }
    }
}
export { ATTRIBUTES, EL, MODEL, NAVTHUMBNAIL }