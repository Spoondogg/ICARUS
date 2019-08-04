/* eslint-disable max-lines, max-statements */
/** @module icarus/model/el/container/MAIN */
import CONTAINER, { Activate, CACHE, Collapse, DATAELEMENTS, Deactivate, Expand, ICONS, MODEL, MODELS, NAVBAR, NAVHEADER, createInputModel } from '../CONTAINER.js';
import CONTAINERFACTORY, { BUTTON, BUTTONGROUP, FACTORY, FORM, PROMPT } from '../CONTAINERFACTORY.js';
import MENU, { NAVSEARCH } from '../../nav/menu/MENU.js';
import NAVITEMICON, { EL, NAVITEM } from '../../nav/navitemicon/NAVITEMICON.js';
import CHATFACTORY from '../chat/CHATFACTORY.js';
import CLASSINDEXFACTORY from '../index/classindex/CLASSINDEXFACTORY.js';
import FORMFACTORY from '../../form/FORMFACTORY.js';
import IMG from '../../img/IMG.js';
import LOADER from '../../dialog/loader/LOADER.js';
import NAVFOOTER from '../../nav/navbar/navfooter/NAVFOOTER.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
import TABLEFACTORY from '../../table/TABLEFACTORY.js';
import USERMENU from '../../nav/menu/usermenu/USERMENU.js';
/** A top level View that holds all other child Containers
    @class
    @extends CONTAINER
*/
export default class MAIN extends CONTAINER {
	/** Constructs a MAIN Container and populates the DOM with any relevant elements
	    @param {MainModel} model Model
    */
	constructor(model) {
        super(document.body, 'MAIN', model, DATAELEMENTS.get('MAIN').containers);
        this.addClass('main');
        this.cache = new CACHE();
        this.deactivateSiblingsOnActivate = false;
        this.body.pane.addClass('pane-tall');
        this.overrideSwipeEvents();
        this.navheader.setAttribute('draggable', false);
        this.navheader.tab.addClass('tab-center');
		this.addNavOptions(model);
        this.setFactory(model.factory);
        this.setLoader(model.loader);
		this.url = model.url;
		/** The active container has access to keybindings */
		this.activeContainer = null;
		// ELEMENTS
		this.navfooter = new NAVFOOTER(this, new MODEL());
		$(this.navfooter.el).insertAfter(this.el);
		this.watchMousePosition();
        this.expandMain();
        /** Add factories */
        this.addFactories();
        this.addRefreshScroll();
        this.addMainActivateEvents();
    }
    /** Overrides the CONTAINER swipe events
        @returns {void}
    */
    overrideSwipeEvents() {
        this.body.pane.swipeUp = () => console.log('MAIN.body.pane.swipeUp');
        this.body.pane.swipeDown = () => console.log('MAIN.body.pane.swipeDown');
    }
    /** Override and terminate parent activation at the top of the chain
        @returns {void}
    */
    activateParentContainer() {
        //console.log(this.toString() + '.activateParentContainer(TRUE)');
    }
    /** Override and terminate parent deactivation at the top of the chain
        @returns {void}
    */
    deactivateParentContainer() {
        //console.log(this.toString() + '.deactivateParentContainer(TRUE)');
    }
    /** Adds the given FACTORY to this CONTAINER's available factories
        @returns {void}
    */
    addFactories() {
        this.getFactory().factories.set('CHATFACTORY', new CHATFACTORY());
        this.getFactory().factories.set('FORMFACTORY', new FORMFACTORY());
        this.getFactory().factories.set('CLASSINDEXFACTORY', new CLASSINDEXFACTORY());
        this.getFactory().factories.set('TABLEFACTORY', new TABLEFACTORY());
    }
    addMainActivateEvents() {
        this.el.addEventListener('activate', () => {      
            //let [sidebarTab] = this.navheader.tabs.get('document-map', 'NAVITEMICON');
            //let [sidebar] = this.navheader.menus.get('document-map', 'SIDEBAR');
            //sidebarTab.el.dispatchEvent(new Activate(sidebarTab));
            //console.log('Trigger scrollTo() for SIDEBAR.scrollTarget', sidebar.scrollTarget);
            /*if (sidebar.scrollTarget !== null) {
                $(sidebar.el).animate({
                    scrollTop: parseInt($(sidebar.scrollTarget.el).offset().top)
                }, 600, 'swing');
                sidebar.scrollTarget = null;
            } else {
                console.log('Scroll target not set');
            }*/
        });
        this.el.addEventListener('deactivate', () => {
            /*let [sidebarTab] = this.navheader.tabs.get('document-map', 'NAVITEMICON');
            if (sidebarTab.hasClass('active')) {
                //let [sidebar] = this.navheader.menus.get('document-map', 'SIDEBAR');
                //console.log(this.toString() + ' is deactivating the document-map', sidebarTab);
                sidebarTab.el.dispatchEvent(new Deactivate(sidebarTab));
            }*/
        });
    }
    /** Scroll to refresh
        @see https://dev.to/vijitail/pull-to-refresh-animation-with-vanilla-javascript-17oc
        @returns {void}
    */
    addRefreshScroll() {
        document.addEventListener('touchstart', (ev) => this.swipeStart(ev), false);
        document.addEventListener('touchmove', (ev) => this.swipe(ev), false);
        document.addEventListener('touchend', (ev) => this.swipeEnd(ev), false);
        this.pStart = {
            x: 0,
            y: 0
        };
        this.pCurrent = {
            x: 0,
            y: 0
        };
        //let main = this.el;
        this.isLoading = false;
    }
    /** Sets this element's loader
        @param {LOADER} loader An element loader
        @returns {void}
    */
    setLoader(loader) {
        if (this.loader === null) {
            this.loader = loader;
        }
    }
    /** In the swipeStart() function, we’ll capture the touch coordinates 
        and assign it to the pStart object.
        @param {Event} ev Touch Event
        @returns {void}
    */
    swipeStart(ev) {
        if (typeof ev.targetTouches === 'undefined') {
            this.pStart.x = ev.screenX;
            this.pStart.y = ev.screenY
        } else {
            let [touch] = ev.targetTouches;
            this.pStart.x = touch.screenX;
            this.pStart.y = touch.screenY;
        }
    }
    swipe(ev) {
        if (typeof ev.changedTouches === 'undefined') {
            this.pCurrent.x = ev.screenX;
            this.pCurrent.y = ev.screenY;
        } else {
            let [touch] = ev.changedTouches;
            this.pCurrent.x = touch.screenX;
            this.pCurrent.y = touch.screenY;
        }
        let changeY = this.pStart.y - this.pCurrent.y;
        console.log('changeY', changeY, this.body.pane.el.scrollTop);
        //const rotation = this.changeY < 
        if (this.body.pane.el.scrollTop === 0) {
            if (changeY < -100) {
                console.warn('Scroll triggered a refresh!');
                // Find a way to detect MAIN.body.pane scroll 
                // Avoid refresh when sidebar scroll takes place and scrollTop === 0
                /*this.isLoading = true;
                alert('Refreshing...');
                //window.navigator.vibrate(200);
                this.refresh();*/
            }
        }
    }
    swipeEnd() {
        if (this.body.pane.el.scrollTop === 0 && !this.isLoading) {
            this.isLoading = true;
            //console.log('REFRESH!!!');
        } else {
            this.isLoading = false;

        }
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
    /** Adds REFERENCE placeholders for this container's children
        @param {ContainerModel} model Model
        @returns {void}
    */
    addReferencePlaceholder(model) {
        let childrenMenu = this.reference.options.menu.getMenu('CHILDREN');
        model.subsections.split(',').forEach((s) => {
            childrenMenu.addNavItemIcon(new MODEL().set({
                label: s,
                id: 'ref_' + s,
                icon: ICONS.ALERT,
                name: s + ' placeholder'
            }));
        });
    }
	/** Creates a SIDEBAR that contains an outline of MAIN and its descendants. 
	    @returns {void}
	*/
    createDocumentMap() {
        let sidebar = this.navheader.addTabbableSidebar('document-map', 'NAV', ICONS.SIDEBAR, 'left');

        /** There has to be a better way of doing this.  What is wrong with using the REFERENCE class / this.reference?
            Well, it doesn't have a container.  But that can be fixed by using DOCUMENTMAP
        */
        this.reference = sidebar.element.navbar;
        this.reference.options = this.reference.addOptionsMenu(
            this.label, ICONS[this.className], this.toString(),
            ['PROPERTIES', 'METHODS', 'CHILDREN'], false //'DATA', 'ATTRIBUTES', 'META', 
        );
        let propertiesMenu = this.reference.options.menu.getMenu('PROPERTIES');
        this.constructReferenceSubMenus(['DATA', 'ATTRIBUTES', 'META'], propertiesMenu, this.reference);

        let methodsMenu = this.reference.options.menu.getMenu('METHODS');
        this.constructReferenceSubMenus(['ELEMENTS', 'CRUD', 'DOM'], methodsMenu, this.reference);
        this.addCrudItems(methodsMenu.getMenu('CRUD'));
        this.addDomItems(methodsMenu.getMenu('DOM'));
        this.addElementItems(methodsMenu.getMenu('ELEMENTS'), this.containerList);

        
		// Add submenu items to DATA and ATTRIBUTES
        this.reference.getTab(this.toString()).el.addEventListener('select', () => this.getFactory().save(false, this, this));

        this.addDefaultDocumentMapProperties(propertiesMenu);

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
        // Tab should expand UserMenu
        userBar.tab.el.addEventListener('activate', () => usermenu.el.dispatchEvent(new Expand(usermenu)));
		$(usermenu.el).insertBefore(userBar.element.navbar.el);
        usermenu.el.dispatchEvent(new Expand(usermenu));
        
		return this.navheader.addTabbableElement(userBar.tab, userBar.element);
    }
    /** Launches the appropriate ClassViewer and passes it the querystring
        @param {Event} ev Evetn
        @param {string} [query] QueryString
        @param {EL} [caller] Calling element
        @param {string} [classType] Class Type to Search (ie: MAIN, FORM, *)
        @param {string} [searchType] Optional Search Type
        @returns {void}
    */
    submitSearch(ev, query, caller = this, classType = this.className, searchType = 'TAG') {
        console.log(this.toString() + '.submitSearch', searchType, query);
        ev.preventDefault();
        ev.stopPropagation();
        console.log('Search', query);
        this.getFactory().launchViewer(classType, this, caller, query, searchType);
    }
    /** Generates an array of TAG names that have been cached locally
        @param {string} value Query String
        @returns {void}
    */
    retrieveCachedTags(value) {
        let tagList = [];
        let formposts = this.getCache().FORMPOST;
        Object.keys(formposts).forEach((key) => {
            let fp = formposts[key];
            if (fp.formId === 10128) { // should be filtering, not just assuming tag is indexed in position 0
                let [tag] = fp.jsonResults.filter((r) => r.name === 'tag' && r.value.toString().startsWith(value));
                if (typeof tag !== 'undefined') {
                    tagList.push(tag.value);
                }
            }
        });
        return tagList;
    }
    /* eslint-disable max-lines-per-function */
	/** Adds default Nav Items to the Nav Bar including the label
        @param {MainModel} model Model
	    @returns {Promise<ThisType>} Promise Chain
	*/
	addNavOptions(model) {
		return this.chain(() => {
			// LEFT ALIGN
			this.createDocumentMap(model);
			// Search
            let tabbable = this.navheader.addTabbableMenu('SEARCH', 'SEARCH', ICONS.SEARCH, []);

            /// Override input defaults and pass to search
            /** @type {NAVSEARCH} */
            let navsearch = tabbable.element.addNavSearch(new MODEL('navsearch-woot'));
            navsearch.submitSearch = (ev) => this.submitSearch( // When search button is clicked... OVERRIDE
                ev,
                navsearch.input.el.value.toString(),
                navsearch.btnSearch,
                this.className,
                navsearch.searchType.el.value
            );

            $(tabbable.tab.el).insertBefore(this.navheader.tab.el);
            tabbable.tab.el.addEventListener('activate', () => {
                navsearch.el.dispatchEvent(new Activate(tabbable.tab));
                navsearch.input.el.focus();
            });

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
		return menu ? menu.addNavItemIcon(MODELS.navitem(label, icon, '').set('url', url)) : null;
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
							loader.log(100, 'Created MAIN, ' + payload.message).then(() => {
								/** Prompts the user to open the new page.
								    In order to avoid popup blocking, the user must 
								    manually click to be redirected or launch a new
								    page in this window
								*/
								let url = '/' + payload.model.id;
								new PROMPT(new MODEL().set({
									label: 'Create a new page',
									caller: this,
                                    container: this,
                                    text: 'Create a new page'
								})).createForm().then((form) => {
									form.footer.buttonGroup.get()[0].destroy().then(() => { //dialog
                                        form.footer.buttonGroup.addButton(MODELS.button('Open in new window')).el.onclick = () => {
											window.open(url, '_blank');
											form.getDialog().hide(300, true);
										};
                                        form.footer.buttonGroup.addButton(MODELS.button('Open in this Window?')).el.onclick = () => {
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
    /** Launches a Forgotten Password form that can email a user a reset token
        @returns {void}
    */
    forgotPassword() {
        console.log('MAIN.forgotPassword');
        this.loader.log(99, 'Forgot Password').then((loader) => new PROMPT(MODELS.dialog(
            'Forgot Password', '', true, this, this, this.getLoader())).createForm(new MODEL('login').set({
                label: 'Forgot Password',
                container: this
            })).then((form) => {
                form.setAction('/Account/ForgotPassword');
                form.setId(0);
                form.label = 'Forgot Password';
                form.addClass('register');
                form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                    MODELS.input('INPUT', MODELS.inputAttributes('Email', '', 'EMAIL'), 'Email / Username', 'EMAIL')
                    //createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL')
                ]);

                let [btnForgotPassword] = form.footer.buttonGroup.get();
                btnForgotPassword.addClass('btn-sign-in');
                btnForgotPassword.setLabel('Verify Email');
                btnForgotPassword.icon.setIcon(ICONS.EXCLAMATION);

                form.afterSuccessfulPost = (payload, status) => this.processAjaxResponse(payload, status, false).then((result) => {
                    console.log(result, 'Closing dialog');
                    form.getDialog().close();
                    loader.log(99, 'A password request has been emailed with further instructions', {
                        show: true,
                        toConsole: true,
                        delay: 5000,
                        type: 'warning'
                    });
                    loader.console.el.dispatchEvent(new Activate(loader.console));
                });
                loader.log(100).then(() => form.getDialog().show());
            })
        );
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
        @todo Consider making this a class that MAIN calls, similar to USERMENU (LOGINFORM)
	    @returns {void}
	*/
	login(caller = this) {
		console.log('Login Caller', caller);
		let label = 'LogIn';
		this.loader.log(99, label).then(
			(loader) => {
                let prompt = new PROMPT(MODELS.dialog(label, '', true, this, caller));
                prompt.addClass('login');
                prompt.createForm(MODELS.dialog('Login', '', true, prompt, caller, this.getLoader())).then(
                    (form) => {
                        let email = this.url.searchParams.get('email');
                        form.setAction('/Account/Login');
                        form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                            MODELS.input('INPUT', MODELS.inputAttributes('Email', email, 'EMAIL'), 'Email / Username', 'EMAIL'),
                            //createInputModel('INPUT', 'Email', email, 'Email / Username', 'EMAIL'),
                            MODELS.input('INPUT', MODELS.inputAttributes('Password', '', 'EMAIL'), 'Password', 'PASSWORD'),
                            //createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                            MODELS.input('INPUT', MODELS.inputAttributes('RememberMe', '', 'CHECKBOX'), 'Remember Me', 'CHECKBOX')
                            //createInputModel('INPUT', 'RememberMe', '', 'Remember Me', 'CHECKBOX')
                        ]);
                        //console.log('ButtonGroup', form.footer.buttonGroup.get());

                        let [btnSignIn] = form.footer.buttonGroup.get();
                        btnSignIn.addClass('btn-sign-in');
                        btnSignIn.setLabel('Sign In');

                        let btnOAuthGoogle = form.footer.buttonGroup.addButton(MODELS.button('Sign in with Google', ICONS.USER));
                        btnOAuthGoogle.addClass('btn-oauth-google');
                        btnOAuthGoogle.el.onclick = () => {
                            this.loginOAuth('Google');
                            return false;
                        }
                        /*form.footer.buttonGroup.addButton('Register').el.onclick = () => {
                            this.register();
                            return false;
                        }*/
                        let btnForgotPassword = form.footer.buttonGroup.addButton(MODELS.button('Forgot Your Password?'));
                        btnForgotPassword.addClass('btn-forgot-password');
                        btnForgotPassword.el.onclick = () => {
                            this.forgotPassword();
                            return false;
                        }

                        form.afterSuccessfulPost = (payload, status) => this.processAjaxResponse(payload, status).then(
                            (result) => {
                                console.log(this.toString() + '.login()', result);
                            }
                        );
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
                MODELS.input('INPUT', MODELS.inputAttributes('Email', '', 'EMAIL'), 'Email / Username', 'EMAIL'),
                MODELS.input('INPUT', MODELS.inputAttributes('Password', '', 'PASSWORD', null, null, 'off'), 'Password', 'PASSWORD'),
                MODELS.input('INPUT', MODELS.inputAttributes('RememberMe', '', 'CHECKBOX'), 'Remember Me', 'CHECKBOX')
				//createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
				//createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
				//createInputModel('INPUT', 'RememberMe', '', 'Remember Me', 'CHECKBOX')
			]);
			form.footer.buttonGroup.children[0].label.setInnerHTML('Login - Local');
            form.footer.buttonGroup.addButton(MODELS.button('Register - Local')).el.addEventListener('activate', () => this.register());
			form.afterSuccessfulPost = (payload, status) => this.processAjaxResponse(payload, status);
		});
	}
	/** Redirects to the third party OAuth Sign In
        ie: http://localhost:8052/Account/ExternalLogin/externalLogin?provider=Google
	    @param {string} provider The OAuth Provider
	    @returns {void} 
	*/
    loginOAuth(provider) {
        this.chain(() => this.navheader.tab.el.dispatchEvent(new Deactivate(this.navheader.tab))).then(
            () => this.chain(() => this.navheader.el.dispatchEvent(new Collapse(this.navheader))).then(
                () => {
                    window.location.href = '/Account/ExternalLogin/externalLogin?provider=' + provider + '&returnUrl=' + encodeURI(this.url.origin + '/signin-' + provider);
                }
            )
        );        
	}
	/** Logs the current user out 
        @returns {Promise<boolean>} True on success
    */
	logout() {
		this.loader.log(99, 'Logging Out').then(
			() => Promise.resolve(localStorage.clear()).then(
				$.post('/Account/LogOff', {
					'__RequestVerificationToken': this.getToken()
				}, this.processAjaxResponse.bind(this), 'json')));
	}
	/** Log into the application using the given credentials
        param {EL} container Username / Email
        @param {EL} caller Account Password
        @returns {void}
    */
	register(caller = this) {
        this.loader.log(99, 'Register').then((loader) => new PROMPT(MODELS.dialog(
            'Sign Up', '', true, this, caller, this.getLoader()
        )).createForm(new MODEL('login').set({
                label: 'Sign Up',
                container: this
            })).then((form) => {
                form.setAction('/Account/Register');
                form.setId(0);
                form.label = 'Sign Up';
                form.addClass('register');
                form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                    MODELS.input('INPUT', MODELS.inputAttributes('Email', '', 'EMAIL'), 'Email / Username', 'EMAIL'),
                    MODELS.input('INPUT', MODELS.inputAttributes('Password', '', 'PASSWORD', null, null, 'off'), 'Password', 'PASSWORD'),
                    MODELS.input('INPUT', MODELS.inputAttributes('PasswordConfirm', '', 'PASSWORD', null, null, 'off'), 'Confirm Password', 'PASSWORD')
                    //createInputModel('INPUT', 'Email', '', 'Email / Username', 'EMAIL'),
                    //createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                    //createInputModel('INPUT', 'PasswordConfirm', '', 'Confirm Password', 'PASSWORD')
                ]);

                let [btnSignIn] = form.footer.buttonGroup.get();
                btnSignIn.addClass('btn-sign-in');
                btnSignIn.setLabel('Sign Up');

                form.afterSuccessfulPost = (payload, status) => this.processAjaxResponse(payload, status).then(
                    () => console.warn('SHOULD CLOSE DIALOG NOW', form.getDialog().close())
                    /*() => {
                        form.getDialog().close();
                    }*/
                );
                loader.log(100).then(() => form.getDialog().show());
            })
        );
    }
    /** Log into the application using the given credentials
        @param {string} email Username / Email 
        @param {string} password Account Password
        @returns {void}
    */
    resetPassword() {
        this.loader.log(99, 'Reset Password').then((loader) => new PROMPT(MODELS.dialog(
                'Reset Password', '', true, this, this, this.getLoader())
            ).createForm(new MODEL('login').set({
                label: 'Reset Password',
                container: this
            })).then((form) => {
                form.setAction('/Account/ResetPassword');
                form.setId(0);
                form.label = 'Reset Password';
                form.addClass('reset-password');

                let email = this.url.searchParams.get('email');

                form.getFieldset()[0].getFormElementGroup()[0].addInputElements([ // fieldset.formElementGroup
                    MODELS.input('INPUT', MODELS.inputAttributes('Code', this.url.searchParams.get('code'), 'HIDDEN'), 'Code', 'HIDDEN'),
                    MODELS.input('INPUT', MODELS.inputAttributes('Email', email, 'HIDDEN'), 'Email / Username', 'HIDDEN'),
                    MODELS.input('INPUT', MODELS.inputAttributes('Password', '', 'PASSWORD', null, null, 'off'), 'Password', 'PASSWORD'),
                    MODELS.input('INPUT', MODELS.inputAttributes('PasswordConfirm', '', 'PASSWORD', null, null, 'off'), 'Confirm Password', 'PASSWORD')
                    //createInputModel('INPUT', 'Code', this.url.searchParams.get('code'), 'Code', 'HIDDEN'),
                    //createInputModel('INPUT', 'Email', email, 'Email / Username', 'HIDDEN'),                    
                    //createInputModel('INPUT', 'Password', '', 'Password', 'PASSWORD'),
                    //createInputModel('INPUT', 'PasswordConfirm', '', 'Confirm Password', 'PASSWORD')
                ]);

                let [btnSignIn] = form.footer.buttonGroup.get();
                btnSignIn.addClass('btn-sign-in');
                btnSignIn.setLabel('Update Password');

                form.afterSuccessfulPost = (payload, status) => this.processAjaxResponse(payload, status, false).then(() => {
                    loader.log(99, 'Redirecting to login').then(() => setTimeout(() => {
                        window.location.href = window.location.origin + '?login=1&email=' + email;
                    }, 3000));
                });
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
export { Activate, BUTTON, BUTTONGROUP, CONTAINERFACTORY, Deactivate, EL, FACTORY, FORM, LOADER, MENU, MODEL, MODELS, NAVBAR, NAVHEADER, NAVITEM, NAVITEMICON, NAVSEARCH, SIDEBAR, TABLEFACTORY }
/* eslint-enable max-lines, max-statements */