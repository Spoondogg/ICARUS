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
class CONTAINER extends GROUP { // EL {
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
        this.updateUrl = this.element + '/Set';  
        
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

        this.navBar = new NAVBAR(this, model.navBar);
        if (model.showHeader) {
            this.navBar.addClass('active');
        }

        this.body = new CONTAINERBODY(this, model);

        this.navBar.header.tab.el.onclick = this.toggleBody.bind(this);

        this.addNavBarDefaults();

        this.addContainerCase('FORM');
        this.addContainerCase('LIST');
        this.addContainerCase('JUMBOTRON');
        this.addContainerCase('HEADERWRAP');
        this.addContainerCase('TEXTBLOCK');

        if (this.collapsed) {
            this.collapse();
        } else {
            this.expand();
        }

        if (!model.showHeader) {
            this.navBar.hide();
        }

        if (model.hasTab) {
            this.tab = this.createTab(this);
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
        );
        
        this.navBar.header.menu.getGroup('DOM').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'DN'
                })
            })
        );
        
        this.navBar.header.menu.getGroup('CRUD').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'LOAD'
                })
            })
        ).el.onclick = this.load.bind(this);

        // Add items to Options Dropdown Tab
        this.navBar.header.menu.getGroup('CRUD').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'SAVE'
                })
            })
        ).el.onclick = this.save.bind(this);

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
        this.navBar.header.menu.getGroup('ELEMENTS').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'Create ^' + className
                })
            })
        ).el.onclick = function () {
            this.navBar.header.toggleCollapse();
            this.create(new MODEL().set({
                'className': className
            }));
        }.bind(this);
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
        console.log(this.className + '.addContainerCase(' + className + ')');
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
     */
    save() {
        console.log(this.element + '.save()');

        let subsections = [];
        for (let c = 0; c < this.body.pane.children.length; c++) {
            subsections.push(this.body.pane.children[c].id);
        }

        this.prompt = new PROMPT(
            'Save ' + this.get('element'), 'Saves the ' + this.get('element'),
            [], [
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
                    'value': new String(this.get('label'))
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
                    'name': 'formPostId',
                    'type': 'NUMBER',
                    'value': new String(this.get('formPostId'))
                })).set({
                    'element': 'INPUT',
                    'label': 'formPostId',
                    'addTab': 0
                })

            ]
        );

        // Override form defaults
        //this.prompt.form.setPostUrl(this.element+'/Set');
        this.prompt.form.setPostUrl(this.className + '/Set');
        this.prompt.form.afterSuccessfulPost = this.afterSuccessfulPost.bind(this);

        this.prompt.show();
    }

    /**
        Actions performed after this container is saved
     */
    afterSuccessfulPost() {
        console.log('PROMPT.FORM.afterSuccessfulPost(): Posted Successfully.');

        this.setLabel(this.prompt.form.el.elements['label'].value);
        //this.subsections = this.prompt.form.el.elements['subsections'].value;
        //this.collapsed = this.prompt.form.el.elements['collapsed'].value;
        this.prompt.form.loader.hide(200);
        this.prompt.close(300);
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