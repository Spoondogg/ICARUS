/* eslint-disable max-lines */
/** @module */
import COLLAPSIBLE, { Collapse, Collapsible, Expand, Toggle } from './COLLAPSIBLE.js';
import { DATAELEMENTS, createInputModel } from '../../../enums/DATAELEMENTS.js';
import GROUP, { ATTRIBUTES, AbstractMethodError, Activate, Deactivate, EL, MODEL, MissingContainerError } from '../group/GROUP.js';
import Movable, { Move } from '../../../interface/Movable.js';
import NAVHEADER, { MENU, NAVITEM, NAVITEMICON } from '../nav/navbar/navheader/NAVHEADER.js';
import Clickable from '../../../interface/Clickable.js';
import DATEOBJECT from '../../../helper/DATEOBJECT.js';
import DIALOG from '../dialog/DIALOG.js';
import Draggable from '../../../interface/Draggable.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import INPUTMODEL from '../input/INPUTMODEL.js';
import { INPUTTYPES } from '../../../enums/INPUTTYPES.js';
import LABEL from '../label/LABEL.js';
import LEGEND from '../legend/LEGEND.js';
import Modify from '../../../event/Modify.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import P from '../p/P.js';
import { STATUS } from '../../../enums/STATUS.js';
import STRING from '../../../STRING.js';
/** An abstract CONTAINER Element with NAVBAR
    @description A CONTAINER is a groupable, expandable {@link EL} that can have children
    @class
    @extends GROUP
*/
export default class CONTAINER extends GROUP {
	/** @constructs CONTAINER
	    @param {EL} node Parent Node
	    @param {string} element HTML element Tag
	    @param {MODEL} model Model
	    @param {Array<string>} containerList An array of strings representing child Containers that this Container can create
	*/
    constructor(node, element = 'DIV', model = new MODEL(), containerList = []) {
        //console.log(element + '.model', model);
        super(node, element, model);
        this.addClass('container');
        this.editableElements = [];
        this.dragging = false;
        /** If true, siblings are deactivated when this CONTAINER is activated */
        this.deactivateSiblingsOnActivate = true;
		this.implement(new Movable(this));
		this.setContainerDefaults(model);		
		this.navheader = new NAVHEADER(this, new MODEL().set('label', this.label.toString()));
        this.navheader.implement(new Draggable(this));
        this.addQuickAccessButtons();
        this.implement(new Draggable(this));        
        this.body = new COLLAPSIBLE(this, this.getBodyElement(model), new MODEL('body'));
        this.body.implement(new Clickable(this.body));
        /** Represents the location where children of this container are instantiated
            @type {EL}
        */
        this.childLocation = this.body.pane;
        this.addEvents();
		// Cascade state
		// Add Navbar Items
		this.addElementItems(containerList).then(() => this.addDomItems().then(() => this.addCrudItems()));
		this.updateDocumentMap();
		this.setDefaultVisibility(model);
    }
    getBodyElement(model) {
        let bodyElement = 'DIV';
        try {
            bodyElement = model.body.element;
        } catch (e) {
            //console.log('body.element does not exist for this model');
        }
        return bodyElement;
    }
    addQuickAccessButtons() {
        // Add quick-access buttons
        if (this.className !== 'MAIN') {
            
            // Save and QuickSave button
            let btnSave = this.navheader.tabs.addNavItemIcon(new MODEL('tab-narrow').set({
                label: 'SAVE',
                icon: ICONS.SAVE,
                name: 'btn-save'
            }));
            btnSave.el.addEventListener('activate', () => this.chain(() => {
                this.el.dispatchEvent(new Modify(btnSave));
            }).then(() => btnSave.el.dispatchEvent(new Deactivate(btnSave))));
            btnSave.el.addEventListener('longclick',
                () => this.getFactory().save(false, this, this).then(
                    () => btnSave.el.dispatchEvent(new Deactivate(btnSave))));

            // Refresh
            let btnRefresh = this.navheader.tabs.addNavItemIcon(new MODEL('tab-narrow').set({
                label: 'REFRESH',
                icon: ICONS.REFRESH,
                name: 'btn-refresh'
            }));
            btnRefresh.el.addEventListener('activate', () => {
                this.chain(() => {
                    this.getMain().focusBody().then(() => this.refresh());
                }).then(() => btnRefresh.el.dispatchEvent(new Deactivate(btnRefresh)));
            });

            // Up and Down buttons
            [
                {
                    label: 'UP',
                    icon: ICONS.UP,
                    name: 'btn-up',
                    dir: 0
                },
                {
                    label: 'DOWN',
                    icon: ICONS.DOWN,
                    name: 'btn-down',
                    dir: 2
                }
            ].forEach((model) => {
                let btn = this.navheader.tabs.addNavItemIcon(new MODEL('tab-narrow').set(model));
                btn.el.addEventListener('activate', () => {
                    this.chain(() => this.el.dispatchEvent(new Move(this, model.dir))).then(
                        () => btn.el.dispatchEvent(new Deactivate(btn)));
                });
            });

            // Move OPTIONS tab to the end
            let [btnOptions] = this.navheader.tabs.get('OPTIONS', 'NAVITEMICON');
            btnOptions.addClass('tab-narrow');
            let siblings = this.navheader.tabs.get();
            let lastSibling = siblings[siblings.length - 1];
            $(btnOptions.el).insertAfter(lastSibling.el);
        }
    }
	/** Sets default properties of this CONTAINER to match the given MODEL
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
		/** Indicates if this CONTAINER can be edited by anyone, or just by the author
            @type {number}
        */
        this.shared = this.required(model.shared || 0);
        /** Indicates if this CONTAINER can be edited by anyone, or just by the author
            @type {number}
        */
        this.isPublic = this.required(model.isPublic || 0);
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
                    return this.populate(model.children);
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
            return this.childLocation.children;
        }
        return this.childLocation.get().filter((c) => (c.name === name || name === null) && (c.className === className || className === null));
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
    createNewFormPost(type, name = '') {
        let typeId = type + 'Id';
        if (this[typeId] === 0) {
            console.log(this.toString() + '.addDocumentMapAttributes() needs to create a(n) ' + type + ' FORMPOST');
            this.getFactory().save(false, this, this).then((prompt) => prompt.form.createNewFormPost(type));
        } else {
            this.getFactory().editProperty(name, type, this, this);
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
        /*if (this.elements.get(type).length > 0) {
            console.log(this.toString() + '.elements.' + type, this.elements.get(type).map((el) => el.label));
        }*/
        this.elements.get(type).forEach((d) => {
            //console.log(this.toString() + ' add doc-map attr', type, d);
            let { name } = d.attributes;
			let tab = dataMenu.addNavItem(new MODEL().set({
				name,
				label: d.label
			}));
            tab.el.addEventListener('activate', () => {
                try {
                    this.createNewFormPost(type, name);
                } catch (e) {
                    console.warn(this.toString() + ' is unable to edit "' + name + ', ' + type);
                    tab.el.dispatchEvent(new Deactivate(tab.el));
                }
            });
		});
    }
    /** Adds the default Document Map Attributes ('DATA', 'ATTRIBUTES', 'META') to the given MENU
        @param {MENU} menu Document Map reference menu for this container
        @returns {void}
    */
    addDefaultDocumentMapAttributes(menu) {
        ['DATA', 'ATTRIBUTES', 'META'].forEach((str) => this.addDocumentMapAttributes(menu, str));
        this.reference.menus.get()[0].get(null, 'NAVITEMICON').forEach(
            (m) => m.el.addEventListener('select', () => this.createNewFormPost(m.name.toLowerCase()))
        );
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
                    
					/// Add submenu items to DATA, ATTRIBUTES and META @see MAIN.createDocumentMap()
					/** @type {[MENU]} */
					let [menu] = this.reference.menus.get(this.toString(), 'MENU');
                    this.addDefaultDocumentMapAttributes(menu);

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
                    tab.el.addEventListener('select', () => this.getFactory().save(false, this, this));
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
	    param {MODEL} model Container Model
	    @returns {void}
	*/
    createElementCollection(name) {
        //console.log(this.toString() + '.createElementCollection()', name);
        try {
            let arr = null;
            if (typeof this.elements.get(name) === 'undefined') {
                arr = this.elements.set(name, []).get(name);
            } else {
                arr = this.elements.get(name);
            }
            /** @type {ATTRIBUTES} 
            let collection = model[name];            
            if (collection) {
                Object.keys(collection).forEach((key) => arr.push(createInputModel('INPUT', key, collection[key])));
            }*/
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
			console.warn('Missing DATAELEMENTS.js reference.  Unable to create ' + this.toString() + '.elements.' + name, this, DATAELEMENTS.get(this.className), e);
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
				let btnAddElement = new EL(this.childLocation, 'DIV', new MODEL('btn-add-element'));
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
		/*this.body.el.addEventListener('select', (event) => {
            console.log('Selected ' + this.toString());
            //event.preventDefault();
            event.stopPropagation();
            //this.navheader.el.dispatchEvent(new Expand(this.navheader));
			//this.getMain().focusBody();
		});
		this.body.el.addEventListener('deselect', () => {
            console.log('Deselected ' + this.toString());
            //event.preventDefault();
            event.stopPropagation();
            //this.navheader.el.dispatchEvent(new Collapse(this.navheader));
		});*/
    }
    /** Dispatches a Deactivate Event on CONTAINER.body for any sibling CONTAINER Elements relative to this CONTAINER 
        @returns {Promise<ThisType>} Promise Chain
    */
    deactivateSiblingContainers() {
        console.log(this.toString() + '.deactivateSiblingContainers()');
        /// IF id is undefined, try comparing by attributes.name
        return this.chain(() => {
            let siblings = this.node.get();
            if (this.id) {
                siblings = siblings.filter((c) => c.id !== this.id);
            } else if (this.name) {
                siblings = siblings.filter((c) => c.attributes.name !== this.attributes.name);
            }
            siblings.forEach((s) => {
                try {
                    s.body.el.dispatchEvent(new Deactivate(s));
                } catch (e) {
                    console.log(this.toString() + ' Unable to remove "active" class from sibling', s);
                }
            });
        }, this.toString() + ' Unable to remove "active" class from siblings');
    }
    /** Dispatches the given Event to this element's siblings
        Overrides EL.dispatchToSiblings
	    @param {Event} event Event to dispatch
	    @returns {void}
	*/
    dispatchToSiblings(event) {
        //console.log(this.toString() + '.siblings()', event, this.node.getContainer().get().filter((c) => c !== this));
        this.node.getContainer().get().filter((c) => c !== this).forEach((s) => s.el.dispatchEvent(event));
    }
	/** Adds 'activate' and 'deactivate' events to this CONTAINER
	    @returns {void}
	*/
	addActivateEvents() {
        this.el.addEventListener('activate', () => {
            console.log('Activated ' + this.toString());
            if (this.node.getContainer().deactivateSiblingsOnActivate) {
                this.dispatchToSiblings(new Deactivate(this));
            }
        });
        this.el.addEventListener('deactivate', () => {
            console.log('Deactivated ' + this.toString());
        });
        this.navheader.tab.el.addEventListener('activate', () => {
            if (this.header) {
                if (!this.header.hasClass('active')) {
                    try {
                        this.header.el.dispatchEvent(new Activate(this.navheader.tab));
                    } catch (e) {
                        if (!(e instanceof TypeError)) {
                            console.warn('Unable to activate header', e);
                        }
                    }
                }
            }
        });
        this.navheader.tab.el.addEventListener('deactivate', () => {
            if (this.header) {
                if (this.header.hasClass('active')) {
                    try {
                        this.header.el.dispatchEvent(new Deactivate(this.navheader.tab));
                    } catch (e) {
                        if (!(e instanceof TypeError)) {
                            console.warn('Unable to deactivate header', e);
                        }
                    }
                }
            }
        });
    }
    /** Adds 'activate' and 'deactivate' events to this CONTAINER
	    @returns {void}
	*/
    addExpandEvents() {
        this.el.addEventListener('expand', () => {
            console.log('Expanded ' + this.toString());
            this.data.collapsed = -1;
        });
        this.el.addEventListener('collapse', () => {
            console.log('Collapsed ' + this.toString());
            this.data.collapsed = 1;
        });
    }
    /** Adds CRUD related events for this CONTAINER
        @param {number} delay Delay
        @todo Implement [create, read/open/load, update/modify, remove,delete]
        @returns {void}
    */
    addCrudEvents(delay = 5000) {
        this.el.addEventListener('modify', () => {
            //console.log(this.toString() + ' has been modified and needs to be saved...');
            this.addClass('modified');
            setTimeout(() => {
                if (document.getElementsByClassName('dragging').length > 0) {
                    //console.log('Still dragging...  Checking again in ' + delay + ' ms...');
                    this.el.dispatchEvent(new Modify(this));
                } else if (this.hasClass('modified') === true) {                    
                    this.getFactory().save(true, this, this);
                    this.removeClass('modified');
                }
            }, delay);
        });
        this.el.addEventListener('save', () => {
            console.log(this.toString() + ' has been saved');
            this.removeClass('modified');
        });
    }
    /** Adds 'moveUp' and 'moveDown' events to this CONTAINER
        param {number} dur Animation duration in milliseconds
	    @returns {void}
	*/
    addMoveEvents() {
        //
	}
	/** Adds default CONTAINER Event Handlers 
	    @returns {void} 
	*/
	addEvents() {
		this.addSelectEvents();
        this.addActivateEvents();
        this.addExpandEvents();
        this.addMoveEvents();
        this.addCrudEvents();
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
                            this.header = new HEADER(node, new MODEL().set('innerHTML', this.data.header));
                            this.header.setAttribute('draggable', 'false');
                            this.header.implement(new Collapsible(this.header));
                            $(this.header.el).insertBefore(this.navheader.el);
                            this.header.el.dispatchEvent(new Expand(this.header));
                            break;
                        case 'slogan':
                            this[name] = new HEADER(node, new MODEL('slogan').set('innerHTML', this.data[name]));
                            break;
                        case 'p':
                            this[name] = new P(node, new MODEL('markdown').set('innerHTML', this.getFactory().markdownConverter.makeHtml(this.data[name])));
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
                    this[name].setAttribute('name', name);
					this[name].implement(new Clickable(this[name]));
					this[name].el.addEventListener('select', () => this.getFactory().editProperty(name, 'data', this, this));
                    this[name].el.addEventListener('activate', () => {
                        console.log('Activated editable element: ' + name);
                        //let siblings = this.editableElements.filter((c) => c.attributes.name !== name);
                        //console.log('Deactivating sibling editable elements', this.toString(), name, siblings);
                        //siblings.forEach((s) => s.el.dispatchEvent(new Deactivate(this)));
                    });
                    this[name].el.addEventListener('deactivate', () => {
                        console.log('Deactivated editable element: ' + name);
                    });

                    if (name === 'header') {
                        this.addHeaderEvents();
                    }

                    this.editableElements.push(this[name]);

					resolve(this[name]);
				}
			} catch (e) {
				console.log('Unable to create ' + name, e);
				reject(e);
			}
		});
    }
    /** Adds specific events for CONTAINER.header (if exists)
        @returns {void} 
    */
    addHeaderEvents() {
        this.header.el.addEventListener('deactivate', () => {
            this.navheader.tab.el.dispatchEvent(new Deactivate(this.header));
        });
        this.header.el.addEventListener('activate', () => {
            this.navheader.tab.el.dispatchEvent(new Activate(this.header));
        });
        this.header.el.addEventListener('longclick', () => {
            //console.log(this.toString() + '.header.longclick()');
            if (this.getUser() === this.authorId || this.shared === 1) {
                if (this.dragging === false) {
                    this.navheader.el.dispatchEvent(new Toggle(this.navheader));
                }
            }
        });
        if (parseInt(this.data.collapsed) === -1) {
            this.header.el.dispatchEvent(new Activate(this.header));
        }
    }
	/** Hides the collection of named EL(s), optionally excluding those with the specified name
	    @param {Array<EL>} elements A collection of Elements to hide
	    @param {string} name Optional name of element to keep visible
	    @returns {Promise} Resolve on success
	*/
	hideElements(elements, name = '') {
        //console.log(this.toString() + '.hideElements()', elements, name);
        return Promise.all(elements.filter((ch) => ch.el.getAttribute('name') !== name).map((c) => c.hide()));
	}
	/** Creates the default Container Inputs representing a Container's state for CRUD Actions
        What you end up with is an array of INPUT MODEL(s) with the necessary attributes and values
        to represent this CONTAINER in a FORM
	    @returns {Array<INPUTMODEL>} An array of input models
	*/
	createContainerInputs() {
		//console.log(this.toString() + '.createContainerInputs()', this);
		return [
			createInputModel('INPUT', 'className', this.className, 'className', 'TEXT', true),
			createInputModel('INPUT', 'element', this.element, 'element', 'TEXT', true),
			createInputModel('INPUT', 'id', this.id, 'ID', 'NUMBER', true),
            createInputModel('INPUT', 'label', this.label.toString(), 'Label'),
            createInputModel('INPUT', 'subsections', this.getSubSections().toString() || '0', 'SubSections', 'TEXT', true),
			createInputModel('INPUT', 'status', this.status.toString(), 'Status', 'NUMBER', true),
            createInputModel('BUTTON', 'dataId', this.dataId.toString(), 'dataId', 'FORMPOSTINPUT'),
            createInputModel('BUTTON', 'attributesId', this.attributesId.toString(), 'attributesId', 'FORMPOSTINPUT'),
            createInputModel('BUTTON', 'metaId', this.metaId.toString(), 'metaId', 'FORMPOSTINPUT'),
            createInputModel('INPUT', 'shared', this.shared.toString(), 'shared', 'CHECKBOX'),
            createInputModel('INPUT', 'isPublic', this.isPublic.toString(), 'isPublic', 'CHECKBOX')
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
	/** Restore Container View to defaults and refresh parent Container
	    @returns {void}
    */
    refreshParentContainer() {
        console.log(this.toString() + '.refreshParentContainer()');
		try {
			this.getMain().focusBody();
			//this.getMain().loader.hide();
		} catch (e) {
			console.log('Unable to focus main');
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
            let container = this.getContainer();
			container.getFactory().save(noPrompt, container, container); // false // dialog.body, this.getContainer(), 
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
            let c = model.data.showNav === '1' ? this.navheader.el.dispatchEvent(new Activate(this.navheader)) : this.navheader.el.dispatchEvent(new Deactivate(this.navheader));
			return [a, b, c];
		}
		return [false, false, false];
	}
	/** Adds the default Data Element Container Cases to the ELEMENTS Menu 
	    @param {Array<string>} containerList An array of container class names
	    @returns {void}
	*/
    addElementItems(containerList) {
		return this.chain(() => {
			if (containerList.length > 0) {
				//let defaultContainers = []; // First two are normal
				//containerList.splice(2, 0, ...defaultContainers);
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
        @returns {Promise<ThisType>} Promise Chain
    */
    refresh() {
		return this.chain(
			() => this.getLoader().log(20, this.toString() + '.refresh()').then(
                (loader) => {
                    this.navheader.tab.el.dispatchEvent(new Deactivate(this.navheader.tab));
                    this.getPayload(this.getId(), this.className).then(
                        (payload) => {
                            let tempStyleDisplay = this.el.style.display;
                            this.el.style.display = 'none';
                            let promises = Object.keys(this.data).map((dataEl) => {
                                try {
                                    this[dataEl].destroy(0);
                                    return [dataEl, true];
                                } catch (e) {
                                    return [dataEl, e.name];
                                }
                            });
                            Promise.all(promises).then(() => { //results
                                this.childLocation.empty().then(
                                    () => this.make(payload.model).then(() => {
                                        this.el.style.display = tempStyleDisplay;
                                        //console.log(this.toString() + '.refresh().results', results);
                                        loader.log(100).then(() => {
                                            this.navheader.tab.el.dispatchEvent(new Activate(this.navheader.tab));
                                        })
                                    })
                                );
                            });
                        }
                    );
                }), this.toString() + ' failed to refresh');
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
            items.UP.el.addEventListener('activate', () => {
                this.chain(() => this.el.dispatchEvent(new Move(this, 0))).then(
                    () => items.UP.el.dispatchEvent(new Deactivate(items.UP)));
            });
            items.DOWN.el.addEventListener('activate', () => {
                this.chain(() => this.el.dispatchEvent(new Move(this, 2))).then(
                    () => items.DOWN.el.dispatchEvent(new Deactivate(items.DOWN)));
            });
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
			items.SAVEAS.el.onclick = () => this.getFactory().save(false, this, this);
			items.SAVE.el.onclick = () => this.getFactory().save(true, this, this);
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
                            resolve(this.getFactory().get(this.childLocation, className, model.id || 0));
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
                    this.getPayload(id, this.className).then((payload) => {
                        if (payload.result === 1) {
                            this.navheader.tab.anchor.label.setInnerHTML(payload.model.label);
                            resolve(this.make(payload.model));
                        } else {
                            reject(new Error(this.toString() + ' Failed to retrieve ' + id + ' from server\n' + payload.message));
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
        try {
            //return this.get().filter((s) => s.id > 0).map((ss) => ss.id); // MODEL
            return [...this.childLocation.el.children].filter((s) => s.id > 0).map((ss) => ss.id); // EL.el from HTMLElementCollection
        } catch (e) {
            console.warn(this.toString() + '.getSubSections()', e);
            return [0];
        }        
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
		this.navheader.tab.anchor.label.setInnerHTML(label.toString());
		this.label = label.toString();
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
								this.container.getFactory().save(true, this.container, this.container).then(() => {
									resolve(dialog.close());
								});
                            } catch (ee) {
                                console.warn(this.toString() + '.removeDialog() Error', this.container);
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
    responseRefresh(loader, resolve) {
        let url = new URL(window.location.href);
        let returnUrl = url.searchParams.get('ReturnUrl');
        if (returnUrl) {
            location.href = url.origin + returnUrl;
            loader.log(100).then(() => resolve(location.href));
        } else {
            loader.log(99).then(() => resolve(location.reload(true)));
        }
    }

    responseUndefined(payload, loader, resolve) {
        let msg = this.toString() + ': An error occurred while posting results to ' + location.href;
        //console.warn(err, payload);

        /// IMPLEMENT AN ERROR HANDLER BASED ON Payload.classname
        loader.console.el.dispatchEvent(new Activate(loader.console));
        switch (payload.className) {
            case 'InvalidLoginAttempt': // payload.result === 4
                msg = 'Login Failed. The email or password you entered is incorrect.';
                loader.log(99, msg, true, false, 1000, 'warning').then(() => resolve(new Error(msg)));
                break;

            case 'InvalidForgotPasswordAttempt': // payload.result === 5
                msg = 'Unable to process forgotten password request.';
                loader.log(99, msg, true, false, 1000, 'warning').then(() => resolve(new Error(msg)));
                break;

            default: // 'Error':
                msg = payload.result + ': ';
                if (payload.message) {
                    msg += '\n' + payload.message
                }
                /*if (payload.model.Errors) {
                    payload.model.Errors.forEach((er) => {
                        err += '\n' + er;
                    })
                }*/
                loader.log(99, msg, true, false, 1000, payload.className.toLowerCase()).then(() => {
                    payload.model.Errors.forEach((er) => {
                        loader.log(99, er, true, true, 300, 'warning');
                    });
                    resolve(new Error(msg));
                });
        }
    }
	/** Handles the Payload response from a Form POST
        If the results are a Payload and its status is "success", the page is reloaded.
        Otherwise, call appropriate handler based on payload.result
        @param {object} payload A post payload
        @param {string} status Result status
        @param {boolean} refresh If true (default), page is refreshed
        @returns {Promise} Promise to resolve / reject
    */
    processAjaxResponse(payload, status, refresh = true) {
		return new Promise((resolve, reject) => {
			this.getLoader().log(80).then((loader) => {
                console.log(this.toString() + '.processAjaxResponse()', payload, status, refresh);
                try {
                    switch (payload.result) {
                        case 1: // success
                            if (refresh) {
                                this.responseRefresh(loader, resolve);
                            } else {
                                //loader.log(100, payload.result + ' : ' + status);
                                resolve(true);
                            }
                            break;

                        /*case 5: // InvalidForgotPasswordAttempt
                            let err = 'Login Failed. The email or password you entered is incorrect.';
                            loader.log(99, err, true, false, 1000, 'warning').then(() => reject(new Error(err)));
                            break;*/

                        default:
                        //case 'undefined':
                            console.warn('payload.result', payload.result);
                            this.responseUndefined(payload, loader, resolve);
                            break;
                    }
                } catch (e) {
                    console.warn('Unable to process Ajax Response', payload, status);
                    loader.console.el.dispatchEvent(new Activate(loader.console));
					loader.log(99, location.href, true, true, 1000, 'warning').then(() => reject(e));
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
}
export { AbstractMethodError, Activate, ATTRIBUTES, COLLAPSIBLE, Clickable, Collapse, Collapsible, createInputModel, DATAELEMENTS, DATEOBJECT, Deactivate, DIALOG, EL, Expand, FOOTER, HEADER, ICONS, INPUTMODEL, INPUTTYPES, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON, NAVHEADER, STRING, Toggle }
/* eslint-enable max-lines */