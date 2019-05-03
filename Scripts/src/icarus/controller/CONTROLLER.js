/** @module */
import MAIN, { FACTORY, LOADER, MODEL } from '../model/el/container/main/MAIN.js';
import WATERMARK from '../helper/WATERMARK.js';
/** An Application Class
    @description Constructs the Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
    @class
    @extends MODEL
*/
export default class CONTROLLER extends MODEL {
	/** Constructs an Application
        @param {UId} id The unique application id
        @param {Name} user A machine friendly username
        @param {boolean} dev If true, dev-options are enabled
        @param {number} recursionLimit The maximum number of recursive loops before an error is thrown
        @param {Name} name The application name
        @param {string} version The application version
        @param {string} token The session token
        @param {FACTORY} factory The default FACTORY
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
		/** @property {Url} url An Url object */
		this.url = new URL(window.location.href);
		/** @property {boolean} debug If true, debug outputs are shown */
		this.debug = true;
        this.setReturnUrl();
		this.loader = new LOADER(0);
		this.loader.log(10, 'Launching application...');
		this.main = new MAIN(this);
		this.showLoginPrompt(user === 'Guest');
        this.keyBindings();

        this.loader.log(100);
    }
    /** If a ReturnUrl is provided, redirect to that Url
        @returns {void}
    */
    setReturnUrl() {
        /** @type {string} */
        this.returnUrl = this.url.searchParams.get('ReturnUrl');
        if (this.returnUrl) {
            this.returnUrl = this.url.origin + this.returnUrl;
            location.href = this.returnUrl;
        }
    }
	/** Sets application keybindings
	    @returns {void}
	    @see https://stackoverflow.com/a/14180949/722785
        @todo Consider if this should be abstracted to an interface
	*/
	keyBindings() {
		window.addEventListener('keydown', (event) => {
			if (event.ctrlKey || event.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 'a':
                        event.stopPropagation();
                        console.log('ctrl-a', 'No action exists');
                        break;
                    case 's':
						event.preventDefault();
						console.log('ctrl-s', this.toString());
						try {
                            if (this.main.activeContainer.className === 'FORM') {
                                this.main.activeContainer.post();
                            } else {
                                console.log(this.toString() + ': No key binding for ctrl-s exists');
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
	/** Determines if a 'login' parameter exists in the Url, and if true, 
	    shows the login prompt.
        @param {boolean} proceed Optionally prevent any action from being taken
	    @returns {boolean} If a login parameter exists, return true
	*/
	showLoginPrompt(proceed = true) {
		if (this.url.searchParams.get('login') && proceed) {
			console.log('showLoginPrompt();');
			this.main.login();
		}
		return this;
	}
	/** If conditions are met, launches OAuth Login Prompt
	    @returns {boolean} If a login parameter exists, return true
	
    showExternalLoginPrompt() {
        let provider = this.url.searchParams.get('provider');
        let returnUrl = this.url.searchParams.get('returnUrl');
        if (provider && returnUrl) {
            console.log('showExternalLoginPrompt()');
            //this.main.loader.log(50, 'Processing OAuth[' + provider + ']...', true).then(() => this.main.loginOAuth(provider));
        }
        return this;
    }*/
	/** If a ReturnUrl is provided, redirect to that Url
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
export { FACTORY }