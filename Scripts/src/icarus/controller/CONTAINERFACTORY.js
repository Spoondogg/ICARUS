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
import DIALOG from '../model/el/dialog/DIALOG.js';
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
import SECTION from '../model/el/section/SECTION.js';
import TEXTBLOCK from '../model/el/container/textblock/TEXTBLOCK.js';
import WORD from '../model/el/container/word/WORD.js';
/** Constructs various Containers and returns them to be appended
    Each Container child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
 */
export default class CONTAINERFACTORY {
	/* eslint-disable max-lines-per-function, complexity */
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
        return $.getJSON('/' + className + '/Get/' + id, (payload) => {
            let obj = null;
            if (payload.className === 'ERROR') {
                if (payload.exception === 'AuthenticationException') {
                    try {
                        node.getContainer().getMainContainer().login();
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
                    //obj.quickSave = this.quickSave;
                    obj.quickSaveFormPost = this.quickSaveFormPost;
                    // Overwrite span with 
                    span.el.parentNode.replaceChild(obj.el, span.el);
                } catch (e) {
                    span.destroy();
                    node.children.splice(index, 1);
                    console.log(e);
                }
                return node.children[index];
            }
        });
	}
	/* eslint-enable max-lines-per-function, complexity */
	/** Saves the state of the given Container
        @description Generates an empty form, populates with current state and posts to appropriate setter
	    param {EL} node The parent container to hold the save menu
        param {CONTAINER} container The Container to save
        @param {BOOLEAN} noPrompt If false (default), no dialog is displayed and the form is automatically submitted after population
	    @returns {Promise} Promise to Save (or prompt the user to save) 
	*/
	save(noPrompt = false) { // 
		return new Promise((resolve) => {
			console.log(this.className + '.save()', noPrompt);
			let dialog = new DIALOG(new MODEL().set({
				label: 'Save ' + this.className,
				container: this
			}));
			dialog.form = FORM.createEmptyForm(dialog.body, false);
			dialog.form.container = this;
            dialog.form.addClass('saveContainer').setAction(this.className + '/Set');
			dialog.form.children[0].children[0].addInputElements(this.createContainerInputs());
			dialog.form.afterSuccessfulPost = (payload) => {
				console.log('Successful post', payload);
				this.setLabel(dialog.form.el.elements.label.value);
				//form.destroy();
				//this.quickSaveFormPost(this.dataId, this.data);
				//this.quickSaveFormPost(this.attributesId, this.attributes);
				//this.refreshParentContainer();
				//console.log('CONTAINERFACTORY.save() afterSuccessfulPost resolved');
				resolve(dialog.close());
			};
			/* eslint-disable-next-line no-alert */
			if (noPrompt) {
                dialog.form.post().then(() => {
					dialog.close();
                });
			} else {
				dialog.show();
			}
		});
	}
	/** If dataId or attributesId exists, extract the appropriate values and save
	    @param {number} modelId The object's unique identifier
	    @param {object} data The object to be saved
	    @returns {void}
	*/
	quickSaveFormPost(modelId, data) {
		console.log('QuickSaveFormPost', modelId, data);
		if (modelId > 0) {
			//console.log(50, 'Saving FormPost: ' + modelId);
			let form = FORM.createEmptyForm(this, true);
			let inputs = [];
			//console.log('Adding data attributes');
			for (let key in data) {
				if (Reflect.call(data, key)) { // if (Object.prototype.hasOwnProperty.call(data, key)) {
					//console.log('Key', key);
					//console.log('Value', this.htmlEncode(data[key]));
					inputs.push(this.createInputModel('INPUT', key, this.htmlEncode(data[key])));
				}
			}
			form.children[0].children[0].addInputElements(inputs);
			form.setAction('FORMPOST/SET');
			form.post();
			form.afterSuccessfulPost = () => {
				form.destroy();
				//console.log('FormPost: ' + modelId + ' has been quicksaved');
			};
		}
	}
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };
/* eslint-enable */