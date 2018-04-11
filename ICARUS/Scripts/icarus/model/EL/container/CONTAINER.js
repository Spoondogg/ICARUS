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
class CONTAINER extends EL {
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

        // ADD OPTIONS

        // Toggle Sidebar
        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL().set({
                'label': 'Toggle Sidebar'
            })
        ).el.onclick = this.toggleSidebar.bind(this);

        //this.body.sidebar.menu.getGroup('DOM').addNavItem(
        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL().set({
                'label': 'UP'
            })
        );

        //this.body.sidebar.menu.getGroup('DOM').addNavItem(
        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL().set({
                'label': 'DN'
            })
        );

        //this.body.sidebar.menu.getGroup('DOM').addNavItem(
        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL().set({
                'label': 'Load'
            })
        ).el.onclick = this.load.bind(this);
        
        // Add items to Options Dropdown Tab
        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL(
                new ATTRIBUTES({
                    'name': 'save'
                })
            ).set({
                'label': 'Save'
            })
        ).el.onclick = this.save.bind(this);

        this.navBar.header.options.tab.menu.addNavItem(
            new MODEL(
                new ATTRIBUTES({
                    'name': 'delete'
                })
            ).set({
                'label': 'Delete'
            })
        ).el.onclick = this.disable.bind(this);

        /* Wrap up construction */
        this.populate(model.children);

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
        Creates a TAB that represents this container
        @param {MODEL} model Object Model
        @param {string} antiForgeryToken Token
        @returns {NAVITEMLINK} A tab (navitemlink)
    */
    createTab(model) {
        console.log('Creating tab...');
        console.log(model);
        try {
            let tab = null;
            let container = model.node.node.node;

            //.sidebar.menu.getGroup(model.node.id).addNavItem(

            if (container.tab) {
                tab = container.tab.addNavItemGroup(
                    new MODEL(new ATTRIBUTES())
                ).addNavItem(
                    new MODEL(new ATTRIBUTES()).set({
                        'label': model.label
                    })
                );
            } else {
                tab = app.body.sidebar.menu.addNavItem(
                    new MODEL(new ATTRIBUTES()).set({
                        'label': model.label
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
        
     @param {any} payload Data returned by server
     */
    updateModel(payload) {
        this.setName(payload.name);
        this.setLabel(payload.label);
        this.setSubSections(payload.subsections);
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
        @param {EL} element The element who's tab is being added
    */
    addConstructElementButton(element) {
        this.navBar.header.options.tab.menu.getGroup('ELEMENTS').addNavItem(
            new MODEL().set({
                'label': 'Create ^' + element
            })
        ).el.onclick = function () {
            this.create(element);
        }.bind(this);
    }

    /**
        Performs addCase() for the given Element within a Container of
        an element that extends Container

        Sets the constructor callback for this element
        and adds respective tabs etc to this container

        @param {string} element ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
    */
    addContainerCase(element, addButton) {
        this.addCase(element,
            function (element, model) {
                return factory.get(this.body.pane, element, model.id || 0);
            }.bind(this)
        );
        if (!addButton) {
            this.addConstructElementButton(element);
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
        for (let c = 0; c < this.body.pane.el.children.length; c++) {
            subsections.push(this.body.pane.el.children[c].id);
        }

        console.log('Check the "this.get(attribute)" here');
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
                    'value': this.get('id'),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'ID'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'label',
                    'value': this.get('label')
                })).set({
                    'element': 'INPUT',
                    'label': 'Label'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'subsections',
                    'value': subsections.length > 0 ? subsections.toString() : '0'
                })).set({
                    'element': 'INPUT',
                    'label': 'SubSections'
                }),

                // Should be checkbox or dropdown
                new MODEL(new ATTRIBUTES({
                    'name': 'status',
                    'type': 'NUMBER',
                    'value': this.get('status')
                })).set({
                    'element': 'INPUT',
                    'label': 'Status',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'showHeader',
                    'type': 'NUMBER',
                    'value': this.get('showHeader')
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Header',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'hasSidebar',
                    'type': 'NUMBER',
                    'value': this.get('hasSidebar')
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Sidebar',
                    'addTab': 0
                }),                

                new MODEL(new ATTRIBUTES({
                    'name': 'collapsed',
                    'type': 'NUMBER',
                    'value': this.get('collapsed')
                })).set({
                    'element': 'INPUT',
                    'label': 'Collapsed',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'hasTab',
                    'type': 'NUMBER',
                    'value': this.get('hasTab')
                })).set({
                    'element': 'INPUT',
                    'label': 'Has Tab',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'formPostId',
                    'type': 'NUMBER',
                    'value': this.get('formPostId')
                })).set({
                    'element': 'INPUT',
                    'label': 'formPostId',
                    'addTab': 0
                })

            ]
        );
        
        this.prompt.form.setPostUrl(this.element+'/Set');
        this.prompt.form.afterSuccessfulPost = function () {
            console.log(this.element+': Updating model');
            
            //this.setLabel(this.prompt.form.el.elements['label'].value);
            this.subsections = this.prompt.form.el.elements['subsections'].value;
            this.collapsed = this.prompt.form.el.elements['collapsed'].value;
            

        }.bind(this);

        this.prompt.show();
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
        this.header.setLabel(label);
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
        console.log('updatemodel');
        this.setName(payload.name);
        this.setLabel(payload.label);
        this.setSubSections(payload.subsections);
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