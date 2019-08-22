/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, Expand, ICONS, MODEL, MODELS, PROMPT } from '../CLASSINDEX.js';
import FORM, { ATTR, DATA, PAYLOAD } from '../../../../form/FORM.js';
import FORMPOSTTHUMBNAIL, { NAVTHUMBNAIL } from '../../../../nav/navitem/navthumbnail/formpostthumbnail/FORMPOSTTHUMBNAIL.js';
/** Contains a list of THUMBNAILS for each Container of the specified 
    classType available to this user.
    @description Represents an indexed view of Images
    @class
*/
export default class FORMPOSTINDEX extends CLASSINDEX {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Node
        @param {ClassIndexModel} [model] Model
        @param {SearchModel} [options] Options
	*/
    constructor(node, model) {
        super(node, model);
        this.addClass('formpostindex');
        //this.setFormId(model.data.formId || options.formId);
        //this.caller = options.caller;
        //console.log('FPI:', this.formId, model, options);
    }
    /** Sets the form that this index represents
        @param {UId} formId Unique Form UId
        @returns {void}
    */
    setFormId(formId) {
        this.formId = this.required(formId);
    }
    /** An abstract/default search that promises to return a payload and status
        @param {SearchData} search Search Data Object
        @returns {Promise<object, string>} Promise to return payload, status
    */
    search(search) {
        let searchUrl = '/FORMPOST/search?formId=' + search.formId + '&page=' + this.page + '&pageLength=' + this.pageLength + '&type=' + search.searchType + '&query=' + search.query;
        console.info('FORMPOSTINDEX Search', searchUrl, search);
        return $.post(searchUrl, {
            '__RequestVerificationToken': this.getToken()
        });
    }
    /** Creates a Thumbnail that launches its respective Container
	    @param {FormPostModel} model FormPost Model
	    @param {string} className The className that the thumbnail represents
        @param {number} [pageNumber] Page to load results into
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail(model, className) {
        //let [pagedMenu] = this.menu.get(pageNumber);
        return this.menu.addChild(new FORMPOSTTHUMBNAIL(this.menu, MODELS.formPost(
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
    /** Retrieves the given formpost by id and updates caller with id
        @param {UId} id FormPost uid
        @returns {void}
    */
    retrieveFormPost(id) {
        //console.log('FORMPOSTINDEX.btnGet()', model, 'Check if there is a caller', this.caller);
        // if a caller exists, send the value back to its input.el
        if (typeof this.caller !== 'undefined') {
            if (this.caller.className === 'FORMPOSTLIST') {
                if (this.caller.input.el.value === '0') {
                    this.caller.input.setAttribute('value', id);
                } else {
                    let arr = this.caller.input.el.value.split(',');
                    arr.push(id);
                    this.caller.input.setAttribute('value', arr.join(','));
                }
            } else {
                console.log('Not a formpostlist.  not sure what to do now');
            }
        }
    }
    /** Creates a Thumbnail representation of a FORMPOST and adds relevant Events 
        @param {MODEL} model Model
        @param {number} [pageNumber] Page to load results into
        @returns {void}
    */
    addThumbnailMethods(model, pageNumber = 0) {
        //console.log('FORMPOSTINDEX.addThumbnailMethods()', model);
        let thumb = this.createThumbnail(model, this.classType, pageNumber);
        let btnGet = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('GET'), DATA.navitem('Get ' + this.classType, ICONS[this.classType])));
        btnGet.el.addEventListener('click', () => this.retrieveFormPost(model.id));

        let btnView = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('VIEW'), DATA.navitem('View ' + this.classType, ICONS[this.classType])));
        btnView.el.addEventListener('click', () => this.confirmView(model));

        let btnEdit = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('EDIT'), DATA.navitem('Edit ' + this.classType, ICONS[this.classType])));
        btnEdit.el.addEventListener('click', () => {
            console.log('FORMPOSTINDEX.btnEdit()', model);
            //this.getContainer().getFactory().editProperty();
            let dialog = new PROMPT(MODELS.dialog(
                'Edit FormPost + (' + model.id + ') ', '', true, 
                this.getContainer(), this, this.getContainer().getLoader()
            ));
            this.getFactory().get(dialog.body.pane, 'FORM', model.formId).then((form) => {
                form.setAction('/FORMPOST/SET');
                form.container = this.required(this.getContainer());
                form.caller = this.required(this.getContainer());
                console.log('WOOT!!! The form', form);
                this.setFormPostValues(model, form);
                dialog.show();
            });
        });
        /*
        // Add methods
        //let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex'];
        let methods = ['woots', 'PageIndex'];
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
        */
    }	
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER/FORMPOST UId
        @param {string} classType CONTAINER class
        @returns {void}
    */
    launchViewer(id, classType) {
        let dialog = new PROMPT(MODELS.dialog(
            'FormPostViewer: ' + classType + ' # ' + id,
            '', true, this.getContainer(), this, this.getContainer().getLoader()
        ));
        let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', 'FORMPOST'));
        viewer.container = this.getContainer();
        this.populateFormPostForm(id, viewer, dialog);
        viewer.body.el.dispatchEvent(new Expand(viewer));

        /*$.post('/FORMPOST/GET/' + id, {
            '__RequestVerificationToken': this.getToken()
        }).then((payload, status) => {
            console.log('Retrieved formpost', this.formId, 
        });*/

        //this.getContainer().getFactory().get(viewer.body.pane, 'FORMPOST', id).then(() => dialog.showDialog());

    }
    /** Asynchronously populates a FORM representing a FORMPOST with values of 
        the given formpost (by id)
        @param {UId} id formpost uid
        @param {CLASSVIEWER} viewer Class Viewer
        @param {PROMPT} dialog A prompt to display the viewer in
        @returns {void}
    */
    populateFormPostForm(id, viewer, dialog) {
        this.getPayload(id).then((payload) => {
            console.log('Retrieved formpost', payload);
            console.log('Building formId', this.formId);
            this.getContainer().getFactory().get(viewer.body.pane, 'FORM', this.formId).then((form) => {
                form.footer.el.style.display = 'none';
                this.setFormPostValues(payload.model, form);                
                dialog.showDialog();
            });
        });
    }
    /** Sets values of a FORMPOST Form based on the given FORMPOST (payload.model.jsonResults)
        
        THIS IS BAD.  You need to check that the CONTAINER is fully loaded before populating 
        instead of just waiting X seconds.

        @param {FormPostModel} model Model
        @param {FORM} form Form
        @returns {void}
    */
    setFormPostValues(model, form) {
        setTimeout(() => {
            if (model.jsonResults) { // Set values based on existing 
                form.getFieldset()[0].getFormElementGroup()[0].addInputElement(
                    MODELS.input('INPUT', ATTR.input('id', model.id, 'HIDDEN', true), 'id', 'HIDDEN')
                    //createInputModel('TEXT', 'id', model.id, 'id', 'HIDDEN', true)
                );
                //[...form.el.elements].forEach((el) => {
                //    el.setAttribute('value', '');
                //    el.setAttribute('readonly', 'true');
                //});
                JSON.parse(model.jsonResults).forEach((inp) => {
                    console.log('Set value', inp);
                    form.setTextInputValue(inp);
                });
            }
        }, 2000);
    }
}
export { ATTR, CLASSVIEWER, CONFIRM, DATA, Expand, FORM, ICONS, MODEL, MODELS, NAVTHUMBNAIL, PAYLOAD, PROMPT }