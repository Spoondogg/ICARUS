/** @module */
import BUTTONGROUP, { BUTTON } from '../../../../group/buttongroup/BUTTONGROUP.js';
//import NAVITEM, { ATTRIBUTES, Collapse, EL, Expand, MODEL } from '../../../nav/navitem/NAVITEM.js';
import NAVTHUMBNAIL, { ATTRIBUTES, EL, ICONS, MODEL, STRING } from '../NAVTHUMBNAIL.js';
import DIV from '../../../../div/DIV.js';
//import GLYPHICON from '../../../span/GLYPHICON.js';
//import HEADER from '../../../../header/header.js';
//import { ICONS } from '../../../../../enums/ICONS.js';
//import P from '../../../p/P.js';
//import STRING from '../../../../../STRING.js';
/** A full-width NavItem with a Thumbnail image, label and description
    @class
*/
export default class CONTAINERTHUMBNAIL extends NAVTHUMBNAIL {
	/** Constructs a THUMBNAIL displaying details of a given CONTAINER
        @param {CONTAINER} node The model
        @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.subsections Delimited string of uids
        @param {string} model.authorId Author Id
        @param {string} model.label The Thumbnail label
        @param {string} model.description Description
        @param {string} model.tags Comma delimited list of tag uids
        @param {object} model.jsonResults JSON Results
        @param {string} classType The class that this thumbnail represents
    */
	constructor(node, model, classType) {
		super(node, model, classType);
        this.addClass('nav-item-thumbnail-container');
    }
    constructThumbnail(model, classType) {
        this.header.setInnerHTML(model.label + ' (' + classType + ' # ' + model.id + ')');
        let descString = model.description + ' (' + model.tags + ')'
        this.p.setInnerHTML(new STRING(descString || 'N/A').truncate(128));
        this.addThumbDetails(model);
        this.addTags(model);
        //this.fetchImage(); // Only if IMG exists
    }
    /** Adds a button group and a default tag
        @param {MODEL} model Model
        @returns {void}
    */
    addTags(model) {
        this.tagGroup = new BUTTONGROUP(this.anchor, new MODEL('tag-group'));
        if (typeof model.tags === 'undefined') {
            this.tagGroup.addButton('#0', ICONS.TAG);
        } else {
            model.tags.split(',').forEach((t) => this.tagGroup.addButton('#' + t, ICONS.TAG));
        }
    }
    /** Adds details like author and rating/rank
        @param {MODEL} model Model
        @returns {void}
    */
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
}
export { ATTRIBUTES, BUTTON, EL, MODEL }