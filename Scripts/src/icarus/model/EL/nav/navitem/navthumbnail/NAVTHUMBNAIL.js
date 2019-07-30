/** @module */
import GLYPHICON, { MODELS } from '../../../span/GLYPHICON.js';
import NAVITEM, { ATTRIBUTES, Collapse, EL, Expand, MODEL } from '../../../nav/navitem/NAVITEM.js';
import AbstractMethodError from '../../../../../error/AbstractMethodError.js';
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
        @param {NavItemModel} [model] Model
        @param {string} classType The class that this thumbnail represents
    */
	constructor(node, model, classType = 'MODEL') {
		super(node, model);
        this.addClass('nav-item-thumbnail');
        this.classType = classType;
        this.image = new GLYPHICON(this.anchor, MODELS.icon(ICONS[classType]));
        this.image.addClass('thumbnail-image');
        $(this.image.el).insertBefore(this.anchor.label.el);
        this.header = new HEADER(this.anchor);
        this.p = new P(this.anchor);
        this.constructThumbnail(model);
        this.menu = this.addMenu(new MODEL('horizontal thumbnail-menu'));
        this.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));
    }
    /** Constructs a thumbnail that represents the given model
        @param {MODEL} model Model
        @returns {void}
    */
    constructThumbnail(model) {
        throw new AbstractMethodError(this.toString() + '.constructThumbnail() not set', this, model);
    }
}
export { ATTRIBUTES, Collapse, EL, Expand, GLYPHICON, ICONS, MODEL, P, STRING }