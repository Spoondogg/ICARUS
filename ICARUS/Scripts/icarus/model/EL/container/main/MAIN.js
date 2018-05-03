/**
    A top level application object
*/
class MAIN extends CONTAINER {
    /**
        Constructs an APP
        @param {MODEL} model APP model
        param {string} antiForgeryToken An authentication token
     */
    constructor(model) {
        console.log(model);
        document.title = model.label; //'spoonMEDIA: MAIN' + 
        new WATERMARK();
        
        super(document.body, 'MAIN', model, new CONTAINERFACTORY());  

        try {
            this.body.sidebar.addClass('sidebar-tall');
        } catch (e) {
            console.log('Sidebar does not exist.');
        }

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
        this.navBar.header.menu.getGroup('USER').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'Log Out',
                    'url': '#?url=logout'
                })
            })
        ).el.onclick = function () {            
            this.navBar.header.toggleCollapse();
            this.logout();
        }.bind(this);        

        this.navBar.header.menu.getGroup('USER').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'Manage',
                    'url': 'Manage/Index'
                })
            })
        );
        
        this.navBar.header.menu.getGroup('DOM').addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': 'Toggle Headers'
                })
            })
        ).el.onclick = function () {
            this.toggleHeaders();
            this.navBar.header.toggleCollapse();            
        }.bind(this);
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
        this.prompt = new PROMPT('Load App', 'Loads an Application by Id', [], [
            { 'element': 'INPUT', 'type': 'number', 'name': 'id', 'value': this.id }
        ]);
        /*
        prompt.form.submit = function () {
            id = prompt.form.el.elements['id'].value;
            alert('Loading App(' + id + ')');
            window.location.href = id || 0;
        }.bind(this);
        */
        this.prompt.show();
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