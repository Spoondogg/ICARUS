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
    @description This thing needs a lot of work...  Its ugly and outdated.
*/
export default class INDEXMAIN extends BANNER {
	/** Constructs a banner with a header affixed outside of the Container's pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
	    @param {MODEL} model INDEX model
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('index-main');
		/** @param {number} page The current page */
		this.page = 0;
		/** @param {number} pageLength The number of items per page */
		this.pageLength = 6;
		/** @param {number} pageTotal The total number of available pages */
		this.pageTotal = 0;
		/** @param {number} maxNavItems The maximum number of pages to cache */
		this.maxNavItems = this.pageLength * 2; // 3 pages worth of NavItems
		this.isLoading = false;
		this.menu = new MENU(this.body.pane, new MODEL().set('label', 'INDEX'));
		this.addEvents();
		this.header = new HEADER(this, new MODEL());
		$(this.header.el).insertBefore(this.body.pane.el);
		this.pagination = this.createPaginationFooter();
		this.footer = new FOOTER(this, new MODEL());
		$(this.pagination.el).insertAfter(this.body.pane.el);
		this.loadPage(this.page);
	}
	/** Constructs the INDEXMAIN Container
        @todo This should be able to create PageIndexes for ALL Container types, not just MAIN
        @returns {void}
    */
	construct() {
		return new Promise((resolve, reject) => {
			try {
				if (!isNaN(this.page)) {
					this.getLoader().log(10, 'Retrieving page ' + this.page).then((loader) => {
						$.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
							'__RequestVerificationToken': this.getMain().token
						}, (payload, status) => {
							if (status === 'success') {
								loader.log(50).then(() => {
									this.isLoading = true;
									this.pageTotal = payload.total;
									payload.list.forEach((model) => {
										this.createThumbnail(model, payload.className).el.onclick = () => this.launchMain(model.id, model.label);
									});
									this.isLoading = false;
									this.purgeList();
									if (!this.pagination.buttonGroup.loaded) {
										this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
										for (let p = 0; p < this.pageCount; p++) {
											this.pagination.buttonGroup.addButton(p + 1).el.onclick = () => {
												this.menu.empty().then(() => this.loadPage(p));
												return false;
											};
										}
										this.pagination.buttonGroup.loaded = true;
										this.pagination.buttonGroup.children[0].addClass('active');
									}
									loader.log(100).then(() => resolve(this));
								});
							} else {
								loader.log(0, status).then(() => reject(new Error('Failed to retrieve page')));
							}
						});
					});
				}
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Adds Scrolling and MouseEnter/Exit Events for this.body.pane
	    @returns {void}
	*/
	addEvents() {
		this.body.pane.el.onscroll = () => {
			if (this.body.pane.el.scrollTop > 10) {
				if (this.body.pane.el.scrollTop >= this.body.pane.el.scrollHeight - this.body.pane.el.offsetHeight) {
					if (!this.isLoading) {
						this.isLoading = true;
						//console.log('Scrolled to bottom. Loading next page if exists');
						this.nextPage();
						this.isLoading = false;
					}
				}
			}
			/*if (this.body.pane.el.scrollTop === 0 && this.page > 1) {
			    setTimeout(() => {
			        if (this.body.pane.el.scrollTop === 0) {
			            console.log('Scrolled to top. Loading previous page if exists');
			            this.prevPage();
			        }
			    }, 300);
			    
			}*/
		};
		this.body.pane.el.onmouseenter = () => {
			console.log('Moused over body.pane');
			this.body.pane.addClass('showNav');
		};
		this.body.pane.el.onmouseleave = () => {
			console.log('Moused out of body.pane');
			this.body.pane.removeClass('showNav');
		};
	}
	/** Creates a Thumbnail that launches its respective MAIN
	    @param {MODEL} model The Thumbnail model
        @param {string} model.label The Thumbnail label
        @param {string} model.description A brief description that can be truncated
	    @param {string} name The name to launch
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
	createThumbnail({
		label,
		description
	}) {
		return this.menu.addNavThumbnail(new MODEL().set({
			label,
			description
		}));
	}
	/** Creates a Pagination Footer
	    @returns {FOOTER} A Footer with a buttongroup for pagination
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
		this.getMain().load(id);
	}
	/** Loads the page
	    @param {number} page Page to load
	    @returns {Promise<this>} callback
	*/
	loadPage(page) {
		return this.callback(() => {
			this.header.setInnerHTML('Page ' + (page + 1));
			let buttons = this.pagination.buttonGroup.el.children;
			for (let b = 0; b < buttons.length; b++) {
				$(buttons[b]).removeClass('active');
			}
			$(buttons[page]).addClass('active');
			this.page = page;
			this.construct();
		});
	}
	/** Loads the next page in sequence
	    @returns {void}
	*/
	nextPage() {
		//console.log('nextpage', this.page + 1, this.pageLength);
		if (this.pageTotal > this.page * this.pageLength + 1) {
			this.loadPage(this.page + 1);
			this.scrollToActiveButton();
		} else {
			console.log('No next pages to display');
		}
	}
	/** Loads the previous page
        @returns {void}
    */
	prevPage() {
		//console.log('prevPage', this.page - 1, this.pageLength);
		this.isLoading = true;
		if (this.page > 0) {
			this.loadPage(this.page - 1);
			this.scrollToActiveButton();
		} else {
			console.log('No previous pages to display');
		}
		this.isLoading = false;
	}
	/** Purges NavItems from the MENU when they exceed @see {maxNavItems}
	    @returns {void}
	*/
	purgeList() {
		if (this.isLoading) {
			setTimeout(() => {
				console.log('Delay purge');
			}, 1000);
		} else {
			this.isLoading = true;
            while (this.menu.children.length > this.maxNavItems) {
                this.menu.children.shift().destroy();
			}
			this.isLoading = false;
		}
	}
	/** Scrolls the Pagination Buttongroup to the active button
	    @returns {void}
	*/
	scrollToActiveButton() {
		try {
			$(this.pagination.buttonGroup.el).animate({
				scrollLeft: $(this.pagination.buttonGroup.children[this.page].el).position().left
			}, 200);
		} catch (e) {
			if (!(e instanceof TypeError)) {
				throw e;
			}
		}
	}
}