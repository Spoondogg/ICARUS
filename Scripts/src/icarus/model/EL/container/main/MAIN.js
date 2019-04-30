/** @module icarus/model/el/container/MAIN */
import CONTAINER, { Activate, DATAELEMENTS, Deactivate, Expand, ICONS, MODEL, NAVBAR, NAVHEADER, createInputModel } from '../CONTAINER.js';
import CONTAINERFACTORY, { DIALOGMODEL, FACTORY, FORM, PROMPT } from '../CONTAINERFACTORY.js';
import NAVITEMICON, { EL, NAVITEM } from '../../nav/navitemicon/NAVITEMICON.js';
import USERMENU, { MENU } from '../../nav/menu/usermenu/USERMENU.js';
import FORMFACTORY from '../../form/FORMFACTORY.js';
import IMG from '../../img/IMG.js';
import LOADER from '../../dialog/loader/LOADER.js';
import MAINMODEL from './MAINMODEL.js';
import NAVFOOTER from '../../nav/navbar/navfooter/NAVFOOTER.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
/** A top level View that holds all other child Containers
    @class
    @extends CONTAINER
*/
export default class MAIN extends CONTAINER {
	/** Constructs a MAIN Container and populates the DOM with any relevant elements
	    @param {MAINMODEL} model APP model
    */
	constructor(model) {
        super(document.body, 'MAIN', model, DATAELEMENTS.get('MAIN').containers);
		this.addClass('main');
		this.body.pane.addClass('pane-tall');
		this.body.pane.swipeUp = () => console.log('MAIN.body.pane.swipeUp');
		this.body.pane.swipeDown = () => console.log('MAIN.body.pane.swipeDown');
		this.navheader.setAttribute('draggable', false);
		this.addNavOptions();
        this.setFactory(model.factory);
		this.loader = model.loader;
		this.url = model.url;
		/** The active container has access to keybindings */
		this.activeContainer = null;
		// ELEMENTS
		this.navfooter = new NAVFOOTER(this, new MODEL());
		$(this.navfooter.el).insertAfter(this.el);
		this.watchMousePosition();
        this.expandMain();
        /** Add factories */
        this.getFactory().factories.set('FORMFACTORY', new FORMFACTORY());
	}
	constructElements() {
		if (this.dataId > 0) {
			document.title = this.data.title;
		} else {
            document.title = this.label;
        }
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
	/** Additional MouseMove support for Internet Explorer
	    If pageX/Y aren't available and clientX/Y are, calculate pageX/Y (This is to support old IE)
	    @param {Event} event Event
	    @returns {void}
	*/
	handleMouseMoveInternetExplorer(event) {
		let eventDoc = event.target && event.target.ownerDocument || document;
		let doc = eventDoc.documentElement;
		let body = null;
		({ body } = eventDoc.body);
		let docLeft = doc && doc.scrollLeft || body && body.scrollLeft || 0;
		let clientLeft = doc && doc.clientLeft || body && body.clientLeft || 0;
		let docTop = doc && doc.scrollTop || body && body.scrollTop || 0;
		let clientTop = doc && doc.clientTop || body && body.clientTop || 0;
		event.pageX = event.clientX + docLeft - clientLeft;
		event.pageY = event.clientY + docTop - clientTop;
		return event;
	}
	/** Mouse Move Event Handler (Desktop Only) creates a cache of the mouse coordinates
	    @param {Event} event Event
	    @returns {void}
	*/
	handleMouseMove(event) {
		if (event.pageX === null && event.clientX !== null) {
			let ev = this.handleMouseMoveInternetExplorer(event);
			this.mouse.x = ev.pageX;
			this.mouse.y = ev.pageY;
		} else {
			this.mouse.x = event.pageX;
			this.mouse.y = event.pageY;
		}
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
	/** Fires expand event for header, body and footer of Container
	    @returns {void}
	*/
	expandMain() {
		this.navheader.el.dispatchEvent(new Expand(this.navheader));
		this.body.el.dispatchEvent(new Expand(this.body));
		this.navfooter.el.dispatchEvent(new Expand(this.navfooter));
	}
	/** Returns a friendly username for the current user (if exists)
	    @returns {string} A friendly username
	*/
	getUser() {
		return this.user;
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
	/** Creates a SIDEBAR that contains an outline of MAIN and its descendants
	    @returns {void}
	*/
	createDocumentMap() {
		let sidebar = this.navheader.addTabbableSidebar('document-map', 'NAV', ICONS.SIDEBAR, 'left');
		sidebar.element.navbar.addOptionsMenu(this.toString(), ICONS[this.className], this.toString(), ['DATA', 'ATTRIBUTES', 'META', 'CHILDREN'], false);
		this.reference = sidebar.element.navbar;
		// Add submenu items to DATA and ATTRIBUTES
        /** @type {[NAVITEMICON]} */
        let [tab] = this.reference.tabs.get(this.toString(), 'NAVITEMICON');
        tab.el.addEventListener('select', () => this.getFactory().save(false, this, this));
		/** @type {[MENU]} */
        let [menu] = sidebar.element.navbar.menus.get(this.toString(), 'MENU');
        this.addDefaultDocumentMapAttributes(menu);

		// Position and show the NAVBAR
		$(sidebar.tab.el).insertBefore(this.navheader.tab.el);
		sidebar.element.navbar.el.dispatchEvent(new Expand(sidebar.element.navbar));
	}
	/** Creates a SIDEBAR with a USERMENU
	    @returns {{tab:NAVITEM, element:SIDEBAR}} Tabbable Element {tab,element}
	*/
	createUserMenu() {
        let userBar = this.navheader.addTabbableSidebar('sidebar-user', 'USER', ICONS.USER, 'right');
		let usermenu = new USERMENU(userBar.element);
		$(usermenu.el).insertBefore(userBar.element.navbar.el);
        usermenu.el.dispatchEvent(new Expand(usermenu));
		return this.navheader.addTabbableElement(userBar.tab, userBar.element);
	}
	/** Adds default Nav Items to the Nav Bar including the label
	    @returns {Promise<ThisType>} Promise Chain
	*/
	addNavOptions() {
		return this.chain(() => {
			// LEFT ALIGN
			this.createDocumentMap();
			// History / Prev / Back Navigation
			let btnPrev = this.navheader.addTabbableMenu('HISTORY', 'HISTORY', ICONS.CHEVRON_LEFT, ['HISTORY1', 'HISTORY2']);
			$(btnPrev.tab.el).insertBefore(this.navheader.tab.el);
			// RIGHT ALIGN
			this.createUserMenu();
			/*if (this.getUser() === 'Guest') {
			    usermenu.tab.el.addEventListener('activate', () => this.login(usermenu.tab));
			} else {
			    this.navheader.addTabbableElement(usermenu.tab, usermenu.element);
			}*/
			this.addDefaultMenuItems();
		});
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
		let optionsMenu = this.navheader.menus.get('OPTIONS', 'MENU');
		let domMenu = optionsMenu[0].get('DOM', 'MENU');
		this.addNavItemIcon(domMenu[0], ICONS.HOME, 'Home').el.onclick = () => setTimeout(() => {
			location.href = this.url.origin;
		}, 300);
		this.addNavItemIcon(domMenu[0], ICONS.TOGGLE, 'Headers').el.onclick = () => this.toggleHeaders().then(() => this.navheader.toggle());
		this.addNavItemIcon(domMenu[0], ICONS.REFRESH, 'Reload').el.onclick = () => setTimeout(() => location.reload(true), 1000);
		this.addNavItemIcon(domMenu[0], ICONS.CONSOLE, 'Console').el.onclick = () => this.loader.show();
		let crudMenu = optionsMenu[0].get('CRUD', 'MENU');
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
                    this.getPayload(0, 'MAIN').then((payload) => {
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
									form.footer.buttonGroup.get()[0].destroy().then(() => { //dialog
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
		return this.chain(() => {
			let ev = new Deactivate(this);
			this.navheader.tabs.get(null, 'NAVITEMICON').filter((c) => c !== this.navheader.tab).forEach((icon) => icon.el.dispatchEvent(ev));
			this.navheader.menus.get(null, 'MENU').forEach((menu) => menu.el.dispatchEvent(ev));
			//this.navfooter.tabs.get(null, 'NAVITEMICON').filter((c) => c !== this.navfooter.tab).map((icon) => icon.el.dispatchEvent(ev));
			this.navfooter.tabs.get(null, 'NAVITEMICON').forEach((icon) => icon.el.dispatchEvent(ev));
			this.navfooter.menus.get(null, 'MENU').map((menu) => menu.el.dispatchEvent(ev));
		}, 'Unable to restore focus to MAIN');
    }
	/** Allows the user to open a MAIN 
		@param {UId} id Unique Id
	    @todo Create method to browse MAINs
	    @returns {boolean} True on success
	*/
	open(id = 0) {
		console.log('TODO: APP.open(' + id + ')');
		return false;
	}
	/** Override CONTAINER.ifEmpty()
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
	}
	/** Gets the container (if exists) and sets it
	    @returns {void}
	*/
	setContainer() {
		this.container = this;
	}
	/** Gets the main (if exists) and sets it
	    @returns {void}
	*/
	setMain() {
		this.main = this;
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
				let prompt = new PROMPT(new DIALOGMODEL(new MODEL('login'), {
					caller,
					container: this,
					label
				}));
                prompt.createForm(new DIALOGMODEL(new MODEL('login'), {
                    caller,
                    container: prompt,
                    label: 'Login'
                })).then(
                    (form) => {
                        form.setAction('/Account/Login');
                        form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                            createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
                            createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                            createInputModel('INPUT', 'RememberMe', '', 'Remember Me', 'CHECKBOX')
                        ]);
                        form.footer.buttonGroup.addButton('Google').el.onclick = () => {
                            this.loginOAuth('Google');
                            return false;
                        }
                        form.footer.buttonGroup.addButton('Register').el.onclick = () => {
                            this.register();
                            return false;
                        }
                        form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
                        loader.log(100).then(() => prompt.show());
                    }
                );
			}
		);
    }
	/** Creates a login form in the given form
	    @param {FORM} form Form element
	    @returns {Promise<ThisType>} Promise Chain
	*/
	createLoginForm(form) {
        console.log(this.toString() + '.createLoginForm()');
        return this.chain(() => {
			form.setAction('/Account/Login');
            form.addClass('login');
            //form.children[0].children[0].addInputElements([
			form.get()[0].get()[0].addInputElements([
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
			window.location.href = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(this.url.origin + '/signin-' + provider);
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
	}
	/** Log into the application using the given credentials
        @param {string} email Username / Email 
        @param {string} password Account Password
        @returns {void}
    */
	register() {
        this.loader.log(99, 'Register', true).then((loader) => new PROMPT(new DIALOGMODEL(
                new MODEL('login'), {
                    container: this,
                    caller: this,
                    label: 'Register'
            })).createForm(new MODEL('login').set({
                label: 'Register',
                container: this
            })).then((form) => {
                form.setAction('/Account/Register');
                form.setId(0);
                form.label = 'Register';
                form.addClass('register');
                form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                    createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
                    createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                    createInputModel('INPUT', 'PasswordConfirm', '', 'Confirm Password', 'PASSWORD')
                ]);
                form.afterSuccessfulPost = (payload, status) => this.ajaxRefreshIfSuccessful(payload, status);
                loader.log(100).then(() => form.getDialog().show());
            })
        );
	}
	/** Swipe Up Event
	    @returns {void}
	*/
	swipeUp() {
		console.log('MAIN.swipeUp()');
		//this.navheader.collapse();
		document.body.classList.add('compact');
	}
	/** Swipe Down Event
	    @returns {void}
	*/
	swipeDown() {
		console.log('MAIN.swipeDown()');
		//this.navheader.expand();
		document.body.classList.remove('compact');
	}
}
export { Activate, CONTAINERFACTORY, Deactivate, EL, FACTORY, FORM, LOADER, MAINMODEL, MENU, MODEL, NAVBAR, NAVHEADER, NAVITEM, NAVITEMICON, SIDEBAR }