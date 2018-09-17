/**
    @module
*/
import EL, { MODEL, ATTRIBUTES } from '../../../EL.js';
/**
    A token provided by the client side to authenticate form POST    
    @class
    @extends EL
*/
export default class TOKEN extends EL {
    /**
        Constructs an INPUT element that represents the Anti Forgery Token
        @param {EL} node The parent object
     */
    constructor(node) {
        super(node,
            'INPUT',
            new MODEL(
                new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', TOKEN.getToken().value)
            )
        );
    }
    /**
        Generates a Request Verification Token element if 
        one exists in the DOM.
        @returns {HTMLElement} An input element
    */
    static getToken() {
        let token = null;
        try {
            token = document.getElementsByName('__RequestVerificationToken')[0];
            document.getElementsByTagName('meta')["token"].content = token.value;
        } catch (e) {
            console.log('Unable to retrieve token.');
            console.log(e);
            return token;
        }
        return token;
    }

    /**
        Remove the Request Verification Token HTML Input from
        the DOM
    */
    static removeTokenFromDom() {
        let token = getToken();
        try {
            token.parentNode.removeChild(token);
        } catch (e) {
            console.log('Failed to remove TOKEN from BODY');
            console.log(e);
        }
    }
}