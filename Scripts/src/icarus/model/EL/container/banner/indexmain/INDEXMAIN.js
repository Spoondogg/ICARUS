/** @module */
import BANNER from '../BANNER.js';
import BUTTON from '../../../button/BUTTON.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
import FOOTER from '../../../footer/FOOTER.js';
import HEADER from '../../../header/HEADER.js';
import MENU from '../../../nav/menu/MENU.js';
import MODEL from '../../../../MODEL.js';
/** Contains a list of THUMBNAILS for each MAIN Container available to this user
    @class
    @extends BANNER
*/
export default class INDEXMAIN extends BANNER {
	/** Constructs a banner with a header affixed outside of the Container's pane
        Contents are paged and pagination exists in the footer
        @todo Contents should be grouped in 3's or 4's and cycled through by swiping
        @todo Preload / Stream contents
	    @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('index-main');
		this.page = 0;
		this.pageLength = 6;
		this.pageTotal = 0;
		this.menu = new MENU(this.body.pane, new MODEL().set({ 'label': 'INDEX' }));
		this.header = new HEADER(this, new MODEL());
		$(this.header.el).insertBefore(this.body.pane.el);
		this.pagination = this.createPaginationFooter();
		this.footer = new FOOTER(this, new MODEL());
		$(this.pagination.el).insertAfter(this.body.pane.el);
		this.loadPage(this.page);
	}
	/** Constructs the INDEXMAIN Container
        @returns {void}
    */
	construct() {
		if (!isNaN(this.page)) {
			console.log('Retrieving page ' + this.page);
			$.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
				'__RequestVerificationToken': this.getMainContainer().token
			}, (payload, status) => {
				if (status === 'success') {
					this.pageTotal = payload.total;
					payload.list.forEach((model) => {
                        let thumb = this.createThumbnail(model, payload.className);
                        thumb.el.onclick = () => {
                            this.launchMain(model.id, model.label);
                        };
					});
					if (!this.pagination.buttonGroup.loaded) {
						//console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
						this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
						//console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
                        pageCount.forEach((index) => {
                            let btn = this.pagination.buttonGroup.addButton(index + 1);
                            btn.el.onclick = () => {
                                this.loadPage(index);
                            };
                        });
                        /*
                        for (let p = 0; p < this.pageCount; p++) {
							let btn = this.pagination.buttonGroup.addButton(p + 1);
							btn.el.onclick = () => {
								this.loadPage(p);
							};
						}
                        */
						this.pagination.buttonGroup.loaded = true;
					}
				}
			});
		}
	}
	/** Creates a Thumbnail that launches its respective MAIN
	    @param {any} model The Thumbnail model
	    @param {string} name The name to launch
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail(model) {
        return this.menu.addNavThumbnail(new MODEL().set({
            'label': model.label,
            'dataId': -1,
            'data': {
                'header': model.label,
                'p': 'Launch ' + model.label + ' (' + model.id + ')[' + model.index + ']'
            }
        }));
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
	/** Opens the given Main Container
		@param {number} id Main Container Id
	    @returns {void}
	*/
	launchMain(id) {
		this.getMainContainer().load(id);
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
			$(buttons[page]).addClass('active');
			//this.body.pane.empty();
            this.menu.empty();
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
	/** Loads the previous page
        @returns {void}
    */
	prevPage() {
		if (this.page > 0) {
			this.loadPage(this.page - 1);
		} else {
			console.log('No previous pages to display');
		}
	}
}