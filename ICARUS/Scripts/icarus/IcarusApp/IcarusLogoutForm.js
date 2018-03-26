class IcarusLogoutForm extends FORM {

    /**
        Constructs an Icarus Logout Form
        @param {APP} node APP element to contain logout form
        @param {string} antiForgeryToken Token
     */
    constructor(node, antiForgeryToken) {
        // EVERY SINGLE APP requires a LOGOUT form, although it may be possible to
        // create the form on demand rather than clogging up the DOM
        super(node, 'logoutForm', 'POST', '/Account/LogOff');
        this.el.style.display = 'none;';
        this.antiForgeryToken = new AntiForgeryTokenInput(this, antiForgeryToken);
    }
}

