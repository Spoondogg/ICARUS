/** @module */
import FORMSELECT, { OPTION } from '../model/el/container/formelement/formselect/FORMSELECT.js';
import MENULIST, { LI, UL } from '../model/el/container/menulist/MENULIST.js';
import SPAN, { ATTRIBUTES, EL, MODEL } from '../model/el/span/SPAN.js';
import ARTICLE from '../model/el/article/ARTICLE.js';
import BANNER from '../model/el/container/banner/BANNER.js';
import CALLOUT from '../model/el/container/banner/callout/CALLOUT.js';
import CHAT from '../model/el/container/chat/CHAT.js';
import CLASSVIEWER from '../model/el/container/banner/classviewer/CLASSVIEWER.js';
import CONTAINER from '../model/el/container/CONTAINER.js';
import DICTIONARY from '../model/el/container/dictionary/DICTIONARY.js';
import FIELDSET from '../model/el/fieldset/FIELDSET.js';
import FORM from '../model/el/form/FORM.js';
import FORMELEMENTGROUP from '../model/el/container/formelement/FORMELEMENTGROUP.js';
import FORMINPUT from '../model/el/container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../model/el/container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMTEXTAREA from '../model/el/container/formelement/formtextarea/FORMTEXTAREA.js';
import IMAGEGALLERY from '../model/el/container/banner/imagegallery/IMAGEGALLERY.js';
import INDEX from '../model/el/container/banner/index/INDEX.js';
import INDEXMAIN from '../model/el/container/banner/indexmain/INDEXMAIN.js';
import INDEXTHUMBNAIL from '../model/el/container/banner/thumbnail/indexthumbnail/INDEXTHUMBNAIL.js';
import JUMBOTRON from '../model/el/container/jumbotron/JUMBOTRON.js';
import LIST from '../model/el/container/list/LIST.js';
import LISTITEM from '../model/el/container/list/listitem/LISTITEM.js';
import MENU from '../model/el/nav/menu/MENU.js';
import NAVITEM from '../model/el/nav/navitem/NAVITEM.js';
import NAVSEPARATOR from '../model/el/nav/navitem/NAVSEPARATOR.js';
import NAVTHUMBNAIL from '../model/el/nav/navitem/navthumbnail/NAVTHUMBNAIL.js';
import PROMPT from '../model/el/dialog/prompt/PROMPT.js';
import SECTION from '../model/el/section/SECTION.js';
import TEXTBLOCK from '../model/el/container/textblock/TEXTBLOCK.js';
import WORD from '../model/el/container/word/WORD.js';
/** Constructs various Containers and returns them to be appended
    Each Container child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
 */
export default class CONTAINERFACTORY {
	/* eslint-disable max-lines-per-function, complexity, max-statements */
	/** Gets this Container from the database via ajax GET request.
	    Retrieves object model and returns the container.
	    A placeholder object is created to ensure that values are loaded
	    in the appropriate order, regardless of any delays from getJson()
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
	    @returns {CONTAINER} A newly constructed container
	*/
	get(node, className, id) {
        //console.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
        let span = new SPAN(node, new MODEL());
        let index = node.children.push(span); // Reserve the slot in the array        
        return $.getJSON('/' + className + '/GET/' + id, (payload) => {
            let obj = null;
            if (payload.className === 'ERROR') {
                if (payload.exception === 'AuthenticationException') {
                    try {
                        console.log('An Authentication Exception occurred');
                        node.getContainer().getMain().login();
                    } catch (e) {
                        console.warn('Unable to launch login', e);
                    }
                } else {
                    console.warn('An Error Occurred', className + '/Get/' + id, payload);
                }
            } else {
                switch (className) {
                    case 'ARTICLE':
                        obj = new ARTICLE(span, payload.model);
                        break;
                    case 'BANNER':
                        obj = new BANNER(span, payload.model);
                        break;
                    case 'CALLOUT':
                        obj = new CALLOUT(span, payload.model);
                        break;
                    case 'CHAT':
                        obj = new CHAT(span, payload.model);
                        break;
                    case 'CLASSVIEWER':
                        obj = new CLASSVIEWER(span, payload.model);
                        break;
                    case 'DICTIONARY':
                        obj = new DICTIONARY(span, payload.model);
                        break;
                    case 'FORM':
                        obj = new FORM(span, payload.model);
                        break;
                    case 'FIELDSET':
                        obj = new FIELDSET(span, payload.model);
                        break;
                    case 'FORMELEMENT':
                        if (payload.model.type === 'FORMPOSTINPUT') {
                            obj = new FORMPOSTINPUT(span, payload.model);
                        } else {
                            switch (payload.model.element) {
                                case 'TEXTAREA':
                                    obj = new FORMTEXTAREA(span, payload.model);
                                    break;
                                case 'SELECT':
                                    obj = new FORMSELECT(span, payload.model);
                                    break;
                                case 'INPUT':
                                    obj = new FORMINPUT(span, payload.model);
                                    break;
                                default:
                                    obj = new FORMINPUT(span, payload.model);
                                    break;
                            }
                        }
                        break;
                    case 'FORMELEMENTGROUP':
                        obj = new FORMELEMENTGROUP(span, payload.model);
                        break;
                    case 'FORMINPUT':
                        obj = new FORMINPUT(span, payload.model);
                        break;
                    case 'FORMSELECT':
                        obj = new FORMSELECT(span, payload.model);
                        break;
                    case 'FORMTEXTAREA':
                        obj = new FORMTEXTAREA(span, payload.model);
                        break;
                    case 'IMAGEGALLERY':
                        obj = new IMAGEGALLERY(span, payload.model);
                        break;
                    case 'INDEX':
                        obj = new INDEX(span, payload.model);
                        break;
                    case 'INDEXMAIN':
                        obj = new INDEXMAIN(span, payload.model);
                        break;
                    case 'INDEXTHUMBNAIL':
                        obj = new INDEXTHUMBNAIL(span, payload.model);
                        break;
                    case 'JUMBOTRON':
                        obj = new JUMBOTRON(span, payload.model);
                        break;
                    case 'LI':
                        obj = new LI(span, payload.model);
                        break;
                    case 'LIST':
                        obj = new LIST(span, payload.model);
                        break;
                    case 'LISTITEM':
                        obj = new LISTITEM(span, payload.model);
                        break;
                    case 'MENULIST':
                        obj = new MENULIST(span, payload.model);
                        break;
                    case 'MENU':
                        obj = new MENU(span, payload.model);
                        break;
                    case 'NAVITEM':
                        obj = new NAVITEM(span, payload.model);
                        break;
                    case 'NAVSEPARATOR':
                        obj = new NAVSEPARATOR(span, payload.model);
                        break;
                    case 'OPTION':
                        obj = new OPTION(span, payload.model);
                        break;
                    case 'SECTION':
                        obj = new SECTION(span, payload.model);
                        break;
                    case 'SPAN':
                        obj = new SPAN(span, payload.model);
                        break;
                    case 'TEXTBLOCK':
                        obj = new TEXTBLOCK(span, payload.model);
                        break;
                    case 'THUMBNAIL':
                        obj = new NAVTHUMBNAIL(span, payload.model);
                        break;
                    case 'UL':
                        obj = new UL(span, payload.model);
                        break;
                    case 'WORD':
                        obj = new WORD(span, payload.model);
                        break;
                    default:
                        throw Error('No constructor exists for CONTAINER{' + className + '}');
                }
                node.children[index] = obj;
                try {
                    // Inject CRUD actions and dependencies
                    obj.container = obj.getProtoTypeByClass('CONTAINER');
                    obj.save = this.save;
                    obj.quickSaveFormPost = this.quickSaveFormPost;
                    obj.editData = this.editData;
                    // Overwrite span with 
                    span.el.parentNode.replaceChild(obj.el, span.el);
                } catch (e) {
                    span.destroy();
                    node.children.splice(index, 1);
                    console.log(e);
                }
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
        @param {BOOLEAN} noPrompt If false (default), no dialog is displayed and the form is automatically submitted after population
        @param {CONTAINER} container Container to save (Default this)
        @param {EL} caller Element that called the save (ie: switchable element resolved)
	    @returns {Promise} Promise to Save (or prompt the user to save) 
	*/
	save(noPrompt = false, container = this, caller = this) {
        return new Promise((resolve) => {
            this.getLoader().log(25).then((loader) => {
                new PROMPT(new MODEL().set({
                    label: 'Save ' + this.className + '[' + this.id + ']',
                    container,
                    caller
                })).createForm(new MODEL().set({
                    formtype: 'CONTAINER',
                    container: this
                })).then((form) => {
                    form.afterSuccessfulPost = () => {
                        let cont = form.getContainer();
                        cont.setLabel(form.el.elements.label.value);
                        cont.quickSaveFormPost('dataId')
                            .then(() => cont.quickSaveFormPost('attributesId').then(
                                () => form.getDialog().close()));
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
	/** If dataId or attributesId exists, extract the appropriate values and save
	    @param {string} type Data type (dataId, attributesId, descriptionId)
	    @returns {void}
	*/
    quickSaveFormPost(type) {
        return new Promise((resolve, reject) => {
            this.getLoader().log(30, 'Saving {' + this.className + '}[' + type + ']').then((loader) => {
                try {
                    if (this[type] > 0) {
                        new PROMPT(new MODEL().set({
                            container: this
                        })).createForm(new MODEL().set({
                            formtype: 'FORMPOST',
                            className: this.className,
                            type,
                            formPostId: this.id,
                            container: this
                        })).then((form) => form.post().then(() => loader.log(100).then(() => resolve(form.getDialog().close()))));
                    } else {
                        console.log('Creating ' + type + ' for ' + this.className);
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    /** Launches a FORM POST editor for the specified element
        param {EL} element The EL who's model.data is being edited
        @param {string} name The name of the input we are editing
        @returns {Promise<PROMPT>} Save PROMPT
    */
    editData(name) {
        return new Promise((resolve, reject) => {
            this.getLoader().log(25, 'Launching Editor', true).then((loader) => {
                try {
                    if (this.dataId > 0) {                    
                        this[name].select();
                        new PROMPT(new MODEL().set({
                            label: 'Edit ' + this.className + ' : ' + name,
                            container: this
                        })).createForm(new MODEL().set({
                            formtype: 'FORMPOST',
                            className: this.className,
                            type: 'dataId',
                            id: this.dataId,
                            container: this
                        })).then((form) => this.hideElements(form.children[0].children[0].children, name)
                            .then(() => {
                                form.getDialog().close = () => form.getDialog().hide().then(() => this.deselectAll());
                                let input = form.el.elements[name];
                                input.focus();
                                input.onkeyup = () => this[name].setInnerHTML(input.value);
                                loader.log(100).then(() => resolve(form.getDialog().show()));
                            })
                        );                    
                    } else {
                        loader.log(100, this.className + '[' + name + '] does not have a data FORMPOST').then(() => resolve(false));
                    }
                } catch (e) {
                    loader.log(100, 'Unable to edit').then(() => reject(e));
                }
            });
        });
    }
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };
/* eslint-enable */