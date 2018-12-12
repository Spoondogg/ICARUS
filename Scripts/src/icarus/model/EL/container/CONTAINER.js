/* eslint-disable max-lines */
/** @module */
import { DATAELEMENTS, createInputModel } from '../../../enums/DATAELEMENTS.js';
import GROUP, { ATTRIBUTES, EL, MODEL } from '../group/GROUP.js';
import AbstractMethodError from '../../../error/AbstractMethodError.js';
import CONTAINERBODY from './CONTAINERBODY.js';
import DATEOBJECT from '../../../helper/DATEOBJECT.js';
import DIALOG from '../dialog/DIALOG.js';
//import DIV from '../div/DIV.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import { INPUTTYPES } from '../../../enums/INPUTTYPES.js';
import LEGEND from '../legend/LEGEND.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import P from '../p/P.js';
//import PROMPT from '../dialog/prompt/PROMPT.js'; You can't have prompt in here because it has a FORM
import { STATUS } from '../../../enums/STATUS.js';
import STRING from '../../../STRING.js';
/** An abstract Container element with NAVBAR
    @description A container can be expanded or hidden and have elements added to itself
    @class
    @extends GROUP
*/
export default class CONTAINER extends GROUP {
	/* eslint-disable max-statements */
	/** @constructs CONTAINER
	    @param {EL} node The element to contain the section
	    @param {string} element HTML element
	    @param {MODEL} model The CONTAINER object retrieved from the server
	    @param {Array<string>} containers An array of strings representing child Containers that this Container can create
	*/
	constructor(node, element, model = new MODEL(), containers = []) {
		super(node, element, model);
        this.setId(model.id).addClass('container');        
        /** If true, invokes double click
            @property {boolean} tappedTwice
        */
        this.tappedTwice = false;
		/** Data model unique id
            @property {number} dataId
        */
		this.dataId = model.dataId || 0;
		/** An array of Input MODELs
            @property {Array<MODEL>} dataElements 
        */
		this.dataElements = [];
		try {
			DATAELEMENTS.CONTAINER.data.forEach((m) => this.dataElements.push(m));
			DATAELEMENTS[this.className].data.forEach((m) => this.dataElements.push(m));
		} catch (e) {
			console.warn('Unable to retrieve dataElements for ' + this.className);
		}
		/** Attribute model unique id
            @property {number} attributesId
        */
        this.attributesId = model.attributesId || 0;
        /** @type {Array<MODEL>} An array of Input MODELs */
        this.attrElements = [];
        try {
            DATAELEMENTS.CONTAINER.attributes.forEach((m) => this.attrElements.push(m));
            DATAELEMENTS[this.className].attributes.forEach((m) => this.attrElements.push(m));
        } catch (e) {
            console.warn('Unable to retrieve dataElements for ' + this.className);
        }
		/** Description model unique id
            @property {number} descriptionId
        */
		this.descriptionId = model.descriptionId || 0;
		
        /** Human readable label
            @property {string} label
        */
        this.label = model.label || element;
        /** Code friendly identifier
            @property {string} name
        */
        this.name = model.name || element;
        /** Toggles public sharing of this CONTAINER
            @property {number} shared
        */
		this.shared = model.shared || 1;
		this.status = model.status || STATUS.DEFAULT;           
        this.subsections = model.subsections ? model.subsections.split(',') : '0'; // Delimited list of child ids

        /** The Container NAVBAR 
            @property {NAVBAR} navBar 
        */
        this.navBar = new NAVBAR(this, new MODEL().set('label', this.label));
		this.createDraggableNavBar();
        this.body = new CONTAINERBODY(this, model);
        this.body.clickHandler(() => this.body.select(), () => this.toggleNav());
        this.addNavBarDefaults();
        this.addDefaultContainers(containers);
		this.setDefaultVisibility(model);
        this.construct();
        this.ifEmpty();
        
	}
	/* eslint-enable max-statements */
	/** Abstract construct method throws an error if not declared 
		@abstract
	    @returns {void}
	*/
	construct() {
		if (this.className !== 'CONTAINER') {
			throw new AbstractMethodError('CONTAINER{' + this.className + '} : Abstract method ' + this.className + '.construct() not implemented.');
		}
    }
    /** If the Container has no children, display a button to create an element
        Should be overridden on CONTAINERs that should not have children
        @returns {void}
    */
    ifEmpty() {
        if (this.children.length === 0) {
            let btnAddElement = new EL(this.body.pane, 'DIV', new MODEL('btn-add-element'));
            btnAddElement.btn = new EL(btnAddElement, 'BUTTON', new MODEL(), 'Add an Element to this ' + this.className);
            btnAddElement.btn.el.onclick = () => {
                this.showNav().navBar.menu.menu.toggleCollapse().getGroup('ELEMENTS').toggleCollapse();
                btnAddElement.destroy();
                return false;
            }
        }
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
                            this[name] = new HEADER(node, new MODEL().set('label', this.data[name]));
                            break;
                        case 'p':
                            this[name] = new P(node, new MODEL(), this.htmlDecode(this.data[name]));
                            break;
                        case 'legend':
                            this[name] = new LEGEND(node, new MODEL().set('label', this.data[name]));
                            break;
                        default:
                            console.warn(name + ' does not have a valid constructor');
                    }
                    this[name].clickHandler(() => this[name].select(), () => this.editData(name));
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
        return Promise.resolve(
            elements
                .filter((ch) => ch.el.getAttribute('name') !== name)
                .map((c) => c.hide()));
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
            let a = model.data.collapsed === '1' ? this.collapse() : this.show();
            let b = model.data.showNav === '1' ? this.navBar.show() : this.navBar.hide();
            return [a, b];
        }
        return [false, false];
	}
	/** Adds the default Container Cases to the CRUD Menu
	    @param {Array} containerList An array of container class names
	    @returns {void}
	*/
	addDefaultContainers(containerList) {
        // containerList.splice(2, 0, ...['FORM', 'MENU', 'BANNER', 'TEXTBLOCK']).forEach((c) => this.addContainerCase(c));
        let defaultContainers = []; // 'FORM', 'MENU', 'BANNER', 'TEXTBLOCK' //, 'IFRAME'  'LIST', 'MENULIST', 'JUMBOTRON' 'CHAT'
        containerList.splice(2, 0, ...defaultContainers);
        containerList.forEach((c) => this.addContainerCase(c));
	}
	/** Drag containers by their NavBars
	    @see https://www.w3schools.com/jsref/event_ondrag.asp
	    @returns {void}
	*/
	createDraggableNavBar() {
		this.navBar.el.setAttribute('draggable', true);
		this.navBar.el.ondragstart = (ev) => {
			console.log('Dragging Container: ' + this.className + '(' + this.id + ') ' + this.label);
			this.collapse();
			ev.dataTransfer.setData("Container", this.id);
		};
		// Drop the Container
		this.navBar.el.ondrop = (ev) => {
			console.log('Dropping onto Container: ' + this.className + '(' + this.id + ')');
			ev.preventDefault();
			let container = $(document.getElementById(ev.dataTransfer.getData("Container")));
			container.insertBefore(this.el);
			container.collapse('show');
		};
		// Allow drop on this Container
		this.navBar.el.ondragover = (ev) => {
			//console.log('Dragging over ' + this.className + '(' + this.id + ')');
			ev.preventDefault();
		};
		this.navBar.el.ondragend = () => { //this.navBar.el.ondragend = (ev) => {
			// Drag Ending
		};
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
	/** Moves this element UP one slot
	    @returns {ThisType} This Container
	*/
	moveUp() {
		let node = $(this.el);
		if (node.prev().length > 0) {
			node.animate({ height: 'toggle' }, 300);
			setTimeout(() => {
				node.prev().animate({ height: 'toggle' }, 300).insertAfter(node).animate({ height: 'toggle' }, 300);
			}, 0);
			setTimeout(() => {
				node.animate({ height: 'toggle' }, 300).delay(300);
			}, 300);
		}
		return this;
	}
	/** Moves this element DOWN one slot
	    @returns {ThisType} This Container
	*/
	moveDown() {
		let node = $(this.el);
		if (node.next().length > 0) {
			node.animate({ height: 'toggle' }, 300);
			setTimeout(() => {
				node.next().animate({ height: 'toggle' }, 300).insertBefore(node).animate({ height: 'toggle' }, 300).delay(300);
			}, 0);
			setTimeout(() => {
				node.animate({ height: 'toggle' }, 300);
			}, 300);
		}
		return this;
	}
	/** Empties the Container Pane and reconstructs its contents 
        based on the current model
        @returns {void}
    */
	refresh() {
		console.log(0, 'Refreshing CONTAINER{' + this.className + '}[' + this.id + ']');
		this.body.pane.empty();
		const [...children] = this.body.pane.children;
		this.body.pane.children = [];
		this.construct();
		this.populate(children);
    }
    /** Closes parent menus
        @param {GROUP} group Menu Group
        @returns {void}
    */
    closeMenus(group) {
        group.toggleCollapse();
        this.navBar.menu.toggleCollapse();
    }
    /** Creates a NavItem that closes its menu on mouseup
        @param {string} className className
        @param {GROUP} group The NavItem Group to add items to (ie: CRUD, DOM)
        @param {boolean} close If true (default), menus are closed after click
        @returns {NAVITEMICON} A Nav Item
    */
    createNavItem(className, group, close = true) {
        try {
            let item = group.addNavItemIcon(new MODEL().set({
                icon: ICONS[className],
                label: className
            }));
            if (close) {
                item.el.onmouseup = () => this.closeMenus(group);
            }
            return item;
        } catch (e) {
            console.warn(e);
            return null;
        }
    }
    /** Creates a collection of NavItems that close Menus on mouseup
        @param {Array<string>} arr List of NavItem labels
        @param {GROUP} group The NavItem Group to add items to (ie: CRUD, DOM)
        @returns {any} An object containing NavItems
    */
    createNavItems(arr, group) {
        let items = {};
        arr.forEach((i) => {
            items[i] = this.createNavItem(i, group);
        });
        return items;
    }

    /** Adds default groups to the Option Menu
	    @returns {GROUP} A Menu Group
	*/
    addOptionGroups() {
        let group = this.navBar.menu.menu.getGroup('OPTIONS');
        let items = this.createNavItems(['ELEMENTS', 'CRUD', 'DOM', 'USER'], group);
        items.ELEMENTS.el.onmouseup = () => false;
        items.ELEMENTS.el.onclick = (ev) => {
            console.log('ELEMENTS');
            this.navBar.menu.menu.toggleCollapse().getGroup('ELEMENTS').toggleCollapse();
            ev.stopPropagation();
            ev.preventDefault();
        }
        items.CRUD.el.onclick = () => {
            console.log('CRUD');
            this.navBar.menu.toggleCollapse().menu.getGroup('CRUD').toggleCollapse();
        }
        items.DOM.el.onclick = () => {
            console.log('DOM');
        }
        items.USER.el.onclick = () => {
            console.log('USER');
        }
        return group;
    }

	/** Adds default items to the DOM Menu
	    @returns {GROUP} A Menu Group
	*/
    addDomItems() {        
        let group = this.navBar.menu.menu.getGroup('DOM');
        let items = this.createNavItems(['UP', 'DOWN', 'REFRESH', 'REMOVE', 'DELETE', 'FULLSCREEN'], group);
        items.UP.el.onclick = () => this.up();
        items.DOWN.el.onclick = () => this.down();
        items.REFRESH.el.onclick = () => this.refresh();
        items.REMOVE.el.onclick = () => this.remove();
        items.DELETE.el.onclick = () => this.disable();
        items.FULLSCREEN.el.onclick = () => document.documentElement.requestFullscreen();
        return group;
    }
    /** Adds the CRUD Nav Items
        @returns {GROUP} A Menu Group
	*/
    addCrudItems() {
        let group = this.navBar.menu.menu.getGroup('CRUD');
        let items = this.createNavItems(['LOAD', 'SAVEAS', 'SAVE'], group);
        items.LOAD.el.onclick = () => this.load();
        items.SAVEAS.el.onclick = () => this.save();
        items.SAVE.el.onclick = () => this.save(true);
        return group;
    }
	/** Adds default DOM, CRUD and ELEMENT Nav Items to the Option Dropdown Menu
        @returns {void}
    */
    addNavBarDefaults() {
        if (this.navBar.menu.menu) {
            this.addOptionGroups();
			this.addDomItems();
            this.addCrudItems();
		}
	}
	/** Adds a button to the options menu that promises to construct the given CONTAINER name
        @param {string} className CONTAINER class name to construct
        @returns {NAVITEMICON} Clickable Nav Item 
    */
    addConstructContainerButton(className) {        
        try {
            let group = this.navBar.menu.menu.getGroup('ELEMENTS');
            let item = this.createNavItem(className, group);
            item.el.onclick = () => this.create(new MODEL(className).set({
                className
            }));
            return item;
		} catch (e) {
			console.warn('Unable to create Constructor Button for CONTAINER{' + this.className + '}', e);
		}
	}
	/** Performs addCase() for the given Element within a 
        Container of an element that extends Container
        Sets the constructor callback for this element
        and adds respective button to this container
        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
        @todo Verify if inline function can be shorthand
        @returns {void}
    */
    addContainerCase(className, addButton = true) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof this.getMain() !== 'undefined') {
                    if (addButton) {
                        this.addConstructContainerButton(className);
                    }
                    this.addCase(className, (model) => {
                        try {
                            this.getMain().getFactory().get(this.body.pane, className, model.id || 0).then((r) => {
                                resolve(r);
                            });
                        } catch (ee) {
                            console.warn('Unable to retrieve factory for Container Case', ee);
                            reject(ee);
                        }
                    });                    
                }
            } catch (e) {
                console.warn(this.className + ': Unable to add Container Case', e);
                reject(e);
            }
        });
    }
    /** Moves the Container up one slot in the DOM
	    @returns {void}
	*/
    up() {
        this.navBar.menu.toggleCollapse();
        this.moveUp();
    }
	/** Moves the Container down one slot in the DOM
	    @returns {void}
	*/
    down() {
        this.navBar.menu.toggleCollapse();
        this.moveDown();
    }
	/** Overrides EL.open();
        Opens the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        @returns {void}
    */
	open() {
		try {
			this.status = STATUS.OPEN;
			super.open();
			this.el.setAttribute('data-status', 'open');
			this.header.btnLock.icon.el.className = ICONS.UNLOCK;
			this.header.options.el.removeAttribute('disabled');
		} catch (e) {
			console.log('Unable to open parent.', e);
		}
	}
	/** Closes the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        and update accordingly
        @returns {void}
    */
	close() {
		console.log('Locking ' + this.element + '(' + this.getId() + ')');
		this.status = STATUS.CLOSED;
		this.node.close();
		this.el.setAttribute('data-status', 'closed');
		// If section is open and we are trying to lock, we must first lock the children
        console.log(this.element + ' has ' + this.children.length + ' child(ren)');
        this.children.forEach((s) => {
            if (s.status === STATUS.OPEN) {
                s.close();
            }
        });
		console.log('Children are closed. Closing ' + this.element + '(' + this.getId() + ')');
		this.header.btnLock.icon.el.className = ICONS.LOCK;
		$(this.header.btnLock.el).removeClass('active');
		this.header.options.el.setAttribute('disabled', 'disabled');
		console.log('Locked');
	}
	/** Returns the CONTAINER's name attribute
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
		this.el.setAttribute('name', name);
		this.model.name = name;
	}
	/** Collapses the container's body
	    @returns {boolean} true if hidden
	    @returns {void}
	*/
	collapse() {
		try {
			$(this.body.el).collapse('hide');
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	/** Expands the container's body
        @returns {void}
    */
	show() {
		try {
			$(this.body.el).collapse('show');
		} catch (e) {
			console.warn(e);
		}
    }
    /** Swipe Up Event
        @returns {void}
    */
    swipeUp() {
        //this.hideNav();
    }
    /** Swipe Down Event
        @returns {void}
    */
    swipeDown() {
        //this.showNav();
    }
    /** Collapses the NavBar
        @returns {void}
    */
    toggleNav() {
        this.navBar.toggle();
    }
    /** Collapses the NavBar
        @returns {void}
    */
    hideNav() {
        console.log('Hiding ' + this.className + ' navBar', this);
        this.navBar.hide();
    }
    /** Expands the NavBar
        @returns {ThisType} callback
    */
    showNav() {
        this.navBar.show();
        return this;
    }
	/** Toggles the collapsed state of the container's body
        @returns {void}
    */
	toggleBody() {
		$(this.body.el).collapse('toggle');
	}
	/** An abstract load method for a CONTAINER
        @abstract
        @throws {AbstractMethodError} Throws an AbstractMethodError if no load method specified
        @returns {void}
    */
	load() {
		throw new AbstractMethodError('CONTAINER{' + this.className + '}.load() : Abstract method ' + this.className + '.load() not implemented.');
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
	    @returns {CONTAINER} The MAIN Container
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
    /** Retrieve the application loader
        @returns {LOADER} Loader
    */
    getLoader() {
        try {
            return this.getMain().getLoader();
        } catch (e) {
            return null;
        }
    }
	/** Sets the label of this element to the given value.
		@param {string} label The name to be set
	    @returns {void}
	*/
	setLabel(label) {
		this.navBar.menu.tab.anchor.setInnerHTML(label);
		this.label = label;
	}
	/** Sets the subsection array to the given value
		@param {array} subsections Sub Section UID array
	    @returns {void}
	*/
	setSubSections(subsections) {
		this.model.subsections = subsections;
	}
	/** Toggles visibility of any child Container Headers
        @returns {void}
	*/
	toggleHeaders() {
		$(this.el).find('.container > nav').toggle();
		console.log('CONTAINER.toggleHeaders()');
	}
	/** Creates a DIALOG and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
        @returns {Promise} A promise to remove the element from the DOM
    */
	remove() {
		return new Promise((resolve, reject) => {
			try {
				let dialog = new DIALOG(new MODEL().set({
                    label: 'Remove ' + this.className + '{' + this.element + '}[' + this.id + '] from ' + this.container.className,
                    container: this.getMain()
				}));
				dialog.footer.buttonGroup.addButton('Yes, Remove ' + this.className, ICONS.REMOVE).el.onclick = () => {
                    this.getLoader().log(50, 'Remove', this).then((loader) => {
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
		console.log('ajaxRefreshIfSuccessful: Payload', payload, 'status', status);
		if (payload.result === 1) { //!== 0 
			let url = new URL(window.location.href);
			let returnUrl = url.searchParams.get('ReturnUrl');
			if (returnUrl) {
				location.href = url.origin + returnUrl;
			} else {
				location.reload(true);
			}
		} else {
			console.log('Unable to POST results to server with status: "' + status + '"', payload);
		}
	}
	/** Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
        @returns {void}
    */
    disable() {
        return new Promise((resolve, reject) => {
            try {
                let dialog = new DIALOG(new MODEL().set({
                    label: 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']',
                    container: this.getMain()
                }));
                dialog.footer.buttonGroup.addButton('Yes, Disable ' + this.className, ICONS.REMOVE).el.onclick = () => {
                    this.getLoader().log(50, 'Disable', this).then((loader) => {
                        this.destroy().then(() => {
                            try {
                                this.container.save(true).then(() => {
                                    console.log('/' + this.className + '/DISABLE/' + this.id);
                                    $.post('/' + this.className + '/DISABLE/' + this.id, {
                                        '__RequestVerificationToken': this.getToken() //token.value
                                    }, //this.ajaxRefreshIfSuccessful);
                                        (data) => {
                                            console.log('RESULTS', data);
                                            resolve(dialog.close());
                                        }
                                    );
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
	/** Creates a DATEOBJECT using this Container's dateCreated attribute
	    @returns {DATEOBJECT} An easy to use date object
	*/
	getDateCreated() {
		return DATEOBJECT.getDateObject(new STRING(this.dateCreated).getDateValue(this.dateCreated));
    }
}
export { AbstractMethodError, ATTRIBUTES, createInputModel, DATAELEMENTS, DATEOBJECT, DIALOG, EL, FOOTER, HEADER, ICONS, INPUTTYPES, MODEL, STRING };
/* eslint-enable max-lines */