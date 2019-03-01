/* eslint-disable max-lines */
/** @module */
import COLLAPSIBLE, { Collapse, Collapsible, Expand } from './COLLAPSIBLE.js';
import { DATAELEMENTS, createInputModel } from '../../../enums/DATAELEMENTS.js';
import GROUP, { ATTRIBUTES, Activate, Deactivate, EL, MODEL } from '../group/GROUP.js';
import NAVHEADER, { MENU, NAVITEM, NAVITEMICON } from '../nav/navbar/navheader/NAVHEADER.js';
import AbstractMethodError from '../../../error/AbstractMethodError.js';
import Clickable from '../../../interface/Clickable.js';
import DATEOBJECT from '../../../helper/DATEOBJECT.js';
import DIALOG from '../dialog/DIALOG.js';
import Draggable from '../../../interface/Draggable.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import { INPUTTYPES } from '../../../enums/INPUTTYPES.js';
import LABEL from '../label/LABEL.js';
import LEGEND from '../legend/LEGEND.js';
import Movable from '../../../interface/Movable.js';
import P from '../p/P.js';
import { STATUS } from '../../../enums/STATUS.js';
import STRING from '../../../STRING.js';
/** An abstract Container element with NAVBAR
    @description A container can be expanded or hidden and have elements added to itself
    @class
    @extends GROUP
*/
export default class CONTAINER extends GROUP {
	// eslint-disable max-statements */
	/** @constructs CONTAINER
	    @param {EL} node Parent Node
	    @param {string} element HTML element Tag
	    @param {MODEL} model Model
	    @param {Array<string>} containers An array of strings representing child Containers that this Container can create
	*/
	constructor(node, element = 'DIV', model = new MODEL(), containers = []) {
		super(node, element, model);
		this.implement(new Movable(this));
		this.setId(model.id).addClass('container');
		['data', 'attributes', 'description'].map((e) => this.createElementCollection(e, model));
        /** @type {string} */
        this.label = this.required(model.label || element);
        /** @type {string} */
        this.name = this.required(model.name || element);
        /** @type {number} */
		this.shared = this.required(model.shared || 1);
		this.status = this.required(model.status || STATUS.DEFAULT);
		this.subsections = this.required(model.subsections ? model.subsections.split(',') : '0'); // Delimited list of child ids
		this.navheader = new NAVHEADER(this, new MODEL().set('label', this.label));
		this.navheader.implement(new Draggable(this));
		this.implement(new Draggable(this));
        this.body = new COLLAPSIBLE(this, new MODEL('body'));
        // Conside this as a method instead of for ALL Containers
        this.body.implement(new Clickable(this.body));
        this.addEvents();
        /** Moves this element UP one slot
	        @returns {ThisType} This Container
	    */
        this.moveUp = () => {
            console.log('container up');
            let n = $(this.el);
            if (n.prev().length > 0) {
                n.animate({
                    height: 'toggle'
                }, 300);
                setTimeout(() => {
                    n.prev().animate({
                        height: 'toggle'
                    }, 300).insertAfter(n).animate({
                        height: 'toggle'
                    }, 300);
                }, 0);
                setTimeout(() => {
                    n.animate({
                        height: 'toggle'
                    }, 300).delay(300);
                }, 300);
            }
        };
        /** Moves this element DOWN one slot
            @returns {ThisType} This Container
        */
        this.moveDown = () => {
            console.log('container down');
            let n = $(this.el);
            if (n.next().length > 0) {
                n.animate({
                    height: 'toggle'
                }, 300);
                setTimeout(() => {
                    n.next().animate({
                        height: 'toggle'
                    }, 300).insertBefore(n).animate({
                        height: 'toggle'
                    }, 300).delay(300);
                }, 0);
                setTimeout(() => {
                    n.animate({
                        height: 'toggle'
                    }, 300);
                }, 300);
            }
            return this;
        };
		// Cascade state
		// Add Navbar Items
		this.addElementItems(containers).then(() => this.addDomItems().then(() => this.addCrudItems()));
        this.setDefaultVisibility(model);
	}
	// eslint-enable max-statements */
    /** Generic construct method for EL/CONTAINER async actions and population
        @param {MODEL} model Model
        @returns {Promise<ThisType>} callback
    */
    construct(model) {
        //console.log(this.className + '.construct()');
        return this.callback(() => {
            //console.log(this.className + ' callback', this);
            this.constructElements();
            // Populate if model exists
            if (model) {
                if (model.children) {
                    return this.populate(model.children).then(
                        () => this.body.el.dispatchEvent(new Expand(this)));
                }
            }
            return this.ifEmpty();
        }, 'Unable to construct ' + this.className);
    }
    /** Performs async actions and constructs initial elements for this Container
        Called during the 'construct' phase of EL/CONTAINER building
        @abstract
	    @returns {Promise<DIALOG>} A Save PROMPT
	*/
	constructElements() {
		throw new AbstractMethodError(this.className + ' : Abstract method ' + this.className + '.constructElements() not implemented.');
	}
    /** Creates the Id and Collection attributes for the given name
	    @param {string} name ie: data, attributes, description
	    @param {MODEL} model Container Model
	    @returns {void}
	*/
	createElementCollection(name, model) {
		this[name + 'Id'] = parseInt(model[name + 'Id'] || 0);
		/** @type {Array<MODEL>} */
		this[name + 'Elements'] = [];
		try {
			DATAELEMENTS.CONTAINER[name].forEach((m) => this[name + 'Elements'].push(m));
			DATAELEMENTS[this.className][name].forEach((m) => this[name + 'Elements'].push(m));
		} catch (e) {
			if (!(e instanceof TypeError)) {
				console.warn('Unable to retrieve {' + this.className + '}[' + name + 'Elements] for ' + this.className, this, DATAELEMENTS[this.className], e);
			}
		}
	}
	/** If the Container has no children, display a button to create an element
	    Should be overridden on CONTAINERs that should not have children
	    @returns {Promise<ThisType>} callback
	*/
	ifEmpty() {
		return this.callback(() => {
            if (this.get().length === 0) {
				let btnAddElement = new EL(this.body.pane, 'DIV', new MODEL('btn-add-element'));
				btnAddElement.btn = new EL(btnAddElement, 'BUTTON', new MODEL().set('innerHTML', 'Add an Element to this ' + this.className));
				btnAddElement.btn.el.onclick = () => {
					this.navheader.expand().then(
						(navBar) => navBar.menu.expand().then(
							(nav) => nav.menu.expand().then(
								(n) => n.get('ELEMENTS').expand())));
					btnAddElement.destroy();
					return false;
				}
			}
		});
    }
    addEvents() {
        //this.body.el.addEventListener('select', () => console.log('Selected ' + this.className, this));
        //this.body.el.addEventListener('deselect', () => console.log('Deselected ' + this.className, this));
        this.body.el.addEventListener('select', () => {
            console.log('Selected ' + this.className, this);
            this.navheader.expand();
            this.getMain().focusBody();
        });
        this.body.el.addEventListener('deselect', () => {
            console.log('Deselected ' + this.className, this);
            this.navheader.collapse();
        });
        this.body.el.addEventListener('activate', () => {
            try {
                console.log('Activated ' + this.className);
                this.getMain().focusBody();
            } catch (e) {
                //console.warn('Unable to focus body', this);
            }
        });
        this.body.el.addEventListener('deactivate', () => {
            try {
                console.log('Deactivated ' + this.className);
                this.getMain().focusBody();
            } catch (e) {
                //console.warn('Unable to focus body', this);
            }
        });
    }
	/** Creates an editable EL for this CONTAINER
        @todo Consider making this into an ELEMENTFACTORY as this will scale quickly
        @param {string} name The Element to create,
        @param {EL} node Parent node
	    @returns {EL} Element
	*/
	createEditableElement(name, node) {
		return new Promise((resolve, reject) => {
			try {
				if (this.data[name]) {
					switch (name) {
						case 'header':
							this[name] = new HEADER(node, new MODEL().set('innerHTML', this.data[name]));
							break;
						case 'p':
							this[name] = new P(node, new MODEL().set('innerHTML', this.htmlDecode(this.data[name])));
							break;
						case 'legend':
							this[name] = new LEGEND(node, new MODEL().set('innerHTML', this.data[name]));
                            break;
                        case 'label':
                            this[name] = new LABEL(node, new MODEL().set('innerHTML', this.data[name]));
                            break;
						default:
							console.warn(name + ' does not have a valid constructor');
					}
                    this[name].implement(new Clickable(this[name]));
                    this[name].el.addEventListener('select', () => this.editData(name));
                    this[name].el.addEventListener('activate', () => this.body.el.dispatchEvent(new Activate(this.body)));
                    this[name].el.addEventListener('deactivate', () => this.body.el.dispatchEvent(new Deactivate(this.body)));
					//this[name].implement(new Selectable(this[name]));
					//this[name].clickHandler(() => false, () => this[name].select(), () => this.editData(name));
					resolve(this[name]);
				}
			} catch (e) {
				console.log('Unable to create ' + name, e);
				reject(e);
			}
		});
	}
	/** Hides the collection of named EL(s), optionally excluding those with the specified name
	    @param {Array<EL>} elements A collection of Elements to hide
	    @param {string} name Optional name of element to keep visible
	    @returns {Promise} Resolve on success
	*/
	hideElements(elements, name = '') {
		return Promise.all(elements.filter((ch) => ch.el.getAttribute('name') !== name).map((c) => c.hide()));
	}
	/** Launches a FORM POST editor for the specified element
        param {EL} element The EL who's model.data is being edited
        @param {string} name The name of the input we are editing
        @abstract
        @see CONTAINERFACTORY The CONTAINERFACTORY assigns editData() to this CONTAINER
	    @returns {Promise<DIALOG>} A Save PROMPT
	*/
	editData(name) {
		throw new AbstractMethodError('CONTAINER{' + this.className + '}[' + name + '] : Abstract method ' + this.className + '.editData(' + name + ') not implemented.');
	}
	/** Creates the default Container Inputs representing a Container's state for CRUD Actions
	    param {CONTAINER} container The specified container for crud actions
	    @returns {Array<MODEL>} An array of input models
	*/
	createContainerInputs() {
		let subsections = this.getSubSections();
		return [
			createInputModel('INPUT', 'className', this.className, 'className', 'HIDDEN', true),
			createInputModel('INPUT', 'element', this.element, 'element', 'TEXT', true),
			createInputModel('INPUT', 'id', this.id, 'ID', 'NUMBER', true),
			createInputModel('INPUT', 'label', typeof this.label === 'object' ? this.label.el.innerHTML.toString() : this.label.toString(), 'Label'),
			createInputModel('INPUT', 'subsections', subsections.length > 0 ? subsections.toString() : '0', 'SubSections', 'TEXT', true),
			createInputModel('INPUT', 'status', this.status.toString(), 'Status', 'NUMBER'), // should be dropdown
			createInputModel('BUTTON', 'dataId', this.dataId.toString(), 'dataId', 'FORMPOSTINPUT'),
			createInputModel('BUTTON', 'attributesId', this.attributesId.toString(), 'attributesId', 'FORMPOSTINPUT'),
			createInputModel('BUTTON', 'descriptionId', this.descriptionId.toString(), 'descriptionId', 'FORMPOSTINPUT'),
			createInputModel('INPUT', 'shared', this.shared.toString(), 'shared', 'CHECKBOX')
		];
	}
	/** Saves the state of the given Container
        @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
        @abstract
        @see CONTAINERFACTORY The CONTAINERFACTORY assigns save() to this CONTAINER
	    @returns {Promise} A Promise to save this Container
	*/
	save(noPrompt = false) {
		let msg = 'CONTAINER{' + this.className + '} : Abstract method ' + this.className + '.save(' + noPrompt + ') not implemented.';
		throw new AbstractMethodError(msg, this);
	}
	/** Extract the appropriate values and save
        @param {string} type Data type
	    @returns {void}
	*/
	quickSaveFormPost(type) {
		throw new AbstractMethodError('CONTAINER{' + this.className + '}[' + type + '] : Abstract method ' + this.className + '.quickSaveFormPost() not implemented.');
	}
	/** Restore Container View to defaults and refresh parent Container
	    @returns {void}
    */
	refreshParentContainer() {
		try {
			this.getMain().focusBody();
			//this.getMain().loader.hide();
		} catch (e) {
			console.log(e);
		}
		try {
			this.getContainer().refresh();
		} catch (e) {
			//console.log('Unable to reload Container);
			//location.reload(true);
			this.getMain().refresh();
		}
	}
	/** Saves this Container's parent Container
        @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
	    @returns {void}
    */
	saveParentContainer(noPrompt = false) {
		console.log('Saving parent container', this.getContainer());
		try {
			this.getContainer().save(noPrompt); // false // dialog.body, this.getContainer(), 
		} catch (e) {
			console.log('Unable to save parent Container', e);
		}
	}
	/** The default visibility state for menus and collapseable content
	    @param {MODEL} model The CONTAINER object retrieved from the server
	    @returns {Array<boolean>} Array of results
	*/
	setDefaultVisibility(model) {
		if (model.data) {
			let a = model.data.collapsed === '1' ? this.navheader.tab.deactivate() : this.navheader.tab.activate();
			let b = model.data.collapsed === '1' ? this.body.collapse() : this.body.expand();
			let c = model.data.showNav === '1' ? this.navheader.expand() : this.navheader.collapse();
			return [a, b, c];
		}
		return [false, false];
	}
	/** Adds the default Data Element Container Cases to the ELEMENTS Menu 
	    @param {Array} containerList An array of container class names
	    @returns {void}
	*/
	addElementItems(containerList) {
		return this.callback(() => {
			if (containerList.length > 0) {
				let defaultContainers = [];
				containerList.splice(2, 0, ...defaultContainers);
				Promise.all([containerList.map((c) => this.addContainerCase(c))]);
			}
		});
	}
	/** HTML Encode the given value.
	    Create a in-memory div, set it's inner text(which jQuery automatically encodes
	    then grab the encoded contents back out.  The div never exists on the page.
	    @todo This really should just be an extention of the String class
	    @param {string} value The string to be html encoded
	    @returns {text} An html encoded string
    */
	htmlEncode(value) {
		return $('<div/>').text(value).html();
	}
	/** Decodes an HTML encoded value back into HTML string
	    @todo This really should just be an extention of the String class
	    @param {string} value An html encoded string
	    @returns {string} A string that was previously html encoded
    */
	htmlDecode(value) {
		return $('<div/>').html(value).text();
    }
	/** Empties the Container Pane and reconstructs its contents based on the current model
        @param {MODEL} model By default, use this CONTAINER's model
        @returns {Promise<ThisType>} callback
    */
    refresh(model = this) { // Optionally retrieve a new MODEL
        console.log('Refresh', this);
        return this.callback(
            () => this.getLoader().log(20, 'Refreshing CONTAINER{' + this.className + '}[' + this.id + ']').then(
                (loader) => {
                    console.log('Refreshing ' + this.className, this);
                    this.body.pane.empty().then(
                        () => this.loadModel(model, (result) => console.log('Loaded Model', result)).then(
                            () => loader.log(100)));
                }
            ), 'Unable to refresh ' + this.className);
	}
	/** Closes parent menus
	    @param {MENU} menu Menu
	    @returns {Promise<ThisType>} callback
	*/
	closeMenus(menu) {
		console.log('closemenus', this);
		return this.callback(() => menu.deactivate().then(() => this.navheader.toggle()));
	}
	/** Creates a NavItem that closes its menu on mouseup
	    @param {string} className className
	    @param {MENU} menu The NavItem Group to add items to (ie: CRUD, DOM)
	    @param {boolean} close If true (default), parent menu is closed after click
	    @returns {NAVITEMICON} A Nav Item
	*/
	createNavItem(className, menu, close = true) {
		try {
			let item = menu.addNavItemIcon(new MODEL().set({
				icon: ICONS[className],
				label: className
			}));
			if (close) {
				item.el.addEventListener('mouseup', () => menu.el.dispatchEvent(new Deactivate()));
			}
			return item;
		} catch (e) {
			console.warn(this.className + '.createNavItem(' + className + ') failed. Unable to create Constructor Button for CONTAINER{ ' + this.className + '}', e);
			return null;
		}
	}
	/** Creates a collection of NavItems that close Menus on mouseup
	    @param {Array<string>} arr List of NavItem labels
	    @param {MENU} menu Menu to add to
	    @returns {any} An object containing NavItems
	*/
	createNavItems(arr, menu) {
		let items = {};
		arr.map((i) => {
			items[i] = this.createNavItem(i, menu);
		});
		return items;
	}
	/** Adds default items to the DOM Menu
	    @returns {GROUP} A Menu Group
	*/
	addDomItems() {
		return this.callback(() => {
            let menu = this.navheader.menus.get('OPTIONS', 'MENU')[0].get('DOM', 'MENU');
			let items = this.createNavItems(['UP', 'DOWN', 'REFRESH', 'REMOVE', 'DELETE', 'FULLSCREEN'], menu[0]);
			items.UP.el.onclick = () => this.moveUp();
			items.DOWN.el.onclick = () => this.moveDown();
			items.REFRESH.el.onclick = () => this.getMain().focusBody().then(() => this.refresh());
            items.REMOVE.el.onclick = () => this.getMain().focusBody().then(() => this.removeDialog());
			items.DELETE.el.onclick = () => this.disable();
			items.FULLSCREEN.el.onclick = () => document.documentElement.requestFullscreen();
		});
	}
	/** Adds the CRUD Nav Items
        @returns {GROUP} A Menu Group
	*/
	addCrudItems() {
		return this.callback(() => {
            let menu = this.navheader.menus.get('OPTIONS', 'MENU')[0].get('CRUD', 'MENU');
			let items = this.createNavItems(['LOAD', 'SAVEAS', 'SAVE'], menu[0]);
			items.LOAD.el.onclick = () => this.load();
			items.SAVEAS.el.onclick = () => this.save();
			items.SAVE.el.onclick = () => this.save(true);
		});
	}
	/** Performs addCase() for the given Element within a 
        Container of an element that extends Container
        Sets the constructor callback for this element
        and adds respective button to this container
        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
        @returns {void}
    */
	addContainerCase(className, addButton = true) {
		return new Promise((resolve, reject) => {
			try {
				if (typeof this.getMain() !== 'undefined') {
					if (addButton) {
                        let menu = this.navheader.menus.get('OPTIONS', 'MENU')[0].get('ELEMENTS', 'MENU');
						let item = this.addContainerCaseButton(className, menu[0]);
						item.el.addEventListener('click', () => this.create(new MODEL().set('className', className)));
						item.el.addEventListener('mouseup', () => menu[0].el.dispatchEvent(new Deactivate()));
					}
					this.addCallback(className, (model) => {
						try {
							resolve(this.getMain().getFactory().get(this.body.pane, className, model.id || 0));
						} catch (ee) {
							console.warn('Unable to retrieve factory for Container Case', ee);
							reject(ee);
						}
					});
				}
			} catch (e) {
				console.warn(this.className + '.addContainerCase(' + className + '): Unable to add Container Case', e);
				reject(e);
			}
		});
	}
	/** Adds a button to the given menu that promises to construct the given CONTAINER name
	    @param {string} className CONTAINER class name to construct
	    @param {MENU} menu Parent Menu
	    param {boolean} close If true (default), menus are closed after click
	    @returns {NAVITEMICON} Clickable Nav Item 
	*/
	addContainerCaseButton(className, menu) {
		try {
			return menu.addNavItemIcon(new MODEL().set({
				icon: ICONS[className],
				label: className
			}));
		} catch (e) {
			console.warn('Unable to create Constructor Button for CONTAINER{' + this.className + '}', e);
		}
    }
	/** Returns the CONTAINER Element id attribute
	    @returns {string} Container name
	*/
	getId() {
		return this.el.getAttribute('id');
	}
	/** Sets this Container's unique identifier to the given id
	    @param {number} id Container UId
	    @returns {ThisType} callback
	*/
	setId(id) {
		/** CONTAINER unique id
		    @property {number} id
		*/
		this.id = id;
		this.el.setAttribute('id', id);
		this.data.id = id;
		this.attributes.id = id;
		return this;
	}
	/** Returns the CONTAINER's name attribute
	    @returns {string} Container name
	*/
	getName() {
		return this.el.getAttribute('name');
	}
	/** Sets the name of this element to the given value.
	    @param {string} name The name to be set
	    @returns {void}
	*/
	setName(name) {
		if (typeof name !== 'undefined' && name !== null) {
			this.el.setAttribute('name', name);
            this.name = name;
		}
	}
	/** Loads the specified MODEL by UId into CONTAINER 
        Retrieves the MODEL from GET/{id} (if permitted)
		then Populates accordingly
	    @todo Prompt the user for an Id to load
	    @todo create a simple application browser to retrieve a MAIN
		@param {number} id App Id to load
		@returns {MAIN} This MAIN
	*/
    load(id) {
        return new Promise((resolve, reject) => {
            // Consider verifying cache before retrieving
            try {
                if (id >= 0) {
                    $.getJSON(this.className + '/GET/' + id, (payload) => {
                        if (payload.result === 1) {
                            this.loadModel(payload.model, resolve);
                        } else {
                            reject(new Error('Failed to retrieve ' + this.className + '(' + this.id + ') from server\n' + payload.message));
                        }
                    });
                } else {
                    console.log('Invalid Id to Load');
                    resolve(this);
                }
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Loads the given MODEL into CONTAINER.body.pane
	    @param {MODEL} model Model
	    @param {Promise.resolve} resolve Promise resolver function
	    param {Promise.reject} reject Promise reject function
	    @returns {Promise<ThisType>} callback
	*/
    loadModel(model, resolve) {
        console.log(this.className + '.loadModel()', model);
        return this.callback(() => {
            if (model.label) {
                document.title = model.label;
            }
            resolve(this.make(model));
            /*
            this.merge(model).then(
                () => this.construct(model).then(
                    () => this.body.pane.empty().then(
                        () => resolve(this.populate(model.children)))));
                //this.setElementAttributes(model).then(() => resolve(this.populate(model.children)));
            */
        }, 'Unable to construct ' + this.className + '(' + this.id + ')');
    }
    /** Sets Id, Label and Name based on MODEL
        @param {MODEL} model MODEL
        @returns {Promise<ThisType>} callback
    */
    setElementAttributes(model) {
        return this.callback(() => {
            this.setId(model.id);
            this.setLabel(model.label);
            this.setName(model.name);
        }, 'Unable to set ' + this.className + ' Attributes');
    }
	/** Generates an array of subsection Ids for this Container
	     @returns {array} A collection of subsection ids
    */
	getSubSections() {
		//console.log(this.className + '.getSubsections()', this);
		let id = null;
		let subsections = [];
		for (let c = 0; c < this.body.pane.el.children.length; c++) {
			id = parseInt(this.body.pane.el.children[c].id);
			if (!isNaN(id)) {
				subsections.push(id);
			}
		}
		return subsections;
	}
	/** Returns the MAIN container
	    @returns {MAIN} The MAIN Container class
	    @throws Will throw an error 
	*/
	getMain() {
		try {
			return this.getProtoTypeByClass('MAIN');
		} catch (e) {
			switch (this.getProtoTypeByClass('MODAL').className) {
				case 'LOADER':
					console.warn('Modals exist in body.document and do not have a parent Container');
					break;
				case 'PROMPT':
					console.warn('Prompts exist in body.document and do not have a parent Container');
					break;
				default:
					console.log(this.className + ' does not have a parent Container.', this, this.getProtoTypeByClass('MODAL'));
			}
		}
	}
	/** Parent CONTAINER attempts to perform a QuickSave
	    @returns {Boolean} Returns true if successful
	*/
	quickSaveParent() {
		try {
			return this.container.save(this, this.container, false);
		} catch (e) {
			console.log('Container.QuickSaveParent() No parent exists');
			return false;
		}
	}
	/** Actions performed after this container is saved
        @param {Payload} payload Form Response Payload
        @returns {void}
    */
	afterSuccessfulPost(payload) {
		console.log(100, 'Post Results', payload);
	}
	/** Returns the label for this section
	    @returns {string} The label
	*/
	getLabel() {
		return this.header.getLabel();
	}
	/** Sets the label of this element to the given value.
		@param {string} label The name to be set
	    @returns {void}
	*/
	setLabel(label) {
		this.navheader.tab.anchor.label.setInnerHTML(label);
		this.label = label;
	}
	/** Sets the subsection array to the given value
		@param {Array<number>} subsections Sub Section UID array
	    @returns {void}
	*/
	setSubSections(subsections) {
        this.subsections = subsections;
	}
	/** Toggles visibility of any child Container Headers
        @returns {Promise<ThisType>} callback
	*/
	toggleHeaders() {
		return this.callback(() => $(this.el).find('.container > nav').toggle());
	}
	/** Creates a DIALOG and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
        @returns {Promise} A promise to remove the element from the DOM
    */
	removeDialog() {
		return new Promise((resolve, reject) => {
			try {
				let dialog = new DIALOG(new MODEL().set({
					label: 'Remove ' + this.className + '{' + this.element + '}[' + this.id + '] from ' + this.container.className,
					container: this.getMain(),
					caller: this.getContainer() //.getMain()
				}));
				dialog.footer.buttonGroup.addButton('Yes, Remove ' + this.className, ICONS.REMOVE).el.onclick = () => {
                    this.getLoader().log(50, 'Remove', true).then(() => { //loader
                        console.log('Removing...');
						this.destroy().then(() => {
							try {
								this.container.save(true).then(() => {
									resolve(dialog.close());
								});
							} catch (ee) {
								reject(ee);
							}
						});
					});
				};
				dialog.show();
			} catch (e) {
				console.log('Unable to disable this ' + this.element, e);
				reject(e);
			}
		});
	}
	/** Typically this function is used within JQuery posts.
        If the results are a Payload and its status is "success",
        the page is reloaded.
        @param {object} payload A post payload
        @param {any} status Result status
        @returns {void} 
    */
	ajaxRefreshIfSuccessful(payload, status) {
		return new Promise((resolve, reject) => {
			this.getLoader().log(80, '...', true).then((loader) => {
				console.log('ajaxRefreshIfSuccessful: Payload', payload, 'status', status);
				try {
					if (payload.result === 1) { //!== 0 
						let url = new URL(window.location.href);
						let returnUrl = url.searchParams.get('ReturnUrl');
						if (returnUrl) {
							location.href = url.origin + returnUrl;
							loader.log(100, location.href).then(() => resolve(location.href));
						} else {
							loader.log(100, location.href).then(() => resolve(location.reload(true)));
						}
					} else {
						let err = 'Unable to POST results to server with status: "' + status + '"';
						//console.log(err, payload);
						loader.log(100, location.href, true, 3000).then(() => reject(new Error(err)));
					}
				} catch (e) {
					loader.log(100, location.href, true, 3000).then(() => reject(e));
				}
			});
		});
	}
	/** Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
        @returns {void}
    */
	disable() {
		return new Promise((resolve, reject) => {
			let main = this.getContainer().getMain();
			main.getLoader().log(20, 'Disable ' + this.className).then((loader) => {
				try {
					let dialog = new DIALOG(new MODEL().set({
						label: 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']',
						container: main,
						caller: main
					}));
					dialog.footer.buttonGroup.addButton('Yes, Disable ' + this.className, ICONS.REMOVE)
						.el.onclick = () => loader.log(50, 'Disable', true).then(
							() => this.destroy().then(
								() => {
									try {
										console.warn('TODO: Should save parent container (if exists)');
										//this.container.save(true).then(() => {
										console.log('/' + this.className + '/DISABLE/' + this.id);
										$.post('/' + this.className + '/DISABLE/' + this.id, {
											'__RequestVerificationToken': this.getToken()
										}, (data) => {
											console.log('RESULTS', data);
											resolve(dialog.closeDialog());
										});
										//});
									} catch (ee) {
										reject(ee);
									}
								}));
					loader.log(100).then(() => dialog.show());
				} catch (e) {
					console.log('Unable to disable this ' + this.element, e);
					loader.log(0).then(() => reject(e));
				}
			});
		});
	}
	/** Creates a DATEOBJECT using this Container's dateCreated attribute
	    @returns {DATEOBJECT} An easy to use date object
	*/
	getDateCreated() {
		return DATEOBJECT.getDateObject(new STRING(this.dateCreated).getDateValue(this.dateCreated));
    }
    /** Retrieves the token value from the DOM Meta tags
	    @returns {string} A request verification token
	*/
    getToken() {
        return document.getElementsByTagName('meta').token.content;
    }
}
export { AbstractMethodError, Activate, ATTRIBUTES, Collapse, Collapsible, createInputModel, DATAELEMENTS, DATEOBJECT, Deactivate, DIALOG, EL, Expand, FOOTER, HEADER, ICONS, INPUTTYPES, MENU, MODEL, NAVITEM, NAVITEMICON, STRING }
/* eslint-enable max-lines */