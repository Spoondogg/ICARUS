/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../../../CONTAINER.js';
import HEADER from '../../../../header/HEADER.js';
import IMG from '../../../../img/IMG.js';
import MENULIST from '../../../menulist/MENULIST.js';
import MODAL from '../../../../modal/MODAL.js';
import P from '../../../../p/P.js';
//import STRING from '../../../../../../STRING.js';
import THUMBNAIL from '../THUMBNAIL.js';
/** A thumbnail with a preview window and a list of Containers 
    that can be loaded into the preview
    @class
    @extends THUMBNAIL
*/
export default class INDEXTHUMBNAIL extends THUMBNAIL {
	/** Constructs a Bootstrap Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, model);
		this.setClass('col-xs-12 col-vs-6 col-sm-6 col-md-4 col-lg-offset-0');
		//this.construct();
		//this.populate(model.children);
	}
	/** Creates the Modal that contains the list of objects for preview
        @todo Consider paging these results
        @returns {void}
    */
	launchModal() {
		console.log('Launch Index Thumbnail Modal');
		this.addModal();
		this.addDataListNavItems();
		this.modal.show();
	}
	/** Creates a MODAL and populates its Container with a Header, Image and various details
        @returns {MODAL} A Thumbnail MODAL
    */
	addModal() {
		this.modal = new MODAL(this.data.header);
		this.modal.container.body.pane.addClass('thumbnail index-thumbnail');
		this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({ 'src': this.image.el.src })));
		//this.modal.container.image.el.src = this.image.el.src;
		this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
			'label': this.data.header
		}));
		this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
			'style': 'height:auto;'
		})), this.data.p);
		this.modal.container.previewNotes = new EL(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES({
			'class': 'preview-notes'
		})), '');
		this.modal.container.preview = new CONTAINER(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('preview')), [this.data.listClass.toUpperCase()]);
		//this.modal.container.preview.el.setAttribute('style', 'height:400px;max-height:400px;overflow-y:auto;');
		this.modal.container.menulist = new MENULIST(this.modal.container.body.pane, new MODEL('index-thumbnail-menulist').set({
			'name': 'preview-list',
			'label': this.data.listClass + '(s)'
		}));
		return this.modal;
	}
	/**
		    Adds NavItems for each data list
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
	/**
	        Creates a modal and loads the specified container
	        @param {number} delay Delay in milliseconds
	        param {string} title Modal Title
	        param {EL} node Modal node to append to
	        @param {string} className Object class name
	        @param {number} id Object id
	        @returns {void}
		*/
	launchPreview(delay = 500, className, id) { //title = 'Preview', // node
		setTimeout(() => {
			$.getJSON('/' + className + '/Get/' + id, (result) => {
				console.log(className, result);
				this.modal.container.preview.create(result.model);
			});
		}, delay);
		/**
		            Get a list of Parents for this Container
		            @returns {void}
		        */
		setTimeout(() => {
			$.getJSON('/' + className + '/GetContainerParents/' + id, (result) => {
				console.log(className + ' Parents:', result, result.length + ' parent Containers');
				//this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
				this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
			});
		}, delay);
	}
}