/** @module */
import BUTTONGROUP, { BUTTON, ICONS } from '../../../group/buttongroup/BUTTONGROUP.js';
import CONFIRM, { DIALOGMODEL, PROMPT } from '../../../dialog/confirm/CONFIRM.js';
import CONTAINER, { Activate, Clickable } from '../../CONTAINER.js';
import MENU, { Collapse, Expand, MODEL } from '../../../nav/menu/MENU.js';
import CLASSVIEWER from '../classviewer/CLASSVIEWER.js';
import FOOTER from '../../../footer/FOOTER.js';
import HEADER from '../../../header/HEADER.js';
/** Contains a list of THUMBNAILS for each Container of the specified classType available to this user
    @class
*/
export default class CLASSINDEX extends CONTAINER {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
        @param {string} classType Default class to display
        @param {string} [query] Optional Query String
	*/
    constructor(node, model, classType = model.data.classType || 'MAIN', query = '') {
        //console.log('ClassIndex', classType, model.data.classType, query);
        super(node, 'DIV', model, [classType]);
        this.addClass('index-main');
        this.query = query;
        /** @type {string} The default class to display */
        this.classType = classType;
		/** @type {number} The current page */
		this.page = 0;
		/** @type {number} The number of items per page */
		this.pageLength = 6;
		/** @type {number} The total number of available pages */
		this.pageTotal = 0;
		/** @type {number} The maximum number of pages to cache */
		this.maxNavItems = this.pageLength * 2; // 3 pages worth of NavItems
        this.isLoading = false;

        this.header = new HEADER(this.body, new MODEL().set('innerHTML', model.data.header || classType));
        $(this.header.el).insertBefore(this.body.el);

        this.menu = new MENU(this.body.pane, new MODEL('index-menu').set('label', 'INDEX'));
        this.menu.el.onscroll = () => {
            if (this.menu.el.scrollTop > 10) {
                if (this.menu.el.scrollTop >= this.menu.el.scrollHeight - this.menu.el.offsetHeight) {
                    if (!this.isLoading) {
                        this.isLoading = true;
                        //console.log('Scrolled to bottom. Loading next page if exists');
                        this.nextPage();
                        this.isLoading = false;
                    }
                }
            }
			/*if (this.menu.el.scrollTop === 0 && this.page > 1) {
			    setTimeout(() => {
			        if (this.menu.el.scrollTop === 0) {
			            console.log('Scrolled to top. Loading previous page if exists');
			            this.prevPage();
			        }
			    }, 300);			    
			}*/
        };
        
        this.configureHeader();
        this.header.el.dispatchEvent(new Activate(this.header));

        this.addEvents();

        this.overrideHorizontalSwipe();
		
		this.pagination = this.createPaginationFooter();
		//this.loadPage(this.page);
    }
    /** Override swipe for horizontal menu 
        @returns {void}
    */
    overrideHorizontalSwipe() {
        this.body.pane.stopPropagation = true;
        this.body.pane.swipeLeft = () => console.log(this.toString() + ' Swipe Left');
        this.body.pane.swipeRight = () => console.log(this.toString() + ' Swipe Right');
    }
    /** Adds appropriate Event handlers to Header
        @returns {void}
    */
    configureHeader() {
        this.header.implement(new Clickable(this.header));
        this.header.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.header.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));
        this.addHeaderEvents();
    }
    /** Appends chosen CONTAINER to target after confirmation
        @param {MODEL} model Model
        @returns {void}
    */
    confirmAppend(model) {
        CONFIRM.confirmMethodCall(
            'Append Confirmation',
            'Append ' + this.classType + ': ' + model.label + '(' + model.id + ') to ' + this.getContainer().toString() + '?',
            () => {
                console.log('Confirmed.  Appending...', model, this.getContainer());
                this.getContainer().getFactory().get(this.getContainer().childLocation, this.classType, model.id);
            }
        );
    }
    /** Launches a Class Viewer after confirmation
        @param {MODEL} model Model
        @param {string} [query] Optional Query String
        @returns {void}
    */
    confirmView(model, query = null) {
        CONFIRM.confirmMethodCall(
            'Launch Viewer',
            'Launch viewer for ' + this.classType + ' "' + model.label + '(' + model.id + ')"?',
            () => {
                console.log('Confirmed.  Viewing ' + this.classType + '(' + model.id + ')');
                this.launchClassViewer(model.id, this.classType, query);
            }
        );
    }
	/** Constructs the CLASSINDEX Container
        @returns {void}
    */
    construct() {
        //console.log('ClassIndex construct()', this.classType, this.data.classType, this.query);
        let query = this.query === null ? '' : this.query;
		return new Promise((resolve, reject) => {
			try {
				if (!isNaN(this.page)) {
                    $.post('/' + this.classType + '/search?page=' + this.page + '&pageLength=' + this.pageLength + '&query=' + query, {
                        '__RequestVerificationToken': this.getToken()
                    }, (payload, status) => {
                        if (status === 'success') {
                            this.isLoading = true;
                            this.pageTotal = payload.total;
                            let pageNote = this.page > -1 ? ': Page ' + (this.page + 1) : '';
                            this.menu.addNavSeparator(this.classType + pageNote);
                            payload.list.forEach((model) => this.addContainerThumbnailMethods(model));
                            this.isLoading = false;
                            this.purgeList();
                            if (!this.pagination.buttonGroup.loaded) {
                                this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
                                if (this.pageCount < 1) {
                                    this.pageCount = 1;
                                }
                                for (let p = 0; p < this.pageCount; p++) {
                                    this.pagination.buttonGroup.addButton(p + 1).el.onclick = () => {
                                        this.menu.empty().then(() => this.loadPage(p));
                                        return false;
                                    };
                                }
                                this.pagination.buttonGroup.loaded = true;
                                this.pagination.buttonGroup.children[0].addClass('active');
                            }
                            resolve(this);                            
                        } else {
                            reject(new Error('Failed to retrieve page'));
                        }
                    });
				}
			} catch (e) {
				reject(e);
			}
		});
    }
    /** Creates a Thumbnail representation of a CONTAINER and adds relevant Events 
        @param {MODEL} model model
        @returns {void}
    */
    addContainerThumbnailMethods(model) {
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
	/** Adds Scrolling and MouseEnter/Exit Events for this.body.pane
	    @returns {void}
	*/
	addEvents() {
        //
	}
	/** Creates a Thumbnail that launches its respective MAIN
	    @param {MODEL} model The Thumbnail model
        @param {number} model.id Unique Identifier that this thumbnail represents
        @param {string} model.label The Thumbnail label
	    @param {string} className The className that the thumbnail represents
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail({
        id,
        subsections,
        authorId,
        label,
        description,
        tags
	}, className) {
		return this.menu.addNavThumbnail(new MODEL().set({
            id,
            subsections,
            authorId,
            label,
            description,
            tags
		}), className);
	}
	/** Creates a Pagination Footer
	    @returns {FOOTER} A Footer with a buttongroup for pagination
	*/
	createPaginationFooter() {
		let pagination = new FOOTER(this.body, new MODEL('pagination'));
		pagination.el.setAttribute('style', 'text-align:center;');
        pagination.btnPrev = new BUTTON(pagination, '', ICONS.CHEVRON_LEFT);
        pagination.btnPrev.addClass('prev');
		pagination.btnPrev.el.onclick = this.prevPage.bind(this);
		pagination.buttonGroup = new BUTTONGROUP(pagination);
		pagination.buttonGroup.loaded = false;
        pagination.btnNext = new BUTTON(pagination, '', ICONS.CHEVRON_RIGHT);
        pagination.btnNext.addClass('next');
		pagination.btnNext.el.onclick = this.nextPage.bind(this);
		return pagination;
    }
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER UId
        @param {string} classType CONTAINER class
        @returns {void}
    */
    launchClassViewer(id, classType) {
        if (classType === 'MAIN') {
            CONFIRM.confirmMethodCall(
                'Launch MAIN Viewer',
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
                label: 'ClassViewer: ' + classType + ' # ' + id
                //text: 'Viewing ' + classType + ' (' + id + ')"'
            }), false);
            let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', classType));
            viewer.body.el.dispatchEvent(new Expand(viewer));
            this.getContainer().getFactory().get(viewer.body.pane, classType, id).then(() => dialog.showDialog());
        }
    }
	/** Loads the page
	    @param {number} page Page to load
	    @returns {Promise<ThisType>} Promise Chain
	*/
    loadPage(page = 0) {
        console.log(this.toString() + '.loadPage()', page);
		return this.chain(() => {
			//this.header.setInnerHTML(this.label + ': Page ' + (page + 1));
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
        //console.log('nextpage', this.page + 1, this.pageLength, this.pageTotal, this.page * this.pageLength);
		if (this.pageTotal - this.page * this.pageLength > this.pageLength) {
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
		console.log('prevPage', this.page - 1, this.pageLength);
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

    /** Empties the menu and resets pages
        @returns {Promise<ThisType>} Promise Chain
    */
    refresh() {
        return this.chain(() => {
            this.menu.empty().then(() => {
                this.loadPage();
            });
        });
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