/** @module */
import CONTAINER, { ICONS, MODEL, createInputModel } from '../CONTAINER.js'; //DIALOG
import CONTAINERFACTORY from '../../../../controller/CONTAINERFACTORY.js';
//import FORM from '../../form/FORM.js';
//import DIV from '../../div/DIV.js';
import LOADER from '../../dialog/loader/LOADER.js';
import NAVITEMICON from '../../nav/navitemicon/NAVITEMICON.js';
import PROMPT from '../../dialog/prompt/PROMPT.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
import STICKYFOOTER from '../../footer/stickyfooter/STICKYFOOTER.js';
/** A top level View that holds all other child Containers
    @class
    @extends CONTAINER
*/
export default class MAIN extends CONTAINER {
	/** Constructs a MAIN Container and populates the DOM with any relevant elements
	    @param {MODEL} model APP model
    */
	constructor(model) {
		document.title = model.label;
		super(document.body, 'MAIN', model, ['ARTICLE', 'TABLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER', 'IMAGEGALLERY', 'DICTIONARY', 'WORD']);
        this.addClass('main');
        this.navBar.addClass('navbar-fixed-top');
		this.body.pane.addClass('pane-tall');
		/** @type {CONTAINERFACTORY} */
		this.factory = model.factory;
		/** @type {LOADER} */
		this.loader = model.loader;
		/** A Security token @type {string} */
		this.token = model.token;
		/** Browser Url @type {Url} url The browser url */
		this.url = model.url;
		/** A Sidebar for details and navigation
		    @property {SIDEBAR} sidebar A Sidebar that exists at the top level of the MAIN Container
		*/
		this.sidebar = new SIDEBAR(this, new MODEL().set({ label: 'Left Sidebar' }));
        this.addNavOptions();

        /** The active container has access to keybindings */
        this.activeContainer = null;

		this.save = this.factory.save;
		//this.quickSave = model.factory.quickSave;
		this.quickSaveFormPost = model.factory.quickSaveFormPost;
		this.stickyFooter = new STICKYFOOTER(this, new MODEL());
        this.populate(model.children);
	}
	construct() {
        this.navBar.setAttribute('draggable', false); //.el.setAttribute('draggable', 'false');
		this.navBar.show();
		if (this.getUser() === 'Guest') {
			this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-right').set('icon', ICONS.USER)).el.onclick = () => this.login();
		}
	}
	/** Returns the Application Dev setting
	    @todo Move this into a config
	    @returns {boolean} Returns true if app in dev mode
	*/
	isDev() {
		return this.dev;
	}
	/** Returns a friendly username for the current user (if exists)
	    @returns {string} A friendly username
	*/
	getUser() {
		return this.user;
	}
	/** Returns the MAIN Factory
	    @returns {CONTAINERFACTORY} The Main Container Factory
	*/
	getFactory() {
		return this.factory;
	}
	/** Add items to Options Dropdown Tab
	    @returns {ThisType} Returns this MAIN for method chaining
	*/
	addNavOptions() {
		if (this.navBar.menu.menu) {
            // LEFT ALIGN
            this.btnSidebar = this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-left').set('icon', ICONS.SIDEBAR));
			this.btnSidebar.el.onclick = () => this.toggleSidebar();
            $(this.btnSidebar.el).insertBefore(this.navBar.menu.optionsTab.el);

            this.btnPrev = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_LEFT));
            $(this.btnPrev.el).insertBefore(this.navBar.menu.optionsTab.el);

            this.btnNext = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_RIGHT));
            $(this.btnNext.el).insertBefore(this.navBar.menu.optionsTab.el);

            // RIGHT ALIGN
            this.addTab = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.PLUS));
            $(this.addTab.el).insertBefore(this.navBar.menu.optionsTab.el);

            this.userTab = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.USER));
            $(this.userTab.el).insertBefore(this.navBar.menu.optionsTab.el);

            this.body.el.onclick = () => this.focusBody(); // Hide Sidebar when container body is focused
			this.addDefaultMenuItems();
		}
		return this;
    }
    /** Returns the MAIN LOADER 
        @returns {LOADER} A LOADER
    */
    getLoader() {
        return this.loader;
    }
	/** Adds a NavItemIcon to the given menu with the given params
	    @param {MENU} menu A navigation MENU
	    @param {string} icon An Icon reference
	    @param {string} label The displayed text
	    @param {string} url The optional url that this Nav Item references 
	    @returns {NAVITEMICON} A Nav Item with an Icon and optional label
	*/
    addNavItemIcon(menu, icon = ICONS.DEFAULT, label = '', url = '#') {
        return menu ? menu.addNavItemIcon(new MODEL().set({
            icon,
            label,
            url
        })) : null;
	}
	/** Adds the default User, Crud and Dom menus to this Container
	    @returns {void}
	*/
    addDefaultMenuItems() {
        let optionsMenu = this.navBar.menu.menu;
        let userMenu = optionsMenu.addMenu(new MODEL('horizontal collapse').set({
            name: 'USER',
            showHeader: 1,
            collapsed: 1
        }));
        this.addNavItemIcon(userMenu, ICONS.USER, 'Log Out', '#?url=logout').el.onclick = () => {
            this.navBar.menu.toggleCollapse();
            this.logout();
        };
        this.addNavItemIcon(userMenu, ICONS.OPTIONS, 'Manage', 'Manage/Index');
        let domMenu = optionsMenu.getGroup('DOM');
        this.addNavItemIcon(domMenu, ICONS.HOME, 'Home').el.onclick = () => {
            setTimeout(() => {
                location.href = this.url.origin;
            }, 300);
        };
        this.addNavItemIcon(domMenu, ICONS.TOGGLE, 'Headers').el.onclick = () => {
            this.toggleHeaders();
            this.navBar.menu.toggleCollapse();
        };
        this.addNavItemIcon(domMenu, ICONS.REFRESH, 'Reload').el.onclick = () => {
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        };
        this.addNavItemIcon(domMenu, ICONS.CONSOLE, 'Console').el.onclick = () => {
            this.loader.show();
        };
        let crudMenu = optionsMenu.getGroup('CRUD');
        this.addNavItemIcon(crudMenu, ICONS.MAIN, 'New').el.onclick = () => this.createNew();
	}
	/** Requests a new {@link MAIN} from the server and redirects to that page
        @todo This should be a POST to avoid CSRF
        @returns {Promise<boolean>} Promised to return true if new MAIN created successfully
    */
    createNew() {
        return new Promise((resolve, reject) => {
            try {
                this.getLoader().log(20, 'Creating new MAIN Element', true).then((loader) => {
                    $.getJSON('/MAIN/Get/0', (payload) => {
                        console.log(payload.message, payload);
                        if (payload.result === 0) {
                            resolve(this.login());
                        } else {
                            loader.log(100, 'Created MAIN, ' + payload.message, true).then(() => {
                                /** Prompts the user to open the new page.
                                    In order to avoid popup blocking, the user must 
                                    manually click to be redirected or launch a new
                                    page in this window
                                */
                                let url = '/' + payload.model.id;
                                new PROMPT(new MODEL().set('label', 'Create a new page')).createForm().then((form) => {
                                    form.footer.buttonGroup.children[0].destroy().then(() => { //dialog
                                        form.footer.buttonGroup.addButton('Open in new window').el.onclick = () => {
                                            window.open(url, '_blank');
                                            form.getDialog().hide(300, true);
                                        };
                                        form.footer.buttonGroup.addButton('Open in this Window?').el.onclick = () => {
                                            location.href = url;
                                            form.getDialog().hide(300, true);
                                        };
                                        form.getDialog().show();
                                        resolve(true);
                                    });
                                });
                            });
                        }
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
	}
	/** Overrides CONTAINER.getContainer() and returns this MAIN Container
	    @returns {MAIN} The MAIN Container
	*/
	getContainer() {
		return this;
	}
	/** Overrides CONTAINER.getMain() and returns this MAIN Container
	    @returns {MAIN} The MAIN Container
	*/
	getMain() {
		return this;
	}
	/** Sets the focus on the Main container body.  
	    This generally is used to hide elements such 
	    as a Sidebar, Modal or an EDIT pane
	    @returns {void}
	*/
	focusBody() {
		if ($(this.sidebar.el).hasClass('active')) {
			this.sidebar.removeClass('active');
		}
		$(this.navBar.menu.menu.el).collapse('hide');
	}
	/** Loads the specified app id into the Main Container
        Receives the MAIN model from Main/Get/id (if permitted)
		Then, sets the document title, application id and label
		and Populates accordingly
	    @todo Prompt the user for an Id to load
	    @todo create a simple application browser to retrieve a MAIN
		@param {number} id App Id to load
		@returns {MAIN} This MAIN
	*/
    load(id = 1) {
        return new Promise((resolve, reject) => {
            try {
                let returnUrl = this.url.searchParams.get('ReturnUrl');
                if (returnUrl) {
                    returnUrl = this.url.origin + returnUrl;
                    location.href = returnUrl;
                }
                if (id >= 0) {
                    $.getJSON('Main/Get/' + id, (payload) => {
                        if (payload.result === 1) {
                            try {
                                if (payload.model.label) {
                                    document.title = payload.model.label;
                                }
                                this.body.pane.empty().then(() => {
                                    this.setId(this.id);
                                    this.setLabel(payload.model.label);
                                    this.populate(payload.model.children).then(() => resolve());
                                });
                            } catch (e) {
                                console.log(0, 'Unable to construct ' + this.className + '(' + this.id + ')');
                                reject(e);
                            }
                        } else {
                            reject(new Error('Failed to retrieve ' + this.className + '(' + this.id + ') from server\n' + payload.message));
                        }
                    });
                } else {
                    console.log('Invalid Id to Load');
                    resolve();
                }
                
            } catch (e) {
                reject(e);
            }
        });
	}
	/** Toggles the active state of the sidebar
	    @return {ThisType} Return this for method chain
	*/
	toggleSidebar() {
		this.sidebar.toggle('active');
		return this;
	}
	/** Allows the user to open a MAIN 
		@param {number} id MAIN id
	    @todo Create method to browse MAINs
	    @returns {boolean} True on success
	*/
	open(id = 0) {
		console.log('TODO: APP.open(' + id + ')');
		return false;
	}
	/** Returns the APP Id
	    @returns {number} App Id
	*/
	getId() {
		return this.id;
	}
	/** Launches the External Authentication Process
		The user will be redirected to a third party authenticator
        @param {string} provider OAuth Provider
        @param {strong} returnUrl Return URL for 3rd party
	    @returns {void}
	*/
    loginExternal() {
        console.log('MAIN.loginExternal();');
        let prompt = new PROMPT(new MODEL().set('label', 'Login OAuth2')).createForm().then((form) => {
            form.setAction('/Account/ExternalLogin'); // /externalLogin?ReturnUrl=%2F
            form.id = 0;
            form.label = 'Login External';
            form.el.setAttribute('id', 0);
            form.addClass('login');
            form.footer.buttonGroup.children[0].destroy().then(() => {
                $.getJSON('/Account/GetLoginProviders', (payload) => {
                    payload.model.forEach((p) => {
                        form.footer.buttonGroup.addButton(p.Properties.Caption).el.onclick = () => {
                            let provider = p.Properties.AuthenticationType;
                            let returnUrl = this.url.origin + '/signin-' + provider;
                            let postUrl = '/Account/ExternalLogin/externalLogin?provider=' +
                                p.Properties.AuthenticationType +
                                '&returnUrl=' + encodeURI(returnUrl);
                            location.href = postUrl;
                        };
                    });
                });
                //prompt.form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
                prompt.show();
            });
        });
	}
	/** Log into the application using the given credentials
	    @todo Create AHREF to 'ForgotPassword'
	    @returns {void}
	*/
    login() {
        this.loader.log(99, 'Logging In', true).then((loader) => {
            new PROMPT(new MODEL().set('label', 'Login')).createForm(new MODEL().set({
                container: this,
                label: 'Log In'
            })).then((form) => {
                form.setAction('/Account/Login');
                form.addClass('login');
                form.children[0].children[0].addInputElements([
                    createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
                    createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                    createInputModel('INPUT', 'RememberMe', '', 'Remember Me', 'CHECKBOX')
                ]);
                form.footer.buttonGroup.children[0].label.setInnerHTML('Login - Local');
                form.footer.buttonGroup.addButton('Register - Local').el.onclick = this.register;
                //form.footer.buttonGroup.addButton('Login - OAuth').el.onclick = () => prompt.close().then(this.loginExternal());
                form.footer.buttonGroup.addButton('Login - Google').el.onclick = () => this.loginOAuth('Google');
                form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
                loader.log(100).then(() => form.getDialog().show());
            });
        });
    }
    /** Redirects to the third party OAuth Sign In
        @param {string} provider The OAuth Provider
        @returns {void} 
    */
    loginOAuth(provider) {
        let returnUrl = this.url.origin + '/signin-' + provider;
        location.href = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(returnUrl);
    }

	/** Logs the current user out
        @returns {Promise<boolean>} True on success
    */
    logout() {
        this.loader.log(99, 'Logging Out', true).then((loader) => {
            $.post('/Account/LogOff', {
                '__RequestVerificationToken': this.getToken() //.token
            }, this.ajaxRefreshIfSuccessful.bind(this), 'json');
        });
	}
	/** Log into the application using the given credentials
        @param {string} email Username / Email 
        @param {string} password Account Password
        @returns {void}
    */
    register() {
        this.loader.log(99, 'Launching Registration...', true).then((loader) => {
            let prompt = new PROMPT(new MODEL().set('label', 'Register')).createForm((form) => {
                form.setAction('/Account/Register');
                form.id = 0;
                form.label = 'Register';
                form.el.setAttribute('id', 0);
                form.addClass('register');
                form.children[0].children[0].addInputElements([ // fieldset.formElementGroup
                    createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
                    createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                    createInputModel('INPUT', 'PasswordConfirm', '', 'Confirm Password', 'PASSWORD')
                ]);
                form.afterSuccessfulPost = (payload, status) => {
                    this.ajaxRefreshIfSuccessful(payload, status);
                }
                loader.log(100).then(() => prompt.show());
            });
        });
    }
    /** Swipe Up Event
        @returns {void}
    */
    swipeUp() {
        this.hideNav();
    }
    /** Swipe Down Event
        @returns {void}
    */
    swipeDown() {
        this.showNav();
    }
    /** Collapses the MAIN NavBar
        @returns {void}
    */
    hideNav() {
        this.navBar.hide();
        $('body').addClass('compact');
    }
    /** Expands the MAIN NavBar
        @returns {void}
    */
    showNav() {
        this.navBar.show();
        $('body').removeClass('compact');
    }
}
export { CONTAINERFACTORY, LOADER, MODEL, NAVITEMICON };