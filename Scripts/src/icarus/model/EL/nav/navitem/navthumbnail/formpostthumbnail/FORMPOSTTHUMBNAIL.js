/** @module */
import BUTTON, { MODELS } from '../../../../button/BUTTON.js';
import NAVTHUMBNAIL, { ATTRIBUTES, Collapse, EL, Expand, ICONS, MODEL } from '../NAVTHUMBNAIL.js'; //STRING
import { Clickable } from '../../../../container/CONTAINER.js';
import UL from '../../../../list/ul/UL.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
*/
export default class FORMPOSTTHUMBNAIL extends NAVTHUMBNAIL {
	/** Constructs a THUMBNAIL displaying details of a given CONTAINER
        @param {CONTAINER} node Node
        @param {ContainerModel} model Model
    */
	constructor(node, model) {
		super(node, model);
        this.addClass('nav-item-thumbnail-formpost');
    }
    /** Constructs a thumbnail that represents the given model
        @param {FormPostModel} model Model
        @returns {void}
    */
    constructThumbnail(model) {
        console.log('FORMPOSTTHUMBNAIL.constructThumbnail', model);
        let { id, key, val } = model;
        let headerStr = 'id: ' + id;
        if (typeof model.key !== 'undefined') {
            headerStr += ' ' + key + ' : ' + val;
        }
        this.header.setInnerHTML(headerStr);
        //this.p.setInnerHTML(new STRING(model.jsonResults).truncate(128));
        try {
            if (model.jsonResults) {
                let button = new BUTTON(this.p, MODELS.button('Show / Hide', ICONS.DATA));
                button.addClass('pill-button');

                let list = new UL(this.p);
                let jsonResults = JSON.parse(model.jsonResults);
                jsonResults.forEach(({
                    name,
                    value
                }) => list.addLI().setInnerHTML(name + ': ' + value));

                ///  DO TAG THINGS ---  TODO: FIX ASAP
                if (model.formId === 10128) {
                    this.header.setInnerHTML(jsonResults[0].value);
                }

                button.implement(new Clickable(button));
                button.el.addEventListener('activate', () => list.el.dispatchEvent(new Expand(list)));
                button.el.addEventListener('deactivate', () => list.el.dispatchEvent(new Collapse(list)));
            }
        } catch (e) {
            console.error('Unable to parse JSON', e);
        }
    }
    /** Retrieve a FormPost for the given MAIN and sets this image source
	    @returns {void}
	
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
    }*/
	/** Appends image metadata to thumbnail
	    @param {object} img An image model
	    @returns {void}
	
    showImageDetails(img) {
        try {
            this.header.el.innerHTML = img.filename;
            this.p.el.innerHTML = 'Id: ' + img.id + '<br>Filesize: ' + img.fileSize + 'kb (' + img.dimX + ' x ' + img.dimY + ')<br>' + img.fileType;
        } catch (ee) {
            console.log('Unable to set Thumbnail attributes', img);
        }
    }*/
}
export { ATTRIBUTES, EL, MODEL, NAVTHUMBNAIL }