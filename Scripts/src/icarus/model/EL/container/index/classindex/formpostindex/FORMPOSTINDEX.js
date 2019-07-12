/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, DIALOGMODEL, Expand, ICONS, MODEL, PROMPT } from '../CLASSINDEX.js';
//import FORM from '../../../../form/FORM.js';
import FORMPOSTTHUMBNAIL from '../../../../nav/navitem/navthumbnail/formpostthumbnail/FORMPOSTTHUMBNAIL.js';
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
        query: model.data.query || '',
        formId: model.data.formId || -1
    }) {
        super(node, model, options);
        this.addClass('formpostindex');
        this.setFormId(model.data.formId || options.formId);
        this.formId = model.data.formId || options.formId;
        console.log('FPI:', this.formId, model, options);
    }
    /** Sets the form that this index represents
        @param {UId} formId Unique Form UId
        @returns {void}
    */
    setFormId(formId) {
        this.formId = this.required(formId);
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
    /** Creates a Thumbnail that launches its respective Container
	    @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.label The Thumbnail label
	    @param {string} className The className that the thumbnail represents
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail({
        id,
        formId,
        authorId,
        shared,
        isPublic,
        status,
        dateCreated,
        dateLastModified,
        jsonResults
    }, className) {
        return this.menu.addChild(new FORMPOSTTHUMBNAIL(this.menu, new MODEL().set({
            id,
            formId,
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
        @param {MODEL} model Model
        @returns {void}
    */
    addThumbnailMethods(model) {
        console.log('FORMPOSTINDEX.addThumbnailMethods()', model);
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
        console.log('FORMPOSTINDEX.launchViewer()', id, classType);

        let dialog = new PROMPT(new DIALOGMODEL(new MODEL(), {
            container: this.getContainer(),
            caller: this,
            label: 'FormPostViewer: ' + classType + ' # ' + id
        }));
        let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', 'FORMPOST'));
        viewer.body.el.dispatchEvent(new Expand(viewer));

        this.getPayload(id).then((payload) => {
            console.log('Retrieved formpost', payload);
            console.log('Building formId', this.formId);
            this.getContainer().getFactory().get(viewer.body.pane, 'FORM', this.formId).then(() => {
                console.log('TODO: Populate values of form from result.model.jsonResults', payload.model.jsonResults);
                let json = JSON.parse(payload.model.jsonResults);
                console.log('JSON', json);
                console.log('viewer', viewer);

                /// @todo YOU UGLY BASTARD
                /// You need to create a flag that indicates that the CONTAINER has finished loading
                /// Then you need to poll for that flag at fixed intervals until the flag is valid
                /// Once valid, retrieve the form and continue...
                /** @type {[FORM]} */
                let [form] = viewer.body.pane.get(null, 'FORM');
                form.footer.el.style.display = 'none';
                console.log('FORM', form);
                setTimeout(() => {
                    if (payload.model.jsonResults) { // Set values based on existing 
                        [...form.el.elements].forEach((el) => {
                            el.setAttribute('value', '');
                            el.setAttribute('readonly', 'true');
                        });
                        json.forEach((inp) => {
                            console.log('Set value', inp);
                            form.setTextInputValue(inp);
                        });
                    }
                    dialog.showDialog();
                }, 2000);
            });
        });

        /*$.post('/FORMPOST/GET/' + id, {
            '__RequestVerificationToken': this.getToken()
        }).then((payload, status) => {
            console.log('Retrieved formpost', this.formId, 
        });*/

        //this.getContainer().getFactory().get(viewer.body.pane, 'FORMPOST', id).then(() => dialog.showDialog());

    }
}
export { CLASSVIEWER, CONFIRM, DIALOGMODEL, Expand, ICONS, MODEL, PROMPT }