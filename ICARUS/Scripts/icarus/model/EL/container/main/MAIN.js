import CONTAINER from '../CONTAINER.js';
import EL, { MODEL } from '../../EL.js';
import LOADER from '../../modal/loader/LOADER.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
import { ICONS } from '../../../../enums/ICONS.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import STICKYFOOTER from '../../footer/stickyfooter/STICKYFOOTER.js';
import CONTAINERFACTORY, { FORM, TOKEN } from '../CONTAINERFACTORY.js';
//import TOKEN from '../formelement/input/TOKEN.js';
import DEBUG from '../../../../DEBUG.js';
import PROMPT from '../../modal/prompt/PROMPT.js';
import INPUT from '../formelement/input/INPUT.js';
import { INPUTTYPES } from '../../../../enums/INPUTTYPES.js';
export { LOADER };
/**
    A top level View that holds all other child Containers
*/
export default class MAIN extends CONTAINER {
    /**
        Constructs a MAIN Container
        @param {MODEL} model APP model
     */
    constructor(model) {

        document.title = model.label;        
        
        super(document.body, 'MAIN', model, [
            'ARTICLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER',
            'IMAGEGALLERY', 'DICTIONARY', 'WORD'
        ]);
        this.addClass('app').navBar.addClass('navbar-fixed-top');
        this.showNavBar();
        this.body.pane.addClass('pane-tall');

        /**
            The LOADER exists outside of the Container
        */
        this.loader = model.loader;
        

        this.sidebar = new SIDEBAR(this, new MODEL().set({
            'label': 'Left Sidebar'
        }));    

        this.addNavOptions();
        
        this.stickyFooter = new STICKYFOOTER(this, new MODEL());

        this.populate(model.children);
    }

    construct() {
        if (user === 'Guest') {
            this.btnLogin = this.navBar.header.tabs.addNavItem( //this.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'icon': ICONS.USER,
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = this.login.bind(this);
        }
    }

    /**
        Add items to Options Dropdown Tab
     */
    addNavOptions() {
        if (this.navBar.header.menu) {

            /**
                A NavItem that toggles the visibility of the Sidebar
            */
            this.btnSidebar = this.navBar.header.tabs.addNavItem(
                new MODEL('pull-left').set({
                    'anchor': new MODEL().set({
                        'label': '',
                        'url': '#',
                        'icon': ICONS.SIDEBAR
                    })
                })
            );            
            this.btnSidebar.el.onclick = this.toggleSidebar.bind(this); 
            $(this.btnSidebar.el).insertBefore(this.navBar.header.tab.el);

            // Hide Sidebar when container body is focused
            this.body.el.onclick = this.focusBody.bind(this);

            // Add USER options
            let userMenu = this.navBar.header.menu.addMenu(
                new MODEL(new ATTRIBUTES('horizontal collapse')).set({
                    'name': 'USER',
                    'showHeader': 1,
                    'collapsed': 1
                })
            );
            userMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': 'Log Out',
                        'url': '#?url=logout'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.logout();
            }.bind(this);

            userMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.OPTIONS,
                        'label': 'Manage',
                        'url': 'Manage/Index'
                    })
                })
            );

            let domMenu = this.navBar.header.menu.getGroup('DOM');
            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.HOME,
                        'label': 'Home'
                    })
                })
            ).el.onclick = function () {
                console.log(100, 'Returning Home...');
                setTimeout(function () {
                    location.href = this.url.origin;
                }.bind(this), 1000);
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.TOGGLE,
                        'label': 'Headers'
                    })
                })
            ).el.onclick = function () {
                this.toggleHeaders();
                this.navBar.header.toggleCollapse();
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.CONSOLE,
                        'label': 'Console'
                    })
                })
            ).el.onclick = function () {
                console.log('Showing Console');
                this.loader.show();
                this.loader.showConsole();
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.REFRESH,
                        'label': 'Reload'
                    })
                })
            ).el.onclick = function () {
                console.log(100, 'Reloading');
                setTimeout(function () {
                    location.reload(true);
                }.bind(this), 1000);
                }.bind(this);

            let crudMenu = this.navBar.header.menu.getGroup('CRUD');
            crudMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.MAIN,
                        'label': 'New'
                    })
                })
            ).el.onclick = this.newMain.bind(this);
        }
    }

    /**
        Requests a new {@link MAIN} from the server and 
        redirects to that page

        @todo This should be a POST to avoid CSRF
    */
    newMain() {
        $.getJSON('/MAIN/Get/0', function (payload) {
            console.log('Created MAIN', payload);
            setTimeout(function () {
                location.href = '/' + payload.model.id;
            }.bind(this), 1000);
        });

        
    }

    /**
        Sets the focus on the Main container body.  
        This generally is used to hide elements such 
        as a Sidebar, Modal or an EDIT pane
     */
    focusBody() {
        if ($(this.sidebar.el).hasClass('active')) {
            this.sidebar.removeClass('active');
        }
        $(this.navBar.header.menu.el).collapse('hide');
    }  

    /**
        Loads the specified app id into the Main Container
        @param {number} id App Id to load
    */
    load(id = 1) {
        let returnUrl = this.url.searchParams.get('ReturnUrl');
        if (returnUrl) {
            returnUrl = this.url.origin + returnUrl;
            location.href = returnUrl;
        }

        // TODO: Prompt the user for an Id to load
        // Eventually create a simple application browser
        // Retrieve Main
        $.getJSON('Main/Get/' + id, this.loadAjaxCall.bind(this));
    }

    /**
        The ajax call performed when MAIN.load is called
        Receives the MAIN model from Main/Get/id (if permitted)
        Then, sets the document title, application id and label
        and Populates accordingly
        @param {any} data The ajax payload
    */
    loadAjaxCall(data) {
        if (data.result === 1) {
            try {
                if (data.model.label) {
                    document.title = data.model.label;
                }
                this.body.pane.empty();
                this.setId(id);
                this.setLabel(data.model.label);
                this.populate(data.model.children);
            } catch (e) {
                this.loader.log(0, 'Unable to construct ' + this.className + '(' + id + ')');
                console.log(e);
            }
        } else {
            this.loader.log(0, 'Failed to retrieve ' + this.className + '(' + id +
                ') from server\n' + data.message
            );
            this.loader.showConsole();
        }
    }

    /**
        Toggles the active state of the sidebar
     */
    toggleSidebar() {
        this.sidebar.toggle('active');
    }

    /**
        Made obsolete by EL.merge()
     * @param {any} payload Data returned by server
     */
    updateModel(payload) {
        this.setLabel(payload.label);
        this.setSubSections(payload.subsections);
    }

    /**
        Allows the user to open an ARTICLE in this APP.
        @param {number} id Article id
    */
    open(id = 0) {
        console.log('TODO: APP.open(' + id + ')');
    }

    /**
        Returns the APP Id
        @returns {number} App Id
    */
    getId() {
        return this.id;
    }

    /**
        Launches the External Authentication Process
        The user will be redirected to a third party authenticator
    */
    loginExternal() {
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
        this.externalLogin = CONTAINERFACTORY.createEmptyForm(this.prompt.container.body.pane);
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
        btnOAuth.el.onclick = function () {

            console.log(50, 'Launching OAuth2 Authenticator...');
            
            //let url = new URL(window.location.href);
            let returnUrl = this.url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);
            

            let postUrl = '/Account/ExternalLogin/externalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl);

            location.href = postUrl;
        }.bind(this);

        this.prompt.show();
    }

    /**
        Log into the application using the given credentials
        @param {string} email Username / Email 
        @param {string} password Account Password
    */
    login(email, password) {
        console.log('Log In');
        // TODO Handle supplied arguments... Or don't... Not sure yet.

        this.prompt = new PROMPT('Log In', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Login');
        this.prompt.form.el.setAttribute('class', 'login');
        this.prompt.form.el.setAttribute('method', 'POST');
        this.prompt.form.el.setAttribute('action', '#');
        
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': INPUTTYPES.INPUT,
                    'type': 'Email',
                    'name': 'Email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );
        
        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': INPUTTYPES.PASSWORD,
                    'type': 'Password',
                    'name': 'Password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        //this.prompt.form.footer.buttonGroup.children[0].el.style.display = 'none';
        /**
            Post the Login FormPost
            If login successful, load the new User Session (Refresh Page)

        */
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            console.log(25, 'Logging In', true);
            $.post(
                '/Account/LogIn',
                $(this.prompt.form.el).serialize(),
                this.ajaxRefreshIfSuccessful
            );
        }.bind(this);

        this.prompt.form.footer.buttonGroup.addButton('Register').el.onclick = this.register;


        // Create a new form to submit 3rd party logins
        this.externalLogin = CONTAINERFACTORY.createEmptyForm(this.prompt.container.body.pane);
        this.externalLogin.el.setAttribute('method', 'post');
        this.externalLogin.el.setAttribute('action', '/Account/ExternalLogin');
        this.externalLogin.footer.buttonGroup.children[0].el.style.display = 'none';
        this.provider = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));

        this.returnUrl = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'returnUrl'
        })));
        let btnOAuth = this.externalLogin.footer.buttonGroup.addButton('OAuth');
        btnOAuth.el.onclick = function () {

            console.log(50, 'Launching OAuth2 Authenticator...');

            /*
            let returnUrl = this.url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);
            

            let postUrl = '/Account/ExternalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl); 
            */

            location.href = '/Account/ExternalLogin';
            /****            
            <form action="/Account/ExternalLogin?ReturnUrl=%2F" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="NUl4K_C0ubvHbrEeyfF19jddMf9-BZ-MTIuA33kSxdhMJoh5TEvV53sbv61vtRCp_vbWI2DQzFENnljDRpx2srlaBpQZQRsWZoKkLwSjTek1">                <div id="socialLoginList">
                <p>
                    <button type="submit" 
                        class="btn btn-default" id="Google" 
                        name="provider" value="Google" 
                        title="Log in using your Google account"
                    >Google</button>
                </p>
                </div>
            </form>
            ****/
        }.bind(this);

        this.prompt.show();

        /*
            TODO:
            Create INPUT CHECKBOX called 'RememberMe'
            Create BUTTON to launch 'Register as new User'
            Create AHREF to 'ForgotPassword'
        */
    }

    /**
        Logs the current user out
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
    */
    register() {
        console.log('Register');

        this.prompt = new PROMPT('Register', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Register');
        this.prompt.form.el.setAttribute('class', 'register');
        //this.prompt.form.el.setAttribute('method', 'POST');
        //this.prompt.form.el.setAttribute('action', 'Account/Register');
        this.prompt.form.postUrl = "Account/Register";

        //this.email = new INPUT(this.prompt.formElementGroup.body.pane,
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': INPUTTYPES.INPUT,
                    'type': 'Email',
                    'name': 'email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );

        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': INPUTTYPES.PASSWORD,
                    'type': 'Password',
                    'name': 'password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        this.passwordConfirm = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': INPUTTYPES.PASSWORD,
                    'type': 'Password',
                    'name': 'PasswordConfirm'
                })
            ).set({
                'label': 'Confirm Password',
                'showHeader': 0
            })
        );
        this.prompt.form.afterSuccessfulPost = function (payload) {
            this.prompt.form.ajaxRefreshIfSuccessful(payload, 'success');
            this.prompt.hide();            
        }.bind(this);
        

        this.prompt.show();
    }
    
    /**
        Log into the application using the given credentials
        @param {string} email Username / Email 
    */
    registerExternal(email) {
        console.log('Register External Login');

        this.prompt = new PROMPT('Associate your OAuth2 Id', '', [], [], true);
        this.prompt.form.destroy();

        let tmp = new EL(this.prompt.container.body.pane, 'DIV', new MODEL());
        $(document.getElementById('externalLoginConfirmation')).insertBefore(tmp.el);
        tmp.destroy();

        this.prompt.show();
    }
}