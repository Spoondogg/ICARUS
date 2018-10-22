/** @module */
import CONTAINER, { DIALOG, ICONS, MODEL } from '../CONTAINER.js'; // ATTRIBUTES, INPUTTYPES
//import CONTAINERFACTORY from '../../../../controller/CONTAINERFACTORY.js';
import FORM from '../../form/FORM.js';
//import FORMINPUT from '../formelement/forminput/FORMINPUT.js';
import LOADER from '../../modal/loader/LOADER.js';
//import MENU from '../../nav/menu/MENU.js';
import NAVITEMICON from '../../nav/navitemicon/NAVITEMICON.js';
//import PROMPT from '../../modal/prompt/PROMPT.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
import STICKYFOOTER from '../../footer/stickyfooter/STICKYFOOTER.js';
/** A top level View that holds all other child Containers
    @class
    @extends CONTAINER
*/
export default class MAIN extends CONTAINER {
	/** Constructs a MAIN Container and populates the DOM
	    with any relevant elements
	    @constructor
	    @param {MODEL} model APP model
	 */
	constructor(model) {
		document.title = model.label;
		super(document.body, 'MAIN', model, ['ARTICLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER', 'IMAGEGALLERY', 'DICTIONARY', 'WORD']);
        //this.addClass('app')
        this.navBar.addClass('navbar-fixed-top');
		this.body.pane.addClass('pane-tall');
		/** @type {CONTAINERFACTORY} */
		this.factory = model.factory;
		/** @type {LOADER} */
		this.loader = model.loader;
		/** A Security token @type {string} */
		this.token = model.token;
		/** Browser Url
		    @property {Url} url The browser url
		*/
		this.url = model.url;
		/** A Sidebar for details and navigation
		    @property {SIDEBAR} sidebar A Sidebar that exists at the top level of the MAIN Container
		*/
		this.sidebar = new SIDEBAR(this, new MODEL().set({ 'label': 'Left Sidebar' }));
		this.addNavOptions();
		this.stickyFooter = new STICKYFOOTER(this, new MODEL());
		this.populate(model.children);
	}
	construct() {
		this.navBar.el.setAttribute('draggable', 'false');
		this.showNavBar();
		if (this.user === 'Guest') {
			this.btnLogin = this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-right').set({
				'icon': ICONS.USER,
				'label': 'LOG IN'
			}));
			this.btnLogin.el.onclick = this.login.bind(this);
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
			this.btnSidebar = this.navBar.menu.tabs.addNavItemIcon(new MODEL('pull-left').set({
				'icon': ICONS.SIDEBAR
			}));
			this.btnSidebar.el.onclick = this.toggleSidebar.bind(this);
			$(this.btnSidebar.el).insertBefore(this.navBar.menu.tab.el);
			this.body.el.onclick = this.focusBody.bind(this); // Hide Sidebar when container body is focused
			this.addDefaultMenuItems();
		}
		return this;
	}
	/**
	    Adds a NavItemIcon to the given menu with the given params
	    @param {MENU} menu A navigation MENU
	    @param {string} icon An Icon reference
	    @param {string} label The displayed text
	    @param {string} url The optional url that this Nav Item references 
	    @returns {NAVITEMICON} A Nav Item with an Icon and optional label
	 */
	addNavItemIcon(menu, icon, label = '', url = '#') {
		return menu.addNavItemIcon(new MODEL().set({
			icon,
			label,
			url
		}))
	}
	/**
	    Adds the default User, Crud and Dom menus to this Container
	    @returns {void}
	*/
	addDefaultMenuItems() {
		let userMenu = this.navBar.menu.menu.addMenu(new MODEL('horizontal collapse').set({
			'name': 'USER',
			'showHeader': 1,
			'collapsed': 1
		}));
		this.addNavItemIcon(userMenu, ICONS.USER, 'Log Out', '#?url=logout').el.onclick = () => {
			this.navBar.menu.toggleCollapse();
			this.logout();
		};
		this.addNavItemIcon(userMenu, ICONS.OPTIONS, 'Manage', 'Manage/Index');
		let domMenu = this.navBar.menu.menu.getGroup('DOM');
		this.addNavItemIcon(domMenu, ICONS.HOME, 'Home').el.onclick = () => {
			setTimeout(() => {
				location.href = this.url.origin;
			}, 300);
		};
		this.addNavItemIcon(domMenu, ICONS.TOGGLE, 'Headers').el.onclick = () => {
			this.toggleHeaders();
			this.navBar.menu.toggleCollapse();
		};
		this.addNavItemIcon(domMenu, ICONS.CONSOLE, 'Console').el.onclick = () => {
			this.loader.show();
			this.loader.showConsole();
		};
		this.addNavItemIcon(domMenu, ICONS.REFRESH, 'Reload').el.onclick = () => {
			setTimeout(() => {
				location.reload(true);
			}, 1000);
		};
		let crudMenu = this.navBar.menu.menu.getGroup('CRUD');
		this.addNavItemIcon(crudMenu, ICONS.MAIN, 'New').el.onclick = this.newMain.bind(this);
	}
	/** Requests a new {@link MAIN} from the server and redirects to that page
        @todo This should be a POST to avoid CSRF
        @returns {Promise<boolean>} Promised to return true if new MAIN created successfully
    */
	newMain() {
		$.getJSON('/MAIN/Get/0', (payload) => {
			console.log('Created MAIN', payload);
			/**
			    Prompts the user to open the new page.
			    In order to avoid popup blocking, the user must 
			    manually click to be redirected or launch a new
			    page in this window
						
			let url = '/' + payload.model.id;
			let prompt = new PROMPT('New Page', 'A new page has been created at <a href="' + url + '" target="_blank">' + url + '</a>');
			let button = prompt.form.footer.buttonGroup.children[0];
			button.setLabel('Open in new Window?');
			button.el.onclick = () => {
				window.open(url, '_blank');
				prompt.hide(300, true);
			};
			prompt.form.footer.buttonGroup.addButton('Open in this Window?').el.onclick = () => {
				location.href = url;
				prompt.hide(300, true);
			};
			prompt.show();*/
			return true;
		});
	}
	/** Overrides CONTAINER.getContainer() and returns this MAIN Container
	    @returns {MAIN} The MAIN Container
	*/
	getContainer() {
		return this;
	}
	/** Overrides CONTAINER.getMainContainer() and returns this MAIN Container
	    @returns {MAIN} The MAIN Container
	*/
	getMainContainer() {
		return this;
	}
	/**
	    Sets the focus on the Main container body.  
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
	/**
		Loads the specified app id into the Main Container

	    @todo Prompt the user for an Id to load
	    @todo create a simple application browser to retrieve a MAIN

		@param {number} id App Id to load
		@returns {MAIN} This MAIN
	*/
	load(id = 1) {
		let returnUrl = this.url.searchParams.get('ReturnUrl');
		if (returnUrl) {
			returnUrl = this.url.origin + returnUrl;
			location.href = returnUrl;
		}
		$.getJSON('Main/Get/' + id, this.loadAjaxCall.bind(this));
		return this;
	}
	/**
		The ajax call performed when MAIN.load is called
		Receives the MAIN model from Main/Get/id (if permitted)
		Then, sets the document title, application id and label
		and Populates accordingly
		@param {any} data The ajax payload
	    @returns {boolean} True on success
	    @throws Throws an error if unable to construct given class
	*/
	loadAjaxCall(data) {
		if (data.result === 1) {
			try {
				if (data.model.label) {
					document.title = data.model.label;
				}
				this.body.pane.empty();
				this.setId(this.id);
				this.setLabel(data.model.label);
				this.populate(data.model.children);
				return true;
			} catch (e) {
				console.log(0, 'Unable to construct ' + this.className + '(' + this.id + ')');
				throw e;
			}
		} else {
			this.loader.log(0, 'Failed to retrieve ' + this.className + '(' + this.id + ') from server\n' + data.message);
			this.loader.showConsole();
		}
	}
	/**
		Toggles the active state of the sidebar
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
	    @returns {void}
	*/
	loginExternal() {
		console.log('loginExternal()');
		/*
				console.log('Log In - External OAuth Provider');
				this.prompt = new PROMPT('Log In - OAuth', '', [], [], true);
				this.prompt.addClass('prompt');
				this.prompt.form.postUrl = '/Account/ExternalLogin';
				this.prompt.form.provider = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
					'type': 'hidden',
					'name': 'provider'
				})));
				this.prompt.form.returnUrl = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
					'type': 'hidden',
					'name': 'ReturnUrl'
				})));
				this.prompt.form.destroy(0);
				// Create a new form to submit 3rd party logins
				this.externalLogin = FORM.createEmptyForm(this.prompt.container.body.pane);
				this.externalLogin.el.setAttribute('method', 'post');
				this.externalLogin.el.setAttribute('action', '/Account/ExternalLogin?ReturnUrl=%2F');
				this.externalLogin.footer.buttonGroup.children[0].el.style.display = 'none';
				this.provider = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
					'type': 'hidden',
					'name': 'provider'
				})));
				this.returnUrl = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
					'type': 'hidden',
					'name': 'ReturnUrl'
				})));
				let btnOAuth = this.externalLogin.footer.buttonGroup.addButton('OAuth - Google');
				btnOAuth.el.onclick = () => {
					console.log(50, 'Launching OAuth2 Authenticator...');
					//let url = new URL(window.location.href);
					let returnUrl = this.url.origin + '/signin-google';
					this.returnUrl.el.setAttribute('value', returnUrl);
					let provider = 'Google';
					this.provider.el.setAttribute('value', provider);
					let postUrl = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(returnUrl);
					location.href = postUrl;
				};
				this.prompt.show();
		        */
	}
	/** Log into the application using the given credentials
		param {string} email Username / Email 
		param {string} password Account Password

        <form action="/Account/ExternalLogin?ReturnUrl=%2F" method="post">
			<input name="__RequestVerificationToken" type="hidden" value="woot">
            <div id="socialLoginList">
			<p>
			    <button type="submit"
			        class="btn btn-default" id="Google"
			        name="provider" value="Google"
			        title="Log in using your Google account"
			    >Google</button>
			</p>
			</div>
		</form>

	    @todo Consider handling email/password string or CREDENTIALS object
	    @todo Create INPUT CHECKBOX called 'RememberMe'
	    @todo Create BUTTON to launch 'Register as new User
	    @todo Create AHREF to 'ForgotPassword'
	    @returns {void}
	*/
	login() { //email, password
		let dialog = new DIALOG(new MODEL().set({ 'text': 'Log In' })); //'token': this.getMainContainer().getToken()
		let form = FORM.createEmptyForm(this.body.pane);
		$(form.el).appendTo(dialog.body.el);
		form.setPostUrl('/Account/Login');
		form.id = 0;
		form.label = 'Login';
		form.el.setAttribute('id', 0);
		form.el.setAttribute('class', 'login');
		form.el.setAttribute('method', 'POST');
		form.el.setAttribute('action', '#');
		form.children[0].children[0].addInputElements([ // fieldset.formElementGroup
			FORM.createInputModel('INPUT', 'Email', 'Email / Username', '', 'EMAIL'),
			FORM.createInputModel('INPUT', 'Password', 'Password', '', 'PASSWORD'),
			FORM.createInputModel('INPUT', 'RememberMe', 'Remember Me', '', 'CHECKBOX')
		]);
		form.footer.buttonGroup.addButton('Register').el.onclick = this.register;
		/*
        // Create a new form to submit 3rd party logins
        this.externalLogin = this.createExternalLoginForm();
        this.provider = new FORMINPUT(this.externalLogin.children[0].children[0].body.pane, new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));
        this.returnUrl = new FORMINPUT(this.externalLogin.children[0].children[0].body.pane, new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'returnUrl'
        })));
        let btnOAuth = this.externalLogin.footer.buttonGroup.addButton('OAuth');
        btnOAuth.el.onclick = function () {
            console.log(50, 'Launching OAuth2 Authenticator...');
			let returnUrl = this.url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
			let provider = 'Google';
			this.provider.el.setAttribute('value', provider);			            

            let postUrl = '/Account/ExternalLogin?provider=' +
                provider + '&returnUrl=' + encodeURI(returnUrl); 
			
            location.href = '/Account/ExternalLogin';
			
        };
        */
		form.afterSuccessfulPost = (payload, status) => {
			this.ajaxRefreshIfSuccessful(payload, status)
		};
		dialog.show();
	}
	/**
	    Sets up the External Login Form
	    @returns {FORM} An external login form
	*/
	createExternalLoginForm() {
		let externalLogin = FORM.createEmptyForm(this.prompt.container.body.pane);
		externalLogin.el.setAttribute('method', 'post');
		externalLogin.el.setAttribute('action', '/Account/ExternalLogin');
		externalLogin.footer.buttonGroup.children[0].el.style.display = 'none';
		return externalLogin;
	}
	/**
		    Logs the current user out
	        @returns {Promise<boolean>} True on success
		*/
	logout() {
		this.loader.showConsole();
		this.loader.log(50, 'MAIN.logout(); Logging out...', true);
		$.post('/Account/LogOff', {
			'__RequestVerificationToken': this.token
		}, this.ajaxRefreshIfSuccessful, "json");
	}
	/**
		    Log into the application using the given credentials
		    @param {string} email Username / Email 
		    @param {string} password Account Password
	        @returns {void}
		*/
	register() {
		console.log('Register');
		/*this.prompt = new PROMPT('Register', '', [], [], true);
				this.prompt.addClass('prompt');
				this.prompt.form.setPostUrl('/Account/Register');
				this.prompt.form.el.setAttribute('class', 'register');
				//this.prompt.form.el.setAttribute('method', 'POST');
				//this.prompt.form.el.setAttribute('action', 'Account/Register');
				this.prompt.form.postUrl = "Account/Register";
				//this.email = new INPUT(this.prompt.formElementGroup.body.pane,
				this.email = new FORMINPUT(this.prompt.form.fieldset.formElementGroup.body.pane, new MODEL(new ATTRIBUTES({
					'typeId': INPUTTYPES.INPUT,
					'type': 'Email',
					'name': 'email'
				})).set({
					'label': 'Username',
					'showHeader': 0
				}));
				this.password = new FORMINPUT(this.prompt.form.fieldset.formElementGroup.body.pane, new MODEL(new ATTRIBUTES({
					'typeId': INPUTTYPES.PASSWORD,
					'type': 'Password',
					'name': 'password'
				})).set({
					'label': 'Password',
					'showHeader': 0
				}));
				this.passwordConfirm = new FORMINPUT(this.prompt.form.fieldset.formElementGroup.body.pane, new MODEL(new ATTRIBUTES({
					'typeId': INPUTTYPES.PASSWORD,
					'type': 'Password',
					'name': 'PasswordConfirm'
				})).set({
					'label': 'Confirm Password',
					'showHeader': 0
				}));
				this.prompt.form.afterSuccessfulPost = function(payload) {
					this.prompt.form.ajaxRefreshIfSuccessful(payload, 'success');
					this.prompt.hide();
				}.bind(this);
				this.prompt.show();
		        */
	}
	/**
		    Call an external registration form
		    param {string} email Username / Email 
	        @returns {void}
		*/
	registerExternal() { // email
		console.log('Register External Login');
		/*this.prompt = new PROMPT('Associate your OAuth2 Id', '', [], [], true);
		this.prompt.form.destroy();
		let tmp = new DIV(this.prompt.container.body.pane, new MODEL());
		$(document.getElementById('externalLoginConfirmation')).insertBefore(tmp.el);
		tmp.destroy();
		this.prompt.show();*/
	}
}
export { LOADER, MODEL, NAVITEMICON };