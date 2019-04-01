/** @module */
import FACTORY, { ATTRIBUTES, EL, MODEL, SPAN } from '../../FACTORY.js';
import FORMSELECT, { OPTION } from '../container/formelement/formselect/FORMSELECT.js';
import MENU, { Deactivate, LI, UL } from '../nav/menu/MENU.js';
import ARTICLE from '../article/ARTICLE.js';
import BANNER from '../container/banner/BANNER.js';
import CALLOUT from '../container/banner/callout/CALLOUT.js';
import CHAT from '../container/chat/CHAT.js';
import CLASSVIEWER from '../container/banner/classviewer/CLASSVIEWER.js';
import CONTAINER from '../container/CONTAINER.js';
import DICTIONARY from '../container/dictionary/DICTIONARY.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORM from '../form/FORM.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
import FORMINPUT from '../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMTEXTAREA from '../container/formelement/formtextarea/FORMTEXTAREA.js';
import IMAGEGALLERY from '../container/banner/imagegallery/IMAGEGALLERY.js';
import INDEX from '../container/banner/index/INDEX.js';
import INDEXMAIN from '../container/banner/indexmain/INDEXMAIN.js';
import INDEXTHUMBNAIL from '../container/banner/thumbnail/indexthumbnail/INDEXTHUMBNAIL.js';
import JUMBOTRON from '../container/jumbotron/JUMBOTRON.js';
import NAVITEM from '../nav/navitem/NAVITEM.js';
import NAVSEPARATOR from '../nav/navitem/NAVSEPARATOR.js';
import NAVTHUMBNAIL from '../nav/navitem/navthumbnail/NAVTHUMBNAIL.js';
import PROMPT from '../dialog/prompt/PROMPT.js';
import SECTION from '../section/SECTION.js';
import TEXTBLOCK from './textblock/TEXTBLOCK.js';
import WORD from './word/WORD.js';
/** Constructs various Containers and returns them to be appended
    Each Container child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
    @extends FACTORY
*/
export default class CONTAINERFACTORY extends FACTORY {
    /* eslint-disable max-lines-per-function, complexity, max-statements */
	/** Builds the Class
        @param {SPAN} span Parent Node temporary element
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
        @param {Object} payload JSON Payload
        @returns {EL} Newly contructed Class
    */
    build(span, className, id, payload) {
        /** @type {CONTAINER} */
        let element = null;
        switch (className) {
            case 'ARTICLE':
                element = new ARTICLE(span, payload.model);
                break;
            case 'BANNER':
                element = new BANNER(span, payload.model);
                break;
            case 'CALLOUT':
                element = new CALLOUT(span, payload.model);
                break;
            case 'CHAT':
                element = new CHAT(span, payload.model);
                break;
            case 'CLASSVIEWER':
                element = new CLASSVIEWER(span, payload.model);
                break;
            case 'DICTIONARY':
                element = new DICTIONARY(span, payload.model);
                break;
            case 'FORM':
                element = new FORM(span, payload.model);
                break;
            case 'FIELDSET':
                element = new FIELDSET(span, payload.model);
                break;
            case 'FORMELEMENT':
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
            case 'IMAGEGALLERY':
                element = new IMAGEGALLERY(span, payload.model);
                break;
            case 'INDEX':
                element = new INDEX(span, payload.model);
                break;
            case 'INDEXMAIN':
                element = new INDEXMAIN(span, payload.model);
                break;
            case 'INDEXTHUMBNAIL':
                element = new INDEXTHUMBNAIL(span, payload.model);
                break;
            case 'JUMBOTRON':
                element = new JUMBOTRON(span, payload.model);
                break;
            case 'LI':
                element = new LI(span, payload.model);
                break;
            //case 'LIST':
            //    container = new LIST(span, payload.model);
            //    break;
            //case 'LISTITEM':
            //    container = new LISTITEM(span, payload.model);
            //    break;
            case 'MENU':
                element = new MENU(span, payload.model);
                break;
            case 'NAVITEM':
                element = new NAVITEM(span, payload.model);
                break;
            case 'NAVSEPARATOR':
                element = new NAVSEPARATOR(span, payload.model);
                break;
            case 'OPTION':
                element = new OPTION(span, payload.model);
                break;
            case 'SECTION':
                element = new SECTION(span, payload.model);
                break;
            case 'SPAN':
                element = new SPAN(span, payload.model);
                break;
            case 'TEXTBLOCK':
                element = new TEXTBLOCK(span, payload.model);
                break;
            case 'THUMBNAIL':
                element = new NAVTHUMBNAIL(span, payload.model);
                break;
            case 'UL':
                element = new UL(span, payload.model);
                break;
            case 'WORD':
                element = new WORD(span, payload.model);
                break;
            default:
                throw Error('No constructor exists for {' + className + '}');
        }
        return element;
    }
    /** Injects dependencies into the given Element/Class
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
            element.save = (noPrompt) => this.save(noPrompt, element, element);
            element.quickSaveFormPost = this.quickSaveFormPost;
            element.editProperty = this.editProperty;
        } catch (e) {
            span.destroy();
            node.children.splice(index, 1);
            console.log(e);
        }
    }
    /* eslint-enable max-lines-per-function, complexity, max-statements */
	/** Saves the state of the CONTAINER
        @param {boolean} noPrompt If false (default), no dialog is displayed and the form is automatically submitted after population
        @param {CONTAINER} container Container to save (Default this)
        @param {EL} caller Element that called the save (ie: switchable element resolved)
	    @returns {Promise} Promise to Save (or prompt the user to save) 
	*/
	save(noPrompt = false, container = this, caller = this) {
		console.log(caller.toString() + ' is attempting to SAVE ' + container.toString());
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
        
	    @param {string} name The name of the input we are editing
        @param {string} type The Type of data (data, meta, attr) we are editing
	    @returns {Promise<PROMPT>} Save PROMPT
	*/
    editProperty(name, type = 'data') {
        console.log(this.toString() + '.editProperty()', name, type);
		return new Promise((resolve, reject) => {
            console.log(25, 'Launching Editor');
            try {
                let typeIdStr = type + 'Id';
                if (this[typeIdStr] > 0) {
                    new PROMPT(new MODEL().set({
                        label: 'Edit ' + this.toString() + '[' + type + '].' + name,
                        container: this,
                        caller: this
                    })).createForm(new MODEL().set({
                        formtype: 'FORMPOST',
                        className: this.className,
                        type,
                        id: this[typeIdStr],
                        container: this
                    })).then((form) => this.hideElements(form.children[0].children[0].children, name).then(() => {
                        /* @todo This should trigger on a 'close' event */
                        form.getDialog().close = () => form.getDialog().hide().then(() => {
                            console.log('form,dialog', form, form.getDialog());
                            form.getDialog().deselectAll();
                        });
                        let input = form.el.elements[name];
                        input.focus();
                        input.onkeyup = () => this[name].setInnerHTML(input.value);
                        console.log(100);
                        resolve(form.getDialog().show());
                    }));
                } else {
                    console.warn(this.toString() + '.elements[' + type + '].' + name + ' does not have a ' + type + ' FORMPOST');
                    resolve(false);
                }
            } catch (e) {
                console.warn('Unable to edit', e);
                reject(e);
            }
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, MODEL }
/* eslint-enable */