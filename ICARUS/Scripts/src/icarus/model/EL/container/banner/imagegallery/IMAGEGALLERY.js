/**
    @module
*/
import BUTTONGROUP, { BUTTON, MODEL } from '../../../group/buttongroup/BUTTONGROUP.js';
import BANNER from '../BANNER.js';
import FOOTER from '../../../footer/FOOTER.js';
import HEADER from '../../../header/HEADER.js';
import THUMBNAIL from '../thumbnail/THUMBNAIL.js';
//import TOKEN from '../../formelement/input/TOKEN.js';
/**
    Contains a high level view of all objects owned by this user
    @class
    @extends BANNER
*/
export default class IMAGEGALLERY extends BANNER {
	/**
	    Constructs a SECTION Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('image-gallery');
		this.page = 0;
		this.pageLength = 6;
		this.pageTotal = 0;
		this.header = new HEADER(this, new MODEL().set({
			'label': 'Image Gallery'
		}));
		$(this.header.el).insertBefore(this.body.pane.el);
		this.pagination = this.createPaginationFooter();
		this.footer = new FOOTER(this, new MODEL());
		$(this.pagination.el).insertAfter(this.body.pane.el);
		this.loadPage(this.page);
	}
	/**
	    Creates a Pagination button group as a footer
	    @returns {FOOTER} A pagination footer
	*/
	createPaginationFooter() {
		let pagination = new FOOTER(this, new MODEL('pagination text-center'));
		//this.pagination.el.setAttribute('style', 'text-align:center;');
		$(pagination.el).insertBefore(this.body.pane.el);
		pagination.btnPrev = new BUTTON(this.pagination, 'Prev');
		pagination.btnPrev.el.setAttribute('style', 'margin-right:1em;');
		pagination.btnPrev.el.onclick = this.prevPage.bind(this);
		pagination.buttonGroup = new BUTTONGROUP(this.pagination);
		pagination.buttonGroup.loaded = false;
		pagination.btnNext = new BUTTON(this.pagination, 'Next');
		pagination.btnNext.el.setAttribute('style', 'margin-left:1em;');
		pagination.btnNext.el.onclick = this.nextPage.bind(this);
		return pagination;
	}
	construct() {
		let postUrl = '/ImageGallery/ImageIndex';
		if (this.page) {
			postUrl += '?page=' + this.page + '&pageLength=' + this.pageLength;
		}
		$.post(postUrl, {
				'__RequestVerificationToken': this.getMainContainer().token //token.value
			},
			/**
						    Processes the payload from /ImageGallery/ImageIndex?page=X&pageLenght=Y
						    @param {any} payload The POST payload
						    @param {any} status The POST status
			                @returns {void}
						*/
			(payload, status) => {
				if (status === 'success') {
					this.pageTotal = payload.total;
					for (let l = 0; l < payload.list.length; l++) {
						let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
							'label': payload.list[l].label,
							'dataId': -1,
							'data': {
								'header': payload.list[l].label,
								'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>' + payload.className + '[' + payload.list[l].index + ']',
								'img': payload.list[l].id,
								'showImageDetails': true
							}
						}));
						if (payload.list[l].id === 0) {
							thumb.image.el.setAttribute('style', 'display:none;');
						}
						thumb.button.el.onclick = () => {
							this.launchMain(payload.list[l].id);
						};
					}
					if (!this.pagination.buttonGroup.loaded) {
						//console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
						this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
						//console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
						for (let p = 0; p < this.pageCount; p++) {
							this.pagination.buttonGroup.addButton(p + 1).el.onclick = () => {
								this.loadPage(p);
							};
						}
						this.pagination.buttonGroup.loaded = true;
					}
				}
			});
	}
	/**
		    Sets the page variables and reconstructs
		    @param {any} page A page to load
	        @returns {void}
		*/
	loadPage(page) {
		console.log('Loading page ' + page);
		this.header.setInnerHTML('Page ' + (page + 1));
		let buttons = this.pagination.buttonGroup.el.children;
		for (let b = 0; b < buttons.length; b++) {
			$(buttons[b]).removeClass('active');
		}
		$(buttons[page]).addClass('active');
		this.body.pane.empty();
		this.page = page;
		this.construct();
	}
	/**
		    Loads the next page
	        @returns {void}
		*/
	nextPage() {
		if (this.pageTotal > this.page * this.pageLength + 1) {
			this.loadPage(this.page + 1);
		} else {
			console.log('No next pages to display');
		}
	}
	/**
		    Loads the previous page
	        @returns {void}
		*/
	prevPage() {
		if (this.page > 0) {
			this.loadPage(this.page - 1);
		} else {
			console.log('No previous pages to display');
		}
	}
	/**
		    Opens the given Image FormPost in a new window
		    @param {number} id Main Container Id
	        @returns {void}
		 */
	launchMain(id) {
		window.open(new URL(window.location.href).origin + '/FormPost/Get/' + id);
	}
}