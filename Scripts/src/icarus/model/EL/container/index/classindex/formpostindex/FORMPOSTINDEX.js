/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, DIALOGMODEL, Expand, ICONS, MODEL, PROMPT } from '../CLASSINDEX.js';
/** Contains a list of THUMBNAILS for each Container of the specified 
    classType available to this user.
    @description Represents an indexed view of Images
    @class
*/
export default class FORMPOSTINDEX extends CLASSINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
        @param {FormPostIndexOptions} [options] Optional options
	*/
    constructor(node, model, options = {
        classType: 'FORMPOST',
        query: '',
        formId: model.data.formId || -1
    }) {
        super(node, model, options);
        this.addClass('formpostindex');
        this.formId = options.formId;
    }
    /** An abstract/default search that promises to return a payload and status
        @param {query} [query] Optional querystring
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchClass(query = '') {
        console.log('FORMPOSTINDEX Search', this.formId, query);
        return $.post('/FORMPOST/search?formId=' + this.formId + '&page=' + this.page + '&pageLength=' + this.pageLength + '&query=' + query, {
            '__RequestVerificationToken': this.getToken()
        });
    }	
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {MODEL} model Model
        @returns {void}
    */
    addThumbnailMethods(model) {
        let thumb = this.createThumbnail(model, this.classType);
        
        let btnView = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'View ' + this.classType,
            icon: ICONS[this.classType],
            name: 'VIEW'
        }));
        btnView.el.addEventListener('click', () => {
            console.log('FORMPOSTINDEX.btnView()', model);
            this.confirmView(model);
        });        

        // Add methods
        let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex'];
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
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER UId
        @param {string} classType CONTAINER class
        @returns {void}
    */
    launchViewer(id, classType) {
        console.log('FORMPOSTINDEX.launchViewer()', id, classType);
        let dialog = new PROMPT(new DIALOGMODEL(new MODEL('dialog-classviewer'), {
            container: this.getContainer(),
            caller: this,
            label: 'FormPostViewer: ' + classType + ' # ' + id
        }), false);
        let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', classType));
        viewer.body.el.dispatchEvent(new Expand(viewer));
        this.getContainer().getFactory().get(viewer.body.pane, 'FORMPOSTINDEX', id).then(() => dialog.showDialog());
    }
}
export { CLASSVIEWER }