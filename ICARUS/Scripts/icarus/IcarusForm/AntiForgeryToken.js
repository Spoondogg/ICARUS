/**
    A token provided by the client side to authenticate form POST    
*/
class AntiForgeryTokenInput extends EL {
    /**
        Constructs an INPUT element that represents the Anti Forgery Token
        @param {EL} node The parent object
        @param {string} antiForgeryToken The token provided by the server
     */
    constructor(node, antiForgeryToken) {
        console.log('Constructing AntiForgeryToken Input');
        super(node,
            'INPUT',
            new MODEL(new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', antiForgeryToken)
        ));
        console.log('AntiForgeryToken: ' + antiForgeryToken);
        console.log(this);
    }
}