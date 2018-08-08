/**
    A top level application object
*/
class MAIN extends CONTAINER {
    /**
        Constructs an APP
        @param {MODEL} model APP model
     */
    constructor(model) {
        model = model || new MODEL().set({
            'id': 0,
            'showHeader': 1,
            'hasSidebar': 0,
            'collapsed': 0,
            'hasTab': 0,
            'dataId': 0,
            'attributesId': 0,
            'descriptionId': 0,
            'shared': 0,
            'element': 'MAIN',
            'navBar': {
                'className': 'NAVBAR',
                'attributes': {
                    'class': 'navbar navbar-fixed-top navbar-inverse'
                },
                'element': 'NAV'
            },
            'footer': {
                'className': 'STICKYFOOTER',
                'attributes': {
                    'class': 'stickyfooter'
                },
                'element': 'FOOTER'
            },
            'className': 'Main',
            'attributes': {
                'class': 'app'
            }
        });

        document.title = model.label;
        new WATERMARK();
        
        super(document.body, 'MAIN', model, ['ARTICLE','INDEX','INDEXMAIN','CLASSVIEWER','IMAGEGALLERY','DICTIONARY','WORD']);
        this.body.pane.addClass('pane-tall');

        this.loader = new LOADER('Loading', 'Loading', 100);
        this.loader.log(100, 'Loading');        

        if (this.body.sidebar) {
            this.body.sidebar.addClass('sidebar-tall');
        }        

        this.addNavOptions();
        
        this.stickyFooter = new STICKYFOOTER(this, new MODEL());

        this.populate(model.children);
    }

    construct() {

    }

    /**
     * Return the user or Guest if doesn't exist
     * @returns {string} User string
     */
    getUser() {
        let userVar;
        try {
            userVar = user;
        } catch (e) {
            userVar = 'Guest';
        }
        return userVar;
    }

    /**
        Add items to Options Dropdown Tab
     */
    addNavOptions() {
        if (this.navBar.header.menu) {

            this.navBar.header.menu.getGroup('USER').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': 'Log Out',
                        'url': '#?url=logout'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.logout();
            }.bind(this);

            this.navBar.header.menu.getGroup('USER').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.OPTIONS,
                        'label': 'Manage',
                        'url': 'Manage/Index'
                    })
                })
            );

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.HOME,
                        'label': 'Home'
                    })
                })
            ).el.onclick = function () {
                app.loader.log(100, 'Returning Home...');
                setTimeout(function () {
                    location.href = url.origin;
                }.bind(this), 1000);
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.TOGGLE,
                        'label': 'Headers'
                    })
                })
            ).el.onclick = function () {
                this.toggleHeaders();
                this.navBar.header.toggleCollapse();
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.CONSOLE,
                        'label': 'Console'
                    })
                })
            ).el.onclick = function () {
                console.log('Showing Console');
                app.loader.show();
                app.loader.showConsole();
                //$(app.loader.console.el).collapse('show');
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.REFRESH,
                        'label': 'Reload'
                    })
                })
            ).el.onclick = function () {
                app.loader.log(100, 'Reloading');
                setTimeout(function () {
                    location.reload(true);
                }.bind(this), 1000);
            }.bind(this);
        }
    }

    /**
        Override Container.createTab()
        @param {MODEL} model Object model
     */
    createTab(model) {
        debug('\tMAIN.createTab();');
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
        debug('APP.setArticle(' + article.getId() + ')');
        $('ul[name=document-map] .nav-item').removeClass('active');
        $('article').hide();
        article.activate();
        article.show();
        try {
            article.tab.activate();
        } catch (e) {
            debug('Article does not have a tab.');
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
     * Log into the application using the given credentials
     * @param {string} email Username / Email 
     * @param {string} password Account Password
     */
    login(email, password) {
        console.log('Log In');
        // TODO Handle supplied arguments... Or don't... Not sure yet.

        this.prompt = new PROMPT('Log In', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Login');
        this.prompt.form.el.setAttribute('class', 'login');
        this.prompt.form.el.setAttribute('method', 'POST');
        this.prompt.form.el.setAttribute('action', '#');

        //this.email = new INPUT(this.prompt.formElementGroup.body.pane,
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'Email',
                    'name': 'Email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );
        
        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'Password',
                    'name': 'Password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        this.provider = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));

        this.returnUrl = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'returnUrl'
        })));

        //this.prompt.form.footer.buttonGroup.children[0].el.style.display = 'none';
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            app.loader.log(25, 'Logging In', true);
            $.post('/Account/LogIn', $(this.prompt.form.el).serialize(),
                function (payload, status) {           
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);
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
                        app.loader.log(0, 'Login failed. (err_'+status+').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
        }.bind(this);

        this.prompt.form.footer.buttonGroup.addButton('Register').el.onclick = this.register;

        this.prompt.form.footer.buttonGroup.addButton('Google').el.onclick = function () {

            app.loader.log(50, 'Launching third party authorization...');

            let url = new URL(window.location.href);
            let returnUrl = url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);

            let postUrl = '/Account/ExternalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl); 

            //location.href = postUrl;
            //window.open(postUrl, '_blank');

            
            this.modal = new MODAL('Google Login');
            this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
                'label': 'iframe',
                'dataId': -1,
                'data': {
                    'src': postUrl
                }
            }));
            this.iframe.frame.el.setAttribute('src', postUrl);
            this.modal.show();
            

            /*
            $.post(postUrl, $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);

                        console.log('Payload:::');
                        console.log(payload);

                        setTimeout(function () {

                            //let url = new URL(window.location.href);
                            //let returnUrl = url.searchParams.get('ReturnUrl');
                            if (payload.model.RedirectUri) {
                                //returnUrl = url.origin + returnUrl;
                                location.href = payload.model.RedirectUri;
                            } else {
                                //location.reload(true);
                                console.log('something went wrong');
                                console.log(payload);
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
            */

        }.bind(this);

        this.prompt.show();

        /*
            TODO:
            Create INPUT CHECKBOX called 'RememberMe'
            Create BUTTON to launch 'Register as new User'
            Create AHREF to 'ForgotPassword'
        */
    }

    /**
        Logs the current user out
    */
    logout() {
        app.loader.log(25, 'Logging out', true);
        $.post('/Account/LogOff', {
            '__RequestVerificationToken': token.value
        }, function (payload, status) {
            this.loader.log(50, 'Status: ' + status, true);
            debug('Payload:');
            debug(payload);

            // textStatus contains the status: success, error, etc
            // If server responds with 'success'            
            if (status === "success") {
                app.loader.log(99, 'Logging Out...');
                setTimeout(function () {
                    location.reload(true); //https://www.w3schools.com/jsref/met_loc_reload.asp
                }.bind(this), 1000);

            } else {
                debug('Failed to POST results to server with status: "' + status + '"');
                app.loader.log(0, 'Failed to send<br>' +
                    payload.message + '<br><hr/>', true
                );
                app.loader.showConsole();
                //$(app.loader.console.el).collapse('show');
                debug('Payload:\n');
                debug(payload);
            }
        }.bind(this), "json");
    }

    /**
     * Log into the application using the given credentials
     * @param {string} email Username / Email 
     * @param {string} password Account Password
     */
    register() {
        console.log('Register');

        this.prompt = new PROMPT('Log In', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Register');
        this.prompt.form.el.setAttribute('class', 'register');
        this.prompt.form.el.setAttribute('method', 'POST');
        this.prompt.form.el.setAttribute('action', '#');

        //this.email = new INPUT(this.prompt.formElementGroup.body.pane,
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'Email',
                    'name': 'Email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );

        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'Password',
                    'name': 'Password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        this.passwordConfirm = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'PasswordConfirm',
                    'name': 'PasswordConfirm'
                })
            ).set({
                'label': 'Confirm Password',
                'showHeader': 0
            })
        );

        //this.prompt.form.footer.buttonGroup.children[0].el.style.display = 'none';
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            app.loader.log(25, 'Register User', true);
            $.post('/Account/Register', $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);
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
                        app.loader.log(0, 'Registration failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
        }.bind(this);
        this.prompt.show();
    }
}