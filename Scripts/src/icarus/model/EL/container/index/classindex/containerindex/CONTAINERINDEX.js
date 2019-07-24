/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, DIALOGMODEL, Expand, ICONS, MODEL, PROMPT } from '../CLASSINDEX.js';
import CONTAINERTHUMBNAIL from '../../../../nav/navitem/navthumbnail/containerthumbnail/CONTAINERTHUMBNAIL.js';
import FORMPOSTINDEX from '../formpostindex/FORMPOSTINDEX.js';
/** Contains a list of THUMBNAILS for each Container of the specified classType available to this user
    Represents an indexed view of Images
    @class
*/
export default class CONTAINERINDEX extends CLASSINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
        @param {MODEL} [model] Model
        @param {ClassIndexOptions} [options] Optional options
	*/
    constructor(node, model, options) {
        super(node, model, options);
        this.addClass('containerindex');        
    }
    /** An abstract/default search that promises to return a payload and status
        @param {string} [type] Optional search type
        @param {query} [query] Optional querystring / delimited tag list
        @returns {Promise<object, string>} Promise to return payload, status
    */
    search(type = this.searchType, query = '') {
        console.log('CONTAINERINDEX.search', type, query);
        let result = null;
        switch (type) {
            case 'TAG':
                result = $.post('/' + this.classType + '/SearchByTag?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + query, {
                    '__RequestVerificationToken': this.getToken()
                });
                break;
            case 'TAGID':
                result = $.post('/' + this.classType + '/SearchByTagId?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + query, {
                    '__RequestVerificationToken': this.getToken()
                });
                break
            default: // generic search
                result = $.post('/' + this.classType + '/search?page=' + this.page + '&pageLength=' + this.pageLength + '&query=' + query, {
                    '__RequestVerificationToken': this.getToken()
                });
        }
        return result;
    }
    /** An abstract/default search that promises to return a payload and status
        @param {string} [tag] Optional comma delimited list of tags
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchTags(tag = '') {
        //console.log('CONTAINERINDEX SearchByTag', this.classType, tag);
        return $.post('/' + this.classType + '/SearchByTag?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + tag, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** An abstract/default search that promises to return a payload and status
        @param {string} [tagId] Optional comma delimited list of tag uids
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchTagIds(tagId = '') {
        //console.log('CONTAINERINDEX SearchByTagId', this.classType, tagId);
        return $.post('/' + this.classType + '/SearchByTagId?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + tagId, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** Appends chosen CONTAINER to target after confirmation
        @param {MODEL} model Model
        @returns {void}
    */
    confirmAppend(model) {
        CONFIRM.confirmMethodCall(
            'Append Confirmation',
            'Append ' + this.classType + ': ' + model.label + '(' + model.id + ') to ' + this.getContainer().toString() + '?',
            () => {
                console.log('Confirmed.  Appending...', model, this.getContainer());
                this.getContainer().getFactory().get(this.getContainer().childLocation, this.classType, model.id);
            }
        );
    }
    /** Adds form related methods to the thumbnail menu
        @param {MODEL} model Model
        @param {NAVTHUMBNAIL} thumb NavThumbnail representing this a form
        @returns {void}
    */
    addFormMethods(model, thumb) {
        let btnFormData = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'Form Data',
            icon: ICONS.DATA,
            name: 'DATA'
        }));
        btnFormData.el.addEventListener('click', () => CONFIRM.confirmMethodCall(
            'FORM.DATA',
            'Show posts for FORM(' + model.id + ')',
            () => {
                //window.open(new URL(window.location.href).origin + '/FORMPOST/search/?formId=' + model.id + '&query=' + this.query + '&page=0&pageLength=10');
                let prompt = new PROMPT(new DIALOGMODEL(new MODEL('dialog-formpostviewer'), {
                    container: this.getContainer(),
                    caller: this,
                    label: 'Form( ' + model.id + ') ' + model.label
                    //text: 'Viewing ' + classType + ' (' + id + ')"'
                }), false);
                //let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', classType));
                //viewer.body.el.dispatchEvent(new Expand(viewer));
                let formPostIndex = new FORMPOSTINDEX(prompt.body.pane, new MODEL().set({
                    container: prompt.getContainer()
                }), {
                    classType: 'FORMPOST',
                    query: '',
                    formId: model.id
                });
                formPostIndex.body.el.dispatchEvent(new Expand(formPostIndex));
                //this.getContainer().getFactory().get(viewer.body.pane, classType, id).then(() => dialog.showDialog());

                prompt.showDialog();
            },
            () => console.log('FORM.SEARCH was not called.')
        ));
    }
    /** Creates a Thumbnail that launches its respective Container
	    @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.label The Thumbnail label
	    @param {string} classType The className that the thumbnail represents
        @param {number} [pageNumber] Page to load results into
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail({
        id,
        subsections,
        authorId,
        label,
        description,
        tags,
        key,
        value,
        jsonResults
    }, classType, pageNumber = 0) {
        let [pagedMenu] = this.menu.get(pageNumber);
        let thumbnail = pagedMenu.addChild(new CONTAINERTHUMBNAIL(pagedMenu, new MODEL().set({
            id,
            subsections,
            authorId,
            label,
            description,
            tags,
            key,
            value,
            jsonResults
        }), classType));
        thumbnail.container = this.getContainer();
        return thumbnail;
    }
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {MODEL} model model
        @param {number} [pageNumber] Page to load results into
        @returns {void}
    */
    addThumbnailMethods(model, pageNumber = 0) {
        //console.log('.addThumbnailMethods()', pageNumber, model);
        let thumb = this.createThumbnail(model, this.classType, pageNumber);

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

        if (this.classType === 'FORM') {
            this.addFormMethods(model, thumb);
        }

        let btnSearch = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'Search ' + this.classType,
            icon: ICONS.SEARCH,
            name: 'SEARCH'
        }));
        btnSearch.el.addEventListener('click', () => CONFIRM.confirmMethodCall(
            this.classType + '.SEARCH',
            'Search children of ' + this.classType,
            () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/search/?query=' + this.query),
            () => console.log(this.classType + '.SEARCH was not called.')
        ));
        /*
        let btnSave = thumb.menu.addNavItemIcon(new MODEL().set({
            label: 'Save ' + this.classType,
            icon: ICONS.SAVE,
            name: 'SAVE'
        }));
        btnSave.el.addEventListener('click', () => this.getFactory().save(false, this.getContainer(), this.getContainer()));
        */
        // Add methods
        let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetParents'];
        for (let m = 0; m < methods.length; m++) {
            thumb.menu.addNavItemIcon(new MODEL().set({
                label: methods[m],
                icon: ICONS[methods[m].toUpperCase()],
                name: methods[m].toUpperCase()
            })).el.onclick = () => CONFIRM.confirmMethodCall(
                this.classType + '.' + methods[m],
                methods[m] + ' description',
                () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/' + methods[m] + '/' + model.id),
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
        if (classType === 'MAIN') {
            CONFIRM.confirmMethodCall(
                'Launch MAIN Viewer',
                classType + ' "(' + id + ') will launch in a new window.  Proceed?',
                () => {
                    console.log('Confirmed.  Viewing ' + classType + '(' + id + ')');
                    window.open('/' + id, '_blank');
                }
            );
        } else {
            let dialog = new PROMPT(new DIALOGMODEL(new MODEL('dialog-classviewer'), {
                container: this.getContainer(),
                caller: this,
                label: 'ClassViewer: ' + classType + ' # ' + id
                //text: 'Viewing ' + classType + ' (' + id + ')"'
            }), false);
            let model = new MODEL();
            model.container = this.getContainer().getMain();
            model.data.set('classType', classType);
            let viewer = new CLASSVIEWER(dialog.body.pane, model);
            //viewer.container = this.getContainer().getMain();
            viewer.body.el.dispatchEvent(new Expand(viewer));
            this.getContainer().getFactory().get(viewer.body.pane, classType, id).then(() => dialog.showDialog());
        }
    }    
}
export { CLASSVIEWER }