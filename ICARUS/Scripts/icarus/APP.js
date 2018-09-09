import CONTAINERFACTORY, { TOKEN } from './model/el/container/CONTAINERFACTORY.js';
import MAIN from './model/el/container/main/MAIN.js';
/**
    A Single Page Web Application Engine
*/
export default class APP {
    /**
        Constructs the main Application Controller
    */
    constructor() {


        this.factory = new CONTAINERFACTORY();
        this.token = TOKEN.getToken().value; //document.getElementsByName('__RequestVerificationToken')[0];
        this.url = new URL(window.location.href);

        this.DEBUGMODE = true; // If true, debug outputs are shown
        this.TESTING = false; // If true, tests are ran and results are shown in the console.
        this.recursionLimit = 100;

        /**
            The MAIN Container
        */
        this.main = new MAIN();


        // If a ReturnUrl is provided, redirect to that Url
        this.returnUrl = this.url.searchParams.get('ReturnUrl');
        if (this.returnUrl) {
            this.returnUrl = this.url.origin + this.returnUrl;
            location.href = this.returnUrl;
        }

        // If a 'login' parameter exists, show the login prompt
        // This is kind of annoying and doesn't need to exist.
        this.isLogin = this.url.searchParams.get('login');
        if (this.isLogin) {
            if (user === 'Guest') {
                app.main.login();
            }
        }
    }
}