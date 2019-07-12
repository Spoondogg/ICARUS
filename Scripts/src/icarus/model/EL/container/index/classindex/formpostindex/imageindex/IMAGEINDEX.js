/** @module */
import FORMPOSTINDEX, { CONFIRM, ICONS, MODEL } from '../FORMPOSTINDEX.js';
import IMAGETHUMBNAIL from '../../../../../nav/navitem/navthumbnail/imagethumbnail/IMAGETHUMBNAIL.js';
/** Contains a list of IMAGE THUMBNAILS for each Container of the specified classType available to this user
    Represents an indexed view of Images
    @class
*/
export default class IMAGEINDEX extends FORMPOSTINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
        @param {FormPostIndexOptions} [options] Optional options
	*/
    constructor(node, model, options = {
        classType: 'IMAGE',
        query: model.data.query || '',
        formId: 3
    }) {
        console.log('ImageIndex', 'FORMPOST', options);
        super(node, model, options);
        this.addClass('imageindex');        
    }
    /** An abstract/default search that promises to return a payload and status
        @param {query} [query] Optional querystring
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchClass(query = '') {
        console.log('IMAGEINDEX Search', this.formId, query);
        return $.post('/FORMPOST/search?formId=' + this.formId + '&page=' + this.page + '&pageLength=' + this.pageLength + '&query=' + query, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** Creates a Thumbnail that launches its respective Container
	    @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.label The Thumbnail label
	    @param {string} className The className that the thumbnail represents
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail({
        id,
        //formId,
        authorId,
        shared,
        isPublic,
        status,
        dateCreated,
        dateLastModified,
        jsonResults
    }, className) {
        return this.menu.addChild(new IMAGETHUMBNAIL(this.menu, new MODEL().set({
            id,
            //formId,
            authorId,
            shared,
            isPublic,
            status,
            dateCreated,
            dateLastModified,
            jsonResults
        }), className));
    }
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {MODEL} model model
        @returns {void}
    */
    addThumbnailMethods(model) {
        let thumb = this.createThumbnail(model, this.classType);

        let btnAppend = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'Append',
            icon: ICONS.PENCIL,
            name: 'APPEND'
        }));
        btnAppend.el.addEventListener('click', () => this.confirmAppend(model));

        let btnView = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'View ' + this.classType,
            icon: ICONS[this.classType],
            name: 'VIEW'
        }));
        btnView.el.addEventListener('click', () => this.confirmView(model));

        /*let btnSearch = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'Search ' + this.classType,
            icon: ICONS.SEARCH,
            name: 'SEARCH'
        }));
        btnSearch.el.addEventListener('click', () => CONFIRM.confirmMethodCall(
            this.classType + '.SEARCH',
            'Search children of ' + this.classType,
            () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/search/?query=' + this.query),
            () => console.log(this.classType + '.SEARCH was not called.')
        ));*/

        // Add methods
        //let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetParents'];
        let methods = ['GetParents'];
        for (let m = 0; m < methods.length; m++) {
            thumb.menu.addNavItemIcon(new MODEL().set({
                label: methods[m],
                icon: ICONS[methods[m].toUpperCase()],
                name: methods[m].toUpperCase()
            })).el.onclick = () => CONFIRM.confirmMethodCall(
                this.classType + '.' + methods[m],
                methods[m] + ' description',
                () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/' + methods[m]),
                () => console.log(this.classType + '.' + methods[m] + '() was not called.')
            );
        }
    }
}