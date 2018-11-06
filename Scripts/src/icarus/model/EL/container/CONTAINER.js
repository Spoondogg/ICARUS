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
import NAVBAR from '../nav/navbar/NAVBAR.js';
//import PROMPT from '../dialog/prompt/PROMPT.js';
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
	    @param {Array<string>} containerList An array of strings representing child Containers that this Container can create
	 */
    constructor(node, element, model = new MODEL(), containerList = []) {
		super(node, element, model); //console.log('CONTAINER{' + this.className + '}');
		this.addClass('icarus-container'); //this.isContainer = 1;
        this.id = model.id || 0;

        // Set reusable data model(s)
        this.dataId = model.dataId || 0;

        /** @type {Array<MODEL>} An array of MODELs */
        this.dataElements = []; 
        try {
            DATAELEMENTS.CONTAINER.forEach((m) => this.dataElements.push(m));
            DATAELEMENTS[this.className].forEach((m) => this.dataElements.push(m));
        } catch (e) {
            console.warn('Unable to retrieve dataElements for ' + this.className);
        }
        console.log(this.className + '.dataElements[]', this.dataElements);

        // Set reusable attribute model(s)
        this.attributesId = model.attributesId || 0;
        this.attrElements = [];

        // Set reusable description model(s)
		this.descriptionId = model.descriptionId || 0;        

        if (model.id) { // Needed for save hooks
            this.el.setAttribute('id', model.id);
        }
		this.label = model.label || element;
		this.name = model.name || element;
        this.shared = model.shared || 1;
        this.status = model.status || STATUS.DEFAULT;
		
		this.updateUrl = this.element + '/Set'; // model.className should be the actual value, no?                
        this.subsections = model.subsections ? model.subsections.split(',') : '0'; // Delimited list of child ids
        this.navBar = new NAVBAR(this, new MODEL().set({
            label: this.label // model.label
        }));
        this.createDraggableNavBar();
        //if (this.status === STATUS.DEFAULT) {
        //if (model.showHeader ) {
        //this.navBar.show();
        //} else {
        //this.navBar.collapse();
        //}
		this.body = new CONTAINERBODY(this, model);
		this.addNavBarDefaults();
		this.addDefaultContainers(containerList);
		this.setDefaultVisibility(model);
		//if (this.className !== 'CONTAINER') {
		this.construct();
		//}
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
	/** Creates the default Container Inputs representing a Container's state for CRUD Actions
	    param {CONTAINER} container The specified container for crud actions
	    @returns {Array<MODEL>} An array of input models
	*/
    createContainerInputs() {
        console.log(this.className + '.createContainerInputs()', this);
        let subsections = this.getSubSections();
        console.log('subsections', subsections);
		return [
            createInputModel('INPUT', 'className', 'className', this.className),
            createInputModel('INPUT', 'element', 'element', this.element),
			createInputModel('INPUT', 'id', 'ID', this.id, 'NUMBER'),
			createInputModel('INPUT', 'label', 'Label', typeof this.label === 'object' ? this.label.el.innerHTML.toString() : this.label.toString()),
			createInputModel('INPUT', 'subsections', 'SubSections', subsections.length > 0 ? subsections.toString() : '0'),
			createInputModel('INPUT', 'status', 'Status', this.status.toString(), 'NUMBER'),
			createInputModel('BUTTON', 'dataId', 'dataId', this.dataId.toString(), 'FORMPOSTINPUT'),
			createInputModel('BUTTON', 'attributesId', 'attributesId', this.attributesId.toString(), 'FORMPOSTINPUT'),
			createInputModel('BUTTON', 'descriptionId', 'descriptionId', this.descriptionId.toString(), 'FORMPOSTINPUT'),
			createInputModel('BUTTON', 'shared', 'shared', this.shared.toString(), 'NUMBER')
		];
	}
	/** Saves the state of the given Container
        @description Generates an empty form, populates with current state and posts to appropriate setter
	    param {EL} node The parent container to hold the save menu
        param {CONTAINER} container The Container to save
        @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
        @abstract
        @see CONTAINERFACTORY The CONTAINERFACTORY assigns save() to this CONTAINER
	    @returns {Promise} A Promise to save this Container
	*/
    save(noPrompt = false) { // node, container = this, 
        console.log(this.className + '.save()', noPrompt); // node, container, 
		throw new AbstractMethodError('CONTAINER{' + this.className + '} : Abstract method ' + this.className + '.save() not implemented.');
	}
    /** If dataId or attributesId exists, extract the appropriate values and save
	    @param {number} modelId The object's unique identifier
	    @param {object} data The object to be saved
	    @returns {void}
	*/
    quickSaveFormPost(modelId, data) {
        console.log(modelId, data);
        throw new AbstractMethodError('CONTAINER{' + this.className + '} : Abstract method ' + this.className + '.quickSaveFormPost() not implemented.');
    }
	/** Restore Container View to defaults and refresh parent Container
	    @param {CONTAINER} container The container to restore
	    @returns {void}
    */
	refreshParentContainer() {
		try {
			this.getMainContainer().focusBody();
			this.getMainContainer().loader.hide();
		} catch (e) {
			console.log(e);
		}
		try {
			this.getContainer().refresh();
		} catch (e) {
			//console.log('Unable to reload Container);
			//location.reload(true);
			this.getMainContainer().refresh();
		}
    }
    /** Restore Container View to defaults and refresh parent Container
	    @param {CONTAINER} container The container to restore
	    @returns {void}
    */
    saveParentContainer() {
        console.log('Saving parent container', this.getContainer());
        try {
            this.getContainer().save(false); // dialog.body, this.getContainer(), 
        } catch (e) {
            console.log('Unable to save parent Container', e);
        }
    }
	/** The default visibility state for menus and collapseable content
	    @param {MODEL} model The CONTAINER object retrieved from the server
	    @returns {void}
	*/
	setDefaultVisibility(model) {
        if (model.collapsed) {
            this.collapse();
        } else {
            this.show(); // Collapse or Expand Body Pane
        }
        if (model.showNav < 1) {
            this.navBar.hide();
        } else {
            this.navBar.show();
        }   
        /*if (model.showNav) {
            this.navBar.show();
        } else {
            this.navBar.hide();            
        } */
	}
	/** Adds the default Container Cases to the CRUD Menu
	    @param {Array} containerList An array of container class names
	    @returns {void}
	*/
	addDefaultContainers(containerList) {
		let defaultContainers = ['IFRAME', 'FORM', 'LIST', 'MENULIST', 'JUMBOTRON', 'BANNER', 'PARAGRAPH', 'CHAT'];
		containerList.splice(2, 0, ...defaultContainers);
		for (let c = 0; c < containerList.length; c++) {
			this.addContainerCase(containerList[c]);
		}
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
			/*
			setTimeout(function () {
			    console.log('QuickSaving drop recipient parent ' + this.className + '(' + this.id + ')');
			    this.getProtoTypeByClass('CONTAINER').quickSave(false); // QuickSave Parent
			}.bind(this), 500);
			*/
			//console.log('You should save your changes');
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
	/**
	    HTML Encode the given value.
	    Create a in-memory div, set it's inner text(which jQuery automatically encodes
	    then grab the encoded contents back out.  The div never exists on the page.
	    @todo This really should just be an extention of the String class
	    @param {string} value The string to be html encoded
	    @returns {text} An html encoded string
	 */
	htmlEncode(value) {
		return $('<div/>').text(value).html();
	}
	/**
	    Decodes an HTML encoded value back into HTML string
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
		console.log('Move Up');
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
		console.log('Move Down');
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
		this.construct();
		this.populate(this.body.pane.children);
	}
	/** Adds default items to the DOM Menu
	    @returns {GROUP} A Menu Group
	*/
	addDomItems() {
		let domGroup = this.navBar.menu.menu.getGroup('DOM');
		domGroup.addNavItemIcon(new MODEL().set({
			'icon': ICONS.UP,
			'label': 'UP'
		})).el.onclick = this.moveContainerUp.bind(this);
		domGroup.addNavItemIcon(new MODEL().set({
			'icon': ICONS.DOWN,
			'label': 'DOWN'
		})).el.onclick = this.moveContainerDown.bind(this);
		domGroup.addNavItemIcon(new MODEL().set({
			'icon': ICONS.REFRESH,
			'label': 'REFRESH'
		})).el.onclick = this.refresh.bind(this);
        domGroup.addNavItemIcon(new MODEL().set({
            'icon': ICONS.DELETE,
            'label': 'REMOVE'
        })).el.onclick = () => this.remove().then(() => {
            console.log('WOOT: REMOVAL COMPLETE');
        });
		domGroup.addNavItemIcon(new MODEL().set({
			'icon': ICONS.EXCLAMATION,
			'label': 'DELETE'
		})).el.onclick = this.disable.bind(this);
		return domGroup;
	}
	/** Adds the CRUD Nav Items
        @returns {GROUP} A Menu Group
	*/
	addCrudItems() {
		let crudGroup = this.navBar.menu.menu.getGroup('CRUD'); // Retrieves the CRUD Menu
		crudGroup.addNavItemIcon(new MODEL().set({
			'icon': ICONS.LOAD,
			'label': 'LOAD'
		})).el.onclick = this.load.bind(this);
		return crudGroup;
	}
	/** Adds default DOM, CRUD and ELEMENT Nav Items to the Option Menu
        @returns {void}
    */
	addNavBarDefaults() {
		if (this.navBar.menu.menu) {
			//let domGroup = this.addDomItems();
			this.addDomItems();
			let crudGroup = this.addCrudItems();
			// Add items to Options Dropdown Tab
			this.btnSave = crudGroup.addNavItemIcon(new MODEL().set({
				'icon': ICONS.SAVE,
				'label': 'SAVE'
			}));
            this.btnSave.el.onclick = () => this.save();
            //this.createSaveFormDialog.bind(this);
            /*
            this.btnQuickSave = crudGroup.addNavItemIcon(new MODEL().set({
				'icon': ICONS.SAVE,
				'label': 'QUICKSAVE'
			}));
            this.btnQuickSave.el.onclick = () => {
                let dialog = new DIALOG(new MODEL().set({
                    label: 'QuickSave'
                }));
                if (this.quickSave(this)) {
                    dialog.close();
                }
            }
            */
            this.btnQuickSave = crudGroup.addNavItemIcon(new MODEL().set({
                'icon': ICONS.SAVE,
                'label': 'QUICKSAVE'
            }));
            this.btnQuickSave.el.onclick = () => this.save(true); //this.createSaveFormDialog.bind(this);
		}
	}
	/** Moves the Container up one slot in the DOM
	    @returns {void}
	*/
	moveContainerUp() {
		this.navBar.menu.toggleCollapse();
		this.moveUp();
	}
	/** Moves the Container down one slot in the DOM
	    @returns {void}
	*/
	moveContainerDown() {
		this.navBar.menu.toggleCollapse();
		this.moveDown();
	}
	/** Creates a save form for this Container and places it in a wrapper
		inside the CRUD Group
	    @returns {void}
	*/
	createSaveFormDialog() {
		console.log('Create Save Dialog');
		let dialog = new DIALOG(new MODEL().set({
			label: 'Save ' + this.className
		}));
        this.getMainContainer().factory.save(false); // dialog.body, this, 
		dialog.show();
	}
	/** Performs JQuery's ajax method to the given url.
	    @param {string} url Target url
	    @param {string} type HTTP Method (GET,PUT,POST,DELETE)
	    @param {FormPost} formPost Data to be sent to the server
	    param {function} success Function to be called on success
	    @returns {{}} payload
	*/
	ajax(url, type, formPost) { // success
		return $.ajax({
			url,
			type, //ie: POST
			async: true,
			data: formPost,
			success: (result) => result
		});
	}
	/** Adds the Construct 'element' button to the options menu
        @param {string} className Element constructor class name
        @returns {void}
    */
	addConstructElementButton(className) {
		if (this.navBar.menu.menu) {
			this.navBar.menu.menu.getGroup('ELEMENTS').addNavItemIcon(new MODEL().set({
					'icon': ICONS[className],
					'label': className //'Create ^'
				})).el.onclick =
				/** Makes a Promise to perform Container.create() with the
					response (MODEL) and performs a QuickSave on the parent Container
				    @see https://scotch.io/tutorials/javascript-promises-for-dummies
				    @see https://developers.google.com/web/fundamentals/primers/promises
				*/
				() => {
					this.navBar.menu.toggleCollapse();
					let promise = new Promise((resolve, reject) => {
						console.log('Promise');
						// do a thing, possibly async, then…
						let result = this.create(new MODEL().set({
							className
						}));
						console.log('Promise', result);
						if (result === null) {
							reject(Error('Failed to create element'));
						} else {
							resolve(result); // Successfully created Element
						}
					});
					promise.then((result) => {
						console.log('promise success', result);
						//this.quickSave(this);
                        this.save(this.node, this, true);
					}, (err) => {
						console.log('promise fail', err); // Error: "It broke"
					});
				};
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
		try {
			if (typeof this.getMainContainer() !== 'undefined') {
				this.addCase(className, function(model) {
					console.log(this.className + ': CALLING CASE: ' + className);
					try {
						return this.getMainContainer().getFactory().get(this.body.pane, className, model.id || 0);
					} catch (ee) {
						console.warn('Unable to retrieve factory for Container Case', ee);
					}
				}.bind(this)); // CONTAINERFACTORY
				if (addButton) {
					this.addConstructElementButton(className);
				}
			}
		} catch (e) {
			console.warn(this.className + ': Unable to add Container Case', e);
		}
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
		for (let s = 0; s < this.children.length; s++) {
			if (this.children[s].status === STATUS.OPEN) {
				this.children[s].close();
			}
		}
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
	/** Sets the CONTAINER's ID
	    @param {number} id Container database Id
	    @returns {void}
	*/
	setId(id) {
		this.id = id;
		this.el.setAttribute('id', id);
		this.data.id = id;
		this.attributes.id = id;
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
        console.log(this.className + 'getSubsections()', this);
		let id = null;
		let subsections = [];
		for (let c = 0; c < this.body.pane.el.children.length; c++) {
        //for (let c = 0; c < this.children.length; c++) {
			//id = parseInt(this.children[c].id);
            id = parseInt(this.body.pane.el.children[c].id);
			if (!isNaN(id)) {
				subsections.push(id);
			}
		}
		return subsections;
	}
	/** Returns the parent container for this container or null if it does not exist
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		return this.container;
	}
	/** Returns the MAIN container
	    @returns {CONTAINER} The MAIN Container
	    @throws Will throw an error 
	*/
	getMainContainer() {
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
			//return null;
			//console.log('CONTAINER.getMainContainer() caught an error');
			//throw e;
		}
	}
	/** Attempts to have the direct parent Container of this Container perform
	    a QuickSave
	    @returns {Boolean} Returns true if successful
	*/
	quickSaveParent() {
		try {
            //return this.container.quickSave(this.container, false);
            return this.container.save(this, this.container, false);
		} catch (e) {
			console.log('Container.QuickSaveParent() No parent exists');
			return false;
		}
	}
	/** Actions performed after this container is saved
        param {EL} node Parent node
        param {EL} caller This
        @param {Payload} payload Form Response Payload
        @returns {void}
    */
	afterSuccessfulPost(payload) {
		console.log(100, 'Successful Post', payload);
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
		//$(this.el).find('.icarus-container nav.navbar-nav').toggle();
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
                    label: 'Remove ' + this.className + '{' + this.element + '}[' + this.id + '] from ' + this.container.className
                }));
                dialog.footer.buttonGroup.addButton('Yes, Remove ' + this.className, ICONS.REMOVE).el.onclick = () => {
                    console.log('Remove', this);
                    this.destroy().then(() => {
                        try {
                            this.container.save(true).then(() => {
                                resolve(dialog.close());
                            });
                        } catch (ee) {
                            reject(ee);
                        }
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
		//let label = 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']';
		//let text = 'Disable ' + label + ' in the Database?<br>This ' + this.className + ' will be permenantly deleted from database in X days!!!';
		//let container = this.getContainer();
		//let main = container.getMainContainer();
		//let token = this.getMainContainer().getToken();
		//console.log('Token', token);
		/*
        try {
			this.prompt = new PROMPT(label, text, [], [], true);
			this.prompt.form.footer.buttonGroup.children[0].setLabel('Disable', ICONS.REMOVE);
			this.prompt.form.footer.buttonGroup.children[0].el.onclick = () => {
				this.destroy();
				this.prompt.hide();
				console.log('TODO: Disable method on Container controller.');
				console.log(100, 'Disabling ' + this.className);
				$.post('/' + this.className + '/Disable/' + this.id, {
					'__RequestVerificationToken': token //token.value
				}, this.ajaxRefreshIfSuccessful);
				console.log(100, 'Disable Complete');
			};
			this.prompt.show();
		} catch (e) {
			console.log('Unable to disable this ' + this.element, e);
		}
        */
	}
	/** Creates a DATEOBJECT using this Container's dateCreated attribute
	    @returns {DATEOBJECT} An easy to use date object
	*/
	getDateCreated() {
		return DATEOBJECT.getDateObject(new STRING(this.dateCreated).getDateValue(this.dateCreated));
	}
}
export { ATTRIBUTES, createInputModel, DATAELEMENTS, DATEOBJECT, DIALOG, EL, FOOTER, HEADER, ICONS, INPUTTYPES, MODEL, STRING };
/* eslint-enable max-lines */