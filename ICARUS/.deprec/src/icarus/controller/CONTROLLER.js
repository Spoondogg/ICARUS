/**
    @module 
*/
import MAIN, { LOADER, MODEL } from '../model/el/container/main/MAIN.js';
import CONTAINERFACTORY from './CONTAINERFACTORY.js';
import WATERMARK from '../helper/WATERMARK.js';
/**
    @class
    @extends MODEL
    @description An Application Class
    Constructs the Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
*/
export default class CONTROLLER extends MODEL {
	/**
		    Constructs an Application
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
		//this.factory = new CONTAINERFACTORY();
		this.watermark = new WATERMARK();
		/**
				    @property {string} name The application name
		        
				this.name = name;*/
		/**
				    @property {string} version The application version
		        
				this.version = version;*/
		/**
				    @property {string} token The session security token
		        
				this.token = token;*/
		/**
		    @property {Url} url An Url object
		*/
		this.url = new URL(window.location.href);
		/**
		    @property {boolean} debug If true, debug outputs are shown
		*/
		this.debug = true;
		/**
				    @property {number} recursionLimit The maximum amount of recursion before throwing an error
		        
				this.recursionLimit = recursionLimit;*/
		/**
		    @property {string} returnUrl If a ReturnUrl is provided, redirect to that Url
		*/
		this.returnUrl = this.url.searchParams.get('ReturnUrl');
		if (this.returnUrl) {
			this.returnUrl = this.url.origin + this.returnUrl;
			location.href = this.returnUrl;
		}
		/**
		    @property {LOADER} loader The default loader modal
		*/
		this.loader = new LOADER('Loading', 'Loading', 100);
		this.loader.log(100, 'Launching application...', true);
		/**
				    @property {PROMPT} prompt A dialog prompting the user for input
				    @type {PROMPT}
				    @todo There should never be more than one prompt in the DOM.
		            @todo Create a queue to hold multiple prompts
				*/
		this.prompt = null;
		/**
		    @property {MAIN} main The MAIN Container
		*/
		this.main = new MAIN(new MODEL().set({
			id,
			user,
			dev,
			factory,
			token,
			'label': '', //this.name + ' : ' + this.version,
			'loader': this.loader,
			//'token': this.token,
			'url': this.url,
			'debug': this.debug,
			'recursionLimit': this.recursionLimit
		}));
		if (user === 'Guest') {
			this.showLoginPrompt();
		}
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