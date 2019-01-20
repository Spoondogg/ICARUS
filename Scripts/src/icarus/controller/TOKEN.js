/** @module */
import EL, {
	ATTRIBUTES,
	MODEL
} from '../model/el/EL.js';
import TokenError from '../error/TokenError.js';
/** A Token to prevent Cross Site Request Forgery (CSRF)
    @class
    @extends EL
    @see csrf https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
*/
export default class TOKEN extends EL {
	/** Constructs an INPUT element that represents the Anti Forgery Token
	    @param {EL} node The parent object
	 */
	constructor(node) {
		super(node, 'INPUT', new MODEL(new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', TOKEN.setToken().value)));
	}
	/** Generates a Request Verification Token element if 
		one exists in the DOM. (Usually a hidden input)
	    The token value is appended to the current document's metatags
        and the original element is removed from the DOM
        @see https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/ 
		@returns {HTMLElement} An input element
	*/
	static setToken() {
		try {
			let [token] = document.getElementsByName('__RequestVerificationToken');
			token.parentNode.removeChild(token);
			document.getElementsByTagName('meta').token.content = token.value;
			return token;
		} catch (e) {
			throw new TokenError('Unable to retrieve or set the token', e.message);
		}
	}
}