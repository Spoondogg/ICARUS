/**
    A top level application object represents the complete client object

    Storing the state of this object would allow the user to pick up
    exactly where they left off.

    Technically, this object could begin to establish a profile for the
    user, storing preferences and any user specific settings, tags etc.

    In future versions, consider adding a LOADER to inform the user when
    content is being constructed
*/
class MAIN extends CONTAINER {
    /**
        Constructs an APP
        @param {MODEL} model APP model
        param {string} antiForgeryToken An authentication token
     */
    constructor(model) {
        console.log(model);
        document.title = 'spoonMEDIA: MAIN' + model.label;
        new WATERMARK();
        
        super(document.body, 'MAIN', model, new CONTAINERFACTORY());        
        this.body.sidebar.addClass('sidebar-tall');
        this.body.pane.addClass('pane-tall');

        this.logoutForm = new LogoutForm(this); // This should be created on demand

        this.addNavOptions();
        
        this.stickyFooter = new STICKYFOOTER(this, new MODEL());
        
        this.addContainerCase('ARTICLE');

        this.populate(model.children);
    }

    /**
        Add items to Options Dropdown Tab
     */
    addNavOptions() {
        this.navBar.header.options.menu.addNavSeparator();
        this.navBar.header.options.menu.addNavItem(
            new MODEL().set({
                //'label': 'Log Out',
                'anchor': new MODEL().set({
                    'className': 'ANCHOR',
                    'label': 'Log Out',
                    'url': '#?url=logout'
                })
                //'url': '#?url=logout'
            })
        ).el.onclick = this.logout.bind(this);

        this.navBar.header.options.menu.addNavItem(
            new MODEL(new ATTRIBUTES({
                'style': 'color:green;background-color:red;'
            })).set({
                'anchor': new MODEL().set({
                    'className': 'ANCHOR',
                    'label': 'Toggle Options Menu (Main)'
                })
                //'label': 'Toggle Options Menu (Main)'
            })
        ).el.onclick = function () {
            console.log('DEV: Create Modal and populate with options');
            this.modal = new MODAL('Options', model.label + ' options', true);

            let list = new UL(this.modal.container.body.pane, new MODEL(new ATTRIBUTES('test-list')));
            let item = new LI(list, new MODEL().set({
                'label': 'item1'
            }));

            this.modal.show();
        }.bind(this);

        // Toggle Sidebar
        this.navBar.header.options.menu.addNavItem(
            new MODEL().set({
                //'label': 'Toggle Sidebar (Main)'
                'anchor': new MODEL().set({
                    'className': 'ANCHOR',
                    'label': 'Toggle Sidebar (Main)'
                })
            })
        ).el.onclick = this.toggleSidebar.bind(this);

        this.navBar.header.options.menu.addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'className': 'ANCHOR',
                    'label': 'Manage User',
                    'url': 'Manage/Index'
                })

                //'label': 'Manage User',
                //'url': 'Manage/Index'
            })
        );

        this.navBar.header.options.menu.addNavSeparator();

        // Button to toggle Headers
        this.navBar.header.options.menu.addNavItem(
            new MODEL().set({
                //'label': 'Toggle Headers'
                'anchor': new MODEL().set({
                    'label': 'Toggle Headers'
                })
            })
        ).el.onclick = this.toggleHeaders.bind(this);
    }

    /**
        Toggles visibility of any child Container Headers
     */
    toggleHeaders() {
        $(this.el).find('.icarus-container nav.navbar-nav').toggle();
    }

    /**
        Override Container.createTab()
        @param {MODEL} model Object model
     */
    createTab(model) {
        console.log('\tMAIN.createTab();');
    }    

    /**
        Loads the specified app by id
        @param {number} id App Id to load
    */
    load(id) {
        let prompt = new PROMPT('Load App', 'Loads an Application by Id', [], [
            { 'element': 'INPUT', 'type': 'number', 'name': 'id', 'value': this.id }
        ]);
        /*
        prompt.form.submit = function () {
            id = prompt.form.el.elements['id'].value;
            alert('Loading App(' + id + ')');
            window.location.href = id || 0;
        }.bind(this);
        */
        prompt.show();
    }

    /**
        Made obsolete by EL.merge()
     * @param {any} payload Data returned by server
     */
    updateModel(payload) {
        this.setLabel(payload.label);
        this.setSubSections(payload.subsections);
    }

    /**
        Allows the user to open an ARTICLE in this APP.
        @param {number} id Article id
    */
    open(id) {
        id = id || 0;
        console.log('TODO: APP.open(' + id + ')');
    }

    /**
        Sets the given index id article, displaying the corresponding article
        and hiding all others

        @param {ARTICLE} article The article to set
    */
    setArticle(article) {
        console.log('APP.setArticle(' + article.getId() + ')');
        $('ul[name=document-map] .nav-item').removeClass('active');
        $('article').hide();
        article.activate();
        article.show();
        try {
            article.tab.activate();
        } catch (e) {
            console.log('Article does not have a tab.');
        }
    }

    /**
        Returns the APP Id
        @returns {number} App Id
    */
    getId() {
        return this.id;
    }

    /**
        Sets the label for this app
        @param {string} label Text
    
    setLabel(label) {
        this.label = label;
        try {
            this.navBar.header.setLabel(label);
        } catch (e) {
            console.log('navBar.header does not exist');
            console.log(e);
        }
    }*/

    /**
        Logs the current user out
    */
    logout() {
        console.log('Logging out...');
        this.loader = new LOADER('Log Out', 'Logging out...');
        this.loader.show();

        console.log('Logging out');
        console.log('Token: ' + token);

        // Post the token to the LogOff url and return results into the loader
        $.post('/Account/LogOff', {
            '__RequestVerificationToken': token.value
        }, function (payload, status) {
            this.loader.addText('Status: ' + status);
            console.log('Payload:');
            console.log(payload);

            // textStatus contains the status: success, error, etc
            // If server responds with 'success'            
            if (status === "success") {
                this.loader.setProgress(100, 'Post Complete.');
                console.log('Successfully logged out.');

                setTimeout(function () {
                    this.loader.hide();
                    setTimeout(function () {
                        location.reload(true); //https://www.w3schools.com/jsref/met_loc_reload.asp
                    }.bind(this), 600);
                }.bind(this), 2000);

            } else {
                console.log('Failed to POST results to server with status: "' + status + '"');
                this.loader.setProgress(0, 'The form did not post.<br>' +
                    payload.message + '<br><hr/>'
                );
                console.log('Failed to submit form.\nPayload:\n');
                console.log(payload);
                btnReset.el.style.display = 'none;';
            }
        }.bind(this), "json");
    }
}