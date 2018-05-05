/**
 * An enumerated list of supported container html element types
 */
const CONTAINERTYPES = {
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
    DIV: 'DIV'
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
     */
    constructor(node, element, model = new MODEL().set({
        'element': element,
        'name': element,
        'label': element,
        'hasTab': 1,
        'showHeader': 1,
        'collapsed': 0
    })) {
        super(node, element, model);
        this.addClass('icarus-container');
        this.el.setAttribute('id', model.id);

        // Container Properties
        this.loader = null;
        this.prompt = null;
        this.modal = null;
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
        
        if (model.navBar === undefined) {
            model.navBar = {};
            model.navBar.label = model.label;
            model.navBar.brand = this.element;
        }
        /*
        this.navBar = new NAVBAR(this, model.navBar);
        if (model.showHeader) {
            this.navBar.addClass('active');
        }
        */
        if (model.navBar) {
            this.navBar = new NAVBAR(this, model.navBar);
            if (model.showHeader) {
                this.navBar.addClass('active');
            }
        }

        this.body = new CONTAINERBODY(this, model);

        if (model.navBar) {
            this.navBar.header.tab.el.onclick = this.toggleBody.bind(this);
            this.addNavBarDefaults();
        }

        this.addContainerCase('IFRAME');
        this.addContainerCase('FORM');
        this.addContainerCase('LIST');
        this.addContainerCase('JUMBOTRON');
        this.addContainerCase('BANNER');
        this.addContainerCase('TEXTBLOCK');
        this.addContainerCase('HEADER');
        this.addContainerCase('PARAGRAPH');

        if (this.collapsed) {
            this.collapse();
        } else {
            this.expand();
        }

        if (model.navBar) {
            if (!model.showHeader) {
                this.navBar.hide();
            }
        }

        if (model.hasTab) {
            this.tab = this.createTab(this);
        }        
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

        this.navBar.header.menu.getGroup('DOM').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'UP'
                })
            })
        ).el.onclick = function () {            
            this.navBar.header.toggleCollapse();       
            this.moveUp();
        }.bind(this);
        
        this.navBar.header.menu.getGroup('DOM').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'DN'
                })
            })
        ).el.onclick = function () {
            this.navBar.header.toggleCollapse();
            this.moveDown();
        }.bind(this);
        
        this.navBar.header.menu.getGroup('CRUD').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'LOAD'
                })
            })
        ).el.onclick = this.load.bind(this);

        // Add items to Options Dropdown Tab
        let btnSave = this.navBar.header.menu.getGroup('CRUD').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'SAVE'
                })
            })
        );
        btnSave.el.onclick = function () {
            btnSave.toggle('active');
            //this.navBar.header.menu.scrollTo();
            let node = this.navBar.header.menu.getGroup('CRUD').collapse;
            if ($(btnSave.el).hasClass('active')) {
                this.save(node, btnSave); //.bind(this);
            } else {                
                //$(node.el).collapse('hide');
                //node.hide();
                $(node.el).collapse('toggle');
                setTimeout(function () {
                    node.empty();
                }.bind(this), 1000);
                //setTimeout(node.empty.bind(this), 1000);
            }
            //this.navBar.header.toggleCollapse();
        }.bind(this);

        this.navBar.header.menu.getGroup('CRUD').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'DELETE'
                })
            })
        ).el.onclick = this.disable.bind(this);
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
                tab = app.body.sidebar.menu.addNavItem(
                    new MODEL(new ATTRIBUTES()).set({
                        'anchor': new MODEL().set({
                            'label': model.label
                        })
                    })
                );
            }

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
        try {
            this.navBar.header.menu.getGroup('ELEMENTS').addNavItem(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'label': className //'Create ^'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.create(new MODEL().set({
                    'className': className
                }));
            }.bind(this);
        } catch (e) {
            console.log('Unable to add Construct Element Button for "' + className + '"');
            console.log(e);
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
        @returns {string} Section name
    */
    getId() {
        return this.el.getAttribute('id');
    }

    /**
        Sets the CONTAINER's ID
        @param {number} id Section database Id
    */
    setId(id) {
        this.el.setAttribute('id', id);
        this.model.id = id;
    }

    /**
        Returns the CONTAINER's name attribute
        @returns {string} Section name
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
        @param {EL} node The parent container for save menu
        @param {EL} caller The element (typically a button) that called the save method
     */
    save(node, caller) {
        console.log(this.element + '.save()');

        let subsections = [];
        let id = null;
        for (let c = 0; c < this.body.pane.el.children.length; c++) {
            id = parseInt(this.body.pane.el.children[c].id);
            if (!isNaN(id)) {
                subsections.push(id);
            }
        }

        console.log('Creating prompt form...');        
        node.empty();
        //node.hide();
        
        let form = new FORM(
            node,
            new MODEL(new ATTRIBUTES({
                'style':'background-color:white;'
            })).set({
                'label': 'PROMPT FORM',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        let fieldset = new FIELDSET(
            form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        let formElementGroup = new FORMELEMENTGROUP(
            fieldset.body.pane, new MODEL(
                new ATTRIBUTES({
                    //'style':'max-height:40vh;overflow-y:auto;'
                })
            ).set({
                'label': 'FORMELEMENTGROUP',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );

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
                'name': 'shared',
                'type': 'NUMBER',
                'value': new String(this.get('shared'))
            })).set({
                'element': 'BUTTON',
                'label': 'shared',
                'addTab': 0
            })
        ];

        // TODO: Fix this up
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                console.log('inputs[' + i + ']: ' + inputs[i].type);
                let inp = null;
                if (inputs[i].type === 'FORMPOSTINPUT') {
                    console.log('FORMPOSTINPUT');
                    new FORMPOSTINPUT(formElementGroup.body.pane, inputs[i]);
                } else {
                    new INPUT(formElementGroup.body.pane, inputs[i]);
                }
                formElementGroup.children.push(inp);
            }
        }

        /*
        // Add any buttons that were provided
        let buttons = [];
        if (buttons) {
            for (let b = 0; b < buttons.length; b++) {
                form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
            }
        }
        */

        form.setPostUrl(this.className + '/Set');

        form.afterSuccessfulPost = function () {
            //node.hide();
            $(node.el).collapse("toggle");
            node.empty();
            //node.node.navBar.toggleHeaders();
            this.setLabel(form.el.elements['label'].value);
            if (caller) {
                caller.toggle('active');
                console.log(caller);
                caller.node.node.toggleCollapse();
            }
        }.bind(this);
        //node.show(); 


        $(node.el).collapse("show");
    }

    /**
        Actions performed after this container is saved
     */
    afterSuccessfulPost() {
        console.log('CONTAINER.FORM.afterSuccessfulPost(): Posted Successfully.');
        try {
            //this.setLabel(this.el.elements['label'].value);
            //this.subsections = this.prompt.form.el.elements['subsections'].value;
            //this.collapsed = this.prompt.form.el.elements['collapsed'].value;
            //this.loader.hide(200);
            //this.prompt.close(300);
        } catch (e) {
            console.log(e);
        }
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
    disable() {
        try {
            this.prompt = new PROMPT('Disable ' + this.element, 'Disable this '+this.element);

            //this.prompt.form.footer.buttonGroup.empty();

            /**
                Modify prompt buttons
            */
            this.prompt.form.footer.buttonGroup.children[0].setLabel('Remove', ICON.REMOVE);
            this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
                this.destroy();
                this.prompt.hide();
            }.bind(this);

            this.prompt.form.footer.buttonGroup.children[1].destroy();
            
            this.prompt.show();

        } catch (e) {
            console.log('Unable to disable this '+this.element+'\n' + e);
        }
    }    
}