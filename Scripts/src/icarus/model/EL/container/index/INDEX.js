/** @module  */
//import CLASSINDEX, { CLASSVIEWER } from './classindex/CLASSINDEX.js';
import CONFIRM, { DIALOGMODEL, PROMPT } from '../../dialog/confirm/CONFIRM.js';
import CONTAINER, { Activate, MODEL } from '../CONTAINER.js';
import CONTAINERINDEX, { CLASSVIEWER } from './classindex/containerindex/CONTAINERINDEX.js';
import MENU, { Collapse, Expand } from '../../nav/menu/MENU.js';
import { ICONS } from '../../../../enums/ICONS.js';
import PANEL from '../../dialog/panel/PANEL.js';
/** Contains a high level view of all objects owned by this user
    @class
*/
export default class INDEX extends CONTAINER {
	/** An abstract indexed view of a collection of Objects
	    @param {CONTAINER} node Parent node
	    @param {MODEL} [model] INDEX model	    
    */
	constructor(node, model) {
		super(node, 'DIV', model);
        this.addClass('index');
        this.menu = new MENU(this.body.pane, new MODEL().set('name', 'index'));
        this.addContainersMenu();
        this.menu.el.dispatchEvent(new Expand(this.menu));
	}
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this.childLocation).then(() => this.configureHeader());
            }
        });
    }
    /** Adds appropriate Event handlers to Header
        @returns {void}
    */
    configureHeader() {
        this.header.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.menu)));
        this.header.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.menu)));
        this.addHeaderEvents();
    }
	/** Adds the Containers Menu, a collection of Container Types that can be browsed
	    Adds a right aligned tab to show/hide the Container Menu
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
	    @returns {void}
	*/
	addContainersMenu() {
		try {			
			// Create Secondary Tabs and Horizontal Menus inside Menu
            let allowed = ['ARTICLE', 'FORM', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL', 'CHAT', 'DICTIONARY', 'IMAGEINDEX', 'CONTAINERINDEX', 'FORMPOSTINDEX'];
			allowed.map((classType) => {
				let tb = this.menu.addNavItemIcon(new MODEL().set({
					label: classType,
					icon: ICONS[classType]
                }));
                tb.el.addEventListener('activate', () => {
                    let prompt = new PROMPT(new DIALOGMODEL(new MODEL('dialog-classindex'), {
                        container: this.getContainer(),
                        caller: tb,
                        label: 'CLASSINDEX: ' + classType,
                        text: 'View ' + classType
                    }));
                    let viewer = new CONTAINERINDEX(prompt.body.pane, new MODEL(), {
                        classType
                    });
                    viewer.setContainer(this.node.node.node.getContainer());
                    viewer.header.el.dispatchEvent(new Activate(this.header));
                    viewer.body.el.dispatchEvent(new Expand(viewer));
                    prompt.showDialog();
                });
				///this.addThumbButtonActions(name, tb, opt);
			});
		} catch (e) {
			let modal = this.getProtoTypeByClass('MODAL');
			if (modal === null) {
				console.warn('Unable to retrieve MAIN Container', e);
				throw e;
			} else {
				switch (modal.className) {
					case 'LOADER':
					case 'PROMPT':
						break;
					default:
						console.warn(this.className + ' exists inside an unrecognized Modal window.', modal);
						break;
				}
			}
		}
    }
    /** Launches a Class Viewer after confirmation
        @param {MODEL} model Model
        @returns {void}
    */
    confirmView(model) {
        CONFIRM.confirmMethodCall(
            'Launch Viewer',
            'Launch viewer for ' + this.classType + ' "' + model.label + '(' + model.id + ')"?',
            () => {
                console.log('Confirmed.  Viewing ' + this.classType + '(' + model.id + ')');
                this.launchClassViewer(model.id, this.classType);
            }
        );
    }
    /** Launches a CLASSVIEWER for the given id and classType
        @param {UId} id CONTAINER UId
        @param {string} classType CONTAINER class
        @returns {void}
    */
    launchClassViewer(id, classType) {
        if (classType === 'MAIN') {
            CONFIRM.confirmMethodCall(
                'Launch MAIN Viewer',
                classType + ' "(' + id + ') will launch in a new window.  Proceed?',
                () => {
                    console.log('Confirmed.  Viewing ' + classType + '(' + id + ')');
                    window.open('/' + id, '_blank');
                }
            );
        } else {
            let dialog = new PROMPT(new DIALOGMODEL(new MODEL('dialog-classviewer'), {
                container: this.getContainer(),
                caller: this,
                label: 'ClassViewer: ' + classType + ' # ' + id
                //text: 'Viewing ' + classType + ' (' + id + ')"'
            }), false);
            let viewer = new CLASSVIEWER(dialog.body.pane, new MODEL().data.set('classType', classType), classType);
            viewer.body.el.dispatchEvent(new Expand(viewer));
            this.getContainer().getFactory().get(viewer.body.pane, classType, id).then(() => dialog.showDialog());
        }
    }
	/** If no children supplied...
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
	}
	/** Posts to the given element and retrieves a list of available instances, 
	    then assigns relevant actions to it
	    @param {string} element The name of the element 
	    @param {NAVITEMICON} thumb A NAVITEMICON that represents the given element
        @param {MENU} menu MENU relative to NAVITEMICON
	    @returns {void}
	    @async
	*/
	addThumbButtonActions(element, thumb, menu) {
		return new Promise((resolve, reject) => {
			try {
				$.post('/' + element + '/LIST', {
					'__RequestVerificationToken': this.getToken()
				}, (payload, status) => {
					if (status === 'success') {
						let str = 'There are ' + payload.list.length + ' instances of ' + payload.className;
						thumb.el.setAttribute('title', str);
						thumb.el.addEventListener('activate', () => console.warn('Payload for ' + element, payload));
                        payload.list.forEach((li) => {
                            let { id, label } = li;
							let icon = menu.addNavItemIcon(new MODEL('card').set({
								label: id,
								icon: ICONS[element]
							}));
							icon.el.setAttribute('title', label);
							icon.el.addEventListener('activate', () => {
                                this.getPayload(id, element).then((result) => {
									let panel = new PANEL(new MODEL().set({
                                        label: element + '(' + id + ')',
										caller: icon,
										container: this
                                    }));
                                    let elementsMenu = this.navheader.getMenu('OPTIONS').getMenu('ELEMENTS');
                                    panel.body.addContainerCase(elementsMenu, element);
									panel.body.populate([result.model]).then((results) => {
										try {
											results.body.pane.children[1].navheader.expand();
										} catch (e) {
											console.warn('Unable to show navheader.  Likely async issue', results);
										}
										// This is cheating.  You should be waiting for an indication that the CONTAINER has loaded instead of 
										// assuming that it will exist.  This will eventually break.
										setTimeout(() => {
											console.warn('!!! BAD BAD BADNESS !!! INDEX Populated', results, results.body.pane.children);
											// DO THE THING that you're not supposed to do this way
											results.body.pane.children[1].navheader.expand();
										}, 1000);
										panel.showDialog();
									});
								});
							})
						});
					}
					resolve(this);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Creates a modal and loads the specified container
	    @param {number} delay Delay in milliseconds
	    param {string} title Modal Title
	    param {EL} node Modal node to append to
	    @param {string} className Object class name
	    @param {number} id Object id
	    @returns {void}
	*/
	launchPreview(delay = 500, className, id) { // title = 'Preview', // node
        setTimeout(() => {
            this.getJson('/' + className + '/GET/' + id, (result) => {
				console.log(className, result);
				this.modal.container.preview.create(result.model);
			});
		}, delay);
        setTimeout(() => {
            this.getJson('/' + className + '/GetContainerParents/' + id, (result) => {
				console.log(className + ' Parents:', result, result.length + ' parent Containers');
				this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
			});
		}, delay);
	}
}
export { CONTAINER }