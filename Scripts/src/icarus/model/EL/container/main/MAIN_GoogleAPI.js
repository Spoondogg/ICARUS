/** @module */
import CONTAINER, {
	ICONS,
	MODEL,
	createInputModel
} from '../CONTAINER.js'; //DIALOG
import USERMENU, {
	MENU
} from '../../nav/menu/usermenu/USERMENU.js';
import Activate from '../../../../event/Activate.js';
import CONTAINERFACTORY from '../../../../controller/CONTAINERFACTORY.js';
import Deactivate from '../../../../event/Deactivate.js';
//import FORM from '../../form/FORM.js';
//import DIV from '../../div/DIV.js';
//import IFRAME from '../../iframe/IFRAME.js';
import IMG from '../../img/IMG.js';
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
		this.navBar.setAttribute('draggable', false);
		this.navBar.expand()
		this.navBar.menu.expand();
		this.body.pane.addClass('pane-tall');
		/** @type {CONTAINERFACTORY} */
		this.factory = model.factory;
		/** @type {LOADER} */
		this.loader = model.loader;
		/** @type {string} */
		this.token = model.token;
		/** @type {URL} */
		this.url = model.url;
		/** The active container has access to keybindings */
		this.activeContainer = null;
		// ELEMENTS
		this.sidebar = new SIDEBAR(this, new MODEL().set({
			label: 'Left Sidebar'
		}));
		this.stickyFooter = new STICKYFOOTER(this, new MODEL());
		// CRUD
		this.save = this.factory.save;
		this.quickSaveFormPost = model.factory.quickSaveFormPost;
		//this.quickSave = model.factory.quickSave;
	}
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return new Promise((resolve, reject) => {
			try {
				this.addNavOptions().then(() => this.populate(children).then(() => resolve(this.navBar.expand())));
			} catch (e) {
				reject(e);
			}
		});
	}
	/** MAIN NavBars should not be draggable, and should contain a user/login button
	    @returns {Promise<ThisType>} callback
    
	addNavLogin() {
	    return new Promise((resolve, reject) => {
	        try {
	            this.navBar.setAttribute('draggable', false);
	            if (this.getUser() === 'Guest') {
	                this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-right').set('icon', ICONS.USER)).el.onclick = () => this.login();
	                //this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-right').set('icon', ICONS.CERTIFICATE)).el.onclick = () => this.loginGoogle();
	            } else {
	                //this.getGoogleIdentity();
	                this.setUserIcon();
	            }
	            resolve(this);
	        } catch (e) {
	            reject(e);
	        }
	    });
	}*/
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
	/** Acts as an undo or back function
	    @returns {void}
	*/
	navigateBack() {
		console.log('TODO: Back');
	}
	/** Acts as an redo or forward function
	    @returns {void}
	*/
	navigateForward() {
		console.log('TODO: Forward');
	}
	/** Add items to Options Dropdown Tab
	    @returns {Promise<ThisType>} callback
	*/
	addNavOptions() {
		return this.callback(() => {
			if (this.navBar.menu.menu) {
				// LEFT ALIGN
				this.btnSidebar = this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-left').set('icon', ICONS.SIDEBAR));
				this.btnSidebar.el.onclick = () => this.toggleSidebar();
				$(this.btnSidebar.el).insertBefore(this.navBar.menu.tab.el);
				this.btnPrev = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_LEFT));
				this.btnPrev.el.onclick = () => this.navigateBack();
				$(this.btnPrev.el).insertBefore(this.navBar.menu.tab.el);
				this.btnNext = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_RIGHT));
				this.btnNext.el.onclick = () => this.navigateForward();
				$(this.btnNext.el).insertBefore(this.navBar.menu.tab.el);
				// RIGHT ALIGN
				this.addTab = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.PLUS));
				$(this.addTab.el).insertBefore(this.navBar.menu.optionsTab.el);
				// USER TAB / MENU
				this.addUserTab();
				this.body.el.onclick = () => this.focusBody(); // Hide Sidebar when container body is focused
				this.addDefaultMenuItems();
			}
		});
		/*return new Promise((resolve, reject) => {
		    try {
		        if (this.navBar.menu.menu) {
		            // LEFT ALIGN
		            this.btnSidebar = this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-left').set('icon', ICONS.SIDEBAR));
		            this.btnSidebar.el.onclick = () => this.toggleSidebar();
		            $(this.btnSidebar.el).insertBefore(this.navBar.menu.tab.el);

		            this.btnPrev = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_LEFT));
		            this.btnPrev.el.onclick = () => this.navigateBack();
		            $(this.btnPrev.el).insertBefore(this.navBar.menu.tab.el);

		            this.btnNext = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.CHEVRON_RIGHT));
		            this.btnNext.el.onclick = () => this.navigateForward();
		            $(this.btnNext.el).insertBefore(this.navBar.menu.tab.el);

		            // RIGHT ALIGN
		            this.addTab = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.PLUS));
		            $(this.addTab.el).insertBefore(this.navBar.menu.optionsTab.el);

		            // USER TAB / MENU
		            this.addUserTab();

		            this.body.el.onclick = () => this.focusBody(); // Hide Sidebar when container body is focused
		            this.addDefaultMenuItems();
		        }
		        resolve(this);
		    } catch (e) {
		        reject(e);
		    }
		});*/
	}
	/** Creates a USER Tab and its associated UserMenu
	    @returns {void}
	*/
	addUserTab() {
		this.userTab = this.navBar.menu.tabs.addNavItemIcon(new MODEL().set('icon', ICONS.USER));
		this.userMenu = new USERMENU(this.navBar.menu);
		this.userTab.el.addEventListener('activate', () => {
			if (this.getUser() === 'Guest') {
				this.login();
			} else {
				this.userMenu.el.dispatchEvent(new Activate(this.userMenu));
			}
		});
		this.userTab.el.addEventListener('deactivate', () => this.userMenu.el.dispatchEvent(new Deactivate(this.userMenu)));
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
		let domMenu = optionsMenu.getGroup('DOM');
		this.addNavItemIcon(domMenu, ICONS.HOME, 'Home').el.onclick = () => {
			setTimeout(() => {
				location.href = this.url.origin;
			}, 300);
		};
		this.addNavItemIcon(domMenu, ICONS.TOGGLE, 'Headers').el.onclick = () => {
			this.toggleHeaders();
			this.navBar.menu.toggle();
		};
		this.addNavItemIcon(domMenu, ICONS.REFRESH, 'Reload').el.onclick = () => {
			setTimeout(() => {
				location.reload(true);
			}, 1000);
		};
		this.addNavItemIcon(domMenu, ICONS.CONSOLE, 'Console').el.onclick = () => this.loader.show();
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
									this.populate(payload.model.children).then(() => resolve(this));
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
					resolve(this);
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
		The user will be redirected to a third party OAuth authenticator
        @param {string} provider OAuth Provider
        @param {strong} returnUrl Return URL for 3rd party
	    @returns {void}
	
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
    }*/
	/** Instantiates the Google Authentication API 
	    and retrieves user details if they exist
	    @returns {void}
    
	getGoogleIdentity() {
	    console.log('Calling Auth2...');
	    gapi.load('auth2', () => {
	        gapi.auth2.init().then(() => {
	            let googleAuth = gapi.auth2.getAuthInstance();
	            googleAuth.signIn().then((googleUser) => {
	                // Current User
	                let currentUser = googleAuth.currentUser.get();
	                console.log('currentUser', currentUser);
	                console.log('currentUserId', currentUser.getId());

	                // Google User
	                console.log('googleUser', googleUser);
	                console.log('googleUserId', googleUser.getId());
	                console.log('googleUserIsSignedIn', googleUser.isSignedIn());
	                console.log('hostedDomain', googleUser.getHostedDomain());

	                let basicProfile = googleUser.getBasicProfile();
	                console.log('basicInfo', basicProfile);
	                console.log('id', basicProfile.getId());
	                console.log('getName', basicProfile.getName());
	                console.log('givenName', basicProfile.getGivenName());
	                console.log('familyName', basicProfile.getFamilyName());
	                console.log('imageUrl', basicProfile.getImageUrl());
	                console.log('email', basicProfile.getEmail());

	                // https://docs.microsoft.com/en-us/aspnet/web-api/overview/security/individual-accounts-in-web-api
	                let authResponse = googleUser.getAuthResponse(true);
	                console.log('authResponse', authResponse);

	                this.userTab.anchor.icon.destroy(0).then(() => {
	                    this.userTab.anchor.icon = new IMG(this.userTab.anchor, new MODEL({
	                        class: 'user-image',
	                        src: basicProfile.getImageUrl()
	                    }));
	                });
	            });
	        });
	    });
	}*/
	/** Retrieves user data from localStorage
	    and sets the user icon image accordingly
	    @returns {void}
	*/
	setUserIcon() {
		console.log('setting user icon');
		this.userTab.anchor.icon.destroy(0).then(() => {
			this.userTab.anchor.icon = new IMG(this.userTab.anchor, new MODEL({
				class: 'user-image',
				src: localStorage.getItem('picture')
			}));
			this.userTab.anchor.icon.el.setAttribute('title', localStorage.getItem('given_name'));
		});
	}
	/** Performs calls to the Google Identity API
	    @returns {void}
    
	loginGoogle() {
	    this.loader.log(99, 'Google Identity').then((loader) => {
	        new PROMPT(new MODEL().set('label', 'Login')).createForm(new MODEL().set({
	            container: this,
	            label: 'Log In - Google API'
	        })).then((form) => {
	            form.footer.buttonGroup.addButton('Login - API').el.onclick = this.getGoogleIdentity();
	            form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
	            loader.log(100).then(() => form.getDialog().show());
	        });
	    });
	}*/
	/** Log into the application using the given credentials
	    @todo Create AHREF to 'ForgotPassword'
	    @returns {void}
	*/
	login() {
		this.loader.log(99, 'Logging In').then((loader) => {
			new PROMPT(new MODEL().set('label', 'Login')).createForm(new MODEL().set({
				container: this,
				label: 'Log In'
			})).then((form) => {
				//this.createLoginForm(form);
				form.footer.buttonGroup.empty().then(() => {
					form.footer.buttonGroup.addButton('Login - Google/.NET').el.onclick = () => form.getDialog().hide().then(() => this.loginOAuth('Google'));
					loader.log(100).then(() => form.getDialog().show());
				});
			});
		});
	}
	/** Creates a login form in the given form
	    @param {FORM} form Form element
	    @returns {Promise<ThisType>} callback
	*/
	createLoginForm(form) {
		return this.callback(() => {
			form.setAction('/Account/Login');
			form.addClass('login');
			form.children[0].children[0].addInputElements([
				createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
				createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
				createInputModel('INPUT', 'RememberMe', '', 'Remember Me', 'CHECKBOX')
			]);
			form.footer.buttonGroup.children[0].label.setInnerHTML('Login - Local');
			form.footer.buttonGroup.addButton('Register - Local').el.onclick = () => this.register();
			form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
		});
	}
	/** Redirects to the third party OAuth Sign In
	    @param {string} provider The OAuth Provider
	    @returns {void} 
	*/
	loginOAuth(provider) {
		this.body.toggle().then(() => {
			let returnUrl = this.url.origin + '/signin-' + provider;
			location.href = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(returnUrl);
		});
	}
	/** Logs the current user out 
        @returns {Promise<boolean>} True on success
    */
	logout() {
		this.loader.log(99, 'Logging Out', true).then(() => { // loader
			Promise.resolve(localStorage.clear()).then(() => {
				$.post('/Account/LogOff', {
					'__RequestVerificationToken': this.getToken() //.token
				}, this.ajaxRefreshIfSuccessful.bind(this), 'json');
			});
		});
	}
	/** Log into the application using the given credentials
        @param {string} email Username / Email 
        @param {string} password Account Password
        @returns {void}
    */
	register() {
		this.loader.log(99, 'Register', true).then((loader) => {
			new PROMPT(new MODEL().set('label', 'Register')).createForm(new MODEL().set({
				container: this,
				label: 'Register'
			})).then((form) => {
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
				loader.log(100).then(() => form.getDialog().show());
			});
		});
	}
	/** Swipe Up Event
	    @returns {void}
	*/
	swipeUp() {
		this.navBar.collapse();
		$('body').addClass('compact');
	}
	/** Swipe Down Event
	    @returns {void}
	*/
	swipeDown() {
		this.navBar.expand();
		$('body').removeClass('compact');
	}
}
export {
	CONTAINERFACTORY,
	LOADER,
	MENU,
	MODEL,
	NAVITEMICON
};