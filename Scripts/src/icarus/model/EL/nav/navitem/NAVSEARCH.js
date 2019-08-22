/* eslint-disable max-lines, max-statements */
/** @module */
import BUTTONGROUP, { Activate, BUTTON, Deactivate, ICONS, MODELS } from '../../group/buttongroup/BUTTONGROUP.js';
import EL, { ATTR, ATTRIBUTES, DATA, MODEL } from '../../EL.js';
import MENU, { Collapse, Expand, NAVITEM } from '../menu/MENU.js';
import INPUT from '../../input/INPUT.js';
/** A search input wrapped in a generic HTMLForm
    @class
*/
export default class NAVSEARCH extends NAVITEM {
	/** Construct a NAVSEARCH
	    @param {EL} node Node
        @param {NavItemSearchModel} [model] Model
	*/
	constructor(node, model = MODELS.navitemsearch()) {
        super(node, model);
        this.addClass('nav-item-search');
        /** @type {boolean} Indicates if the user is typing (true) or has stopped for X duration (false) */
        this.isTyping = false;
        // A timer to detect how long the user has stopped typing
        this.typingTimer = null; // timer
        this.doneTypingInterval = 300; //time in ms

        this.query = new INPUT(this, MODELS.input('INPUT', ATTR.input('query', model.data.query, 'TEXT', false, 'Search', 'off')));
        this.query.el.addEventListener('focus', () => this.showSearchOptions());
        //this.input.el.addEventListener('blur', () => this.hideSearchOptions());
        this.searchClass = new INPUT(this, MODELS.input('INPUT', ATTR.input('searchclass', model.data.searchClass, 'HIDDEN')));
        this.searchType = new INPUT(this, MODELS.input('INPUT', ATTR.input('searchtype', model.data.searchType, 'HIDDEN')));
        this.formId = new INPUT(this, MODELS.input('INPUT', ATTR.input('formId', model.data.formId, 'HIDDEN')));

        this.buttonGroup = new BUTTONGROUP(this, MODELS.buttongroup());
        this.btnSearchClass = this.buttonGroup.addSwitch(MODELS.button(ATTR.button('BUTTON', 'CLASS'), DATA.button('', ICONS.CLASS)));
        this.btnSearchType = this.buttonGroup.addSwitch(MODELS.button(ATTR.button('BUTTON', 'TYPE'), DATA.button('', ICONS.STAR)));
        this.btnFormId = this.buttonGroup.addSwitch(MODELS.button(ATTR.button('BUTTON', 'FORMID'), DATA.button('', ICONS.FORM)));
        this.btnOptions = this.buttonGroup.addSwitch(MODELS.button(ATTR.button('BUTTON', 'OPTIONS'), DATA.button('', ICONS.OPTIONS)));
        this.btnSearch = this.buttonGroup.addButton(MODELS.button(ATTR.button('BUTTON', 'SEARCH'), DATA.button('', ICONS.SEARCH)));

        // Make tabs for search params
        this.searchParamsMenu = new MENU(this, MODELS.menu(ATTR.menu('params', 'search-params')));
        this.searchParamsMenu.el.dispatchEvent(new Expand(this));

        let opts = this.searchParamsMenu.addNavBar(MODELS.menu(ATTR.menu('search-params', 'search-param-options')));
        this.btnOptions.el.addEventListener('activate', () => opts.el.dispatchEvent(new Expand(this.btnOptions)));
        this.btnOptions.el.addEventListener('deactivate', () => opts.el.dispatchEvent(new Collapse(this.btnOptions)));

        let classParam = opts.addTabbableMenu('CLASS');
        this.createSearchParams(classParam.element, this.btnSearchClass, this.searchClass,
            [['MAIN'], ['ARTICLE'], ['SECTION'], ['FORM'], ['TABLE'], ['FORMPOST']],
            model.data.searchClass
        );

        let typeParam = opts.addTabbableMenu('TYPE');
        this.createSearchParams(typeParam.element, this.btnSearchType, this.searchType,
            [['TAG'], ['CLASS'], ['TAGID'], ['FORMID']],
            model.data.searchType
        );

        let formIdParam = opts.addTabbableMenu('FORMID');
        this.createSearchParams(formIdParam.element, this.btnFormId, this.formId,
            [['IMAGES', 3], ['TAGS', 10128]],
            model.data.formId
        );
        //formIdParam.element.addNavItemIcon(MODELS.navitem('IMAGES', ICONS.IMAGES).set('data', 3));
        //formIdParam.element.addNavItemIcon(MODELS.navitem('TAGS', ICONS.TAG).set('data', 10128));

        // Deactivate siblings / only single active
        [classParam, typeParam, formIdParam].forEach(
            (menu) => menu.element.get().forEach(
                (item) => item.el.addEventListener('activate', () => menu.element.deactivateSiblings(item))));


        // Add a list of search-options
        this.searchOptions = new MENU(this, MODELS.menu(ATTR.menu('options', 'search-options')));
        //let options = ['A', 'B', 'C'];
        //this.setSearchOptions(options);
        this.addSearchEvents();
    }
    /** Adds appropriate events to search type buttons
        @param {MENU} menu Menu
        @param {BUTTON} button Button
        @returns {void}
    */
    addSearchTypeEvents(menu, button) {
        // Show list of search types as dropdown-menu
        button.el.addEventListener('activate', () => {
            this.searchOptions.empty();
            menu.el.dispatchEvent(new Expand(button));
        });
        button.el.addEventListener('deactivate', () => menu.el.dispatchEvent(new Collapse(button)));
    }
    /* eslint-disable max-lines-per-function */
    addSearchEvents() {
        // Handle 'ENTER' key press
        this.query.el.addEventListener('keypress', (ev) => {
            clearTimeout(this.typingTimer);
            let evt = ev;
            if (!ev) {
                evt = window.event;
            }
            let keyCode = evt.keyCode || evt.which;
            if (keyCode === '13') { // Enter Key
                ev.preventDefault();
                ev.stopPropagation();
                console.log('ENTER was pressed');
                this.btnSearch.el.click();
                return false;
            }
        });

        // Populate options-list
        this.query.el.addEventListener('keyup', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {

                let evt = ev;
                if (!ev) {
                    evt = window.event;
                }
                let keyCode = evt.keyCode || evt.which;

                //console.log('You done typing yet?', keyCode);

                // If we are searching tags, create dropdown and populate                    
                if (this.searchType.el.value === 'TAG') {
                    let { value } = this.query.el;
                    if (value.trim().length > 0) {
                        let tagList = this.getContainer().getContainer().getMain().retrieveCachedTags(value);
                        this.createSearchOptions(tagList);
                    } else {
                        this.hideSearchOptions();
                        setTimeout(() => this.searchOptions.empty(false), 300);
                    }
                }

                if (keyCode === 13) { // Enter Key
                    ev.preventDefault();
                    ev.stopPropagation();
                    //console.log('ENTER was pressed');
                    this.btnSearch.el.click();
                    return false;
                }

            }, this.doneTypingInterval);

        });

        // When search button is clicked... SHOULD BE OVERRIDEN
        this.btnSearch.el.addEventListener('click', (ev) => this.submitSearch(ev, this.getSearchModel(), this.btnSearch));
    }
    /** Constructs and returns a Search MODEL based on
        the current state of this NAVSEARCH
        @returns {SearchModel} A Search MODEL
    */
    getSearchModel() {
        return DATA.search(
            this.searchClass.el.value, this.searchType.el.value,
            this.query.el.value, this.formId.el.value
        );
    }
    /** Launches the appropriate ClassViewer and passes it the querystring
        @param {Event} ev Event
        @param {SearchModel} [search] Search
        @param {EL} [caller] Calling element
        @returns {void}
    */
    submitSearch(ev, search, caller) {
        console.log('ABSTRACT: ' + this.toString() + '.submitSearch', ev, search, caller);
    }
    /** Creates a set of navitem items that represent search types
        The first value is activated by default
        @param {MENU} menu Menu
        @param {BUTTON} button Button
        @param {INPUT} input Input
        @param {Array<[string, number]>} params List of search parameters ie: [['TAGS', 10128], ['IMAGES', 3]]
        @param {string|number} [activeParam] Optional value to activate
        @returns {void}
    */
    createSearchParams(menu, button, input, params, activeParam = '') {
        params.forEach((param) => {
            let [key, value] = param;
            value = typeof value === 'undefined' ? key : value;
            let btn = menu.addNavItem(MODELS.navitem(ATTR.navitem(key), DATA.navitem(key, ICONS[key])));
            btn.el.addEventListener('activate', () => {
                this.setSearchParam(button, [key, value], input);
                menu.deactivateSiblings(btn);
                /**this.searchTypes.get().forEach((b) => {
                    if (b !== btn) {
                        b.el.dispatchEvent(new Deactivate(b));
                    }
                });**/
            });
            if (activeParam === value) {
                btn.el.dispatchEvent(new Activate(this));
            }
        });
        //menu.get()[activeParam].el.dispatchEvent(new Activate(this));
    }
    /** Sets the search type and updates any relevant labels
        @param {BUTTON} button Button
        @param {[string, any]} param Search Type
        @param {INPUT} input Input
        @returns {void}
    */
    setSearchParam(button, param, input) {
        //this.input.el.value = '';
        button.setLabel(param[0], ICONS[param[0]]);
        input.setAttribute('value', param[1]);
        button.el.dispatchEvent(new Deactivate(button));
        this.query.el.focus();
        //this.searchTypes.el.dispatchEvent(new Collapse(this.btnSearchType));
    }
    /** Creates a search option
        @param {string} option Search Option
        @returns {void}
    */
    createSearchOption(option) {
        console.log('NAVSEARCH.createSearchOption()', option);
        if (this.searchOptions.get(option).length === 0 && option !== '') {
            let btn = this.searchOptions.addNavItem(MODELS.navitem(ATTR.navitem(option), DATA.navitem(option, ICONS.BLANK)));
            btn.el.addEventListener('activate', () => {
                //this.searchOptions.deactivateSiblings(btn);
                this.selectSearchOption(option);
                this.btnSearch.el.click();
                btn.el.dispatchEvent(new Deactivate(btn));
            });
        }/* else {
            console.log('Search Option ' + option + ' already exists');
        }*/
    }
    /** Removes existing search options, then populates the list of search options with the given values
        @param {Array<string>} options A list of options
        @returns {void}
    */
    createSearchOptions(options) {
        this.searchOptions.empty(false).then(() => {
            //this.searchOptions.addNavSeparator('Cached');
            options.forEach((op) => this.createSearchOption(op));
            //this.searchOptions.addNavSeparator('Retrieving...');
            //console.log('Promise to retrieve and populate additional values');
            this.getJson('/FORMPOST/Search/?formId=10128&query=tag:' + this.query.el.value, (payload) => {
                //console.log('Retrieved TAGS matching "' + this.input.el.value + '"', payload);
                payload.list.forEach((tag) => {
                    //let result = JSON.parse(tag.jsonResults);
                    //console.log('results; ', result);
                    let [t] = JSON.parse(tag.jsonResults).filter((r) => r.name === 'tag');
                    //if (typeof t !== 'undefined') {
                    this.createSearchOption(t.value);
                    //}                
                });
                this.showSearchOptions();
            });
            // How do you prevent cached tags from not already being retrieved???  
            // Or do you just filter out the duplicates and maybe update the cache each time
            // Basically, no matter what, you're getting duplicate data and that could be costly
            // You almost have to send over a list of already cached values to NOT retrieve
            // At what point does the size of the NOT TO SEND list outweigh the DO SEND list?
            // Am I worrying too much about a few bits of data?

            /*
            options.forEach((op) => {
                let btn = this.searchOptions.addNavItem(new MODEL().set({
                    label: op,
                    icon: ICONS.BLANK,
                    name: op
                }));
                btn.el.addEventListener('activate', () => {
                    this.selectSearchOption(op);
                    btn.el.dispatchEvent(new Deactivate(btn));
                })
            });
            */
        });
    }
    /** Sets the input value to the selected option and hides the options menu
        @param {string} opt Search Option
        @returns {void}
    */
    selectSearchOption(opt) {
        console.log('Selected option: ' + opt);
        this.query.el.value = opt;
        //this.input.setAttribute('value', opt);
        this.hideSearchOptions();
    }
    /** Expands the Search Options Menu
        @returns {void} 
    */
    showSearchOptions() {
        this.searchOptions.el.dispatchEvent(new Expand(this.searchOptions));
    }
    /** Expands the Search Options Menu
        @returns {void} 
    */
    hideSearchOptions() {
        this.searchOptions.el.dispatchEvent(new Collapse(this.searchOptions));
    }
}
export { ATTRIBUTES, BUTTON, DATA, EL, MODEL, NAVITEM }