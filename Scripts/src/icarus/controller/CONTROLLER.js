/** @module */
import MAIN, { LOADER, MODEL } from '../model/el/container/main/MAIN.js';
import CONTAINERFACTORY from './CONTAINERFACTORY.js';
//import DIALOG from '../model/EL/dialog/DIALOG.js';
import WATERMARK from '../helper/WATERMARK.js';
/** An Application Class
    @description Constructs the Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
    @class
    @extends MODEL
*/
export default class CONTROLLER extends MODEL {
	/** Constructs an Application
        @param {number} id The unique application id
        @param {string} user A friendly username
        @param {boolean} dev If true, dev-options are enabled
        @param {number} recursionLimit The maximum number of recursive loops before an error is thrown
        @param {string} name The application name
        @param {string} version The application version
        @param {string} token The session token
        @param {CONTAINERFACTORY} factory The container constructor factory 
    */
	constructor(id = 0, user = 'Guest', dev = false, recursionLimit = 100, name, version, token, factory) { // eslint-disable-line max-params
		super().set({
			id,
			user,
			dev,
			recursionLimit,
			name,
			version,
			token,
			factory
		});
		this.watermark = new WATERMARK();
		/** @property {string} name The application name
        this.name = name;*/
		/** @property {string} version The application version
        this.version = version;*/
		/** @property {string} token The session security token
		this.token = token;*/
		/** @property {Url} url An Url object */
		this.url = new URL(window.location.href);
		/** @property {boolean} debug If true, debug outputs are shown */
		this.debug = true;
		/** @property {number} recursionLimit The maximum amount of recursion before throwing an error		        
        this.recursionLimit = recursionLimit;*/
		/** @property {string} returnUrl If a ReturnUrl is provided, redirect to that Url */
		this.returnUrl = this.url.searchParams.get('ReturnUrl');
		if (this.returnUrl) {
			this.returnUrl = this.url.origin + this.returnUrl;
			location.href = this.returnUrl;
		}
		/** @property {LOADER} loader The default loader modal */
		this.loader = new LOADER(0, 'Loading');
		this.loader.log(10, 'Launching application...', true);
		/** @property {PROMPT} prompt A dialog prompting the user for input
			@type {PROMPT}
			@todo There should never be more than one prompt in the DOM.
		    @todo Create a queue to hold multiple prompts
		*/
		this.prompt = null;
		/** @property {MAIN} main The MAIN Container */
		this.main = new MAIN(this);
		if (user === 'Guest') {
			this.showLoginPrompt();
        }

        // Add key bindings
        this.keyBindings();
    }
    /** Sets application keybindings
        @returns {void}
        @see https://stackoverflow.com/a/14180949/722785
    */
    keyBindings() {
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        console.log('ctrl-s', this.main.activeContainer);
                        try {
                            if (this.main.activeContainer.className === 'FORM') {
                                this.main.activeContainer.post();
                            }
                        } catch (e) {
                            console.log('Failed keyBinding', e);
                        }
                        break;
                    case 'f':
                        event.preventDefault();
                        console.log('ctrl-f', this.main.activeContainer);
                        break;
                    case 'g':
                        event.preventDefault();
                        console.log('ctrl-g', this.main.activeContainer);
                        break;
                    default:
                        //
                }
            }
        });
    }

	/**
	    Determines if a 'login' parameter exists in the Url, and if true, 
	    shows the login prompt.
	    @returns {boolean} If a login parameter exists, return true
	*/
	showLoginPrompt() {
		if (this.url.searchParams.get('login')) {
			this.main.login();
		}
		return this;
    }
    /**
	    If conditions are met, launches OAuth Login Prompt
	    @returns {boolean} If a login parameter exists, return true
	*/
    showExternalLoginPrompt() {
        let provider = this.url.searchParams.get('provider');
        let returnUrl = this.url.searchParams.get('returnUrl');
        if (provider && returnUrl) {
            this.main.loader.log(50, 'Processing OAuth...', true).then(() => {
                this.main.loginExternal(provider, returnUrl);
                document.getElementById('Google').click(); // clicks ExternalLogin.cshtml for that returns to '/'
                //location.href = '/Account/ExternalLogin/externalLogin?ReturnUrl=%2F&provider=' + this.url.searchParams.get('provider');
                /*$.post('/Account/ExternalLogin/externalLogin?ReturnUrl=%2F', {
                    '__RequestVerificationToken': this.main.getToken(),
                    'provider': this.url.searchParams.get('provider'),
                    'returnUrl': this.url.searchParams.get('returnUrl')
                }, (data) => {
                    console.log('Payload', data);
                }); //, 'json'this.main.ajaxRefreshIfSuccessful,*/
            });
        }
        return this;
    }
	/**
	    If a ReturnUrl is provided, redirect to that Url
	    @returns {APP} This APP
	*/
	redirectToReturnUrl() {
		let returnUrl = this.url.searchParams.get('ReturnUrl');
		if (returnUrl) {
			location.href = this.url.origin + this.returnUrl;
		}
		return this;
	}
}
export { CONTAINERFACTORY };