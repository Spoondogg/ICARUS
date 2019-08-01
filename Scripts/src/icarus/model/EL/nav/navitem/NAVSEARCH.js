/* eslint-disable max-lines, max-statements */
/** @module */
import BUTTONGROUP, { Activate, BUTTON, Deactivate, ICONS, MODELS } from '../../group/buttongroup/BUTTONGROUP.js';
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
import MENU, { Collapse, Expand, NAVITEM } from '../menu/MENU.js';
import INPUT from '../../input/INPUT.js';
//import Tabbable from '../../../../interface/Tabbable.js';
/** A search input wrapped in a generic HTMLForm
    @class
    @extends NAVITEM
*/
export default class NAVSEARCH extends NAVITEM {
	/** Construct a NAVSEARCH
	    @param {EL} node Node
        @param {NavItemModel} [model] Model
	*/
	constructor(node, model) {
        super(node, model);
        this.addClass('nav-item-search');
        /** @type {boolean} Indicates if the user is typing (true) or has stopped for X duration (false) */
        this.isTyping = false;
        // A timer to detect how long the user has stopped typing
        this.typingTimer = null; // timer
        this.doneTypingInterval = 300; //time in ms

        this.input = new INPUT(this, MODELS.input(new MODEL(), {
            type: 'text',
            placeholder: 'Search',
            name: 'q',
            autocomplete: 'off'
        }));
        this.input.el.addEventListener('focus', () => this.showSearchOptions());
        //this.input.el.addEventListener('blur', () => this.hideSearchOptions());
        this.searchType = new INPUT(this, MODELS.input(new MODEL(), {
            type: 'hidden',
            name: 'type',
            value: 'CLASS'
        }));

        this.buttonGroup = new BUTTONGROUP(this, MODELS.buttongroup(null, null, new MODEL('input-buttons')));
        this.btnSearchType = this.buttonGroup.addSwitch(MODELS.button('CLASS', ICONS.CLASSVIEWER).set('name', 'TYPE'));
        this.btnSearch = this.buttonGroup.addButton(MODELS.button('', ICONS.SEARCH).set('name', 'SEARCH'));

        // Add a list of searchtypes
        this.searchTypes = new MENU(this, MODELS.menu('types', new ATTRIBUTES('search-types')));
        this.createSearchTypes(['TAG', 'CLASS', 'TAGID']);

        /*let tab = this.searchTypes.addNavItem(new MODEL('tab-woot').set('label', 'tab-woot'));
        let menu = this.searchTypes.addMenu(new MODEL('tabbable-menu-woot'));
        menu.addNavItem(new MODEL().set('label', 'ONE'));
        menu.addNavItem(new MODEL().set('label', 'TWO'));
        //menu.addNavItem(new MODEL().set('label', 'THREE'));
        tab.addTabbableElement(menu);*/
        this.addSearchTypeEvents();

        // Add a list of search-options
        this.searchOptions = new MENU(this, MODELS.menu('options', new ATTRIBUTES('search-options')));
        //let options = ['A', 'B', 'C'];
        //this.setSearchOptions(options);
        this.addSearchEvents();
    }

    addSearchTypeEvents() {
        // Show list of search types as dropdown-menu
        this.btnSearchType.el.addEventListener('activate', () => {
            this.searchOptions.empty();
            this.searchTypes.el.dispatchEvent(new Expand(this.btnSearchType));
        });
        this.btnSearchType.el.addEventListener('deactivate',
            () => this.searchTypes.el.dispatchEvent(new Collapse(this.btnSearchType)));
    }
    /* eslint-disable max-lines-per-function */
    addSearchEvents() {
        // Handle 'ENTER' key press
        this.input.el.addEventListener('keypress', (ev) => {
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
                //this.submitSearch(evt, navsearch.input.el.value.toString(), navsearch.button, this.className, navsearch.searchType.el.value)
                return false;
            }
        });

        // Populate options-list
        this.input.el.addEventListener('keyup', (ev) => {
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
                    let { value } = this.input.el;
                    if (value.trim().length > 0) {
                        //let tagList = this.getContainer().getMain().retrieveCachedTags(value);
                        let tagList = this.getContainer().getContainer().getMain().retrieveCachedTags(value);
                        //console.log('TODO Populate datalist Search: "' + value.toString() + '"', tagList);
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
                    //this.submitSearch(evt, navsearch.input.el.value.toString(), navsearch.button, this.className, navsearch.searchType.el.value)
                    return false;
                }

            }, this.doneTypingInterval);

        });

        // When search button is clicked... SHOULD BE OVERRIDEN
        this.btnSearch.el.addEventListener('click', (ev) => this.submitSearch(
            ev,
            this.input.el.value.toString(),
            this.btnSearch,
            this.className,
            this.searchType.el.value
        ));
    }
    /** Launches the appropriate ClassViewer and passes it the querystring
        @returns {void}
    */
    submitSearch() {
        console.log('ABSTRACT: ' + this.toString() + '.submitSearch');
    }
    /** Creates a set of navitem items that represent search types
        The first value is activated by default
        @param {Array<string>} types List of search types
        @param {number} [activateIndex] Optional indexed value to activate
        @returns {void}
    */
    createSearchTypes(types, activateIndex = 0) {
        types.forEach((type) => {
            let btn = this.searchTypes.addNavItem(MODELS.navitem(type, ICONS[type], {
                type
            }));
            btn.el.addEventListener('activate', () => {
                this.setSearchType(type);
                this.searchTypes.deactivateSiblings(btn);
                /**this.searchTypes.get().forEach((b) => {
                    if (b !== btn) {
                        b.el.dispatchEvent(new Deactivate(b));
                    }
                });**/
            });
        });
        this.searchTypes.get()[activateIndex].el.dispatchEvent(new Activate(this));
    }
    /** Sets the search type and updates any relevant labels
        @param {string} type Search Type
        @returns {void}
    */
    setSearchType(type) {
        this.input.el.value = ''
        this.btnSearchType.setLabel(type, ICONS[type]);
        this.searchType.setAttribute('value', type);
        this.btnSearchType.el.dispatchEvent(new Deactivate(this.btnSearchType));
        this.input.el.focus();
        //this.searchTypes.el.dispatchEvent(new Collapse(this.btnSearchType));
    }
    /** Creates a search option
        @param {string} option Search Option
        @returns {void}
    */
    createSearchOption(option) {
        if (this.searchOptions.get(option).length === 0 && option !== '') {
            let btn = this.searchOptions.addNavItem(new MODEL().set({
                label: option,
                icon: ICONS.BLANK,
                name: option
            }));
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
            this.getJson('/FORMPOST/Search/?formId=10128&query=tag:' + this.input.el.value, (payload) => {
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
        this.input.el.value = opt;
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
export { ATTRIBUTES, BUTTON, EL, MODEL, NAVITEM }