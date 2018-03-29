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
    constructor(node, element, model) { //collapsed, showHeader, hasTab

        model = model || new MODEL().set({
            'element': element,
            'name': element,
            'label': element,
            'hasTab': true,
            'showHeader': true,
            'collapsed': false
        });

        super(node, element || CONTAINERTYPES.DEFAULT, model);
        this.addClass('icarus-container');
        this.el.setAttribute('id', model.id);
        
        // Container Properties
        this.loader = null;
        this.prompt = null;
        this.updateUrl = this.element + '/Set';    
        this.subsections = [];

        // HELLO!!!!!!!!!!!!
        // Consider that if model.navBar doesn't exist, it doesn't need to be created
        if (model.navBar === undefined) {
            model.navBar = {};
            model.navBar.label = model.label;
            model.navBar.brand = this.element;
        }


        this.navBar = new NAVBAR(this, model.navBar);
        if (model.showHeader) {
            this.navBar.addClass('active');
        }

        this.body = new CONTAINERBODY(this, model); //new EL(this, 'DIV', model);


        this.navBar.header.tab.el.onclick = function () {
            console.log('Clicked header tab');
            this.body.collapse();
        }.bind(this);

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
        ).el.onclick = function () {
            this.load(0);
        }.bind(this);

        
        
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
        

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('JUMBOTRON', function () {
            return this.addJumbotron(new MODEL(new ATTRIBUTES(), 'JUMBOTRON'), true);
        }.bind(this));

        this.addCase('TEXTBLOCK', function () {
            return this.addTextBlock(new MODEL(new ATTRIBUTES(), 'TEXTBLOCK'));
        }.bind(this));

        /* Wrap up construction */
        this.populate(model.children);

        if (this.collapsed) {
            this.collapse();
        } else {
            this.expand();
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
        Construct a TextBlock
        @param {any} model Object
        @returns {TEXTBLOCK} a text block
    */
    addTextBlock(model) {
        this.children.push(
            new TEXTBLOCK(this.body, model, 1, false, true)
        );
        return this.children[this.children.length - 1];
    }

    /**
        Create a Jumbotron
        @param {MODEL} model Object Model
        @param {boolean} showHeader Show/hide header
        @returns {JUMBOTRON} A Jumbotron
     */
    addJumbotron(model, showHeader) {
        this.children.push(
            new JUMBOTRON(this.body, model, showHeader)
        );
        return this.children[this.children.length - 1];
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
        Gets this container from the database via ajax GET request.
        Retrieves object model and sets this container.

        This will essentially contain ALL contructors for Containers.  
        This SHOULD be moved into its own FACTORY class (ie: ContainerFactory)

        @param {string} element HTML Element type
        @param {number} id Container UId
        @returns {CONTAINER} A newly constructed container
    */
    getObject(element, id) {
        console.log('CONTAINER.get(' + element + ',' + id + ');');
        $.getJSON('/' + element + '/Get/' + id, function (data) {
            let obj = null;
            switch (element) {
                case 'ARTICLE':
                    obj = new ARTICLE(this.body.pane, data.model);
                    break;

                case 'SECTION':
                    obj = new SECTION(this.body.pane, data.model);
                    break;

                case 'FORM':
                    obj = new IcarusForm(this.body.pane, data.model);
                    break;

                case 'FIELDSET':
                    obj = new IcarusFieldSet(this.body.pane, data.model);
                    break;

                case 'FORMELEMENTGROUP':
                    obj = new IcarusFormElementGroup(this.body.pane, data.model);
                    break;

                case 'INPUT':
                    obj = new IcarusFormInput(this.body.pane, data.model);
                    break;

                case 'SELECT':
                    obj = new IcarusFormSelect(this.body.pane, data.model);
                    break;

                case 'TEXTAREA':
                    obj = new IcarusFormTextArea(this.body.pane, data.model);
                    break;

                case 'FORMELEMENTOPTION':
                    obj = new IcarusFormOption(this.body.pane, data.model);
                    break;

            }
            this.children.push(obj);
        }.bind(this));
        return this.children[this.children.length - 1];
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
                return this.getObject(element, model.id || 0);
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
        Toggles the CONTAINER's body
        @returns {boolean} true if hidden
    */
    collapse() {
        try {
            $(this.body.el).collapse('hide');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
        Toggles the CONTAINER's body
    */
    expand() {
        try {
            $(this.body.el).collapse('show');
        } catch (e) {
            // 
        }
    }

    toggleBody() {
        $(this.body.el).collapse("toggle");
    }

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
        for (let c = 0; c < this.body.el.children.length; c++) {
            subsections.push(this.body.el.children[c].id);
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
                    'label': 'Element',
                    'addTab': false,
                    'showHeader': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'id',
                    'value': this.get('id'),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'ID',
                    'addTab': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'label',
                    'value': this.get('label')
                })).set({
                    'element': 'INPUT',
                    'label': 'Label',
                    'addTab': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'subsections',
                    'value': subsections.toString() || '0'
                })).set({
                    'element': 'INPUT',
                    'label': 'SubSections',
                    'addTab': false
                }),

                // Should be checkbox or dropdown
                new MODEL(new ATTRIBUTES({
                    'name': 'status',
                    'type': 'NUMBER',
                    'value': 1
                })).set({
                    'element': 'INPUT',
                    'label': 'Status',
                    'addTab': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'showHeader',
                    'type': 'NUMBER',
                    'value': 1
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Header',
                    'addTab': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'collapsed',
                    'type': 'NUMBER',
                    'value': 1
                })).set({
                    'element': 'INPUT',
                    'label': 'Collapsed',
                    'addTab': false
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'hasTab',
                    'type': 'NUMBER',
                    'value': 1
                })).set({
                    'element': 'INPUT',
                    'label': 'Has Tab',
                    'addTab': false
                })

            ]
        );

        this.prompt.form.setPostUrl(this.element+'/Set');
        this.prompt.form.afterSuccessfulPost = function () {
            console.log(this.element+': Updating model');
            
            this.setLabel(this.prompt.form.el.elements['label'].value);
            this.subsections = this.prompt.form.el.elements['subsections'].value;
            //this.collapsed = this.prompt.form.el.elements['collapsed'].value);

            console.log(this.model);

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