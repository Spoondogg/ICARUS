/**
    Imports
*/
import WATERMARK from './WATERMARK.js';
import CONTAINERFACTORY, { TOKEN } from './model/el/container/CONTAINERFACTORY.js';
import MAIN from './model/el/container/main/MAIN.js';
import LOADER from './model/el/modal/loader/LOADER.js';
import MODEL from './model/MODEL.js';
/**
    A Single Page Web Application Engine
*/
export default class APP {
    /**
        Constructs the main Application Controller
        and initializes the MAIN Container.

        This should be instantiated during the init phase of 
        the html document

        @param {MODEL} model An Application Configuration Model
    */
    constructor(model) {

        new WATERMARK();
        this.name = 'Icarus';
        this.version = '0.5.20180909';
        this.token = TOKEN.getToken().value; //document.getElementsByName('__RequestVerificationToken')[0];
        this.url = new URL(window.location.href);

        this.DEBUGMODE = true; // If true, debug outputs are shown
        this.recursionLimit = 100;

        /**
            The default loader modal
        */
        this.loader = new LOADER('Loading', 'Loading', 100);
        this.loader.log(100, 'Launching application...', true);

        /**
            The MAIN Container
            this.main = new MAIN(new MODEL(), this.loader)
        */
        //this.main = new MAIN(new MODEL(), this.loader);
        this.main = new MAIN(new MODEL().set({
            'label': this.name + ' : ' + this.version,
            'loader': this.loader,
            'token': this.token,
            'url': this.url,
            'debug': this.debug,
            'recursionLimit': this.recursionLimit
        }));


        /**
            If a ReturnUrl is provided, redirect to that Url
        */
        this.returnUrl = this.url.searchParams.get('ReturnUrl');
        if (this.returnUrl) {
            this.returnUrl = this.url.origin + this.returnUrl;
            location.href = this.returnUrl;
        }

        /**
            If a 'login' parameter exists, show the login prompt
            In certain cases, you want to trigger the user to log in
        */
        this.isLogin = this.url.searchParams.get('login');
        if (this.isLogin) {
            if (user === 'Guest') {
                this.main.login();
            }
        }
    }
}