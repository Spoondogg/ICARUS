/** 
    @module 
*/
import WATERMARK from '../helper/WATERMARK.js';
import CONTAINERFACTORY, { TOKEN, MODEL } from '../model/el/container/CONTAINERFACTORY.js';
import MAIN from '../model/el/container/main/MAIN.js';
import LOADER from '../model/el/modal/loader/LOADER.js';

/**
    @class
    @extends Object
    @description An Application Class
    Constructs the main Application Controller and initializes the MAIN Container
    This should be instantiated during the init phase of the html document
*/
export default class APP extends Object {
    /**
        Constructs an Application
        @param {number} id The unique application id
        @param {string} user A friendly username
        @param {boolean} dev If true, dev-options are enabled
        @param {number} recursionLimit Limits recursion depth 
    */
    constructor(id = 0, user = 'Guest', dev = false, recursionLimit = 100) {
        super();
        this.watermark = new WATERMARK();
        this.name = 'Icarus';
        this.version = '0.5.20180909';
        this.token = TOKEN.getToken().value;
        this.url = new URL(window.location.href);

        /**
            @property {boolean} debug If true, debug outputs are shown
        */
        this.debug = true;

        this.recursionLimit = recursionLimit;

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
            @property {MAIN} main The MAIN Container
        */
        this.main = new MAIN(new MODEL().set({
            'id': id,
            'user': user,
            'dev': dev,
            'label': '', //this.name + ' : ' + this.version,
            'loader': this.loader,
            'token': this.token,
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