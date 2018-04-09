/**
    A token provided by the client side to authenticate form POST    
*/
class TokenInput extends EL {
    /**
        Constructs an INPUT element that represents the Anti Forgery Token
        @param {EL} node The parent object
     */
    constructor(node) {
        console.log('Constructing Token Input');
        super(node,
            'INPUT',
            new MODEL(
                new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', token.value)
            )
        );
        console.log('Token: ' + token.value);
        console.log(this);
    }
}