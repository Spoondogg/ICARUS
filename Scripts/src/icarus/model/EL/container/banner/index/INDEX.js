/** @module  */
import CONTAINER, { ATTRIBUTES, MODEL } from '../../CONTAINER.js';
import BANNER from '../BANNER.js';
import DIV from '../../../div/DIV.js';
import HEADER from '../../../header/HEADER.js';
import { ICONS } from '../../../../../enums/ICONS.js';
import MENU from '../../../nav/menu/MENU.js';
import MENULIST from '../../menulist/MENULIST.js';
import MODAL from '../../../modal/MODAL.js';
import P from '../../../p/P.js';
/** Contains a high level view of all objects owned by this user
    @class
    @extends BANNER
*/
export default class INDEX extends BANNER {
	/** Constructs a SECTION Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model	    
    */
	constructor(node, model) {
		super(node, model);
		this.addClass('index');
	}
	construct() {
		this.menu = new MENU(this.body.pane, new MODEL('horizontal collapse').set({
			'label': 'INDEX',
			'collapsed': 1,
			'showHeader': 1
		}));
		['ARTICLE', 'FORM', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL', 'CHAT', 'DICTIONARY', 'WORD', 'IMAGEGALLERY'].forEach((element) => {
			this.addThumbButtonActions(element, this.menu.addNavItemIcon(new MODEL().set({
				'icon': ICONS[element.toUpperCase()],
				'label': element,
				'dataId': -1,
				'data': {
					'header': element,
					'p': '&nbsp;'
				}
			})));
		});
	}
	/** Posts to the given element and retrieves a list of available instances, 
	    then assigns relevant actions to it
	    @param {string} element The name of the element 
	    @param {NAVITEMICON} thumb A NAVITEMICON that represents the given element
	    @returns {void}
	    @async
	*/
	addThumbButtonActions(element, thumb) {
		$.post('/' + element + '/List', {
			'__RequestVerificationToken': this.getToken()
		}, (payload, status) => {
			if (status === 'success') {
				let str = 'There are ' + payload.list.length + ' instances of ' + payload.className;
				thumb.el.setAttribute('title', str);
				thumb.el.onclick = () => {
					this.launchModal(payload.className, str, payload.className, payload.list);
				};
			}
		});
	}
	/** Creates the Modal that contains the list of objects for preview
        @todo Consider paging these results
        @param {string} header Header text
        @param {string} p paragraph
        @param {string} listClass element class
        @param {Array} list A list
        @returns {void}
    */
	launchModal(header, p, listClass, list) {
		console.log('Launch Index Thumbnail Modal');
		this.modal = new MODAL(header);
		this.modal.container.body.pane.addClass('thumbnail index-thumbnail');
		//this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
		//this.modal.container.image.el.src = this.image.el.src;
		this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
			'label': header
		}));
		this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
			'style': 'height:auto;'
		})), p);
		this.modal.container.previewNotes = new DIV(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
			'class': 'preview-notes'
		})), '');
		this.modal.container.preview = new CONTAINER(this.modal.container.body.pane, 'DIV', new MODEL('preview'),
			[listClass.toUpperCase()]);
		this.modal.container.preview.el.setAttribute('style', 'height:400px;max-height:400px;overflow-y:auto;');
		this.modal.container.menulist = new MENULIST(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
			'style': 'max-height:200px;overflow-y:auto;'
		})).set({
			'name': 'preview-list',
			'label': listClass + '(s)'
		}));
		for (let li = 0; li < list.length; li++) {
			let title = list[li].label + ' (' + listClass + '[' + list[li].id + '])';
			this.modal.container.menulist.menu.addNavItem(new MODEL().set({
				'label': title
			})).el.onclick = () => {
				this.modal.container.preview.body.pane.empty();
				this.launchPreview(500, listClass, list[li].id); // title, this.modal.container.preview.body.pane,
			};
		}
		this.modal.expand();
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
	launchPreview(delay = 500, className, id) { // title = 'Preview', // node
		setTimeout(() => {
			$.getJSON('/' + className + '/Get/' + id, (result) => {
				console.log(className, result);
				this.modal.container.preview.create(result.model);
			});
		}, delay);
		setTimeout(() => {
			$.getJSON('/' + className + '/GetContainerParents/' + id, (result) => {
				console.log(className + ' Parents:', result, result.length + ' parent Containers');
				//this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
				this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
			});
		}, delay);
	}
}