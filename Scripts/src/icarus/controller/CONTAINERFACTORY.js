/** @module */
import FORMSELECT, { OPTION } from '../model/el/container/formelement/formselect/FORMSELECT.js';
import MENU, { Deactivate, LI, UL } from '../model/el/nav/menu/MENU.js';
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
			/** @type {CONTAINER} */
			let container = null;
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
						container = new ARTICLE(span, payload.model);
						break;
					case 'BANNER':
						container = new BANNER(span, payload.model);
						break;
					case 'CALLOUT':
						container = new CALLOUT(span, payload.model);
						break;
					case 'CHAT':
						container = new CHAT(span, payload.model);
						break;
					case 'CLASSVIEWER':
						container = new CLASSVIEWER(span, payload.model);
						break;
					case 'DICTIONARY':
						container = new DICTIONARY(span, payload.model);
						break;
					case 'FORM':
						container = new FORM(span, payload.model);
						break;
					case 'FIELDSET':
						container = new FIELDSET(span, payload.model);
						break;
					case 'FORMELEMENT':
						if (payload.model.type === 'FORMPOSTINPUT') {
							container = new FORMPOSTINPUT(span, payload.model);
						} else {
							switch (payload.model.element) {
								case 'TEXTAREA':
									container = new FORMTEXTAREA(span, payload.model);
									break;
								case 'SELECT':
									container = new FORMSELECT(span, payload.model);
									break;
								case 'INPUT':
									container = new FORMINPUT(span, payload.model);
									break;
								default:
									container = new FORMINPUT(span, payload.model);
									break;
							}
						}
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
					case 'IMAGEGALLERY':
						container = new IMAGEGALLERY(span, payload.model);
						break;
					case 'INDEX':
						container = new INDEX(span, payload.model);
						break;
					case 'INDEXMAIN':
						container = new INDEXMAIN(span, payload.model);
						break;
					case 'INDEXTHUMBNAIL':
						container = new INDEXTHUMBNAIL(span, payload.model);
						break;
					case 'JUMBOTRON':
						container = new JUMBOTRON(span, payload.model);
						break;
					case 'LI':
						container = new LI(span, payload.model);
						break;
						//case 'LIST':
						//    container = new LIST(span, payload.model);
						//    break;
						//case 'LISTITEM':
						//    container = new LISTITEM(span, payload.model);
						//    break;
					case 'MENU':
						container = new MENU(span, payload.model);
						break;
					case 'NAVITEM':
						container = new NAVITEM(span, payload.model);
						break;
					case 'NAVSEPARATOR':
						container = new NAVSEPARATOR(span, payload.model);
						break;
					case 'OPTION':
						container = new OPTION(span, payload.model);
						break;
					case 'SECTION':
						container = new SECTION(span, payload.model);
						break;
					case 'SPAN':
						container = new SPAN(span, payload.model);
						break;
					case 'TEXTBLOCK':
						container = new TEXTBLOCK(span, payload.model);
						break;
					case 'THUMBNAIL':
						container = new NAVTHUMBNAIL(span, payload.model);
						break;
					case 'UL':
						container = new UL(span, payload.model);
						break;
					case 'WORD':
						container = new WORD(span, payload.model);
						break;
					default:
						throw Error('No constructor exists for CONTAINER{' + className + '}');
				}
				node.children[index] = container;
				try {
					/// WHY AM I DOING THIS????
					/// It really doesn't make sense to do this, unless...  there was magic involved.
					/// - [ ] Verify if magic was involved
					/// 2019-03-21
					/// Ok, so you inject the CRUD actions into the CONTAINER because...
					/// - You don't want to import a PROMPT and all the CRUD stuff on each instantiation...?
					/// - Yes...  Creating a FORM inside a CONTAINER would create a cyclic redundancy error
					/// MAGIC CONFIRMED
					/// So, can you bind the method or use an arrow function instead?
					/// You also might be able to bypass a whole bunch of chaining to get back to MAIN
					///  - Consider calling MAIN from the FACTORY...  Could that be done?
					// Inject CRUD actions and dependencies // Consider a Crudable Interface (IFACE)
					/** Saves the state of the given Container
                        @param {boolean} noPrompt If false (default), no prompt is displayed
                        @abstract
                        @see CONTAINERFACTORY The CONTAINERFACTORY assigns save() to this CONTAINER
	                    @returns {Promise} A Promise to save this Container
	                */
					container.save = (noPrompt) => this.save(noPrompt, container, container);
					container.quickSaveFormPost = this.quickSaveFormPost;
					container.editProperty = this.editProperty;
					// Overwrite span with 
					span.el.parentNode.replaceChild(container.el, span.el);
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
                        label: 'Edit ' + this.toString + '[' + type + '].' + name,
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
export { ATTRIBUTES, CONTAINER, EL, MODEL }
/* eslint-enable */