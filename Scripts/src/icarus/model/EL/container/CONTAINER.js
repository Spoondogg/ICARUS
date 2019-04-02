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
import FACTORY from '../../FACTORY.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import { INPUTTYPES } from '../../../enums/INPUTTYPES.js';
import LABEL from '../label/LABEL.js';
import LEGEND from '../legend/LEGEND.js';
import MissingContainerError from '../../../error/MissingContainerError.js';
import Movable from '../../../interface/Movable.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import P from '../p/P.js';
import { STATUS } from '../../../enums/STATUS.js';
import STRING from '../../../STRING.js';
/** An abstract CONTAINER Element with NAVBAR
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
	    @param {Array<string>} containerList An array of strings representing child Containers that this Container can create
	*/
	constructor(node, element = 'DIV', model = new MODEL(), containerList = []) {
		super(node, element, model);
		this.addClass('container');
		this.implement(new Movable(this));
		this.setContainerDefaults(model);		
		this.navheader = new NAVHEADER(this, new MODEL().set('label', this.label));
		this.navheader.implement(new Draggable(this));
		this.implement(new Draggable(this));
		this.body = new COLLAPSIBLE(this, new MODEL('body'));
        this.body.implement(new Clickable(this.body));
		this.addEvents();
		// Cascade state
		// Add Navbar Items
		this.addElementItems(containerList).then(() => this.addDomItems().then(() => this.addCrudItems()));
		this.updateDocumentMap();
		this.setDefaultVisibility(model);
    }
	/** Instantiates CONTAINER defaults, UId's, 
        elements etc based on the CONTAINER model
	    @param {CONTAINERMODEL|MODEL} model Model
	    @returns {void}
	*/
	setContainerDefaults(model) {
		this.setId(model.id);
		/** A collection of named Element MODELs
            @type {Map<string, Array<MODEL>>}
        */
        this.elements = new Map();
        ['data', 'attributes', 'meta'].map((e) => this.createElementCollection(e, model));
        
        /** A Human Friendly label for a CONTAINER
		    @type {string}
		*/
		this.label = this.required(model.label || this.element);
		/** Indicates if this CONTAINER is public or private
            CONTAINER(s) are considered to be PUBLIC by default
            @type {number}
        */
        this.shared = this.required(model.shared || 1);
        /** Simple status indicator
            @type {number}
        */
        this.status = this.required(model.status || STATUS.DEFAULT);
        /** Array of CONTAINER UIds 
            @type {Array<number>}
        */
        this.subsections = this.required(model.subsections ? model.subsections.split(',') : [0]);
        /** A Machine Friendly name for a CONTAINER
		    @type {string}
		*/
        this.name = this.required(model.name || this.element);
		/** Represents an anchor/reference in the SIDEBAR NAV document-map 
		    @type {NAVBAR} Document Map Reference NAVBAR
		*/
        this.reference = null;
	}
	// eslint-enable max-statements */
	/** Generic construct method for EL/CONTAINER async actions and population
	    @param {MODEL} model Model
	    @returns {Promise<ThisType>} Promise Chain
	*/
	construct(model) {
		//console.log(this.toString() + '.construct()');
		return this.chain(() => {
			this.constructElements();
            if (model) { // Populate if model exists
				if (model.children) {
					return this.populate(model.children).then(
						() => this.body.el.dispatchEvent(new Expand(this)));
				}
			}
			return this.ifEmpty();
		}, this.toString() + '.construct() Failed');
    }
    /** Get child element by Name and optionally by Class
	    @param {string} name Element Name
        @param {string} className Element Class
	    @returns {Array<EL>} Child Item/Element Filtered Results
        @description This might also be recognized as this.getChildren()
	*/
    get(name = null, className = null) {
        if (name === null && className === null) {
            return this.body.pane.children;
        }
        return this.body.pane.get().filter((c) => (c.name === name || name === null) && (c.className === className || className === null));
    }
	/** Sets and returns the parent CONTAINER for this element
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		try {
			if (typeof this.container === 'undefined') {
				this.setContainer();
				return this.container;
			}
			return this.container;
		} catch (e) {
			console.warn(e);
			throw new MissingContainerError(this.className + ' is unable to find a parent Container');
		}
	}
	/** Adds clickable DATA or ATTRIBUTE nav items to the Document Map
	    @param {MENU} menu This Container's reference menu
	    @param {string} submenuName Target menu (ie: DATA or ATTRIBUTES)
	    @returns {void}
	*/
	addDocumentMapAttributes(menu, submenuName) {
		/** @type {[MENU]} */
		let [dataMenu] = menu.get(submenuName, 'MENU');
		let type = submenuName.toString().toLowerCase();
        this.elements.get(type).forEach((d) => {
            let { name } = d.attributes;
			let tab = dataMenu.addNavItem(new MODEL().set({
				name,
				label: d.label
			}));
            tab.el.addEventListener('activate', () => {                
                console.log('Searching for "' + this.toString() + '.elements.' + type + '.' + name);
                this.elements.get(type).filter((m) => m.attributes.name === name).forEach(
					(mdl) => {
						console.log(' - Result', mdl);
					}
                );
                this.editProperty(name, type); 
			});
		});
	}
	/** Adds this CONTAINER to parent reference in the Document Map
	    @returns {void}
	*/
	updateDocumentMap() {
		if (this.className !== 'MAIN' && this.getContainer() !== null) {
			try {
				let parentName = this.getContainer().toString();
				/** @type {NAVBAR} */
				let parentRef = this.getContainer().reference;
				if (parentRef !== null) {
					/** @type {[MENU]} */
					let [parentRefMenu] = parentRef.menus.get(parentName, 'MENU');
					/** @type {[MENU]} */
					let [childrenMenu] = parentRefMenu.get('CHILDREN', 'MENU');
					/** @type {NAVBAR} */
					this.reference = childrenMenu.addNavBar(new MODEL().set('name', this.toString()));
					this.reference.addOptionsMenu(this.toString(), ICONS[this.className], this.toString(), ['DATA', 'ATTRIBUTES', 'META', 'CHILDREN'], false);
					/// Add submenu items to DATA and ATTRIBUTES @see MAIN.createDocumentMap()
					/** @type {[MENU]} */
					let [menu] = this.reference.menus.get(this.toString(), 'MENU');
					['DATA', 'ATTRIBUTES', 'META'].forEach((str) => this.addDocumentMapAttributes(menu, str));
					/// Allow only one active CHILD at a time
					/** @type {[NAVITEMICON]} */
					let [tab] = this.reference.tabs.get(this.toString(), 'NAVITEMICON');
					tab.el.addEventListener('activate', () => {
						console.log('DocumentMap > ' + this.toString(), this);
						this.scrollTo();
						childrenMenu.get(null, 'NAVBAR').filter((c) => c !== this.reference).forEach(
							(n) => n.tabs.children.forEach(
								(t) => t.el.dispatchEvent(new Deactivate(t))));
                    });
                    tab.el.addEventListener('select', () => {
                        console.log('TODO: Launch SAVE() for ' + this.toString());
                        this.save(false);
                    });
					/// Expand the NAVBAR and override its collapse Event
					this.reference.el.dispatchEvent(new Expand(this.reference));
					this.reference.collapse = () => true;
				}
			} catch (e) {
				console.warn('Unable to update document-map', this.className, e);
			}
		}
	}
	/** Performs async actions and constructs initial elements for this Container
        Called during the 'construct' phase of EL/CONTAINER building
        @abstract
	    @returns {Promise<ThisType>} Promise Chain
	*/
	constructElements() {
		throw new AbstractMethodError(this.className + ' : Abstract method ' + this.className + '.constructElements() not implemented.');
	}
	/** Creates this CONTAINER's MODEL collections based on the 
        default MODEL for this container type in DATAELEMENTS
	    @param {string} name ie: data, attributes, meta
	    @param {MODEL} model Container Model
	    @returns {void}
	*/
    createElementCollection(name, model) {
        //console.log(this.toString() + '.createElementCollection()', name);
        try {
            let arr = this.elements.set(name, []).get(name);
            /** @type {ATTRIBUTES} */
            let collection = model[name];            
            if (collection) {
                Object.keys(collection).forEach((key) => arr.push(createInputModel('INPUT', key, collection[key])));
            }
            /** @type {Array<MODEL>} */
            let containerData = DATAELEMENTS.get('CONTAINER')[name];
            if (containerData) {
                containerData.forEach((m) => arr.push(m)); // Default CONTAINER Data Elements
            }
            /** @type {Array<MODEL>} */
            let thisContainerData = DATAELEMENTS.get(this.className)[name];
            if (thisContainerData) {
                thisContainerData.forEach((m) => arr.push(m)); // Default Data Elements for CONTAINER descendent
            }
		} catch (e) {
			console.warn('Unable to create ' + this.toString() + '.elements.' + name, this, DATAELEMENTS.get(this.className), e);
		}
	}
	/** If the Container has no children, display a button to create an element
	    Should be overridden on CONTAINERs that should not have children
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
		/*return this.chain(() => {
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
		});*/
	}
	/** Adds 'select' and 'deselect' events to this CONTAINER
	    @returns {void}
	*/
	addSelectEvents() {
		this.body.el.addEventListener('select', () => {
            console.log('Selected ' + this.toString(), this);
            this.navheader.el.dispatchEvent(new Expand(this.navheader));
			this.getMain().focusBody();
		});
		this.body.el.addEventListener('deselect', () => {
            console.log('Deselected ' + this.toString(), this);
            this.navheader.el.dispatchEvent(new Collapse(this.navheader));
		});
	}
	/** Adds 'activate' and 'deactivate' events to this CONTAINER
	    @returns {void}
	*/
	addActivateEvents() {
		this.body.el.addEventListener('activate', () => {
			try {
				console.log('Activated ' + this.toString());
                this.getMain().focusBody();
                let siblings = this.getContainer().get().filter((c) => c.id !== this.id);
                console.log(' - Siblings', siblings);
                siblings.forEach((s) => {
                    console.log('  -> Sibling', s.id, s);
                    /*try {
                        s.el.dispatchEvent(new Deactivate(s));
                        //s.body.removeClass('active');
                    } catch (e) {
                        console.log(this.toString() + ' Unable to remove "active" class from sibling', s);
                    }*/
                });
			} catch (e) {
				//console.warn('Unable to focus body', this);
			}
		});
		this.body.el.addEventListener('deactivate', () => {
			try {
                console.log('Deactivated ' + this.toString());
				this.getMain().focusBody();
			} catch (e) {
				//console.warn('Unable to focus body', this);
			}
		});
	}
	/** Adds 'moveUp' and 'moveDown' events to this CONTAINER
	    @returns {void}
	*/
	addMoveEvents() {
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
	}
	/** Adds default CONTAINER Event Handlers 
	    @returns {void} 
	*/
	addEvents() {
		this.addSelectEvents();
		this.addActivateEvents();
		this.addMoveEvents();
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
					this[name].el.addEventListener('select', () => this.editProperty(name));
					this[name].el.addEventListener('activate', () => this.body.el.dispatchEvent(new Activate(this.body)));
					this[name].el.addEventListener('deactivate', () => this.body.el.dispatchEvent(new Deactivate(this.body)));
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
        @param {string} name The name of the input we are editing
        @param {string} type The Type of data (data, meta, attr) we are editing
        @abstract
        @see CONTAINERFACTORY The CONTAINERFACTORY assigns editProperty() to this CONTAINER
	    @returns {Promise<DIALOG>} A Save PROMPT
	*/
    editProperty(name, type = 'data') {
        throw new AbstractMethodError('CONTAINER{' + this.className + '}[' + type + '][' + name + '] : Abstract method ' + this.toString() + '.editProperty(' + name + ') not implemented.');
	}
	/** Creates the default Container Inputs representing a Container's state for CRUD Actions
        What you end up with is an array of INPUT MODEL(s) with the necessary attributes and values
        to represent this CONTAINER in a FORM
	    @returns {Array<MODEL>} An array of input models
	*/
	createContainerInputs() {
		//console.log(this.toString() + '.createContainerInputs()', this);
		let subsections = this.getSubSections();
		return [
			createInputModel('INPUT', 'className', this.className, 'className', 'TEXT', true),
			createInputModel('INPUT', 'element', this.element, 'element', 'TEXT', true),
			createInputModel('INPUT', 'id', this.id, 'ID', 'NUMBER', true),
            createInputModel('INPUT', 'label', this.label.toString(), 'Label'),
			createInputModel('INPUT', 'subsections', subsections.length > 0 ? subsections.toString() : '0', 'SubSections', 'TEXT', true),
			createInputModel('INPUT', 'status', this.status.toString(), 'Status', 'NUMBER', true),
            createInputModel('BUTTON', 'dataId', this.dataId.toString(), 'dataId', 'FORMPOSTINPUT'),
            createInputModel('BUTTON', 'attributesId', this.attributesId.toString(), 'attributesId', 'FORMPOSTINPUT'),
            createInputModel('BUTTON', 'metaId', this.metaId.toString(), 'metaId', 'FORMPOSTINPUT'),
            createInputModel('INPUT', 'shared', this.shared.toString(), 'shared', 'CHECKBOX')
		];
    }
    /** Dispatches the given Event to this CONTAINER's children
	    @param {Event} event Event to dispatch
	    @returns {void}
	*/
    dispatchToChildren(event) {
        console.log(this.toString() + '.dispatchToChildren()');
        this.get().forEach((c) => {
            console.log(' - Child', c.toString(), c);
            try {
                c.el.dispatchEvent(event);
            } catch (e) {
                console.warn('Unable to dispatch event to child', c, event);
            }
        });
    }
	/** Saves the state of the given Container
        @param {boolean} noPrompt If false (default), no prompt is displayed
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
	    @returns {Promise} Promise
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
            let { tab } = this.navheader;
            let a = model.data.collapsed === '1' ? tab.el.dispatchEvent(new Deactivate(tab)) : tab.el.dispatchEvent(new Activate(tab));
			let b = model.data.collapsed === '1' ? this.body.el.dispatchEvent(new Collapse(this.body)) : this.body.el.dispatchEvent(new Expand(this.body));
            let c = model.data.showNav === '1' ? this.navheader.el.dispatchEvent(new Expand(this.navheader)) : this.navheader.el.dispatchEvent(new Collapse(this.navheader));
			return [a, b, c];
		}
		return [false, false];
	}
	/** Adds the default Data Element Container Cases to the ELEMENTS Menu 
	    @param {Array<string>} containerList An array of container class names
	    @returns {void}
	*/
	addElementItems(containerList) {
		return this.chain(() => {
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
        @returns {Promise<ThisType>} Promise Chain
    */
	refresh(model = this) { // Optionally retrieve a new MODEL
		console.log('Refresh', this);
		return this.chain(
			() => this.getLoader().log(20, 'Refreshing CONTAINER{' + this.className + '}[' + this.id + ']').then(
				(loader) => {
					console.log('Refreshing ' + this.className, this);
					this.body.pane.empty().then(
						() => this.loadModel(model).then(
							() => loader.log(100)));
				}
			), 'Unable to refresh ' + this.className);
	}
	/** Closes parent menus
	    @param {MENU} menu Menu
	    @returns {Promise<ThisType>} Promise Chain
	*/
	closeMenus(menu) {
		console.log('closemenus', this);
		return this.chain(() => menu.deactivate().then(() => this.navheader.toggle()));
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
		return this.chain(() => {
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
		return this.chain(() => {
			let menu = this.navheader.menus.get('OPTIONS', 'MENU')[0].get('CRUD', 'MENU');
			let items = this.createNavItems(['LOAD', 'SAVEAS', 'SAVE'], menu[0]);
			items.LOAD.el.onclick = () => this.load();
			items.SAVEAS.el.onclick = () => this.save();
			items.SAVE.el.onclick = () => this.save(true);
		});
	}
	/** Adds a constructor for the given Element ClassName to this CONTAINER
        and adds respective button to this container
        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
        @returns {Promise<ThisType>} Promise Chain
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
					this.addConstructor(className, (model) => {
						try {
							resolve(this.getFactory().get(this.body.pane, className, model.id || 0));
						} catch (ee) {
							console.warn('Unable to retrieve factory for Container Case', ee);
							reject(ee);
						}
					});
				}
			} catch (e) {
				console.warn(this.toString() + '.addContainerCase(' + className + '): Unable to add Container Case', e);
				reject(e);
			}
		});
    }
    /** Returns the MAIN Factory
	    @returns {FACTORY} The Main Container Factory
	*/
    getFactory() {
        return this.getMain().getFactory();
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
	/** Returns the CONTAINER UId
	    @returns {number} Unique Id
	*/
	getId() {
		return this.id;
		//return this.el.getAttribute('id');
	}
	/** Sets this Container's unique identifier to the given id
	    @param {number} id Container UId
	    @returns {ThisType} Method Chain
	*/
    setId(id) {
        if (typeof id !== 'undefined' && id !== null) {
            /** CONTAINER unique id
                @property {number} id
            */
            this.id = id;
            //this.attributes.id = id; // UId is read-only in 'this'
            this.el.setAttribute('id', id);
        }
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
            this.attributes.name = name;
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
		@returns {Promise<ThisType>} Promise Chain
	*/
	load(id) {
		return new Promise((resolve, reject) => { // Consider verifying cache before retrieving
			try {
				if (id >= 0) {
					$.getJSON(this.className + '/GET/' + id, (payload) => {
						if (payload.result === 1) {
							resolve(this.loadModel(payload.model));
						} else {
							reject(new Error('Failed to retrieve ' + this.toString() + ' from server\n' + payload.message));
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
	/** Returns a string representation of this Container
	    @returns {string} Classname(id)
	*/
    toString() {
		return this.className + '(' + (this.id || 0).toString() + ')'
	}
	/** Loads the given MODEL into CONTAINER.body.pane
	    @param {MODEL} model Model
	    @returns {Promise<ThisType>} Promise Chain
	*/
	loadModel(model) {
		console.log(this.toString() + '.loadModel()', model);
		return this.chain(() => {
			if (model.label) {
				document.title = model.label;
			}
			this.make(model);
		}, 'Unable to construct ' + this.toString());
	}
	/** Sets Id, Label and Name based on MODEL
	    @param {MODEL} model MODEL
	    @returns {Promise<ThisType>} Promise Chain
    
	setElementAttributes(model) {
	    return this.chain(() => {
	        this.setId(model.id);
	        this.setLabel(model.label);
	        this.setName(model.name);
	    }, 'Unable to set ' + this.className + ' Attributes');
	}*/
	/** Generates an array of subsection Ids for this Container
	     @returns {array} A collection of subsection ids
    */
	getSubSections() {
		//console.log(this.className + '.getSubsections()', this);
		let id = null;
        let subsections = [];
        try {
            for (let c = 0; c < this.body.pane.el.children.length; c++) {
                id = parseInt(this.body.pane.el.children[c].id);
                if (!isNaN(id)) {
                    subsections.push(id);
                }
            }
        } catch (e) {
            console.warn(this.toString() + '.getSubSections()', e);
        }
		return subsections;
	}
	/** Returns the MAIN container
	    @returns {CONTAINER} The MAIN Container class
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
        @returns {Promise<ThisType>} Promise Chain
	*/
	toggleHeaders() {
		return this.chain(() => $(this.el).find('.container > nav').toggle());
	}
	/** Creates a DIALOG and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
        @returns {Promise} A promise to remove the element from the DOM
    */
	removeDialog() {
		return new Promise((resolve, reject) => {
			try {
				let dialog = new DIALOG(new MODEL().set({
					label: 'Remove ' + this.toString() + ' from ' + this.container.toString(),
					container: this.getMain(),
					caller: this.getContainer() //.getMain()
				}));
				dialog.footer.buttonGroup.addButton('Yes, Remove ' + this.toString(), ICONS.REMOVE).el.onclick = () => {
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
						label: 'Disable ' + this.toString(),
						container: main,
						caller: main
					}));
					dialog.footer.buttonGroup.addButton('Yes, Disable ' + this.toString(), ICONS.REMOVE)
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
export { AbstractMethodError, Activate, ATTRIBUTES, Collapse, Collapsible, createInputModel, DATAELEMENTS, DATEOBJECT, Deactivate, DIALOG, EL, Expand, FACTORY, FOOTER, HEADER, ICONS, INPUTTYPES, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON, NAVHEADER, STRING }
/* eslint-enable max-lines */