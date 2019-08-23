/** @module */
import BUTTONGROUP, { BUTTON, ICONS } from '../../../group/buttongroup/BUTTONGROUP.js';
import CONFIRM, { PROMPT } from '../../../dialog/confirm/CONFIRM.js';
import CONTAINER, { ATTR, AbstractMethodError, Activate, Clickable, DATA, Deactivate, MODELS } from '../../CONTAINER.js';
import MENU, { Collapse, Expand, MODEL, NAVSEARCH } from '../../../nav/menu/MENU.js';
import CLASSVIEWER from './classviewer/CLASSVIEWER.js';
//import FOOTER from '../../../footer/FOOTER.js';
import HEADER from '../../../header/HEADER.js';
//import NAVHEADER from '../../../nav/navbar/navheader/NAVHEADER.js';
import PAGINATION from '../../../footer/pagination/PAGINATION.js';
import PAYLOAD from '../../../form/PAYLOAD.js';
/** A Class Index contains a list of THUMBNAILS for each Object (Container,FormPost) of 
    the specified classType param (If available to this user)
    @description A ClassIndex launches a ClassViewer which displays a view of that Class
    @class
*/
export default class CLASSINDEX extends CONTAINER {
	/** Container with a header affixed outside of the its pane
        Contents are paged and pagination exists in the footer
        @param {CONTAINER} node Node
        @param {ClassIndexModel} [model] Model
	*/
    constructor(node, model = MODELS.classIndex()) {
        //console.log('CLASSINDEX', options);
        super(node, 'DIV', model, [model.data.searchClass]);
        this.addClass('classindex');
        this.classType = model.data.searchClass;
        /** @todo Consider creating a PAGEABLE interface */
		/** @type {number} The current page */
		this.page = 0;
		/** @type {number} The number of items per page */
		this.pageLength = 6;
		/** @type {number} The total number of available pages */
		this.pageTotal = 0;
		/** @type {number} The maximum number of pages to cache */
        this.maxNavItems = this.pageLength * 2; // 3 pages worth of NavItems
        /** @type {boolean} Indicates a LOADING state
            @todo This should be an interface
        */
        this.isLoading = false;

        /** The ClassIndex Menu contains the results of the search */
        this.menu = new MENU(this.body.pane, MODELS.menu(ATTR.menu('INDEX', 'index-menu')));
        //this.createPagedMenu(0);
        this.createHeader(model);
        this.addMenuScrollEvents();        
        this.configureHeader();
        this.addEvents();
        this.overrideHorizontalSwipe();	
        this.createPaginationFooter();
    }
    /** Creates a header with basic tabbable functionality, bound to this.menu
        @param {ClassIndexModel} model Model
        @returns {void}
    */
    createHeader(model) {
        this.header = new HEADER(this.body, new MODEL('classindex-header'));
        $(this.header.el).insertBefore(this.body.el);
        this.headerTab = new BUTTON(this.header, MODELS.button(ATTR.button(), DATA.button(model.data.header || model.data.searchClass, ICONS.BLANK)));
        this.headerTab.addClass('headerTab');
        this.headerTab.implement(new Clickable(this.headerTab));
        this.headerTab.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.body)));
        this.headerTab.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.body)));

        if (parseInt(this.data.collapsed) === 1) {
            this.headerTab.el.dispatchEvent(new Deactivate(this.headerTab));
        } else {
            this.headerTab.el.dispatchEvent(new Activate(this.headerTab));
        }

        this.searchMenu = new MENU(this.body, MODELS.menu(ATTR.menu('searchmenu', 'search-menu')));
        $(this.searchMenu.el).insertBefore(this.body.el);
        this.navSearch = this.searchMenu.addNavSearch(model);
        //this.navSearch.query.setAttribute('value', model.data.query);
        this.navSearch.btnSearch.el.addEventListener('click',
            () => this.menu.empty(false).then(
                () => this.callSearch(this.navSearch.getSearchModel())
            )
        );
    }
    /** Calls the search using the current params and populates the results menu
        @param {SearchModel} [search] Search
        @returns {void}
    */
    callSearch(search) {
        console.log(this.toString() + '.callSearch()', search);
        this.append('data', search);
        //this.data.searchClass = search.searchClass;
        //this.data.searchType = search.searchType;
        //this.data.query = search.query;
        //this.data.formId = search.formId;
        this.page = 0;
        this.pageCount = 0;
        this.pageTotal = 0;
        //this.menu.empty().then(() => this.constructSearchResults(type, query));
        this.constructSearchResults(search);
        //this.construct();
    }
    /** Adds scroll events to this menu
        @returns {void}
    */
    addMenuScrollEvents() {
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
        this.buttonGroup = new BUTTONGROUP(this.header);
        //let searchToggle = this.buttonGroup.addToggleButton('', ICONS.SEARCH);

        this.btnPageTotal = this.buttonGroup.addSwitch(MODELS.button(ATTR.button(), DATA.button(this.pageTotal, ICONS.TAGS)));
        this.btnPageTotal.addClass('page-total');
        this.btnPageTotal.el.addEventListener('activate', (ev) => {
            console.log('TODO: Not sure if this should trigger anything or not');
            ev.stopPropagation();
        });

        this.btnSearch = this.buttonGroup.addSwitch(MODELS.button(ATTR.button(), DATA.button('', ICONS.SEARCH)));
        this.btnSearch.el.addEventListener('activate', (ev) => {
            ev.stopPropagation();
            this.searchMenu.el.dispatchEvent(new Expand(this.btnSearch));
        });
        this.btnSearch.el.addEventListener('deactivate', (ev) => {
            ev.stopPropagation();
            this.searchMenu.el.dispatchEvent(new Collapse(this.btnSearch));
        });
        //this.menu.el.dispatchEvent(new Expand(this.menu));
        this.body.el.dispatchEvent(new Expand(this.body));

        /*this.header.implement(new Clickable(this.header));
        this.header.el.addEventListener('select', () => this.getFactory().editProperty('header', 'data', this, this));
        this.header.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.header.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));
        */
        this.addHeaderEvents();
        if (parseInt(this.data.collapsed) === 1) {
            this.header.el.dispatchEvent(new Deactivate(this.header));
        } else {
            this.header.el.dispatchEvent(new Activate(this.header));
        }
    }
    /** Launches a Class Viewer after confirmation
        @param {ClassModel} model Model
        @param {string} [query] Optional Query String
        @returns {void}
    */
    confirmView(model, query = null) {
        CONFIRM.confirmMethodCall(
            'Launch Viewer',
            'Launch viewer for ' + this.classType + ' # ' + model.id + '"?',
            () => {
                console.log('Confirmed.  Viewing ' + this.classType + '(' + model.id + ')');
                this.launchViewer(model.id, this.classType, query);
            }
        );
    }
    /** An abstract/default search that promises to return a payload and status
        @param {SearchModel} [search] Search
        @returns {Promise<object, string>} Promise to return payload, status
    */
    search(search) {
        throw new AbstractMethodError(this.toString() + '.search() not set', this, search);
    }
	/** Constructs the CLASSINDEX Container
        @param {ClassIndexModel} model Model
        @returns {Promise<ThisType>} Promise to resolve ClassIndex
    */
    construct(model) {
        //if (typeof this.data.className !== 'undefined') {
        //let query = this.data.query === null ? '' : this.data.query;
        //this.menu.empty().then(() => this.constructSearchResults(this.searchType, query));
        //console.log(this.toString() + '.construct()', model);
        this.constructSearchResults(model.data)
        //}
    }
    /** Constructs a list of search results based on the given query
        @param {SearchModel} [search] Search
        @returns {Promise<ThisType>} Promise to resolve ClassIndex
    */
    constructSearchResults(search = DATA.search(this.classType, 'CLASS')) {
        //console.log(this.toString() + '.constructSearchResults', search, this.page);
        return new Promise((resolve, reject) => {
            try {
                if (isNaN(this.page)) {
                    console.log('Something aint right with this.page', this);
                } else {
                    this.search(search).then((payload, status) => {
                        //console.log('Search Results', search, payload, status); //this.menu.get()
                        if (status === 'success') {
                            this.constructPage(payload);
                            resolve(this);
                        } else {
                            reject(new Error('Failed to retrieve page', search));
                        }
                    });
                }
            } catch (e) {
                console.warn('ERROR!!!', e);
                reject(e);
            }
        });
    }
    /** Constructs a page of results
        @param {PAYLOAD} payload Payload
        @returns {void}
    */
    constructPage(payload) {
        //console.log('Constructing a page of results', payload);
        this.isLoading = true;
        this.pageTotal = payload.total;
        this.btnPageTotal.setLabel(payload.total);
        let pageNote = this.page > -1 ? ': Page ' + (this.page + 1) : '';
        let page = this.createPagedMenu(this.page);
        page.addNavSeparator(this.classType + pageNote);
        payload.list.forEach((model) => this.addThumbnailMethods(model, this.page));
        this.isLoading = false;
        this.purgeList();
        if (!this.pagination.buttonGroup.loaded) {
            this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
            if (this.pageCount < 1) {
                this.pageCount = 1;
            }
            for (let p = 0; p < this.pageCount; p++) {
                this.pagination.buttonGroup.addButton(MODELS.button(ATTR.button(), DATA.button(p + 1))).el.onclick = () => {
                    //this.menu.empty().then(() => this.loadPage(p));
                    this.loadPage(p);
                    return false;
                };
            }
            this.pagination.buttonGroup.loaded = true;
            //if (this.pageCount > 0) {
            //    this.pagination.buttonGroup.children[0].addClass('active');
            //}
        }
        page.el.dispatchEvent(new Expand(page));
    }
    /** Creates a menu representing a page
        @param {number} pageNumber Page number
        @returns {MENU} Paged menu
    */
    createPagedMenu(pageNumber) {
        return this.menu.addMenu(MODELS.menu(ATTR.menu(pageNumber, 'page')));
    }
    /** Creates a Thumbnail representation of a Class and adds relevant Events 
        @param {ClassModel} model model
        @param {number} [pageNumber] Page to load results into
        @returns {void}
    */
    addThumbnailMethods(model, pageNumber = 0) {
        throw new AbstractMethodError(this.toString() + '.search() not set', this, model, pageNumber);
    }
	/** Adds Scrolling and MouseEnter/Exit Events for this.body.pane
	    @returns {void}
	*/
	addEvents() {
        //
	}
	/** Creates a Thumbnail that launches its respective Container
	    @param {ClassModel} model Model
	    @param {string} className The className that the thumbnail represents
	    @returns {NAVTHUMBNAIL} A thumbnail
	*/
    createThumbnail(model, className) {
        throw new AbstractMethodError(this.toString() + '.createThumbnail() not set', this, className, model);
	}
	/** Creates a Pagination Footer
	    @returns {FOOTER} A Footer with a buttongroup for pagination
	*/
    createPaginationFooter() {
        this.pagination = new PAGINATION(this.body);
        this.pagination.nextPage = () => this.nextPage();
        this.pagination.prevPage = () => this.prevPage();//this.createPaginationFooter();
    }
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER UId
        @param {string} classType CONTAINER class
        @returns {void}
    */
    launchViewer(id, classType) {
        throw new AbstractMethodError(this.toString() + '.launchClassViewer() not set', this, id, classType);
    }
	/** Loads the page
	    @param {number} page Page to load
	    @returns {Promise<ThisType>} Promise Chain
	*/
    loadPage(page = 0) {
        console.info(this.toString() + '.loadPage()', page);
		return this.chain(() => {
			//this.header.setInnerHTML(this.label + ': Page ' + (page + 1));
			let buttons = this.pagination.buttonGroup.el.children;
			for (let b = 0; b < buttons.length; b++) {
				$(buttons[b]).removeClass('active');
			}
			$(buttons[page]).addClass('active');
			this.page = page;
			this.construct(this);
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
            this.menu.empty(false).then(() => {
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
export { ATTR, CLASSVIEWER, CONFIRM, Collapse, DATA, Expand, ICONS, MODEL, MODELS, NAVSEARCH, PAYLOAD, PROMPT }