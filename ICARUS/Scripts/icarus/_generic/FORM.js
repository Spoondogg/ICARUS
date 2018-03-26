/**
    Generic Form Constructor
*/
class FORM extends EL {
    /**
        Constructs a generic form.
        @param {EL} node The parent
        @param {number} id Form Unique Id
        @param {string} name Form's name
        @param {string} method The form's method ie: POST, GET, PUT
        @param {string} action The form's action or url
     */
    constructor(node, id, name, method, action) {
        super(node, 'FORM', new MODEL(new ATTRIBUTES({
            'id': id, // Is this really necessary?
            'name': name,
            'method': method,
            'action': action
        }))); 
    }

    /**
        Sets the METHOD for this FORM
        @param {string} method Form METHOD
     */
    setMethod(method) {
        this.el.setAttribute('method', method);
    }

    /**
        Sets the METHOD for this FORM
        @param {string} action Form ACTION
     */
    setAction(action) {
        this.el.setAttribute('action', action);
    }
}