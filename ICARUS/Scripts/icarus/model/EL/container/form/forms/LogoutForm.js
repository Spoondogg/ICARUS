﻿class LogoutForm extends FORM {
    /**
        Constructs an Icarus Logout Form
        @param {APP} node APP element to contain logout form
     */
    constructor(node) {
        // EVERY SINGLE APP requires a LOGOUT form, although it may be possible to
        // create the form on demand rather than clogging up the DOM
        super(node, new MODEL(
            new ATTRIBUTES({
                'id': 'logoutForm',
                'name': 'logoutForm', 
                'method': 'POST',
                'action': '/Account/LogOff',
                'style': 'display:none;'
            })
        ).set({
            'id': 'logoutForm',
            'label': 'Logout Form'            
        }));
        
        //this.el.style.display = 'none;';
        //this.antiForgeryToken = new TokenInput(this);
    }
}