/** @module */
import CONTAINER, { ATTR, DATA, Deactivate, MODELS } from './container/CONTAINER.js';
import SPAN, { ATTRIBUTES, EL, MODEL } from './span/SPAN.js';
import { ICONS } from '../../enums/ICONS.js';
import PAYLOAD from './form/PAYLOAD.js';
import PROMPT from './dialog/prompt/PROMPT.js';
import SEARCH from './dialog/prompt/SEARCH/SEARCH.js';
/** Abstract Factory that constructs Element Classes
    @description Each child must be imported individually to avoid cyclic redundancy of dependencies
    @class
*/
export default class FACTORY {
    /** Constructs a generic FACTORY
        @param {string} type Identifies what Class(es) the factory will construct
    */
    constructor(type = '') {
        this.type = type;
        try {
            /* eslint-disable no-undef */ // 'showdown' is embedded into vendor.js
            this.markdownConverter = new showdown.Converter({
                smoothLivePreview: true,
                strikethrough: true,
                tasklists: true
            });
            this.markdownConverter.setFlavor('github');
            /* eslint-enable no-undef */
        } catch (e) {
            console.warn('Failed to bind markdown converted');
            throw e;
        }
        /** A Collection of FACTORY Classes available to this FACTORY
            @type {Map<string, FACTORY>} A collection of factories
        */
        this.factories = new Map();
    }
    /** Returns a friendly identifier for this FACTORY
        @returns {string} A Factory Type Identifier
    */
    toString() {
        return this.type + 'FACTORY';
    }
    /** Launches a login prompt when an Authentication Exception occurs
        @param {EL} node Node
        @returns {void}
    */
    authenticationException(node) {
        try {
            console.log(this.toString() + ' An Authentication Exception occurred');
            node.getContainer().getMain().login();
        } catch (e) {
            console.warn(this.toString() + ' Unable to launch login', e);
        }
    }
    /** Constructs the appropriate element
        @param {string} className Container Constructor Name
        @param {SPAN} span Placeholder
        @param {MODEL} model Model
        @returns {CONTAINER} Newly constructed CONTAINER Class
    */
    build(className, span, model) {
        /** @type {EL} */
        let element = null;
        switch (className) {
            case 'EL':
                element = new EL(span, model.element, model);
                break;
            default:
                throw Error('No constructor exists for {' + className + '}');
        }
        return element;
    }
    /** Injects dependencies into the given Element/Class
        @description This is done to avoid cyclic redundancy on imports (ie: FORM inside CONTAINER),
        CRUD actions are injected into the Class from its FACTORY
        @param {EL} node Parent node (Generally append to node.body.pane)
        @param {SPAN} span Parent Node temporary element
        @param {number} index Slot reserved in children array
        @param {EL} element Element/Class
        @returns {void}
    */
    injectDependencies(node, span, index, element) {
        try {
            element.setFactory(this);
            // Overwrite span with 
            span.el.parentNode.replaceChild(element.el, span.el);
        } catch (e) {
            span.destroy();
            node.children.splice(index, 1);
            console.log(e);
        }
    }
	/* eslint-disable max-lines-per-function, complexity, max-statements */
	/** Retrieves MODEL (in the form of a PAYLOAD) from the database and returns its constructed class
	    A placeholder object is created to ensure that values are loaded
	    in the appropriate order, regardless of any delays from getJson()
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
	    @returns {Promise<EL>} A newly constructed element
	*/
	get(node, className, id = 0) {
		let span = new SPAN(node);
        let index = node.children.push(span); // Reserve the slot in the array  
        return span.getPayload(id, className).then((payload) => {
            /** @type {EL} */
            let element = null;
            if (payload.className === 'ERROR') {
				if (payload.exception === 'AuthenticationException') {
                    this.authenticationException(node);
				} else {
                    console.warn(this.toString() + ' An Error Occurred', className + '/GET/' + id, payload);
				}
            } else {
                element = this.build(className, span, payload.model);
                node.children[index] = element;
                element.setFactory(this);
                this.injectDependencies(node, span, index, element);
                //span.el.parentNode.replaceChild(element.el, span.el);				
            }
            try {
                if (id === 0) {
                    console.log('SAVE', node);
                    let container = node.getContainer();
                    this.save(true, container, container);
                }
            } catch (e) {
                console.warn('Attempted SAVE failed', node, e);
            }

            return node.children[index];

		});
    }
    /** Launches a FORMPOST editor for the specified element
        @todo Some map/reduce magic and this can turn into a proper collection for data, attr, meta
        
	    @param {string} [name] The name of the input we are editing
        @param {string} [type] The Type of data (data, meta, attr) we are editing
        @param {CONTAINER} [container] Container that this property is being edited by
        @param {EL} [caller] Caller
	    @returns {Promise<PROMPT>} Save PROMPT
	*/
    editProperty(name = '', type = 'data', container = this, caller = this) {
        //console.log(this.toString() + '.editProperty()', name, type);
        return new Promise((resolve, reject) => {
            try {
                let typeIdStr = type + 'Id';
                if (container[typeIdStr] > 0) {
                    new PROMPT(MODELS.dialog(
                        'Edit ' + container.toString() + '[' + type + '].' + name, '', true,
                        container, caller, container.getLoader()
                    )).createForm(new MODEL().set({
                        formtype: 'FORMPOST',
                        className: container.className,
                        type,
                        id: container[typeIdStr],
                        container
                    })).then((form) => {
                        //console.log('EDITFORM', form.get()[0].get());
                        /*
                            FORMPOSTINPUTS do not correctly push INPUTS into
                            this.body.pane.children but instead just INPUT.children

                            In the future, look to merge this approach with standard
                            FORM creation

                            ---

                            Wrapping form.hideElements() in a chain to allow it as an
                            optional sub function
                        */
                        form.chain(() => {
                            if (name !== '') {
                                //console.log('hiding elements');
                                form.hideElements(form.get()[0].get()[0].get(), name);
                            }
                        }).then(() => {
                            /* @todo This should trigger on a 'close' event */
                            form.getDialog().close = () => form.getDialog().hide().then(() => {
                                //console.log('form,dialog', form, form.getDialog());
                                form.getDialog().deselectAll();
                            });
                            if (name !== '') {
                                let input = form.el.elements[name];
                                try {                                    
                                    input.focus();
                                } catch (ee) {
                                    console.warn('Error focusing element "' + name + '"', form.el.elements);
                                }

                                try {
                                    input.onkeyup = () => {
                                        let output = input.value;
                                        if (input.name === 'p') {
                                            output = this.markdownConverter.makeHtml(input.value);
                                        }
                                        container[name].setInnerHTML(output);
                                    }
                                } catch (eee) {
                                    console.warn('Error updating contents of editable element');
                                }
                            }
                            resolve(form.getDialog().show());
                        });
                    });
                } else {
                    console.warn(container.toString() + '.elements[' + type + '].' + name + ' does not have a ' + type + ' FORMPOST');
                    resolve(false);
                }
            } catch (e) {
                console.warn('Unable to edit', e);
                reject(e);
            }
        });
    }
    /** If data collection exists, (ie: data, attributes, meta)
        extract the appropriate values and save
	    @param {string} type Data type (dataId, attributesId, metaId)
        @param {CONTAINER} [container] Container that this property is being edited by
        @param {EL} [caller] Caller
	    @returns {Promise<LOADER>} Promise to return loader
	*/
    quickSaveFormPost(type, container, caller) {
        console.log(container.toString() + '.quickSaveFormPost(' + type + ')');
        return new Promise((resolve, reject) => {
            container.getLoader().log(30, 'Saving {' + container.className + '}[' + type + ']').then((loader) => {
                try {
                    if (container[type] > 0) { // ie: container['dataId']
                        new PROMPT(new MODEL().set({
                            container,
                            caller
                        })).createForm(new MODEL().set({
                            formtype: 'FORMPOST',
                            className: container.className,
                            type,
                            formPostId: container.id,
                            container
                        })).then((form) => form.post().then(() => loader.log(100).then(() => resolve(form.getDialog().close()))));
                    } else {
                        resolve(loader.log(100));
                    }
                } catch (e) {
                    console.error(container.toString() + '.quickSaveFormPost(' + type + ')', e);
                    reject(e);
                }
            });
        });
    }
    /** Launches a viewer in a dialog for the given class type 
        @param {string} classType Default class to display
        @param {CONTAINER} container Calling container
        @param {EL} caller Calling element (ie: switchable element resolved)
        @param {string} [query] Optional Query String
        @returns {Promise<PROMPT>} Prompt configured to view given classType
    */
    launchViewer(classType = 'MAIN', container = this, caller = this, query = null) {
        console.warn('FACTORY does not have a valid viewer at this time', classType, container, caller, query);
        return Promise.resolve(false);
    }
    /** Saves the state of the CONTAINER
        @param {boolean} [noPrompt] If false (default), no dialog is displayed and the form is automatically submitted after population
        @param {CONTAINER} [container] Container to save (Default this)
        @param {EL} [caller] Element that called the save (ie: switchable element resolved)
        @param {string} [name] optional named element to focus in PROMPT.form
	    @returns {Promise<PROMPT>} Promise to Save (or prompt the user to save) 
	*/
    save(noPrompt = false, container = this, caller = this, name = null) {
        console.log(caller.toString() + ' is attempting to SAVE ' + container.toString(), name);
        return new Promise((resolve) => {
            console.log(this, caller, container, container.getMain());
            caller.getMain().getLoader().log(25).then((loader) => {
                let prompt = new PROMPT(new MODEL().set({
                    label: 'Save ' + container.toString() + ': ' + container.label,
                    container,
                    caller
                }));
                prompt.createForm(new MODEL().set({
                    formtype: 'CONTAINER',
                    container
                })).then((form) => {
                    prompt.form = form;
                    if (name !== null) {
                        form.hideElements(form.get()[0].get()[0].get(), name);
                    }
                    let cont = form.getContainer();
                    cont.navheader.menus.get(null, 'MENU').forEach((menu) => menu.el.dispatchEvent(new Deactivate(container)));
                    form.afterSuccessfulPost = () => {
                        cont.setLabel(form.el.elements.label.value);
                        // @todo This is ugly
                        let factory = cont.getFactory();
                        factory.quickSaveFormPost('data', cont, cont).then(
                            () => factory.quickSaveFormPost('attributes', cont, cont).then(
                                () => factory.quickSaveFormPost('meta', cont, cont).then(
                                    () => form.getDialog().close())));
                    }
                    loader.log(100).then(() => {
                        if (noPrompt) {
                            form.post().then(() => form.getDialog().close().then((dialog) => resolve(dialog)));
                        } else {
                            resolve(form.getDialog().show());
                        }
                    });
                });
            });
        });
    }
    /** Performs the SEARCH Query and populates results
        @param {string} queryString Query String
        @param {CONTAINER} container Container to search (Default this)
        @param {SEARCH} prompt A SEARCH Prompt
        @param {number} [minLength] Minimum search string length
        @returns {void}
    */
    submitSearch(queryString, container, prompt, minLength = 2) {
        prompt.results.empty();
        let results = null;
        switch (queryString) {
            case '*':
                results = container.get();
                break;
            default:
                if (queryString.length + 1 > minLength) {
                    console.log('Searching ' + container.toString() + ' for "' + queryString + '"');
                    results = container.query(queryString);
                } else {
                    console.warn('Invalid query "' + queryString + '". Search be at least ' + minLength + ' characters long', queryString.length);
                    results = [];
                }
        }        
        results.forEach((r) => {
            let thumb = prompt.results.addNavThumbnail(new MODEL().set({
                id: r.id,
                label: r.toString() + ': ' + r.label,
                //icon: ICONS[r.className],
                name: r.toString()
            }), [r.className]);
            let btnView = thumb.menu.addNavItemIcon(MODELS.navitem(ATTR.navitem('VIEW'), DATA.navitem('View ' + r.className, ICONS[r.className])));
            //btnView.el.addEventListener('click', () => this.confirmView(model));
            btnView.el.addEventListener('click', () => console.log('TODO: Launch Viewer'));
        });
    }
    /** Searches the children of this Element and displays results in a PROMPT (Or passes them along the chain)
        @param {boolean} noPrompt If false (default), no dialog is displayed and the results are passed along
        @param {CONTAINER} container Container to search (Default this)
        @param {EL} caller Element that called the search (ie: switchable element resolved)
        @param {string} query optional named element to focus in PROMPT.form
	    @returns {Promise<PROMPT>} Promise to show SEARCH Prompt (or pass along results)
	*/
    search(noPrompt = false, container = this, caller = this, query = null) {
        console.log(caller.toString() + ' is attempting to SEARCH ' + container.toString(), query);
        return new Promise((resolve) => {
            caller.getLoader().log(25).then((loader) => {
                let prompt = new SEARCH(new MODEL().set({
                    label: 'Search ' + container.toString(),
                    container,
                    caller
                }));
                prompt.createForm().then((form) => {
                    form.setAction('#');
                    form.setId(0);
                    form.label = 'Search';
                    let inp = form.getFieldset()[0].getFormElementGroup()[0].addFormInput(
                        MODELS.input('INPUT', ATTR.input('Search', '', 'TEXT', null, 'Search ' + container.toString() + ' for...'), 'Search')
                        //createInputModel('INPUT', 'Search').setAttribute('placeholder', 'Search ' + container.toString() + ' for...')
                    );
                    form.footer.buttonGroup.get()[0].setLabel('', ICONS.SEARCH);
                    form.post = () => container.submitSearch(inp.input.el.value, container, prompt);

                    prompt.form = form;
                    if (query !== null) {
                        console.log(container.toString() + 'Query', query);
                    }
                    loader.log(100).then(() => {
                        if (noPrompt) {
                            console.log('noprompt');
                            form.getDialog().close().then((dialog) => resolve(dialog));
                        } else {
                            resolve(form.getDialog().show());
                        }
                    });
                });
            });
        });
    }
	/* eslint-enable max-lines-per-function, complexity, max-statements */
}
export { ATTR, ATTRIBUTES, CONTAINER, DATA, EL, MODEL, PAYLOAD, PROMPT, SPAN }
/* eslint-enable */