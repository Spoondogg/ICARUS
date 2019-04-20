/** @module */
import CONTAINER, { Deactivate } from '../../container/CONTAINER.js';
import FACTORY, { ATTRIBUTES, EL, MODEL, PAYLOAD, SPAN } from '../../FACTORY.js';
import FORMSELECT, { OPTION } from '../../container/formelement/formselect/FORMSELECT.js';
//import MENU, { Deactivate, LI, UL } from '../nav/menu/MENU.js';
import PROMPT, { DIALOGMODEL } from '../../dialog/prompt/PROMPT.js';
import FIELDSET from '../../fieldset/FIELDSET.js';
import FORM from '../../form/FORM.js';
import FORMELEMENTGROUP from '../../container/formelement/FORMELEMENTGROUP.js';
import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMTEXTAREA from '../../container/formelement/formtextarea/FORMTEXTAREA.js';
/** Constructs various Form Elements and returns them to be appended
    Each Form Element child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
    @deprecated
*/
export default class FORMELEMENTFACTORY extends FACTORY {
    /* eslint-disable max-lines-per-function, complexity, max-statements */
    /** Constructs a FACTORY to build CONTAINER Classes */
    constructor() {
        super('FORMELEMENT');
    }
    /** Builds the CONTAINER Class
        @param {SPAN} span Parent Node temporary element
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
        @param {Object} payload JSON Payload
        @returns {EL} Newly contructed Class
    */
    build(span, className, id, payload) {
        console.log('FORMELEMENTFACTORY.build()');
        let parentContainer = span.getContainer();
        console.log(parentContainer.toString() + ' is building a(n) ' + className, parentContainer);
        /** @type {CONTAINER} */
        let element = null;
        switch (className) {            
            case 'FORMELEMENT':
                element = this.processFormElement(span, payload);
                break;
            case 'FORMELEMENTGROUP':
                element = new FORMELEMENTGROUP(span, payload.model);
                break;
            case 'FORMINPUT':
                element = new FORMINPUT(span, payload.model);
                break;
            case 'FORMSELECT':
                element = new FORMSELECT(span, payload.model);
                break;
            case 'FORMTEXTAREA':
                element = new FORMTEXTAREA(span, payload.model);
                break;            
            default:
                throw Error(this.toString() + ' No constructor exists for {' + className + '}', parentContainer);
        }
        return element;
    }
    /** Injects dependencies into the given Element/Class
        @description In order to avoid cyclic redundancy on imports, 
        CRUD actions are injected into the Class from its FACTORY
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {SPAN} span Parent Node temporary element
	    @param {number} index Slot reserved in children array
	    @param {EL} element Element/Class
	    @returns {void}
	*/
    injectDependencies(node, span, index, element) {
        try {
			/** Saves the state of the given Container
			    @param {boolean} noPrompt If false (default), no prompt is displayed
			    @abstract
			    @see CONTAINERFACTORY The CONTAINERFACTORY assigns save() to this CONTAINER
			    @returns {Promise} A Promise to save this Container
			*/
            //element.save = (noPrompt) => this.save(noPrompt, element, element);
            element.save = this.save;
            element.quickSaveFormPost = this.quickSaveFormPost;
            element.editProperty = this.editProperty;
            // Overwrite span with 
            span.el.parentNode.replaceChild(element.el, span.el);
        } catch (e) {
            span.destroy();
            node.children.splice(index, 1);
            console.log(e);
        }
    }
    /** Create appropriate FORM ELEMENT based on payload.model
        @param {SPAN} span Container Temporary Holder
        @param {{model:Object}} payload Json Payload
        @returns {FORMELEMENT} Form Element
    */
    processFormElement(span, payload) {
        let element = null;
        if (payload.model.type === 'FORMPOSTINPUT') {
            element = new FORMPOSTINPUT(span, payload.model);
        } else {
            switch (payload.model.element) {
                case 'TEXTAREA':
                    element = new FORMTEXTAREA(span, payload.model);
                    break;
                case 'SELECT':
                    element = new FORMSELECT(span, payload.model);
                    break;
                case 'INPUT':
                    element = new FORMINPUT(span, payload.model);
                    break;
                default:
                    element = new FORMINPUT(span, payload.model);
                    break;
            }
        }
        return element;
    }
    /** Constructs a CONTAINER based on the given id and appends to node
	    A placeholder object is created to ensure that values are loaded
	    in the appropriate order, regardless of any delays from getJson()
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
	    @returns {Promise<CONTAINER>} A newly constructed container
	*/
    get(node, className, id) {
        let span = new SPAN(node, new MODEL());
        let index = node.children.push(span); // Reserve the slot in the array  
        return span.getPayload(id, className).then((payload) => {
            /** @type {CONTAINER} */
            let container = null;
            if (payload.className === 'ERROR') {
                if (payload.exception === 'AuthenticationException') {
                    this.authenticationException(node);
                } else {
                    console.warn(this.toString() + ' An Error Occurred', className + '/GET/' + id, payload);
                }
            } else {
                switch (className) {                    
                    case 'FORM':
                        container = new FORM(span, payload.model);
                        break;
                    case 'FIELDSET':
                        container = new FIELDSET(span, payload.model);
                        break;
                    case 'FORMELEMENT':
                        container = this.processFormElement(span, payload);
                        break;
                    case 'FORMELEMENTGROUP':
                        container = new FORMELEMENTGROUP(span, payload.model);
                        break;
                    case 'FORMINPUT':
                        container = new FORMINPUT(span, payload.model);
                        break;
                    case 'FORMSELECT':
                        container = new FORMSELECT(span, payload.model);
                        break;
                    case 'FORMTEXTAREA':
                        container = new FORMTEXTAREA(span, payload.model);
                        break;                    
                    case 'OPTION':
                        container = new OPTION(span, payload.model);
                        break;                    
                    case 'SPAN':
                        container = new SPAN(span, payload.model);
                        break;                  
                    default:
                        throw Error('No constructor exists for CONTAINER{' + className + '}');
                }
                node.children[index] = container;
                this.injectDependencies(node, span, index, container);
                return node.children[index];
            }
        }).then(() => {
            if (id === 0) {
                console.log('SAVE', node);
                node.getContainer().save(true);
            }
        });
    }
    /* eslint-enable max-lines-per-function, complexity, max-statements */
	/** Saves the state of the CONTAINER
        @param {boolean} noPrompt If false (default), no dialog is displayed and the form is automatically submitted after population
        @param {CONTAINER} container Container to save (Default this)
        @param {EL} caller Element that called the save (ie: switchable element resolved)
        @param {string} name optional named element to focus
	    @returns {Promise} Promise to Save (or prompt the user to save) 
	*/
    save(noPrompt = false, container = this, caller = this, name = null) {
        console.log(caller.toString() + ' is attempting to SAVE ' + container.toString(), name);
        return new Promise((resolve) => {
            caller.getLoader().log(25).then((loader) => {
                new PROMPT(new MODEL().set({
                    label: 'Save ' + container.toString(),
                    container,
                    caller
                })).createForm(new MODEL().set({
                    formtype: 'CONTAINER',
                    container
                })).then((form) => {
                    if (name !== null) {
                        form.hideElements(form.get()[0].get()[0].get(), name);
                    }
                    let cont = form.getContainer();
                    cont.navheader.menus.get(null, 'MENU').forEach((menu) => menu.el.dispatchEvent(new Deactivate(this)));
                    form.afterSuccessfulPost = () => {
                        cont.setLabel(form.el.elements.label.value);
                        // @todo This is ugly
                        cont.quickSaveFormPost('data').then(
                            () => cont.quickSaveFormPost('attributes').then(
                                () => cont.quickSaveFormPost('meta').then(
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
	/** If data collection exists, (ie: data, attributes, meta) 
        extract the appropriate values and save
	    @param {string} type Data type (dataId, attributesId, metaId)
	    @returns {Promise<LOADER>} Promise to return loader
	*/
    quickSaveFormPost(type) {
        console.log(this.toString() + '.quickSaveFormPost(' + type + ')');
        return new Promise((resolve, reject) => {
            this.getLoader().log(30, 'Saving {' + this.className + '}[' + type + ']').then((loader) => {
                try {
                    if (this[type] > 0) { // ie: this['dataId']
                        new PROMPT(new MODEL().set({
                            container: this,
                            caller: this
                        })).createForm(new MODEL().set({
                            formtype: 'FORMPOST',
                            className: this.className,
                            type,
                            formPostId: this.id,
                            container: this
                        })).then((form) => form.post().then(() => loader.log(100).then(() => resolve(form.getDialog().close()))));
                    } else {
                        resolve(loader.log(100));
                    }
                } catch (e) {
                    console.error(this.toString() + '.quickSaveFormPost(' + type + ')', e);
                    reject(e);
                }
            });
        });
    }
	/** Launches a FORM POST editor for the specified element
        @todo Some map/reduce magic and this can turn into a proper collection for data, attr, meta
        
	    @param {string} [name] The name of the input we are editing
        @param {string} [type] The Type of data (data, meta, attr) we are editing
	    @returns {Promise<PROMPT>} Save PROMPT
	*/
    editProperty(name = '', type = 'data') {
        //console.log(this.toString() + '.editProperty()', name, type);
        return new Promise((resolve, reject) => {
            //console.log(25, 'Launching Editor');
            try {
                let typeIdStr = type + 'Id';
                if (this[typeIdStr] > 0) {
                    new PROMPT(new MODEL().set({
                        label: 'Edit ' + this.toString + '[' + type + '].' + name,
                        container: this,
                        caller: this
                    })).createForm(new MODEL().set({
                        formtype: 'FORMPOST',
                        className: this.className,
                        type,
                        id: this[typeIdStr],
                        container: this
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
                                try {
                                    let input = form.el.elements[name];
                                    input.focus();
                                    input.onkeyup = () => this[name].setInnerHTML(input.value);                                    
                                } catch (ee) {
                                    console.warn('Error focusing element "' + name + '"', form.el.elements);
                                }
                            } 
                            resolve(form.getDialog().show());
                        });
                    });
                } else {
                    console.warn(this.toString + '.elements[' + type + '].' + name + ' does not have a ' + type + ' FORMPOST');
                    resolve(false);
                }
            } catch (e) {
                console.warn('Unable to edit', e);
                reject(e);
            }
        });
    }
}
export { ATTRIBUTES, CONTAINER, DIALOGMODEL, EL, FACTORY, FORM, MODEL, PAYLOAD, PROMPT }
/* eslint-enable */