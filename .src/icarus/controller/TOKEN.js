/**
    @module
*/
import EL, { ATTRIBUTES, MODEL } from '../model/el/EL.js';
import TokenError from '../error/TokenError.js';
/**
    A Token to prevent Cross Site Request Forgery (CSRF)
    @class
    @extends EL
    @see csrf https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
*/
export default class TOKEN extends EL {
/**
    Constructs an INPUT element that represents the Anti Forgery Token
    @param {EL} node The parent object
 */
constructor(node) {
super(node, 'INPUT', new MODEL(new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', TOKEN.getToken().value)));
}
/**
	    Generates a Request Verification Token element if 
	    one exists in the DOM. (Usually a hidden input)
        The token value is appended to the current document's metatags
	    @returns {HTMLElement} An input element
	*/
static getToken() {
try {
let token = document.getElementsByName('__RequestVerificationToken');
console.log('Token.value', token);
document.getElementsByTagName('meta').token.content = token[0].value;
return token;
} catch (e) {
throw new TokenError('Unable to retrieve or set the token', e.message);
}
}
/**
	    Remove the Request Verification Token HTML Input from the DOM
        @returns {boolean} Returns true if the token was removed
        @throws Throw an error if token input element cannot be removed from the DOM
	*/
static removeTokenFromDom() {
let token = this.getToken();
try {
token.parentNode.removeChild(token);
return true;
} catch (e) {
console.warn('Failed to remove TOKEN from BODY');
throw e;
}
}
}