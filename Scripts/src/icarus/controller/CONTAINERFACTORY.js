/** @module */
import FORMSELECT, { OPTION } from '../model/el/container/formelement/formselect/FORMSELECT.js';
import MENULIST, { LI, UL } from '../model/el/container/menulist/MENULIST.js';
import SPAN, { ATTRIBUTES, EL, MODEL } from '../model/el/span/SPAN.js';
//import EL, { ATTRIBUTES, MODEL } from '../model/el/EL.js';
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
import FORMTEXTAREA from '../model/el/container/formelement/formtextarea/FORMTEXTAREA.js';
//import FORMPOSTINPUT from '../model/el/container/formelement/formpostinput/FORMPOSTINPUT.js';
import IFRAME from '../model/el/container/iframe/IFRAME.js';
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
//import PARAGRAPH from '../model/el/container/paragraph/PARAGRAPH.js';
import SECTION from '../model/el/section/SECTION.js';
import TEXTBLOCK from '../model/el/container/textblock/TEXTBLOCK.js';
//import TOKEN from '../model/el/container/formelement/forminput/TOKEN.js';
import WORD from '../model/el/container/word/WORD.js';
/**
    Constructs various Containers and returns them to be appended
    Each Container child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
 */
export default class CONTAINERFACTORY {
	/* eslint-disable max-lines-per-function, complexity */
	/**
	    Gets this Container from the database via ajax GET request.
	    Retrieves object model and returns the container.

	    A placeholder object is created to ensure that values are loaded
	    in the appropriate order, regardless of any delays from getJson()

	    @param {MODEL} node Parent node (Generally append to node.body.pane)
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
	    @returns {CONTAINER} A newly constructed container
	*/
	get(node, className, id) {
		//console.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
		let span = new SPAN(node, new MODEL());
		let index = node.children.push(span); // Reserve the slot in the array        
		return $.getJSON('/' + className + '/Get/' + id, (result) => {
			let obj = null;
			switch (className) {
				case 'ARTICLE':
					obj = new ARTICLE(span, result.model);
					break;
				case 'BANNER':
					obj = new BANNER(span, result.model);
					break;
				case 'CALLOUT':
					obj = new CALLOUT(span, result.model);
					break;
				case 'CHAT':
					obj = new CHAT(span, result.model);
					break;
				case 'CLASSVIEWER':
					obj = new CLASSVIEWER(span, result.model);
					break;
				case 'DICTIONARY':
					obj = new DICTIONARY(span, result.model);
					break;
				case 'FORM':
					obj = new FORM(span, result.model);
					break;
				case 'FIELDSET':
					obj = new FIELDSET(span, result.model);
					break;
				case 'FORMELEMENTGROUP':
					obj = new FORMELEMENTGROUP(span, result.model);
					break;
					//case 'FORMPOSTINPUT':
					//	obj = new FORMPOSTINPUT(span, result.model);
					//	break;
				case 'FORMINPUT':
					obj = new FORMINPUT(span, result.model);
					break;
				case 'FORMSELECT':
					obj = new FORMSELECT(span, result.model);
					break;
				case 'FORMTEXTAREA':
					obj = new FORMTEXTAREA(span, result.model);
					break;
				case 'IFRAME':
					obj = new IFRAME(span, result.model);
					break;
				case 'IMAGEGALLERY':
					obj = new IMAGEGALLERY(span, result.model);
					break;
				case 'INDEX':
					obj = new INDEX(span, result.model);
					break;
				case 'INDEXMAIN':
					obj = new INDEXMAIN(span, result.model);
					break;
				case 'INDEXTHUMBNAIL':
					obj = new INDEXTHUMBNAIL(span, result.model);
					break;
				case 'JUMBOTRON':
					obj = new JUMBOTRON(span, result.model);
					break;
				case 'LI':
					obj = new LI(span, result.model);
					break;
				case 'LIST':
					obj = new LIST(span, result.model);
					break;
				case 'LISTITEM':
					obj = new LISTITEM(span, result.model);
					break;
				case 'MENULIST':
					obj = new MENULIST(span, result.model);
					break;
				case 'MENU':
					obj = new MENU(span, result.model);
					break;
				case 'NAVITEM':
					obj = new NAVITEM(span, result.model);
					break;
				case 'NAVSEPARATOR':
					obj = new NAVSEPARATOR(span, result.model);
					break;
				case 'OPTION':
					obj = new OPTION(span, result.model);
					break;
					//case 'PARAGRAPH':
					//	obj = new PARAGRAPH(span, result.model);
					//	break;
				case 'SECTION':
					obj = new SECTION(span, result.model);
                    break;
                case 'SPAN':
                    obj = new SPAN(span, result.model);
                    break;
				case 'TEXTBLOCK':
					obj = new TEXTBLOCK(span, result.model);
					break;
				case 'THUMBNAIL':
					obj = new NAVTHUMBNAIL(span, result.model);
					break;
				case 'UL':
					obj = new UL(span, result.model);
					break;
				case 'WORD':
					obj = new WORD(span, result.model);
					break;
				default:
					obj = new EL(span, result.model);
			}
			node.children[index] = obj;
			try {
				// Inject CRUD actions and dependencies
				//obj.factory = this;
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
                label: 'Save ' + this.className
            }));
            dialog.form = FORM.createEmptyForm(dialog.body, false);
            dialog.form.addClass('saveContainer').setPostUrl(this.className + '/Set');
            dialog.form.children[0].children[0].addInputElements(this.createContainerInputs());
            dialog.form.afterSuccessfulPost = (payload) => {
                console.log('Successful post', payload);
                this.setLabel(dialog.form.el.elements.label.value);
                //node.close();
                //form.destroy();
                this.quickSaveFormPost(this.dataId, this.data);
                this.quickSaveFormPost(this.attributesId, this.attributes);
                //container.refreshParentContainer(container);
                console.log('CONTAINERFACTORY.save() afterSuccessfulPost resolved');
                resolve();
            };
            /* eslint-disable-next-line no-alert */
            if (noPrompt) {
                console.log(
                    'Quick Saving ' + this.className + '(' + this.id + ') : ' + this.label
                );
                dialog.form.post().then(() => {
                    dialog.close();
                });
            } else {
                console.log('Showing save form dialog');
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
					inputs.push(this.createInputModel('INPUT', key, key, this.htmlEncode(data[key])));
				}
			}
			form.children[0].children[0].addInputElements(inputs);
			form.setPostUrl('FormPost/Set');
			form.post();
			form.afterSuccessfulPost = () => {
				form.destroy();
				//console.log('FormPost: ' + modelId + ' has been quicksaved');
			};
		}
		/*else {
			console.log('No modelId provided');
		}*/
	}
	/** Displays a prompt that performs a save of the container, it's 
	    attributes and any data objects associated with it.
        @param {CONTAINER} container The Container to save
	    @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
	    @returns {BOOLEAN} True if successful
	
	quickSave(container, noPrompt = false) {
		// eslint-disable-next-line no-alert //
        if (noPrompt || confirm('Quick Save ' + container.className + '(' + container.id + ') : ' + container.label + ' ?')) {
			//console.log(this.className + '.save()', this);
			// Populate subsections with elements in this body
			//let subsections = container.getSubSections();
			let form = FORM.createEmptyForm(container, true);
			form.children[0].children[0].addInputElements(form.createContainerInputs());
			form.setPostUrl(container.className + '/Set');
			form.post();
			form.afterSuccessfulPost = () => {
				container.setLabel(form.el.elements.label.value);
				form.destroy();
				container.quickSaveFormPost(container.dataId, container.data);
                container.quickSaveFormPost(container.attributesId, container.attributes);
			};
			return true;
		}
	}*/
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };
/* eslint-enable */