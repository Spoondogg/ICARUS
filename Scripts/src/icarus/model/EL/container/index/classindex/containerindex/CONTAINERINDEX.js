/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, CONTAINER, Expand, ICONS, MODEL, MODELS, PROMPT } from '../CLASSINDEX.js';
import CONTAINERTHUMBNAIL, { NAVTHUMBNAIL } from '../../../../nav/navitem/navthumbnail/containerthumbnail/CONTAINERTHUMBNAIL.js';
import FORMPOSTINDEX from '../formpostindex/FORMPOSTINDEX.js';
/** Contains a list of THUMBNAILS for each Container of the specified classType available to this user
    Represents an indexed view of Images
    @class
*/
export default class CONTAINERINDEX extends CLASSINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Node
        @param {ClassIndexModel} [model] Model
	*/
    constructor(node, model = MODELS.classIndex()) {
        super(node, model);
        this.addClass('containerindex');        
    }
    /** An abstract/default search that promises to return a payload and status
        @param {SearchData} [search] Search Parameters
        @returns {Promise<object, string>} Promise to return payload, status
    */
    search(search = MODELS.search('MAIN', 'CLASS')) {
        let result = null;
        let url = '/';
        switch (search.searchType) {
            case 'TAG':
                url += search.searchClass + '/SearchByTag';
                break;
            case 'TAGID':
                url += search.searchClass + '/SearchByTagId';
                break
            case 'CLASS':
            default: // generic search
                url += search.searchClass + '/search';
        }
        url += '?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + search.query;
        console.log(url);
        result = $.post(url, {
            '__RequestVerificationToken': this.getToken()
        });
        return result;
    }
    /** An abstract/default search that promises to return a payload and status
        @param {CSV} [tag] Optional comma delimited list of tags
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchTags(tag = '') {
        return $.post('/' + this.classType + '/SearchByTag?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + tag, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** An abstract/default search that promises to return a payload and status
        @param {CSV} [tagId] Optional comma delimited list of tag uids
        @returns {Promise<object, string>} Promise to return payload, status
    */
    searchTagIds(tagId = '') {
        return $.post('/' + this.classType + '/SearchByTagId?page=' + this.page + '&pageLength=' + this.pageLength + '&tag=' + tagId, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** Appends chosen CONTAINER to target after confirmation
        @param {ContainerModel} model Model
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
        let btnFormData = thumb.menu.addNavItemIcon(MODELS.navitem('Form Data', ICONS.DATA, 'DATA'));
        btnFormData.el.addEventListener('click', () => CONFIRM.confirmMethodCall(
            'FORM.DATA',
            'Show posts for FORM(' + model.id + ')',
            () => {
                //window.open(new URL(window.location.href).origin + '/FORMPOST/search/?formId=' + model.id + '&query=' + this.query + '&page=0&pageLength=10');
                let prompt = new PROMPT(MODELS.dialog(
                    'Form( ' + model.id + ') ' + model.label, '', false,
                    this.getContainer(), this, this.getLoader()
                ));
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
	    @param {ContainerModel} model Container model
	    @param {string} classType The className that the thumbnail represents
        @param {number} [pageNumber] Page to load results into
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail(model, classType, pageNumber = 0) {
        //console.log('.createThumbnail()', classType, pageNumber, model);
        let [pagedMenu] = this.menu.get(pageNumber);
        let thumbnail = pagedMenu.addChild(new CONTAINERTHUMBNAIL(pagedMenu, MODELS.container(
            model.label, model.subsections, model.tags, model.name, model.id, model.authorId), classType)
        );
        thumbnail.container = this.getContainer();
        return thumbnail;
    }
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {ContainerModel} model Model
        @param {number} [pageNumber] Page to load results into
        @returns {void}
    */
    addThumbnailMethods(model, pageNumber = 0) {
        //console.log('.addThumbnailMethods()', pageNumber, model);
        let thumb = this.createThumbnail(model, this.classType, pageNumber);

        let btnAppend = thumb.menu.addNavItemIcon(MODELS.navitem('Append', ICONS.PENCIL, 'APPEND'));
        btnAppend.el.addEventListener('click', () => this.confirmAppend(model));

        let btnView = thumb.menu.addNavItemIcon(MODELS.navitem('View ' + this.classType, ICONS[this.classType], 'VIEW'));
        btnView.el.addEventListener('click', () => this.confirmView(model));

        if (this.classType === 'FORM') {
            this.addFormMethods(model, thumb);
        }

        let btnSearch = thumb.menu.addNavItemIcon(MODELS.navitem('Search ' + this.classType, ICONS.SEARCH, 'SEARCH'));
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
            thumb.menu.addNavItemIcon(
                MODELS.navitem(methods[m], ICONS[methods[m].toUpperCase()], methods[m].toUpperCase())
            ).el.onclick = () => CONFIRM.confirmMethodCall(
                this.classType + '.' + methods[m],
                methods[m] + ' description',
                () => window.open(new URL(window.location.href).origin + '/' + this.classType + '/' + methods[m] + '/' + model.id),
                () => console.log(this.classType + '.' + methods[m] + '() was not called.')
            );
        }
    }	
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER UId
        @param {SearchModel} search Search
        @returns {void}
    */
    launchViewer(id, search) {
        if (search.searchClass === 'MAIN') {
            CONFIRM.confirmMethodCall(
                'Launch MAIN Viewer',
                search.searchClass + ' "(' + id + ') will launch in a new window.  Proceed?',
                () => {
                    console.log('Confirmed.  Viewing ' + search.searchClass + '(' + id + ')');
                    window.open('/' + id, '_blank');
                }
            );
        } else {
            let dialog = new PROMPT(MODELS.dialog(
                'ClassViewer: ' + search.searchClass + ' # ' + id, '', false,
                this.getContainer(), this, this.getLoader()
            ));
            dialog.addClass('dialog-classviewer');
            let model = new MODEL();
            model.container = this.getContainer().getMain();
            model.data.set('searchClass', search.searchClass);
            let viewer = new CLASSVIEWER(dialog.body.pane, model);
            viewer.body.el.dispatchEvent(new Expand(viewer));
            this.getContainer().getFactory().get(viewer.body.pane, search.searchClass, id).then(() => dialog.showDialog());
        }
    }    
}
export { CLASSVIEWER, CONTAINER, NAVTHUMBNAIL, PROMPT }