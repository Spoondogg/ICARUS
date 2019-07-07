/** @module */
import CONTAINER, { ATTRIBUTES, MODEL } from '../../../CONTAINER.js';
import DIV from '../../../../div/DIV.js';
import HEADER from '../../../../header/HEADER.js';
import IMG from '../../../../img/IMG.js';
import MODAL from '../../../../modal/MODAL.js';
import NAVTHUMBNAIL from '../../../../nav/navitem/navthumbnail/NAVTHUMBNAIL.js';
import P from '../../../../p/P.js';
/** A thumbnail with a preview window and a list of Containers 
    that can be loaded into the preview
    @class
    @extends NAVTHUMBNAIL
*/
export default class INDEXTHUMBNAIL extends NAVTHUMBNAIL {
	/** Constructs a Bootstrap Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, model);
		this.addClass('indexthumbnail');
	}
	/** Creates the Modal that contains the list of objects for preview
        @todo Consider paging these results
        @returns {void}
    */
	launchModal() {
		console.log('Launch Index Thumbnail Modal');
		this.addModal();
		this.addDataListNavItems();
		this.modal.expand();
	}
	/** Creates a MODAL and populates its Container with a Header, Image and various details
        @returns {MODAL} A Thumbnail MODAL
    */
	addModal() {
		this.modal = new MODAL(this.data.header);
		this.modal.container.body.pane.addClass('thumbnail index-thumbnail');
		this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL(new ATTRIBUTES('src', this.image.el.src)));
		this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set('innerHTML', this.data.header));
		this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES('style', 'height:auto;')).set('innerHTML', this.data.p));
		this.modal.container.previewNotes = new DIV(this.modal.container.body.pane, new MODEL('preview-notes'), '');
		this.modal.container.preview = new CONTAINER(this.modal.container.body.pane, 'DIV', new MODEL('preview'), [this.data.listClass.toUpperCase()]);
		return this.modal;
	}
	/** Adds NavItems for each data list
        @returns {void}
    */
	addDataListNavItems() {
		for (let li = 0; li < this.data.list.length; li++) {
			let title = this.data.list[li].label + ' (' + this.data.listClass + '[' + this.data.list[li].id + '])';
			this.modal.container.menulist.menu.addNavItem(new MODEL().set({
				'label': title
			})).el.onclick = () => {
				this.modal.container.preview.body.pane.empty();
				this.launchPreview(500, title, this.modal.container.preview.body.pane, this.data.listClass, this.data.list[li].id);
			};
		}
	}
	/** Creates a modal and loads the specified container
        @param {number} delay Delay in milliseconds
        @param {string} className Object class name
        @param {number} id Object id
        @returns {void}
    */
    launchPreview(delay = 500, className, id) { //title = 'Preview', // node
        console.log('launchPreview()', className, id);
        setTimeout(() => {
            this.getJson('/' + className + '/GET/' + id, (result) => {
				console.log(className, result);
				this.modal.container.preview.create(result.model);
			});
		}, delay);
		/** Get a list of Parents for this Container
		    @returns {void}
		*/
        setTimeout(() => {
            this.getJson('/' + className + '/GetContainerParents/' + id, (result) => {
				console.log(className + ' Parents:', result, result.length + ' parent Containers');
				this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
			});
		}, delay);
	}
}