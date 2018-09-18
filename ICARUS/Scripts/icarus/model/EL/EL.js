/**
    @module
*/
import MODEL, { ATTRIBUTES } from '../MODEL.js';
import { STATUS } from '../../enums/STATUS.js';
import RecursionLimitError from '../../error/RecursionLimitError.js';
export { MODEL, ATTRIBUTES };
/**
    Generic Element Constructor  
    @description An abstract html element class
    @class
    @extends MODEL
*/
export default class EL extends MODEL {
	/**
	    Constructs a generic html element
	    @param {EL} node The object to contain this element
	    @param {string} element The HTML tag that is used for this element
	    @param {MODEL} model A set of key/value pairs for this element's model
	    @param {string} innerHTML This text will be displayed within the HTML element
	    @param {array} children An object array of child models
	*/
	constructor(node, element = 'DIV', model, innerHTML, children) {
		super(model.attributes);
		this.container = this.setContainer();
		this.node = node; // The parent EL (or Body) that this ELEMENT is within        
		this.className = this.constructor.name;
		this.element = element || HtmlElement.DEFAULT; // Html Element that this EL represents
		this.status = STATUS.DEFAULT; // Element state changes depend on this.status 
		this.children = children ? children : []; // Contains an array of child element models
		this.callbacks = {}; // Contains a series of Constructor functions that this element can use
		this.make(node, model, innerHTML);
		//this.merge(model);
		//this.setInnerHTML(innerHTML);
	}
	/**
	    Create the HTML element in the DOM, appended to the given node
	    @description Append the element to its parent and set its inner HTML (when available)
	    @param {EL} node Parent node to append to
	    @param {MODEL} model A set of key/value pairs for this element's model
	    @param {string} innerHTML This text will be displayed within the HTML element
	    @returns {EL} This element
	 */
	make(node, model, innerHTML) {
		try {
			if (node === document.body) {
				//console.log('BODY.create(' + this.element + ')');
				this.el = node.appendChild(document.createElement(this.element));
				node = this;
			} else {
				this.el = node.el.appendChild(document.createElement(this.element));
			}
			this.merge(model);
			this.setInnerHTML(innerHTML);
		} catch (e) {
			console.log(e);
		}
		return this.el;
	}
	/**
	    Retrieve an {@link EL} based on its __proto__
	    @description Recursively iterates through parent nodes until an object with the given prototype is found
	    @param {string} value The value to search for within this key
	    @param {EL} node Entry point to traversing the chain
	    @param {number} attempt Recursion loop
	    @returns {CONTAINER} The parent container
	    @throws Will throw an error if recursion attempt exceeds limit
	*/
	getProtoTypeByClass(value, node = this.node, attempt = 0) {
		if (node === document.body) {
			return null; // You have reached the top of the chain
		} else {
			attempt++;
			try {
				//console.log('Searching for __proto__.__proto__.constructor.name: ' + value + '(' + attempt + ')', node);
				if (attempt < 100) {
					if (node.__proto__.__proto__.__proto__.constructor.name === value.toString() || node.__proto__.__proto__.constructor.name === value.toString() || node.__proto__.constructor.name === value.toString()) {
						//console.log('Found container(' + value.toString() + ')...', node);
						return node;
					} else {
						return this.getProtoTypeByClass(value, node.node, attempt++);
					}
				} else {
					throw new RecursionLimitError(this.className + '.getProtoTypeByClass(): Exceeded attempt limit. (' + attempt + ')');
				}
			} catch (e) {
				//TypeError: this.getProtoTypeByClass is not a function
				if (e.name === 'TypeError') {
					// Cannot read property '__proto__' of undefined
					//console.warn('A TypeError was caught while attempting to find proto "'+value+'"\n');
				} else {
					console.log('An unknown error occurred');
					console.log(e.name, e.message);
					throw e;
				}
			}
		}
	}
	/**
	    Retrieves the container (if exists) and sets it
	*/
	setContainer() {
		this.container = this.getProtoTypeByClass('CONTAINER');
	}
	/**
	    Sets the parent container for this Nav Header if it does not exist,
	    then returns it or null
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		try {
			if (this.container === undefined) { // || this.container === null
				this.container = this.getProtoTypeByClass('CONTAINER');
				return this.container;
			} else {
				return this.container;
			}
		} catch (e) {
			console.log(e);
			throw {
				name: 'MissingContainerError',
				message: this.className + ' is unable to find a parent Container'
			};
		}
	}
	/**
	    Returns the MAIN container
	    @returns {CONTAINER} This EL's parent container
	*/
	getMainContainer() {
		if (this.container !== undefined) {
			try {
				return this.container.getMainContainer();
			} catch (e) {
				console.warn('EL{' + this.className + '} Unable to retrieve Container', e);
				//throw e;
			}
		}
		/*if (this.getContainer() !== null) {
		    return this.getContainer().getMainContainer();
		} else {
		    console.log(this.className + ' does not have a parent Container');
		    return null;
		}*/
	}
	/**
	 * Creates a textarea input and populates with this element's contents
	 */
	edit() {
		try {
			//console.log(this.className + '.edit()', this);
			let footer = this.getMainContainer().stickyFooter;
			this.addClass('edit');
			this.status = STATUS.LOCKED;
			this.editor = new EL(footer, 'TEXTAREA', new MODEL(new ATTRIBUTES({
				'value': this.el.innerHTML
			})), this.el.innerHTML);
			this.editor.el.onkeyup = function() {
				this.el.innerHTML = this.editor.el.value;
			}.bind(this);
			this.editor.el.onblur = function() {
				try {
					this.getContainer().data[this.className.toLowerCase()] = this.editor.el.value;
					this.editor.destroy();
					this.removeClass('edit');
					if (this.getContainer().quickSave(true)) {
						this.getMainContainer().stickyFooter.hide();
					}
				} catch (e) {
					throw e;
				}
			}.bind(this);
			this.editor.el.focus();
			footer.show();
			event.stopPropagation();
		} catch (ee) {
			console.log(ee);
		}
	}
	/**
	    Acts like a switch statement, performing actions from the given list of callbacks.
	    This is used because constructor functions persist across the inheritance chain,
	    whereas an actual SWITCH statement would be overridden on each inheritted class.
	    @see https://stackoverflow.com/a/35769291/722785
    
	    @param {MODEL} model The object model for the element to be created
	    @returns {EL} Constructed Element
	 */
	create(model) {
		let result = null;
		try {
			this.callbacks[model.className].forEach(function(fn) {
				result = fn(model);
			}.bind(this));
		} catch (e) {
			console.log(0, this.className + '.create(): No constructor exists ' + 'for className "' + model.className + '"');
			console.log(e);
			return false;
		}
		return result;
	}
	/**
	    Add a case to the creator EL.create();
	    @param {string} className The Icarus Class name that this callback is meant to construct
	    @param {Function} fn Function to call (should accept model)
	*/
	addCase(className, fn) {
		this.callbacks[className] = [];
		this.callbacks[className].push(fn);
	}
	/**
	    Combines the given model with this model, overriding initial values
	    with given ones
	    @param {MODEL} model A generic MODEL object
	 */
	merge(model) {
		if (typeof model === 'object') {
			for (let prop in model) {
				if (prop !== 'attributes') {
					/*
					if (this.hasOwnProperty(prop)) {
					    console.log('Property "' + prop + '" already exists as ' + this[prop].value);
					}
					console.log('Setting ' + this.element + '[' + prop + '] to ' + model[prop]);
					*/
					this[prop] = model[prop];
				} else {
					for (let attr in model.attributes) {
						if (attr !== 'innerHTML') {
							this.el.setAttribute(attr, model.attributes[attr]);
						} else if (attr === 'innerHTML') {
							this.el.innerHTML = model.attributes[attr];
						}
					}
				}
			}
		} else {
			console.log('EL.merge(): Given model is not a valid object');
		}
	}
	/**
	    Opens the ELEMENT up for editing.  This should create a link
	    between the object on the server and its client side representation
	    @returns {EL} This EL
	*/
	open() {
		this.status = STATUS.OPEN;
		//this.el.setAttribute('data-status', 'open');
		try {
			this.node.open();
		} catch (e) {
			console.log('Unable to open parent element(' + this.element + ')', e);
		}
		return this;
	}
	/**
	    Closes the EL up for editing.  <br>This should create a link
	    between the object on the server and its client side representation
	    and update accordingly
	    @returns {EL} This EL
	*/
	close() {
		this.status = STATUS.CLOSED;
		//this.el.setAttribute('data-status', 'closed');
		return this;
	}
	/**
	    Empties contents of node element
	    @returns {EL} This EL
	*/
	empty() {
		while (this.el.firstChild) {
			this.el.removeChild(this.el.firstChild);
		}
		return this;
	}
	/**
	    Removes this element from the DOM
	    @param {number} delay Millisecond delay
	    @returns {EL} This EL
	*/
	destroy(delay = 300) {
		try {
			setTimeout(function() {
				this.el.parentNode.removeChild(this.el);
			}.bind(this), delay);
			try {
				let i = this.node.children.indexOf(this);
				this.node.children.splice(i, 1);
			} catch (ee) {
				console.log('Unable to remove ' + this.element + ' from node.children');
			}
		} catch (e) {
			console.log('Unable to destroy this ' + this.element, e);
		}
		return this;
	}
	/**
	    Override this element's class with the given value
	    @param {string} className A class
	    @returns {EL} Returns this element for chaining purposes
	 */
	setClass(className) {
		this.el.className = className;
		this.attributes.class = className;
		return this;
	}
	/**
	    Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
	    @returns {EL} Returns this element for chaining purposes
	*/
	addClass(className) {
		$(this.el).addClass(className);
		let prevClass = this.attributes.class || '';
		this.attributes['class'] = prevClass += ' ' + className;
		return this;
	}
	/**
	    Revoves the given class name from the element's list of classes
	    @param {string} className the class to be removed
	    @returns {EL} Returns this element for chaining purposes
	*/
	removeClass(className) {
		$(this.el).removeClass(className);
		this.attributes.set('class', this.attributes.get('class').replace(className, ''));
		return this;
	}
	/**
	    Shows this Element
	    @returns {EL} This EL
	*/
	show() {
		this.el.style.display = 'block';
		return this;
	}
	/**
	    Hides this Element
	    @returns {EL} This EL
	*/
	hide() {
		this.el.style.display = 'none';
		return this;
	}
	/**
	    Adds 'active' to this element's classes
	    @returns {EL} This EL
	 */
	activate() {
		$(this.el).addClass('active');
		return this;
	}
	/**
	    Removes 'active' from this element's classes
	    @returns {EL} This EL
	 */
	deactivate() {
		$(this.el).removeClass('active');
		return this;
	}
	/**
	    Toggles the 'active' class on this element
	    @param {string} className Optionally toggle this class
	    @returns {EL} This EL
	*/
	toggle(className) {
		if (className) {
			$(this.el).toggleClass(className); // || 'active'
		} else {
			$(this.el).toggle();
		}
		return this;
	}
	/**
	    Create all children elements in the order that
	    they were pushed into provided array
	    @param {array} children Array of children object models to be constructed
	    @returns {EL} This EL
	*/
	populate(children) {
		if (children) {
			let denom = children.length;
			let progress = 0; // 0 to 100            
			//console.log(this.className + '.populate(' + children.length + ');');
			try {
				for (let c = 0; c < children.length; c++) {
					progress = Math.round((c + 1) / denom * 100);
					//console.log(progress, this.className+'.populate('+(c+1)+'/'+denom+')');
					this.create(children[c]);
				}
			} catch (e) {
				console.log(e);
			}
		}
		return this;
	}
	/**
	    Sets the inner HTML of this element
	    @param {string} innerHTML Html string to be parsed into HTML
	    @returns {EL} This EL
	*/
	setInnerHTML(innerHTML = '') {
		this.el.innerHTML = innerHTML;
		return this;
	}
	/**
	    Scrolls page to the top of this element
	    @param {number} speed Millisecond duration
	    @returns {EL} This EL
	*/
	scrollTo(speed = 1000) {
		console.log('Scrolling to this element at ' + parseInt($(this.el).offset().top));
		$(this.node.el).animate({
			scrollTop: parseInt($(this.el).offset().top)
		}, speed);
		return this;
	}
}