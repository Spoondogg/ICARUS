/** @module */
import MODEL, { ATTRIBUTES } from '../MODEL.js';
//import { HtmlElement } from '../../enums/HtmlElement.js';
import MissingContainerError from '../../error/MissingContainerError.js';
import RecursionLimitError from '../../error/RecursionLimitError.js';
import {
	STATUS
} from '../../enums/STATUS.js';
/** A Generic HTML Element Class
    @class
    @extends MODEL
*/
export default class EL extends MODEL {
	/** Constructs a generic html element
	    @param {EL} node Parent Element Class
	    @param {string} element HTML Element Tag
	    @param {MODEL} model Model
	    @param {string} innerHTML HTML Element Inner HTML
	    @param {Array<MODEL>} children Array of child nodes
	*/
	constructor(node, element = 'DIV', model = new MODEL(), innerHTML, children = []) {
		//console.log(typeof model, element, node);
		super(model.attributes);
		this.setContainer();
		this.node = node;
		this.className = this.constructor.name;
		this.element = element;
		this.status = STATUS.DEFAULT; // Element state changes depend on this.status 
		this.transition = null; // Transition type: ie: collapse, accordion, fade etc @todo Transition Event
		/** An array of MODELS that are children of this EL
		    @property {Array<MODEL>} children 
		*/
		this.children = children;
        /** A Collection of callback methods that accept a MODEL
            ie: this.callbacks[foo]
        */
        this.callbacks = {};

        /** A collection of public Methods
		    @property {Object.<Function>} methods
		*/
        this.methods = {};
		/** A collection of public Events
		    @property {Object.<Event>} events
		*/
        this.events = {};
		/** A collection of public Event handlers
		    @property {Object.<Function>} handlers
		*/
        this.handlers = {};
		//console.log('Creating element', this.element);
		this.el = document.createElement(this.element);
		this.make(this.el, node, model, innerHTML);
	}
	/** Append the HTML element to the appropriate node and apply the given model and optional innerHTML
        @param {HTMLElement} el The HTML Element
	    @param {EL} node Parent node to append to
	    @param {MODEL} model A set of key/value pairs for this element's model
	    @param {string} innerHTML This text will be displayed within the HTML element
	    @returns {Promise<HTMLElement>} This element
	*/
	make(el, node, model, innerHTML) {
		try {
			if (node === document.body) {
				//this.el = node.appendChild(document.createElement(this.element));
				node.appendChild(el);
			} else {
				node.el.appendChild(el);
			}
			this.merge(model);
			this.setInnerHTML(innerHTML);
			return el;
		} catch (e) {
			console.warn('Unable to make ' + this.element);
			throw e;
		}
	}
	/** Add a function to the list of callbacks for to the creator EL.create();
	    @param {string} className The Icarus Class name that this callback is meant to construct
	    @param {Function} fn Function to call (should accept model)
	    @returns {void}
	*/
	addCallback(className, fn) {
		/*try {
            this.callbacks[className].push(fn);
        } catch (e) {
            this.callbacks[className] = [fn];
            //this.callbacks[className].push(fn);
        }*/
		this.callbacks[className] = [];
		this.callbacks[className].push(fn);
	}
	/** Adds given child element to this element's children
	    @param {EL} model Model
	    @returns {EL} Child Element
	*/
	addChild(model) {
		this.children.push(model);
		return this.children[this.children.length - 1];
	}
	/** Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
	    @returns {Promise<ThisType>} Returns this element for chaining purposes
	*/
	addClass(className) {
		return this.callback(() => {
			if (className === 'undefined') {
				console.log('ClassName Undefined');
			} else {
				$(this.el).addClass(className);
				this.attributes.class = this.getClass() + ' ' + className;
			}
		});
	}
	/** Promises to add an array of classnames to this element
	    @param {Array<string>} classNames An array of class names
	    @returns {Promise<ThisType>} callback
	*/
	addClasses(classNames) {
		Promise.all(classNames.map((c) => this.addClass(c))).then(() => this);
	}
	/** Inserts @see {this.el} as the first child of target
	    @param {HTMLElement} target Target HTML Element
	    @returns {ThisType} callback
	*/
	append(target) {
		return this.callback(() => target.insertBefore(this.el, target.firstChild));
	}
	/** Creates a textarea input and populates with this element's contents
        @todo Consider aligning with CONTAINER.editData() / JUMBOTRON.editData()
	    @returns {void}
	*/
	edit() {
		console.log('EL.edit()');
		try {
			let footer = this.getMain().stickyFooter;
			this.addClass('edit');
			this.status = STATUS.LOCKED;
			this.editor = new EL(footer, 'TEXTAREA', new MODEL(new ATTRIBUTES({
				'value': this.el.innerHTML
			})), this.el.innerHTML);
			this.editor.el.onkeyup = () => this.setInnerHTML(this.editor.el.value);
			this.editor.el.onblur = () => {
				try {
					let container = this.getContainer();
					container.data[this.className.toLowerCase()] = this.editor.el.value;
					this.editor.destroy();
					this.removeClass('edit');
					if (container.quickSave(container, true)) {
						this.getMain().stickyFooter.hide();
					}
				} catch (e) {
					throw e;
				}
			}
			this.editor.el.focus();
			footer.show();
			event.stopPropagation();
		} catch (ee) {
			console.log(ee);
		}
	}
	/** Calls the edit method for this.el on double click
	    @todo Consider applying this method from the caller
	    @returns {void}
	*/
	enableEdit() {
		try {
			if (this.getMain().getDev()) {
				this.el.ondblclick = this.edit.bind(this);
			}
		} catch (e) {
			console.log('EL{' + this.className + '}.getMain() error', this);
		}
	}
	/** Retrieve an {@link EL} based on its __proto__
        @description Recursively iterates through parent nodes until an object with the given prototype is found
        @param {string} value The value to search for within this key
        @param {EL} node Entry point to traversing the chain
        @param {number} attempt Recursion loop
        @returns {CONTAINER} The parent container
        @todo There needs to be some sort of recursion for getPrototypeOf(node)
        @todo Check if this can be swapped out for isPrototypeOf()
        @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf
        @throws Will throw an error if recursion attempt exceeds limit
    */
	getProtoTypeByClass(value, node = this.node, attempt = 0) {
		if (node === document.body) {
			return null; //this.getMain(); // null You have reached the top of the chain
		}
		let depth = attempt + 1;
		try {
			if (depth < 100) {
				if (Reflect.getPrototypeOf(
						Reflect.getPrototypeOf(
							Reflect.getPrototypeOf(node)))
					.constructor.name === value.toString() || Reflect.getPrototypeOf(Reflect.getPrototypeOf(node)).constructor.name === value.toString() || Reflect.getPrototypeOf(node).constructor.name === value.toString()) {
					return node;
				}
				return this.getProtoTypeByClass(value, node.node, depth);
			}
			throw new RecursionLimitError(this.className + '.getProtoTypeByClass(): Exceeded attempt limit. (Attempt ' + attempt + ')');
		} catch (e) {
			//TypeError: this.getProtoTypeByClass is not a function
			if (e instanceof TypeError) {
				// Cannot read property '__proto__' of undefined
				/** 
				    Show warning if enabled
				    @todo There should be a global for this 
				
				if (1 === 0) {
					console.warn('A TypeError was caught while attempting to find proto "' + value + '"\n');
				}*/
			} else {
				console.log('An unknown error occurred');
				throw e;
			}
		}
	}
	/** Get child element by Name and optionally by Class
	    @param {string} name Element Name
        @param {strong} className Element Class
	    @returns {Array<EL>} Child Item/Element Filtered Results
	*/
    get(name = null, className = null) {
        let results = this.children.filter((c) => (c.name === name || name === null) && (c.className === className || className === null));
        if (results.length === 0) {
            console.warn(this.className + '.get(' + name + ', ' + className + ') returned 0 results');
        } /*else {
            console.info(this.className + '.get(' + name + ', ' + className + ') results', results);
        }*/
		return results;
		//return this.children.filter((c) => c.el.name === name);
	}
	/** Retrieves MODEL.ATTRIBUTES.class 
	    @returns {string} Class Name
	*/
	getClass() {
		return this.attributes.class || '';
	}
	/** Sets and returns the parent container for this element
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		try {
			if (typeof this.container === 'undefined') {
				this.container = this.getProtoTypeByClass('CONTAINER');
				return this.container;
			}
			return this.container;
		} catch (e) {
			console.warn(e);
			throw new MissingContainerError(this.className + ' is unable to find a parent Container');
		}
	}
	/** Retrieve the application loader
	    @returns {LOADER} Loader
	*/
	getLoader() {
		try {
			return this.getMain().getLoader();
		} catch (e) {
			return null;
		}
	}
	/** Returns the MAIN container
	    @returns {Promise<MAIN>} MAIN class
	*/
	getMain() {
		console.log(this.className + '.getMain()');
		try {
			let main = null;
			if (typeof this.container === 'undefined') {
				main = this.getProtoTypeByClass('MAIN');
			} else {
				main = this.getContainer().getMain();
			}
			return main;
		} catch (e) {
			console.error(e);
			throw e;
		}
		/*return new Promise((resolve, reject) => {
		    try {
		        //return this.getProtoTypeByClass('MAIN');
		        if (typeof this.container === 'undefined') {
		            resolve(this.getProtoTypeByClass('MAIN'));
		        } else {
		            try {
		                resolve(this.getContainer().getMain());
		            } catch (e) {
		                console.warn('EL{' + this.className + '} Unable to retrieve MAIN Container', e);
		                reject(e);
		            }
		        }
		    } catch (ee) {
		        console.error(ee);
		        reject(ee);
		    }
		});*/
	}
	/** Retrieves the token value from the DOM Meta tags
	    @returns {string} A request verification token
	*/
	getToken() {
		return document.getElementsByTagName('meta').token.content;
	}
	/** Attempts to call the constructor of the given MODEL
        @see https://stackoverflow.com/a/35769291/722785	    
        @param {MODEL} model MODEL
        @returns {Promise<EL>} Promise to return a Constructed Element
    */
    create(model) {
		//console.log('EL.create()', model);
		return new Promise((resolve, reject) => {
			try {
				let result = this.callbacks[model.className].forEach((fn) => fn(model));
				resolve(result);
			} catch (e) {
				console.warn(0, this.className + '.create(): No constructor exists for className "' + model.className + '"', this, e);
				reject(e);
			}
		});
	}
	/** Wraps a Synchronous function inside a Promise that returns this element as a callback
	    The function is called within a try/catch block and will reject on error
	    @param {Array<Function>} fn An array of Synchronous functions in performing order
	    @param {string} msg Optional message to display on error
	    @returns {ThisType} Returns this object as a callback
	*/
	callback(fn, msg = 'Callback Error') {
		return new Promise((resolve, reject) => {
			try {
				if (Array.isArray(fn)) {
					fn.map((f, i) => {
						console.log('function call[' + i + ']', f);
						f();
					});
				} else {
					fn();
				}
				resolve(this);
			} catch (e) {
				console.warn(msg, e);
				if (e instanceof TypeError) {
					console.log('Given Array', fn);
				}
				reject(e);
			}
		});
	}
	/** Combines the given model with this model, overriding initial values with given ones
        @param {MODEL} model A generic MODEL object
        @returns {void}
    */
	merge(model) {
		if (typeof model === 'object') {
			for (let prop in model) {
				if (prop === 'attributes') {
					this.processAttributes(model.attributes);
				} else {
					this[prop] = model[prop];
				}
			}
		} else {
			console.log('EL.merge(): Given model is not a valid object');
		}
	}
	/** Iterates through attributes and sets accordingly
	    If attribute is 'innerHTML', the element's innerHTML is modified
	    @param {object} attributes A set of key/value pairs
	    @returns {void}
	 */
	processAttributes(attributes) {
		for (let attr in attributes) {
			if (attr !== 'innerHTML') {
				this.el.setAttribute(attr, attributes[attr]);
			} else if (attr === 'innerHTML') {
				this.el.innerHTML = attributes[attr];
			}
		}
	}
	/** Empties contents of node element
	    @returns {ThisType} callback
	*/
	empty() {
		return new Promise((resolve) => {
			while (this.el.firstChild) {
				this.el.removeChild(this.el.firstChild);
			}
			resolve(this);
		});
	}
	/** Removes this element from the DOM
	    @param {number} delay Millisecond delay
	    @returns {Promise} Callback on successful destroy()
	*/
	destroy(delay = 300) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					this.el.parentNode.removeChild(this.el);
					//this.node.children.splice(this.node.children.indexOf(this), 1);
					//this.node.children.shift();
					resolve();
				} catch (e) {
					if (e instanceof TypeError) {
						//console.log('Unable to destroy this ' + this.element);
						//throw ee;
						resolve();
					} else {
						reject(e);
					}
				}
			}, delay);
		});
	}
	/** Sets the given attribute to the element and its model
	     @param {string} key Attribute name
	     @param {any} value Attribute value
	     @returns {ThisType} callback
	*/
	setAttribute(key, value) {
		return this.callback(() => {
			if (typeof value !== 'undefined' && value !== null) {
				this.el.setAttribute(key, value);
			}
			try {
				this.attributes.set(key, value);
			} catch (e) {
				if (e instanceof TypeError) {
					this.attributes = new ATTRIBUTES().set(key, value);
				}
			}
		});
	}
	/** Override this element's class with the given value
        @param {string} className A class
        @returns {EL} Returns this element for chaining purposes
    */
	setClass(className) {
		this.callback(() => {
			this.el.className = className;
			this.attributes.class = className;
		});
	}
	/** Retrieves the container (if exists) and sets it
	    @returns {void}
	*/
	setContainer() {
		this.container = this.getContainer(); //this.getProtoTypeByClass('CONTAINER');
	}
	/** Removes the given class name from the element's list of classes
	    @param {string} className the class to be removed
	    @returns {Promise<ThisType>} callback
	*/
	removeClass(className) {
		/*return this.callback(() => $(this.el).removeClass(className)).then((el) => {
		    el.attributes.set('class', el.attributes.get('class').split(' ').filter((v) => v !== className));
		});*/
		return new Promise((resolve, reject) => {
			try {
				$(this.el).removeClass(className);
				//this.attributes.set('class', this.attributes.get('class').replace(className, ''));
				this.attributes.set('class', this.attributes.get('class').split(' ').filter((v) => v !== className));
				resolve(this);
			} catch (e) {
				if (e instanceof TypeError) {
					resolve(this);
				} else {
					reject(e);
				}
			}
		});
	}
	/** Binds methods of the given interface to this class
	    @param {IFACE} iface The interface to implement on this class
	    @returns {void}
	*/
	implement(iface) {
		Object.keys(iface.methods).forEach((key) => {
			this[key] = iface.methods[key];
		});
	}
	/** Returns true if class exists on this element
	    @param {string} className the class to be appended
	    @returns {boolean} True if class exists
	*/
	hasClass(className) {
		return $(this.el).hasClass(className);
	}
	/** Creates given elements as children of this element
	    @param {array} children Array of children object models to be constructed
	    @returns {Promise<ThisType>} callback
	*/
	populate(children) {
		return new Promise((resolve, reject) => {
			if (children) {
				try {
					let msg = this.className + '.populate(' + children.length + ');';
					this.getMain().loader.log(10, msg).then((loader) => Promise.all(children.map((c) => this.create(c))).then(() => loader.log(100).then(() => resolve(this))));
				} catch (e) {
					reject(e);
				}
			} else {
				resolve(this);
			}
		});
	}
	/** Sets the inner HTML of this element
	    @param {string} innerHTML Html string to be parsed into HTML
	    @returns {ThisType} This node for chaining
	*/
	setInnerHTML(innerHTML = '') {
		this.el.innerHTML = innerHTML;
		return this;
	}
	/** Scrolls page to the top of this element
	    @param {number} speed Millisecond duration
	    @returns {ThisType} callback
	*/
	scrollTo(speed = 1000) {
		console.log('Scrolling to this element at ' + parseInt($(this.el).offset().top));
		$(this.node.el).animate({
			scrollTop: parseInt($(this.el).offset().top)
		}, speed);
		return this;
	}
	/** Toggles the given class on this element
	    @param {string} className The classname to toggle on this element
	    @returns {ThisType} callback
	*/
	toggleClass(className = 'active') {
		return this.callback(() => $(this.el).toggleClass(className));
	}
}
export {
	MODEL,
	ATTRIBUTES
};