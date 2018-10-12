/** @module */
import BANNER from '../BANNER.js';
import BUTTON from '../../../button/BUTTON.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
import FOOTER from '../../../footer/FOOTER.js';
import HEADER from '../../../header/HEADER.js';
import IFRAME from '../../iframe/IFRAME.js';
import MENU from '../../../nav/menu/MENU.js';
import MODAL from '../../../modal/MODAL.js';
import MODEL from '../../../../MODEL.js';
import THUMBNAIL from '../thumbnail/THUMBNAIL.js';
/** Contains a high level view of all MAIN Objects available to this user
    @class
    @extends BANNER
*/
export default class INDEXMAIN extends BANNER {
	/** Constructs a SECTION Container Element
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('index-main');
		this.page = 0;
		this.pageLength = 6;
        this.pageTotal = 0;
        this.menu = new MENU(this, new MODEL().set({
            'label': 'INDEX'
        }));
		this.header = new HEADER(this, new MODEL());
		$(this.header.el).insertBefore(this.body.pane.el);
		this.pagination = this.createPaginationFooter();
		//$(this.pagination.el).insertBefore(this.body.pane.el);
		this.footer = new FOOTER(this, new MODEL());
		$(this.pagination.el).insertAfter(this.body.pane.el);
		this.loadPage(this.page);
	}
	/**
		    Constructs the INDEXMAIN Container
	        @returns {void}
		*/
	construct() {
		if (!isNaN(this.page)) {
			console.log('Retrieving page ' + this.page);
			//let token = TOKEN.getToken();
			$.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
				'__RequestVerificationToken': this.getMainContainer().token // this.token.value
			}, (payload, status) => {
				if (status === 'success') {
					this.pageTotal = payload.total;
					for (let l = 0; l < payload.list.length; l++) {
						let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
							'label': payload.list[l].label,
							'dataId': -1,
							'data': {
								'header': payload.list[l].label,
								'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>' + payload.className + '[' + payload.list[l].index + ']'
							}
						}));
						thumb.buttonGroup.removeClass('btn-block');
						thumb.button.el.onclick = () => {
							this.launchMain(payload.list[l].id, payload.list[l].label);
						};
					}
					if (!this.pagination.buttonGroup.loaded) {
						console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
						this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
						console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
						for (let p = 0; p < this.pageCount; p++) {
							let btn = this.pagination.buttonGroup.addButton(p + 1);
							btn.el.onclick = () => {
								this.loadPage(p);
							};
						}
						this.pagination.buttonGroup.loaded = true;
					}
				}
			});
		}
		/*else {
			let note = new P(this.body.pane, new MODEL(), 'No Containers Exist');
		}*/
	}
	/** Creates a Pagination Footer
	    @returns {FOOTER} A pagination Footer
	*/
	createPaginationFooter() {
		let pagination = new FOOTER(this, new MODEL('pagination'));
		pagination.el.setAttribute('style', 'text-align:center;');
		pagination.btnPrev = new BUTTON(pagination, 'Prev');
		pagination.btnPrev.el.setAttribute('style', 'margin-right:1em;');
		pagination.btnPrev.el.onclick = this.prevPage.bind(this);
		pagination.buttonGroup = new BUTTONGROUP(pagination);
		pagination.buttonGroup.loaded = false;
		pagination.btnNext = new BUTTON(pagination, 'Next');
		pagination.btnNext.el.setAttribute('style', 'margin-left:1em;');
		pagination.btnNext.el.onclick = this.nextPage.bind(this);
		return pagination;
	}
	/** Loads the page
	    @param {number} page Page to load
	    @returns {void}
	*/
	loadPage(page) {
		try {
			this.header.setInnerHTML('Page ' + (page + 1));
			let buttons = this.pagination.buttonGroup.el.children;
			for (let b = 0; b < buttons.length; b++) {
				$(buttons[b]).removeClass('active');
			}
			//console.log('Activating button[' + page + ']');
			$(buttons[page]).addClass('active');
			this.body.pane.empty();
			this.page = page;
			this.construct();
		} catch (e) {
			console.log('Unable to load page.', e);
		}
	}
	/** Loads the next page in sequence
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
	/** Opens the given Main Id in a new window
		@param {number} id Main Container Id
		@param {string} label Main Container Label
	    @returns {void}
	*/
	launchMain(id, label) {
		console.log('Launch Index IFrame Modal');
		this.modal = new MODAL(label);
		this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
			'label': 'iframe',
			'dataId': -1,
			'data': {
				'src': this.getMainContainer().url.origin + '/' + id
			}
		}));
		this.iframe.frame.el.setAttribute('src', this.getMainContainer().url.origin + '/' + id);
		this.modal.show();
	}
	/** Creates the Modal that contains an iFrame with the given page loaded
		@todo Consider paging these results
	    @returns {void}
	*/
	launchModal() {
		console.log('Launch Index IFrame Modal');
		this.modal = new MODAL(this.data.header);
		this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
			'label': 'iframe'
		}));
		this.modal.show();
	}
}