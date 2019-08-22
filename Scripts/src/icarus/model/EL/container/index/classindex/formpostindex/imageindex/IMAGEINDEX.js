/** @module */
import FORMPOSTINDEX, { ATTR, CONFIRM, DATA, ICONS, MODELS } from '../FORMPOSTINDEX.js';
import IMAGETHUMBNAIL, { NAVTHUMBNAIL } from '../../../../../nav/navitem/navthumbnail/imagethumbnail/IMAGETHUMBNAIL.js';
/** Contains a list of IMAGE THUMBNAILS for each Container of the specified classType available to this user
    Represents an indexed view of Images
    @class
*/
export default class IMAGEINDEX extends FORMPOSTINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Node
        @param {FormPostIndexModel} [model] Model
	*/
    constructor(node, model = MODELS.formPostIndex().append('data', DATA.search('IMAGE', 'CLASS', '', 3))) { //options = MODELS.search('IMAGE', 'CLASS', model.data.query || '', 'CLASS', 3)
        super(node, model);
        this.addClass('imageindex');        
    }
    /** Creates a Thumbnail that launches its respective Container
	    @param {FormPostModel} model The Thumbnail model
	    @param {string} className The className that the thumbnail represents,
        @param {number} [pageNumber] Page to load results into
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail(model, className) { //, pageNumber = 0
        //let [pagedMenu] = this.menu.get(pageNumber);
        return this.menu.addChild(new IMAGETHUMBNAIL(this.menu, MODELS.formPost(
            model.id,
            model.formId,
            model.authorId,
            model.shared,
            model.isPublic,
            model.status,
            model.dateCreated,
            model.dateLastModified,
            model.jsonResults
        ), className));
    }
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {FormPostModel} model model
        @param {number} [pageNumber] Page to load results into
        @returns {void}
    */
    addThumbnailMethods(model, pageNumber = 0) {
        let thumb = this.createThumbnail(model, this.classType, pageNumber);

        let btnAppend = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('APPEND'), DATA.navitem('Append', ICONS.PENCIL)));
        btnAppend.el.addEventListener('click', () => this.confirmAppend(model));

        let btnView = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('VIEW'), DATA.navitem('View ' + this.classType, ICONS[this.classType])));
        btnView.el.addEventListener('click', () => this.confirmView(model));

        // Add methods
        //let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetParents'];
        let methods = ['GetParents'];
        for (let m = 0; m < methods.length; m++) {
            thumb.menu.addNavItemIcon(
                MODELS.navitem(ATTR.navitem(methods[m]), DATA.navitem(methods[m].toUpperCase(), ICONS[methods[m].toUpperCase()]))
            ).el.onclick = () => CONFIRM.confirmMethodCall(
                this.classType + '.' + methods[m],
                methods[m] + ' description',
                () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/' + methods[m]),
                () => console.log(this.classType + '.' + methods[m] + '() was not called.')
            );
        }
    }
}
export { NAVTHUMBNAIL }