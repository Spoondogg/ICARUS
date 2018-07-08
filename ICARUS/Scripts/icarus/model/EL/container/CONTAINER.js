/**
 * An enumerated list of supported container html element types
 */
var CONTAINERTYPES = {
    DEFAULT: 'DIV',
    MAIN: 'MAIN',
    ARTICLE: 'ARTICLE',
    SECTION: 'SECTION',
    FORM: 'FORM',
    FIELDSET: 'FIELDSET',
    FORMELEMENTGROUP: 'FORMELEMENTGROUP',
    FORMELEMENT: 'FORMELEMENT',
    INPUT: 'INPUT',
    SELECT: 'SELECT',
    TEXTAREA: 'TEXTAREA',
    DIV: 'DIV',
    INDEX: 'INDEX'
};

/**
    A generic CONTAINER with a header that controls population of this element.

    A container can be expanded or hidden and
    have elements added to itself.
*/
class CONTAINER extends GROUP {
    /**
        @param {EL} node The element to contain the section
        @param {string} element HTML element
        @param {MODEL} model The CONTAINER object retrieved from the server
        @param {array} containerList An array of strings representing child Containers that this Container can create
     */
    constructor(node, element, model = new MODEL().set({
        'element': element,
        'name': element || '',
        'label': element,
        'hasTab': 1,
        'showHeader': 1,
        'collapsed': 0,
        'shared': 1
    }), containerList = []) {
        super(node, element, model);
        this.addClass('icarus-container');

        // Data elements contain a list of arguments for a data object
        this.dataElements = DATAELEMENTS[this.className];

        this.attrElements = []; // Attribute elements contain a list of attributes that apply for this object
        
        if (model.id) {
            this.el.setAttribute('id', model.id);
        }

        this.shared = this.shared ? this.shared : 1;

        // Container Properties
        this.prompt = null;
        this.updateUrl = this.element + '/Set';  // model.className should be the actual value, no?
        
        // Delimited list of child ids
        this.subsections = '0';
        if (model.subsections) {
            this.subsections = model.subsections.split(',');
        }

        // HELLO!!!!!!!!!!!!
        // Consider that if model.navBar doesn't exist, it doesn't need to be created
        // navbar is pretty heavy
        // Create it on demand instead of always being here
        // Use el.make() as required
        // Implement el.make() as an argument of new EL();
        
        if (model.navBar === undefined) {
            model.navBar = {};
            model.navBar.label = model.label;
            model.navBar.brand = this.element;
        }
        
        if (model.navBar) {
            this.navBar = new NAVBAR(this, model.navBar);
            if (model.element !== 'MAIN') {
                if (model.showHeader && dev === true) {
                    this.navBar.addClass('active');
                } else {
                    this.navBar.el.style.display = 'none';
                }
            }

            if (model.shared) {
                this.navBar.header.tab.anchor.icon.el.className = ICON.PUBLIC;
            }
        }

        this.body = new CONTAINERBODY(this, model);

        if (model.navBar) {
            this.navBar.header.tab.el.onclick = this.toggleBody.bind(this);
            this.addNavBarDefaults();
        }

        // Default permitted child containers
        this.addContainerCase('IFRAME');
        this.addContainerCase('FORM');
        this.addContainerCase('LIST');
        this.addContainerCase('MENULIST');
        this.addContainerCase('JUMBOTRON');
        this.addContainerCase('BANNER');
        this.addContainerCase('PARAGRAPH');
        this.addContainerCase('CHAT');

        // Add any additional containers from containerList
        for (let c = 0; c < containerList.length; c++) {
            this.addContainerCase(containerList[c]);
        }

        // Collapse or Expand Body Pane
        if (this.collapsed) {
            this.collapse();
        } else {
            this.expand();
        }

        // Show or Hide the NavBar
        if (model.navBar) {
            if (!model.showHeader) {
                this.navBar.hide();
            }
        }

        // Adds a Tab to the SideBar (where applicable)
        if (model.hasTab) {
            this.tab = this.createTab(this);
        }

        // These methods may need to be migrated within the extended objects
        if (this.className !== 'CONTAINER') {
            this.construct();
        } else {
            this.populate(model.children);
        }

        /*
        // Load any children that were provided in the model
        if (this.className === 'CONTAINER') {
            this.populate(model.children);
        }
        */
    }

    /** Abstract construct method throws an error if not declared */
    construct() {
        debug('CONTAINER.construct();');
        if (this.className !== 'CONTAINER') {
            throw new Error('Abstract method ' + this.className + '.construct() not implemented.');
        }
    }

    /**
        HTML Encode the given value.

        Create a in-memory div, set it's inner text(which jQuery automatically encodes
        then grab the encoded contents back out.  The div never exists on the page.

        TODO: This really should just be an extention of the String class

        @param {any} value The string to be html encoded
        @returns {text} An html encoded string
     */
    htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    /**
        Decodes an HTML encoded value back into HTML string

        TODO: This really should just be an extention of the String class

        @param {any} value An html encoded string
        @returns {string} A string that was previously html encoded
     */
    htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    /**
     * Moves this element UP one slot
     */
    moveUp() {
        console.log('Move Up');
        let node = $(this.el);
        //let node = $(this.node.el);
        //let container = this.node.node.el;
        if (node.prev().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .prev()
                    .animate({ height: 'toggle' }, 300)
                    .insertAfter(node)
                    .animate({ height: 'toggle' }, 300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300).delay(300);
            }, 300);
        }
    }

    /**
     * Moves this element DOWN one slot
     */
    moveDown() {
        console.log('Move Down');
        let node = $(this.el);
        //let node = $(this.node.el);
        //let container = this.node.node.el;
        if (node.next().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .next()
                    .animate({ height: 'toggle' }, 300)
                    .insertBefore(node)
                    .animate({ height: 'toggle' }, 300)
                    .delay(300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300);
            }, 300);
        }
    }

    /**
        Adds default DOM, CRUD and ELEMENT Nav Items to the Option Menu
     */
    addNavBarDefaults() {
        if (this.navBar.header.menu) {

            if (this.hasSidebar) {                
                this.navBar.header.menu.getGroup('DOM').addNavItem(
                    new MODEL().set({
                        'anchor': new MODEL().set({
                            'label': 'Toggle Sidebar'
                        })
                    })
                ).el.onclick = function () {
                    this.navBar.header.toggleCollapse();
                    setTimeout(function () {
                        this.toggleSidebar();
                    }.bind(this), 500);
                }.bind(this);                
            }
            
            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.UP,
                        'label': 'UP'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.moveUp();
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.DOWN,
                        'label': 'DOWN'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.moveDown();
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.REFRESH,
                        'label': 'REFRESH'
                    })
                })
            ).el.onclick = function () {
                console.log('TODO: Refresh CONTAINER{' + this.className + '}[' + this.id + ']');
                console.log(this);

                app.loader.log(20, 'Emptying body.pane');
                app.loader.show();

                this.body.pane.empty();

                console.log('Rebuilding children...');

                // This needs to handle the Container constructor
                // Does this mean that I CALL the constructor?
                // ie:  CONTAINER.call(
                //let newContainer = new this.__proto__.constructor(this.node, this);

                // Reconstruct from model
                this.construct();

                // Populate based on children
                this.populate(this.body.pane.children);
                


                // Retrieve the object from the server? Or use local model.
                // TRY to use local first.
                /*
                try {
                    $.getJSON('/FORMPOST/Get/' + parseInt(this.data.bgimage), function (data) {

                        // If access granted...
                        if (data.model) {
                            //console.log('Retrieved image id: ' + parseInt(this.data.bgimage));
                            //console.log(data.model);
                            console.log('Parsed...');
                            let parsed = JSON.parse(data.model.jsonResults);
                            console.log(parsed);

                            // Extract the base64 values and create an image
                            for (let p = 0; p < parsed.length; p++) {
                                if (parsed[p].name === 'base64') {
                                    this.body.pane.el.setAttribute('style',
                                        'background: url(' + parsed[p].value + ');'
                                    );
                                }
                            }
                        }
                    }.bind(this));
                } catch (e) {
                    console.log('Unable to retrieve FormPost.');
                    console.log(e);
                }
                */

            }.bind(this);

            this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.LOAD,
                        'label': 'Load'
                    })
                })
            ).el.onclick = this.load.bind(this);

            // Add items to Options Dropdown Tab
            this.btnSave = this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.SAVE,
                        'label': 'SAVE'
                    })
                })
            );
            this.btnSave.el.onclick = function () {
                this.btnSave.toggle('active');
                //this.navBar.header.menu.scrollTo();

                // CREATE A TEMPORARY wrapper to hold the SAVE FORM
                if ($(this.btnSave.el).hasClass('active')) {
                    let node = this.navBar.header.menu.getGroup('CRUD').wrapper;
                    this.btnSave.wrapper = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('collapse in wrapper')));
                    this.save(this.btnSave.wrapper, this.btnSave); //.bind(this);
                } else {
                    console.log('closing save form');
                    let wrp = this.navBar.header.menu.getGroup('CRUD').el.nextElementSibling;
                    
                    try {
                        $(wrp).collapse('toggle');
                        setTimeout(function () {          
                            wrp.parentNode.removeChild(wrp);
                        }.bind(this), 2000);

                    } catch (e) {
                        console.log('Unable to destroy this ');
                        console.log(e);
                    }
                }

                this.navBar.header.toggleCollapse();

            }.bind(this);

            this.btnQuickSave = this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.SAVE,
                        'label': 'QUICKSAVE'
                    })
                })
            );
            this.btnQuickSave.el.onclick = this.quickSave.bind(this);

            this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.DELETE,
                        'label': 'REMOVE'
                    })
                })
            ).el.onclick = this.remove.bind(this);

            this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON.EXCLAMATION,
                        'label': 'DELETE'
                    })
                })
            ).el.onclick = this.disable.bind(this);

        }
    }
    
    /**
        Creates a TAB that represents this container
        @param {MODEL} model Object Model
        @param {string} antiForgeryToken Token
        @returns {NAVITEMLINK} A tab (navitemlink)
    */
    createTab(model) {
        try {
            let tab = null;
            let container = model.node.node.node;

            if (container.tab) {
                tab = container.tab.addMenu(new MODEL()).addNavItem(
                    new MODEL(new ATTRIBUTES()).set({
                        'anchor': new MODEL().set({
                            'label': model.label
                        })
                    })
                );
            } else {
                if (typeof app !== 'undefined' && app.body.sidebar) {
                    tab = app.body.sidebar.menu.addNavItem(
                        new MODEL(new ATTRIBUTES()).set({
                            'anchor': new MODEL().set({
                                'label': model.label
                            })
                        })
                    );
                }
            }

            if (tab !== null) {
                tab.el.onclick = function (e) {
                    // Activate parent(s)
                    app.setArticle(model);
                    let parentNode = model.node.node.node;
                    while (parentNode.node.node) { // 
                        try {
                            parentNode.tab.activate();
                            parentNode.show();
                        } catch (ee) { /*console.log(ee)*/ }
                        parentNode = parentNode.node.node.node;
                    }

                    // Prevent parent click()
                    e.stopPropagation();

                }.bind(this);
            }
            return tab;
        } catch (e) {
            console.log(this.element+' has not been instantiated.  Unable to create tab.');
            console.log(e);
            return null;
        }
    }
    
    /**
        Performs JQuery's ajax method to the given url.
        @param {string} url Target url
        @param {string} type HTTP Method (GET,PUT,POST,DELETE)
        @param {FormPost} formPost Data to be sent to the server
        @param {function} success Function to be called on success
        @returns {object} payload
    */
    ajax(url, type, formPost, success) {
        return $.ajax({
            url: url,
            type: type, //ie: POST
            async: true, 
            data: formPost,
            success: function (result) {
                // Do something with the result
            }
        });
    }

    /**
        Adds the Construct 'element' button to the options menu
        @param {string} className Element constructor class name
    */
    addConstructElementButton(className) {
        if (this.navBar.header.menu) {

            //this.navBar.header.menu.getGroup('ELEMENTS').addNavItem(
            this.navBar.header.menu.getGroup('ELEMENTS').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICON[className],
                        'label': className //'Create ^'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.create(new MODEL().set({
                    'className': className
                }));
                try {
                    this.navBar.header.tab.anchor.icon.setIcon('glyphicon ' + ICON.EXCLAMATION);
                } catch (e) {
                    console.log(e);
                }
            }.bind(this);
        }
    }

    /**
        Performs addCase() for the given Element within a Container of
        an element that extends Container

        Sets the constructor callback for this element
        and adds respective tabs etc to this container

        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
    */
    addContainerCase(className, addButton = true) {
        //console.log(this.className + '.addContainerCase(' + className + ')');
        this.addCase(className,
            function (model) {
                return factory.get(this.body.pane, className, model.id || 0);
            }.bind(this)
        );
        if (addButton) {
            this.addConstructElementButton(className);
        }
    }

    /**
        Overrides EL.open();
        Opens the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
    */
    open() {
        try {
            this.status = STATUS.OPEN;
            super.open();
            this.el.setAttribute('data-status', 'open');
            this.header.btnLock.icon.el.className = ICON.UNLOCK;
            this.header.options.el.removeAttribute('disabled');
        } catch (e) {
            console.log('Unable to open parent.');
            console.log(e);
        }
    }

    /**
        Closes the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        and update accordingly
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
        this.header.btnLock.icon.el.className = ICON.LOCK;
        $(this.header.btnLock.el).removeClass('active');
        this.header.options.el.setAttribute('disabled', 'disabled');

        console.log('Locked');
    }

    /**
        Returns the CONTAINER's name attribute
        @returns {string} Container name
    */
    getId() {
        return this.el.getAttribute('id');
    }

    /**
        Sets the CONTAINER's ID
        @param {number} id Container database Id
    */
    setId(id) {
        this.id = id;
        this.el.setAttribute('id', id);
        this.data.id = id;
        this.attributes.id = id;
    }

    /**
        Returns the CONTAINER's name attribute
        @returns {string} Container name
    */
    getName() {
        return this.el.getAttribute('name');
    }

    /**
        Sets the name of this element to the given value.
        @param {string} name The name to be set
    */
    setName(name) {
        this.el.setAttribute('name', name);
        this.model.name = name;
    }

    /**
        Collapses the container's body
        @returns {boolean} true if hidden
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

    /**
        Expands the container's body
    */
    expand() {
        try {
            $(this.body.el).collapse('show');
        } catch (e) {
            console.log(e);
        }
    }

    /**
        Toggles the collapsed state of the container's body
     */
    toggleBody() {
        $(this.body.el).collapse('toggle');
    }

    /**
        Toggles the active state of the sidebar
     */
    toggleSidebar() {
        this.body.sidebar.toggle('active');
        setTimeout(function () {
            $(this.body.sidebar.el).collapse('toggle');
        }.bind(this), 600);
    }

    /**
     * Creates a modal and populates with a list of Form Groups that belong to this user
     */
    load() {
        let modal = new MODAL('Select A Form Group', 'Choose from the following...');
        modal.show();
    }

    /**
        Saves the state of this Element
        @param {EL} node The parent container to hold the save menu
        @param {EL} caller The element (typically a button) that called the save method
     */
    save(node, caller) {
        console.log(this.element + '.save()');
        console.log('Node:');
        console.log(node);
        console.log('Caller:');
        console.log(caller);
        console.log('This:');
        console.log(this);

        // Populate subsections with elements in this body
        let subsections = this.getSubSections();

        debug('Creating save form...');        
        let form = this.createEmptyForm(node, false);
        form.el.setAttribute('style', 'background-color:white;');

        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'element',
                'value': this.get('element'),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'element'
            }),

            new MODEL(new ATTRIBUTES({
                'id': 0,
                'name': 'id',
                'value': new String(this.get('id')),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'ID'
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'label',
                'value': typeof this.get('label') === 'object' ? new String(this.get('label').el.innerHTML) : new String(this.get('label'))
            })).set({
                'element': 'INPUT',
                'label': 'Label'
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'subsections',
                'value': subsections.length > 0 ? subsections.toString() : '0',
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'SubSections'
            }),

            // Should be checkbox or dropdown
            new MODEL(new ATTRIBUTES({
                'name': 'status',
                'type': 'NUMBER',
                'value': new String(this.get('status'))
            })).set({
                'element': 'INPUT',
                'label': 'Status',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'showHeader',
                'type': 'NUMBER',
                'value': new String(this.get('showHeader'))
            })).set({
                'element': 'INPUT',
                'label': 'Show Header',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'hasSidebar',
                'type': 'NUMBER',
                'value': new String(this.get('hasSidebar'))
            })).set({
                'element': 'INPUT',
                'label': 'Show Sidebar',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'collapsed',
                'type': 'NUMBER',
                'value': new String(this.get('collapsed'))
            })).set({
                'element': 'INPUT',
                'label': 'Collapsed',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'hasTab',
                'type': 'NUMBER',
                'value': new String(this.get('hasTab'))
            })).set({
                'element': 'INPUT',
                'label': 'Has Tab',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'dataId',
                'type': 'NUMBER',
                'value': new String(this.get('dataId'))
            })).set({
                'element': 'BUTTON',
                'label': 'dataId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'attributesId',
                'type': 'NUMBER',
                'value': new String(this.get('attributesId'))
            })).set({
                'element': 'BUTTON',
                'label': 'attributesId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'descriptionId',
                'type': 'NUMBER',
                'value': new String(this.get('descriptionId'))
            })).set({
                'element': 'BUTTON',
                'label': 'descriptionId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'shared',
                'type': 'NUMBER',
                'value': new String(this.get('shared')) || '0'
            })).set({
                'element': 'BUTTON',
                'label': 'shared',
                'addTab': 0
            })
        ];

        form.fieldset.formElementGroup.addInputElements(inputs);
        
        form.setPostUrl(this.className + '/Set');

        /*
        // THIS IS THE PART THAT USES NODE/CALLER
        */
        form.afterSuccessfulPost = function () {
            $(node.el).collapse('toggle');
            node.empty();
            this.setLabel(form.el.elements['label'].value);
            if (caller) {
                caller.toggle('active');
                console.log(caller);
                caller.node.node.toggleCollapse();
            }
            app.loader.hide();
        }.bind(this);

        $(node.el).collapse("show");
    }

    /**
     * Generates an array of subsection Ids for this Container
     * @returns {array} A collection of subsection ids
     */
    getSubSections() {
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

    /**
     * Recursively iterates through parent nodes until an object with the given 'attributeName' is found
     * @param {any} key The object key to search within
     * @param {any} value The value to search for within this key
     * @param {any} node Entry point to traversing the chain
     * @param {any} attempt Recursion loop
     * @returns {CONTAINER} The parent container
     */
    getContainer(key, value, node = this.node, attempt = 0) {
        attempt++;

        debug('Searching for ' + key + ': ' + value + '(' + attempt + ')');
        debug(node);

        if (attempt < 100) {
            try {
                debug('id: ' + node.id);
                if (node[key] === value.toString()) {
                    return node;
                } else {
                    return this.getContainer(key, value, node.node, attempt++);
                }
            } catch (e) {
                debug(e);
            }
        } else {
            debug('getContainer(): Too many attempts (' + attempt + ')');
        }
    }

    

    /**
     * Creates an empty form with a single fieldset and formelementgroup
     * @param {EL} node Parent node
     * @param {boolean} hidden If true, form is hidden
     * @returns {FORM} An empty form container
     */
    createEmptyForm(node, hidden = false) {
        let form = new FORM(
            node,
            new MODEL(new ATTRIBUTES({
                'style': hidden ? 'display:none;' : ''
            })).set({
                'label': 'FORM',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset = new FIELDSET(
            form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset.formElementGroup = new FORMELEMENTGROUP(
            form.fieldset.body.pane, new MODEL().set({
                'label': 'FORMELEMENTGROUP',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        return form;
    }

    /**
     * If dataId or attributesId exists, extract the appropriate values
     * @param {number} modelId The object's unique identifier
     * @param {object} data The object to be saved
     */
    quickSaveFormPost(modelId, data) {
        console.log('QuickSaveFormPost:'+modelId);
        console.log(data);
        if (modelId > 0) {
            app.loader.log(50, 'Saving FormPost: ' + modelId);
            let form = this.createEmptyForm(this, true);
            let inputs = [];
            for (let key in data) {
                debug('Adding data attributes');

                //let value = this.data[key] ? this.data[key] : data[key];
                console.log('Key: ' + key);
                console.log('Value:');
                console.log(this.htmlEncode(data[key]));

                inputs.push(
                    new MODEL(new ATTRIBUTES({
                        'name': key,
                        //'value': this[key] ? this[key].el ? this[key].el.innerHTML : data[key] : data[key]
                        'value': this.htmlEncode(data[key]) //value
                    })).set({
                        'element': 'INPUT',
                        'label': key,
                        'addTab': 0
                    })
                );
            }

            form.fieldset.formElementGroup.addInputElements(inputs);
            form.setPostUrl('FormPost/Set');
            form.post();
            form.afterSuccessfulPost = function () {
                form.destroy();
                debug('FormPost: ' + modelId + ' has been quicksaved');
            }.bind(this);

        } else {
            debug('No modelId provided');
        }
    }

    /**
        Displays a prompt that performs a save of the container, it's 
        attributes and any data objects associated with it.
     */
    quickSave(noPrompt = false) {

        if (noPrompt || confirm('Quick Save?')) {
            app.loader.log(20, 'Quick Save');

            debug(this.element + '.save()');
            debug(this);

            // Populate subsections with elements in this body
            let subsections = this.getSubSections();

            debug('Creating save form...');
            let form = this.createEmptyForm(this, true);
            form.fieldset.formElementGroup.addInputElements([
                new MODEL(new ATTRIBUTES({
                    'name': 'element',
                    'value': this.get('element'),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'element'
                }),

                new MODEL(new ATTRIBUTES({
                    'id': 0,
                    'name': 'id',
                    'value': new String(this.get('id')),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'ID'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'label',
                    'value': typeof this.get('label') === 'object' ? new String(this.get('label').el.innerHTML) : new String(this.get('label'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Label'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'subsections',
                    'value': subsections.length > 0 ? subsections.toString() : '0',
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'SubSections'
                }),

                // Should be checkbox or dropdown
                new MODEL(new ATTRIBUTES({
                    'name': 'status',
                    'type': 'NUMBER',
                    'value': new String(this.get('status'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Status',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'showHeader',
                    'type': 'NUMBER',
                    'value': new String(this.get('showHeader'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Header',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'hasSidebar',
                    'type': 'NUMBER',
                    'value': new String(this.get('hasSidebar'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Sidebar',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'collapsed',
                    'type': 'NUMBER',
                    'value': new String(this.get('collapsed'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Collapsed',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'hasTab',
                    'type': 'NUMBER',
                    'value': new String(this.get('hasTab'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Has Tab',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'dataId',
                    'type': 'NUMBER',
                    'value': new String(this.get('dataId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'dataId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'attributesId',
                    'type': 'NUMBER',
                    'value': new String(this.get('attributesId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'attributesId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'descriptionId',
                    'type': 'NUMBER',
                    'value': new String(this.get('descriptionId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'descriptionId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'shared',
                    'type': 'NUMBER',
                    'value': new String(this.get('shared'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'shared',
                    'addTab': 0
                })
            ]);

            form.setPostUrl(this.className + '/Set');
            form.post();
            form.afterSuccessfulPost = function () {
                this.setLabel(form.el.elements['label'].value);
                form.destroy();

                this.quickSaveFormPost(this.dataId, this.data);
                this.quickSaveFormPost(this.attributesId, this.attributes);

                //app.loader.hide();
            }.bind(this);

            app.loader.log(100, 'Quick Save Complete');
            //app.loader.hide();
        } else {
            console.log('Quick Save Cancelled');
        }

        this.navBar.header.toggleCollapse();
    }

    /**
        Actions performed after this container is saved
        @param {EL} node Parent node
        @param {EL} caller This
     */
    afterSuccessfulPost(node, caller) {
        app.loader.log(100, 'Success');
        //app.loader.hide();
    }

    /**
        Returns the label for this section
        @returns {string} The label
    */
    getLabel() {
        return this.header.getLabel();
    }

    /**
        Sets the label of this element to the given value.
        @param {string} label The name to be set
    */
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label = label;
    }

    /**
        Sets the label of this element to the given value.
        @param {string} name The name to be set
    */
    setName(name) {
        this.el.setAttribute('name', name);
        this.model.name = name;
    }

    /**
        Sets the subsection array to the given value
        @param {array} subsections Sub Section UID array
    */
    setSubSections(subsections) {
        this.model.subsections = subsections;
    }

    /**
        Toggles visibility of any child Container Headers
     */
    toggleHeaders() {
        $(this.el).find('.icarus-container nav.navbar-nav').toggle();
    }

    /**
     * 
     @param {any} payload Data returned by server
     */
    updateModel(payload) {
        //console.log('updatemodel');
        //this.setName(payload.name);
        //this.setLabel(payload.label);
        //this.setSubSections(payload.subsections);
    }

    /**
        Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
    */
    remove() {
        let label = 'Remove ' + this.className + '{'+ this.element + '}['+this.id+']';
        let text = 'Remove ' + this.className + ' from ' + this.node.node.node.className + '?';
        try {
            this.prompt = new PROMPT(label, text, [], [], true);
            this.prompt.form.footer.buttonGroup.children[0].setLabel('Remove', ICON.REMOVE);
            this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
                this.destroy();
                this.prompt.hide();
            }.bind(this);            
            this.prompt.show();
        } catch (e) {
            debug('Unable to disable this ' + this.element);
            debug(e);
        }
    }

    /**
        Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
    */
    disable() {
        let label = 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']';
        let text = 'Disable ' + this.className + 'j['+this.id+'] in the Database?<br>This '+this.className+' will be permenantly deleted from database in X days!!!';
        try {
            this.prompt = new PROMPT(label, text, [], [], true);
            this.prompt.form.footer.buttonGroup.children[0].setLabel('Disable', ICON.REMOVE);
            this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
                this.destroy();
                this.prompt.hide();
                console.log('TODO: Disable method on Container controller.');
                app.loader.log(100, 'Disabling '+this.className);
                $.post('/' + this.className + '/Disable/' + this.id, {
                    '__RequestVerificationToken': token.value
                },
                    function (payload, status) {
                        if (payload.result !== 0) {
                            app.loader.log(100, 'Success');
                            setTimeout(function () {

                                let url = new URL(window.location.href);
                                let returnUrl = url.searchParams.get('ReturnUrl');
                                if (returnUrl) {
                                    returnUrl = url.origin + returnUrl;
                                    location.href = returnUrl;
                                } else {
                                    location.reload(true);
                                }

                            }.bind(this), 1000);
                        } else {
                            app.loader.log(0, 'Login failed. (err_' + status + ').<br>' +
                                payload.message
                            );
                            debug('Failed to POST results to server with status: "' + status + '"');
                            debug('Payload:\n');
                            debug(payload);
                        }
                    }.bind(this)
                );

                app.loader.log(100, 'Disable Complete');




            }.bind(this);
            this.prompt.show();
        } catch (e) {
            debug('Unable to disable this ' + this.element);
            debug(e);
        }
    } 
}