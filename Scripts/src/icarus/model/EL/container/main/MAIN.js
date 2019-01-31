/** @module */
import CONTAINER, { Activate, DATAELEMENTS, Deactivate, ICONS, MODEL, createInputModel } from '../CONTAINER.js';
import USERMENU, { MENU } from '../../nav/menu/usermenu/USERMENU.js';
import CONTAINERFACTORY from '../../../../controller/CONTAINERFACTORY.js';
import IMG from '../../img/IMG.js';
import LOADER from '../../dialog/loader/LOADER.js';
import NAVFOOTER from '../../nav/navbar/navfooter/NAVFOOTER.js';
import NAVITEMICON from '../../nav/navitemicon/NAVITEMICON.js';
import PROMPT from '../../dialog/prompt/PROMPT.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
//import STICKYFOOTER from '../../footer/stickyfooter/STICKYFOOTER.js';
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
		super(document.body, 'MAIN', model, DATAELEMENTS.MAIN.containers);
		this.addClass('main').then(() => this.body.pane.addClass('pane-tall'));
		this.navheader.setAttribute('draggable', false);
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
		this.sidebar = new SIDEBAR(this);
		//this.stickyFooter = new STICKYFOOTER(this, new MODEL());
        this.navfooter = new NAVFOOTER(this, new MODEL());
		// CRUD
		this.save = this.factory.save;
        this.quickSaveFormPost = model.factory.quickSaveFormPost;

        this.watchMousePosition();
    }
    /** Detects mouse position for desktop and caches its value every X ms
        @param {number} delay Millisecond delay between caches
        @returns {void}
    */
    watchMousePosition(delay = 50) {
        this.mouse = {
            x: 0,
            y: 0,
            w: document.body.clientWidth,
            h: document.body.clientHeight,
            xPct: 0,
            yPct: 0
        };
        document.onmousemove = (ev) => this.handleMouseMove(ev);
        document.body.onresize = () => this.handleResize();
        setInterval(() => this.cacheMouse(), delay); // setInterval repeats every X ms ~41 ms == 24fps
    }

    /** Updates the Mouse Position Cache
        param {Event} ev Resize Event
        @returns {void}
    */
    handleResize() {
        this.mouse.w = document.body.clientWidth;
        this.mouse.h = document.body.clientHeight;
    }
    /** Mouse Move Event Handler (Desktop Only)
        @param {Event} ev Event
        @returns {void}
    */
    handleMouseMove(ev) {
        let eventDoc = null;
        let doc = null;
        let body = null;

        // If pageX/Y aren't available and clientX/Y are, calculate pageX/Y (This is to support old IE)
        if (ev.pageX === null && ev.clientX !== null) {
            eventDoc = ev.target && ev.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            ev.pageX = ev.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            ev.pageY = ev.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // Cache mouse position
        this.mouse.x = ev.pageX;
        this.mouse.y = ev.pageY;
    }
    /** Set the Mouse Position and relative positioning
        param {number} x X Coord
        param {number} y Y Coord
        @returns {void}
    */
    cacheMouse() {
        this.mouse.xPct = (this.mouse.x / this.mouse.w).toFixed(2) * 100;
        this.mouse.yPct = (this.mouse.y / this.mouse.h).toFixed(2) * 100;
        //console.log(this.mouse);
    }
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return this.addNavOptions().then(
			() => this.populate(children).then(
				() => this.navheader.expand().then(
					() => this.body.expand().then(
						() => this.navfooter.expand()))));
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
	/** Adds default Nav Items to the Nav Bar including the label
	    @returns {Promise<ThisType>} callback
	*/
	addNavOptions() {
		return this.callback(() => {
			//if (this.navbar.menu) {
			//console.warn('Yes to addNavOptions');
			// LEFT ALIGN
            this.btnSidebar = this.navheader.tabs.addNavItemIcon(new MODEL().set({
                icon: ICONS.SIDEBAR,
                label: 'Sidebar'
            }));
			this.btnSidebar.el.addEventListener('activate', () => this.sidebar.activate());
            this.btnSidebar.el.addEventListener('deactivate', () => this.sidebar.deactivate());
            $(this.btnSidebar.el).insertBefore(this.navheader.tab.el);

            this.btnPrev = this.navheader.tabs.addNavItemIcon(new MODEL().set({
                icon: ICONS.CHEVRON_LEFT,
                label: 'Prev'
            }));
			this.btnPrev.el.onclick = () => this.navigateBack();
			$(this.btnPrev.el).insertBefore(this.navheader.tab.el);

			// RIGHT ALIGN
			// USER TAB / MENU
            this.addUserTab();

			this.body.el.onclick = () => this.focusBody(); // Hide Sidebar when container body is focused

            this.addDefaultMenuItems();
			//} else {
			//    console.warn('No to addNavOptions');
			//}
		});
	}
	/** Creates a USER Tab and its associated UserMenu
        @param {MODEL} model Tab Model
	    @returns {void}
	    @deprecated
	*/
    addUserTab(model = new MODEL()) {
        let tab = this.navheader.tabs.addNavItemIcon(model.set({
            icon: ICONS.USER,
            label: 'USER'
        }));
        let menu = this.navheader.menus.addChild(new USERMENU(this.navheader.menus));
        if (this.getUser() === 'Guest') {
            tab.el.addEventListener('activate', () => this.login(tab));
        } else {
            this.navheader.addTabbableElement(tab, menu);
        }
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
        let domMenu = this.navheader.options.get('DOM', 'MENU');
		this.addNavItemIcon(domMenu[0], ICONS.HOME, 'Home').el.onclick = () => setTimeout(() => {
			location.href = this.url.origin;
		}, 300);
        this.addNavItemIcon(domMenu[0], ICONS.TOGGLE, 'Headers').el.onclick = () => this.toggleHeaders().then(() => this.navheader.toggle());
        this.addNavItemIcon(domMenu[0], ICONS.REFRESH, 'Reload').el.onclick = () => setTimeout(() => location.reload(true), 1000);
        this.addNavItemIcon(domMenu[0], ICONS.CONSOLE, 'Console').el.onclick = () => this.loader.show();

        let crudMenu = this.navheader.options.get('CRUD', 'MENU');
        this.addNavItemIcon(crudMenu[0], ICONS.MAIN, 'New').el.onclick = () => this.createNew();
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
                                new PROMPT(new MODEL().set({
                                    label: 'Create a new page',
                                    caller: this,
                                    container: this
                                })).createForm().then((form) => {
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
		//return Promise.resolve(this);
		return this;
	}
	/** Overrides CONTAINER.getMain() and returns this MAIN Container
	    @returns {MAIN} The MAIN Container
	*/
	getMain() {
		//return Promise.resolve(this);
		return this;
	}
	/** Sets the focus on the Main container body.  
	    This generally is used to hide elements such 
	    as a Sidebar, Modal or an EDIT pane
	    @returns {void}
	*/
    focusBody() {
        console.log('focusbody');
        let ev = new Deactivate(this);
        this.sidebar.el.dispatchEvent(ev);
        this.btnSidebar.el.dispatchEvent(ev);
        this.navheader.tabs.get(null, 'NAVITEMICON').filter((c) => c !== this.navheader.tab).map((icon) => icon.el.dispatchEvent(ev));
        this.navheader.menus.get(null, 'MENU').map((menu) => menu.el.dispatchEvent(ev));
        //this.navfooter.tabs.get(null, 'NAVITEMICON').filter((c) => c !== this.navfooter.tab).map((icon) => icon.el.dispatchEvent(ev));
        this.navfooter.tabs.get(null, 'NAVITEMICON').map((icon) => icon.el.dispatchEvent(ev));
        this.navfooter.menus.get(null, 'MENU').map((menu) => menu.el.dispatchEvent(ev));
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
					$.getJSON('MAIN/GET/' + id, (payload) => {
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
	/** Log into the application using the given credentials
        @param {EL} caller The calling element to resolve on DIALOG close
	    @todo Create AHREF to 'ForgotPassword'
	    @returns {void}
	*/
    login(caller = this) {
        console.log('Login Caller', caller);
		let label = 'LogIn';
        this.loader.log(99, label).then(
            (loader) => {
                let prompt = new PROMPT(new MODEL().set({
                    caller,
                    container: this,
                    label
                }));
                prompt.createForm(new MODEL().set({
                    caller,
                    container: prompt,
                    label
                })).then(
                    (form) => form.footer.buttonGroup.empty().then(
                        () => {
                            form.footer.buttonGroup.addButton('Login - Google/.NET').el.onclick = () => {
                                this.loginOAuth('Google');
                                return false;
                            }
                            //loader.log(100).then(() => form.getDialog().show());
                            loader.log(100).then(() => prompt.show());
                        }
                    )
                )
            }
        );
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
        ie: http://localhost:8052/Account/ExternalLogin/externalLogin?provider=Google
	    @param {string} provider The OAuth Provider
	    @returns {void} 
	*/
	loginOAuth(provider) {
		this.body.collapse().then(() => {
			location.href = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(this.url.origin + '/signin-' + provider);
		});
	}
	/** Logs the current user out 
        @returns {Promise<boolean>} True on success
    */
	logout() {
        this.loader.log(99, 'Logging Out').then(
            () => Promise.resolve(localStorage.clear()).then(
                $.post('/Account/LogOff', {
                    '__RequestVerificationToken': this.getToken()
                }, this.ajaxRefreshIfSuccessful.bind(this), 'json')));
		/*this.loader.log(99, 'Logging Out').then(() => { // loader
            $.post('/Account/LogOff', {
				'__RequestVerificationToken': this.getToken() //.token
			}, this.ajaxRefreshIfSuccessful.bind(this), 'json');
		});*/
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
				form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
				loader.log(100).then(() => form.getDialog().show());
			});
		});
	}
	/** Swipe Up Event
	    @returns {void}
	*/
	swipeUp() {
		this.navheader.collapse();
		document.body.classList.add('compact');
	}
	/** Swipe Down Event
	    @returns {void}
	*/
	swipeDown() {
		this.navheader.expand();
		document.body.classList.remove('compact');
	}
}
export { Activate, CONTAINERFACTORY, Deactivate, LOADER, MENU, MODEL, NAVITEMICON }