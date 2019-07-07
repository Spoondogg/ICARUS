/** @module */
import CLASSINDEX, { CLASSVIEWER, CONFIRM, DIALOGMODEL, Expand, ICONS, MODEL, PROMPT } from '../CLASSINDEX.js';
/** Contains a list of THUMBNAILS for each Container of the specified classType available to this user
    Represents an indexed view of Images
    @class
*/
export default class IMAGEINDEX extends CLASSINDEX { // SHOULD EXTEND FORMPOSTINDEX !!!!
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
        @param {string} [query] Optional Query String
	*/
    constructor(node, model, query = '') {
        console.log('ImageIndex', 'FORMPOST', 3, query);
        super(node, model, {
            classType: 'FORMPOST',
            query
        });
        this.addClass('index-image');        
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

        // Add methods
        let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetContainerParents'];
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
        if (classType === 'MAIN') {
            CONFIRM.confirmMethodCall(
                'Launch IMAGE Viewer',
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
                label: 'ImageViewer: ' + classType + ' # ' + id
                //text: 'Viewing ' + classType + ' (' + id + ')"'
            }), false);
            let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', classType));
            viewer.body.el.dispatchEvent(new Expand(viewer));
            this.getContainer().getFactory().get(viewer.body.pane, classType, id).then(() => dialog.showDialog());
        }
    }
}