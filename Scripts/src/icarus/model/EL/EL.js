/** @module */
import MODEL, { ATTRIBUTES } from '../MODEL.js';
import MissingContainerError from '../../error/MissingContainerError.js';
import RecursionLimitError from '../../error/RecursionLimitError.js';
import { STATUS } from '../../enums/STATUS.js';
/** A Generic HTML Element Class
    @class
    @extends MODEL
*/
export default class EL extends MODEL {
	/** Constructs a Node representing an HTMLElement as part of a 
        doubly linked list with a Main (Head) and a Tail (Last Child)
	    @param {EL} node Parent Element Class
	    @param {string} element HTML Element Tag
	    @param {MODEL} model Model
	    @param {Array<MODEL>} children Array of child nodes
	*/
	constructor(node, element = 'DIV', model = new MODEL()) {
		super(model.attributes);
		this.setContainer();
        this.setMain();
        /** Parent EL
		    @type {EL} children 
		*/
		this.node = node;
		//this.next = null;
        this.className = this.constructor.name;
        /** HTML Element Tag ie: DIV 
            @type {string} element
        */
        this.element = element;
        /** State Indicator 
            @type {number} status 
        */
		this.status = STATUS.DEFAULT; // 
		//this.transition = null; // Transition type: ie: collapse, accordion, fade etc @todo Transition Event
		/** An array of MODELS that are children of this EL
		    @type {Array<MODEL>} children 
		*/
        this.children = [];
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
		
        this.make(model);
	}
	/** Creates an HTMLElement based based on this MODEL and appends to this Node Element
        param {HTMLElement} el The HTML Element
	    param {EL} node Parent node to append to
	    @param {MODEL} model A set of key/value pairs for this element's model
	    param {string} innerHTML This text will be displayed within the HTML element
	    @returns {Promise<ThisType>} callback
	*/
    make(model) {
        return this.callback(() => {
            this.el = document.createElement(this.element);
            if (this.node === document.body) {
                this.node.appendChild(this.el);
            } else {
                this.node.el.appendChild(this.el);
            }
            this.merge(model).then(() => this.construct(model));
        }, 'Unable to make ' + this.element);
	}	
    /** Perform any async actions required to construct the Element
        @param {MODEL} model Model
	    @returns {Promise<ThisType>} callback
	*/
    construct(model) {
        if (model) {
            if (model.children) {
                return this.populate(model.children);
            }
        }
        return this.ifEmpty();
    }
    /** If no children supplied...
	    @returns {Promise<ThisType>} callback
	*/
    ifEmpty() {
        return Promise.resolve(this);
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
        this.get().push(model);
        return this.getTail();
	}
	/** Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
        @see https://stackoverflow.com/a/9229821/722785
	    @returns {Promise<ThisType>} Returns this element for chaining purposes
	*/
	addClass(className) {
		return this.callback(() => {
			if (className === 'undefined') {
				console.log('ClassName Undefined');
            } else {
                try {
                    className.split(' ').forEach((c) => this.el.classList.add(c));
                    this.attributes.class = this.el.classList.value;
                } catch (e) {
                    console.warn('Unable to add class', className, this, e);
                }
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
	
	append(target) {
		return this.callback(() => target.insertBefore(this.el, target.firstChild));
    }*/
    /** Dispatches the given Event to this element's siblings
        @param {Event} event Event to dispatch
        @returns {void}
    */
    dispatchToSiblings(event) {
        this.node.get().filter((c) => c !== this).forEach((s) => s.el.dispatchEvent(event));
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
	
	enableEdit() {
		try {
			if (this.getMain().getDev()) {
				this.el.ondblclick = this.edit.bind(this);
			}
		} catch (e) {
			console.log('EL{' + this.className + '}.getMain() error', this);
		}
	}*/
    /** Used to recursively verify if the reflected Prototype class of the given node
        matches a specified value.  This can be helpful in cases where you need to 
        identify the root super class, not just the current one
        @param {EL} node Self or reflection of self
        @param {string} className Class name to match
        @param {number} attempt Recursion loop attempt
        @param {number} limit Recursion limit
        @returns {boolean} True if classname found in proto chain
        @throws {RecursionLimitError} A Recursion error is thrown if limits are exceeded
    */
    checkReflectionPrototype(node, className, attempt = 0, limit = 10) {
        if (attempt < limit) {
            let reflection = Reflect.getPrototypeOf(node); // Can this value be cached?            
            if (reflection !== null) {
                if (reflection.constructor.name === 'EL') { // No sense in going any further than EL
                    return false;
                }
                if (reflection.constructor.name === className) {
                    return true;
                }
                return this.checkReflectionPrototype(reflection, className, attempt + 1);
            }
            return false;
        }
        throw new RecursionLimitError(this.className + '.checkReflectionPrototype(): Exceeded attempt limit. (Attempt ' + attempt + ')');
    }
    /** Retrieve an {@link EL} based on its __proto__
        @description Recursively iterates through parent nodes until an object with the given prototype is found
        @param {string} className The value to search for within this key
        @param {EL} node Entry point to traversing the chain
        @param {number} attempt Recursion loop
        @param {number} limit Recursion limit
        @returns {CONTAINER} The parent container
        @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf
        @throws Will throw an error if recursion attempt exceeds limit
    */
	getProtoTypeByClass(className, node = this.node, attempt = 0, limit = 100) {
		if (node === document.body) {
			return null; //this.getMain(); // null You have reached the top of the chain
		}
		try {
			if (attempt < limit) {
                if (this.checkReflectionPrototype(node, className)) {
                    return node;
                }
                return this.getProtoTypeByClass(className, node.node, attempt + 1);
			}
			throw new RecursionLimitError(this.className + '.getProtoTypeByClass(): Exceeded attempt limit. (Attempt ' + attempt + ')');
		} catch (e) {
			if (e instanceof TypeError) {				
				/** Possible TypeError(s) include:
                    TypeError: this.getProtoTypeByClass is not a function
                    TypeError: Reflect.getPrototypeOf called on non-object
                    TypeError: Cannot read property '__proto__' of undefined
				*/
				// console.warn('A TypeError was caught while attempting to find proto', className, e);
			} else {
				console.warn('An unknown error occurred');
				throw e;
			}
		}
	}
	/** Get child element by Name and optionally by Class
	    @param {string} name Element Name
        @param {strong} className Element Class
	    @returns {Array<EL>} Child Item/Element Filtered Results
        @description This might also be recognized as this.getChildren()
	*/
	get(name = null, className = null) {
        if (name === null && className === null) {
            return this.children;
        }
        return this.get().filter((c) => (c.name === name || name === null) && (c.className === className || className === null));
	}
	/** Retrieves MODEL.ATTRIBUTES.class 
	    @returns {string} Class Name
	*/
	getClass() {
		return this.attributes.class || '';
	}
	/** Sets and returns the parent EL/CONTAINER for this element
	    @returns {EL} The parent container for this container
	*/
	getContainer() {
		try {
			if (typeof this.container === 'undefined') {
				this.setContainer();
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
            console.warn('Unable to retrieve loader', this, e);
			return null;
		}
	}
	/** Returns the MAIN container
	    @returns {Promise<MAIN>} MAIN class
	*/
	getMain() {
		try {
			if (typeof this.main === 'undefined') {
				this.setMain();
				return this.main;
			}
			return this.main;
		} catch (e) {
			console.warn(e);
			throw new MissingContainerError(this.className + ' is unable to find a MAIN Container');
		}
    }
    /** Retrieves the last child in linked list / children 
        @returns {EL} Tail Element/Model
    */
    getTail() {
        return this.get()[this.get().length - 1];
    }
    /** Retrieves the previous element (if exists) 
        @returns {EL} Previous Sibling Element
    */
    getPrev() {
        try {
            return this.node.get()[this.node.get().indexOf(this) - 1];
        } catch (e) {
            console.warn('Unable to retrieve previous element/sibling', this, e);
        }
    }
    /** Retrieves the next element (if exists) 
        @returns {EL} Next Sibling Element
    */
    getNext() {
        try {
            return this.node.get()[this.node.get().indexOf(this) + 1];
        } catch (e) {
            console.warn('Unable to retrieve next element/sibling', this, e);
        }
    }
	/** Attempts to call the constructor of the given MODEL
        @see https://stackoverflow.com/a/35769291/722785	    
        @param {MODEL} model MODEL
        @returns {Promise<EL>} Promise to return a Constructed Element
    */
	create(model) {
		//console.log('EL{' + this.className + '}.create()', model);
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
        return this.callback(() => {
            if (typeof model === 'object') {
                for (let prop in model) {
                    if (typeof prop === 'string') {
                        switch (prop) {
                            case 'attributes':
                                this.processAttributes(model.attributes);
                                break;
                            case 'innerHTML':
                                this.setInnerHTML(model[prop]);
                                break;
                            case 'children':
                                console.log(this.className + '.children', model[prop]);
                                this[prop] = model[prop];
                                break;
                            default:
                                this[prop] = model[prop];
                        }
                    }
                }
            }
        }, 'EL.merge(): Failed to merge ' + this.constructor.name);
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
                //this.el.innerHTML = attributes[attr];
                this.setInnerHTML(attributes[attr]);
            }
		}
	}
	/** Removes all child Elements of this Element from the DOM (Preserves this.children)
	    @returns {ThisType} callback
	*/
	empty() {
		return new Promise((resolve) => {
			while (this.el.firstChild) {
				this.el.removeChild(this.el.firstChild);
            }
            //this.children.length = 0;
			resolve(this);
		});
    }
    /** Removes this HTMLElement from the DOM (MODEL is maintained within node.children)
	    param {number} delay Millisecond delay
	    @returns {Promise} Callback on successful destroy()
	*/
    remove() { // delay = 300
        return this.callback(() => this.el.parentNode.removeChild(this.el));
    }
	/** Removes this Element from the DOM and its Class from any linked lists
	    @param {number} delay Millisecond delay
	    @returns {Promise} Callback on successful destroy()
	*/
	destroy(delay = 300) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
                try {
                    this.remove().then(() => {
                        if (this.node !== document.body) {
                            this.node.get().splice(this.node.get().indexOf(this), 1);
                        }
                        resolve();
                    });
				} catch (e) {
					if (e instanceof TypeError) {
						console.warn('Unable to destroy this ' + this.element, this);
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
	/** Gets the container (if exists) and sets it
	    @returns {void}
	*/
	setContainer() {
		this.container = this.getProtoTypeByClass('CONTAINER');
	}
	/** Gets the main (if exists) and sets it
	    @returns {void}
	*/
	setMain() {
		this.main = this.getProtoTypeByClass('MAIN');
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
	/** Creates given Elements as children of this Element
	    @param {Array<EL>} children model.children
	    @returns {Promise<ThisType>} callback
	*/
    populate(children) {
        return this.callback(() => Promise.all(children.map((c) => this.create(c))), this.className + '.populate() Failed to populate ' + this.className);
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
export { MODEL, ATTRIBUTES }