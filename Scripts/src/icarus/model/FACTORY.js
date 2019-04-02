/** @module */
import SPAN, { ATTRIBUTES, EL, MODEL } from '../model/el/span/SPAN.js';
/** Abstract Factory that constructs Element Classes
    @description Each child must be imported individually to avoid cyclic redundancy of dependencies
    @class
*/
export default class FACTORY {
	super() {
		this.type = '';
	}
	toString() {
		return this.type + 'FACTORY';
	}
	authenticationException(node) {
		try {
			console.log(this.toString() + ' An Authentication Exception occurred');
			node.getContainer().getMain().login();
		} catch (e) {
			console.warn(this.toString() + ' Unable to launch login', e);
		}
	}
	/** Injects dependencies into the given Element/Class
	    @description This is done to avoid cyclic redundancy on imports (ie: FORM inside CONTAINER)
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {SPAN} span Parent Node temporary element
	    @param {number} index Slot reserved in children array
	    @param {EL} element Element/Class
	    @returns {void}
	*/
	injectDependencies(node, span, index, element) {
		try {
			// Inject Dependencies
		} catch (e) {
			span.destroy();
			node.children.splice(index, 1);
			console.warn(this.toString() + '.injectDependencies()', element.toString(), e);
		}
	}
	/* eslint-disable max-lines-per-function, complexity, max-statements */
	/** Retrieves MODEL (in the form of a PAYLOAD) from the database and returns its constructed class
	    A placeholder object is created to ensure that values are loaded
	    in the appropriate order, regardless of any delays from getJson()
	    @param {EL} node Parent node (Generally append to node.body.pane)
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
	    @returns {CONTAINER} A newly constructed container
	*/
	get(node, className, id = 0) {
		let span = new SPAN(node, new MODEL());
		let index = node.children.push(span); // Reserve the slot in the array        
		return $.getJSON('/' + className + '/GET/' + id, (payload) => {
			if (payload.className === 'ERROR') {
				if (payload.exception === 'AuthenticationException') {
					this.authenticationException(node);
				} else {
					console.warn(this.toString() + ' An Error Occurred', className + '/GET/' + id, payload);
				}
			} else {
				/** @type {EL} */
				let element = this.build(span, node, className, id, payload);
				node.children[index] = element;
				this.injectDependencies(node, span, index, element);
				span.el.parentNode.replaceChild(element.el, span.el);
				return node.children[index];
			}
		}).then(() => {
			if (id === 0) {
				console.log('SAVE', node);
				node.getContainer().save(true);
			}
		});
	}
	/** Builds the Class
        @param {SPAN} span Parent Node temporary element
	    @param {string} className Container Constructor Name
	    @param {number} id Container UId
        @param {any} payload JSON Payload
        @returns {EL} Newly contructed Class
    */
	build(span, className, id, payload) {
		/** @type {EL} */
		let element = null;
		switch (className) {
			case 'EL':
				element = new EL(span, payload.model.element, payload.model);
				break;
			default:
				throw Error('No constructor exists for {' + className + '}');
		}
		return element;
	}
	/* eslint-enable max-lines-per-function, complexity, max-statements */
}
export { ATTRIBUTES, EL, MODEL, SPAN }
/* eslint-enable */