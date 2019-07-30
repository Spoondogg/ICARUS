/* eslint-disable max-lines, max-statements */
/** A generic HTML Element Node Module
    @module icarus/model/el
*/
import MODEL, { ATTRIBUTES } from '../MODEL.js';
import AbstractMethodError from '../../error/AbstractMethodError.js';
import FACTORY from './FACTORY.js';
import MissingContainerError from '../../error/MissingContainerError.js';
import PAYLOAD from './form/PAYLOAD.js';
import RecursionLimitError from '../../error/RecursionLimitError.js';
import { STATUS } from '../../enums/STATUS.js';
/** A Generic HTML Element Node Class
    @description It might make more sense for this class to be called NODE.
    In the future, I might consider creating a NODE class and having EL
    extend it.  I'm certain that there are certain methods and properties 
    of EL that would be better suited to a NODE class.    
    @todo Create a NODE class to handle methods for accessing its parent/child
    @todo Extend MODEL (current) and implement NODE for descendants of CONTAINER
    @description This would result in CONTAINERS having NODE features...  But what about cases
    where EL needs to access?  Maybe this isn't such a good idea afterall.
    @class
    @extends MODEL
*/
export default class EL extends MODEL {
	/** Constructs a node representing an HTMLElement that can be represented in the DOM
	    @param {EL} node Parent Node
	    @param {Name} [element=DIV] HTMLElement tagName
	    @param {MODEL} [model] Model
	*/
    constructor(node, element = 'DIV', model = new MODEL()) {
		super(model.attributes);
		this.setContainer();
        this.setMain();
        /** An element FACTORY
            @type {FACTORY}
        */
        this.factory = null;
		/** Parent EL
		    @type {EL}
		*/
		this.node = node;
		/** String representation of this Element's Class Name
		    @type {Name}
		*/
		this.className = this.constructor.name;
		/** HTML Element Tag ie: DIV 
		    @type {string}
		*/
        this.element = element;
		/** State Indicator 
		    @type {number} 
		*/
        this.status = STATUS.DEFAULT;
        /** Represents the location where children of this element are instantiated
            @type {EL}
        */
        this.childLocation = this;
		/** An array of MODELS that are children of this EL
		    @type {Array<MODEL>} children 
		*/
        this.children = [];
        /** A dialog that belongs to this element 
            @type {DIALOG}
        */
        this.dialog = null;
        /** A Collection of async Constructor methods
		    ie: this.constructors[foo]
            @type {Object<string, Function>}
		*/
        this.constructors = {};
		/** A collection of public Methods
		    @type {Object<string, Function>}
		*/
        this.methods = {};
        /** A collection of Event Handlers
            @type {Object<string, Function>}
        */
        this.events = {};
        /** A collection of public Event handlers
		     @type {Object<string, Function>}
		*/
        this.handlers = {};
        this.make(model);
	}
	/** Creates an HTMLElement based based on this MODEL and appends to this Node Element
        param {HTMLElement} el The HTML Element
	    param {EL} node Parent node to append to
	    @param {MODEL} model A set of key/value pairs for this element's model
	    param {string} innerHTML This text will be displayed within the HTML element
	    @returns {Promise<ThisType>} Promise Chain
	*/
	make(model) {
		return this.chain(() => {
			if (typeof this.el === 'undefined') {
                /** The HTML Element shown in the DOM
                    @type {HTMLElement}
                */
                this.el = document.createElement(this.element);
				if (this.node === document.body) {
					this.node.appendChild(this.el);
				} else {
					this.node.el.appendChild(this.el);
				}
			} /*else {
				console.warn(this.toString() + '.make(): this.el already exists', typeof this.el);
			}*/
			this.merge(model).then(() => this.construct(model));
		}, this.toString() + '.make() Unable to make ' + this.element);
	}
	/** Perform any async actions required to construct the Element
        @param {MODEL} model Model
	    @returns {Promise<ThisType>} Promise Chain
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
	    @returns {Promise<ThisType>} Promise Chain
	*/
	ifEmpty() {
		return Promise.resolve(this);
    }
    /** A callback Function that accepts a MODEL as a parameter
        @typedef {Function<MODEL>} ModelFunction A Function that accepts a MODEL
        @param {MODEL} model
    */

	/** Add a constructor style function to this classes constructor collection
	    @param {string} className The Icarus Class name that this callback is meant to construct
	    @param {ModelFunction} fn Callback Function
	    @returns {void}
	*/
    addConstructor(className, fn) {
        //console.log(this.toString() + '.addConstructor()', className);
		//this.constructors[className] = [];
		//this.constructors[className].push(fn);
        this.constructors[className] = fn;
	}
	/** Adds given child element to this element's children
	    @param {EL} model Model
	    @returns {EL} Child Element
	*/
	addChild(model) {
        this.get().push(model);
        //console.log('Added Child', this.getTail());
		return this.getTail();
	}
	/** Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
        @see https://stackoverflow.com/a/9229821/722785
	    @returns {Promise<ThisType>} Returns this element for chaining purposes
	*/
	addClass(className) {
		return this.chain(() => {
			if (className === 'undefined') {
				console.log('ClassName Undefined');
            } else {
                className.split(' ').forEach((c) => {
                    try {
                        if (c.length > 0) {
                            this.el.classList.add(c);
                        }
                    } catch (e) {
                        console.warn(this.toString() + ' Unable to add class to classList', [c, className], e);
                    }
                });
                this.attributes.class = this.el.classList.value;
			}
		});
    }
    /** Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
        @see https://stackoverflow.com/a/9229821/722785
	    @returns {Promise<ThisType>} Returns this element for chaining purposes
	*/
    setClass(className = '') {
        return this.chain(() => {
            if (className === 'undefined') {
                console.log('ClassName Undefined');
            } else {
                this.el.className = className;
                this.attributes.class = className;
            }
        });
    }
	/** Promises to add an array of classnames to this element
	    @param {Array<string>} classNames An array of class names
	    @returns {Promise<ThisType>} Promise Chain
	*/
	addClasses(classNames) {
		Promise.all(classNames.map((c) => this.addClass(c))).then(() => this);
	}
	/* Inserts @see {this.el} as the first child of target
	    @param {HTMLElement} target Target HTML Element
	    @returns {Promise<ThisType>} Promise Chain
	
	append(target) {
		return this.chain(() => target.insertBefore(this.el, target.firstChild));
    }*/
	/** Dispatches the given Event to this element's siblings
	    @param {Event} event Event to dispatch
        @param {string} className Event signal classname
	    @returns {void}
	*/
	dispatchToSiblings(event, className) {
		this.node.get().filter((c) => c.hasClass(className) && c !== this).forEach((s) => s.el.dispatchEvent(event));
	}
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
    /** Retrieves the index value for this element among its siblings
        @returns {number} index value
    */
    getIndex() {
        return this.node.get().indexOf(this);
    }
    /** Checks for the existence of a nested property value
        @see https://stackoverflow.com/a/2631198/722785
        @param {any} obj Node
        @param {any} level Property level
        @param {any} rest The rest
        @returns {boolean} True if property exists
    */
    getNestedProperty(obj, level, ...rest) {
        console.log(this.toString() + '.checkNested()', level, obj, rest.length);
        if (typeof obj === 'undefined') {
            return false;
        }
        if (rest.length === 0 && Reflect.apply(hasOwnProperty, obj, level)) {
            return obj[level];
        }
        return this.getNestedProperty(obj[level], ...rest);
        //var hasGivenProperty = Reflect.hasOwnProperty(this, level);

        //var hasGivenProperty = Reflect.apply(hasOwnProperty, this, level);
        //return rest.length === 0 && hasGivenProperty ? true : this.checkNested(this[level], ...rest);
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
    /** Returns the element's dialog
        @returns {DIALOG} Dialog
    */
	getDialog() {
        return this.dialog;
	}
    /** Sets the element's dialog
        @param {DIALOG} dialog Dialog to set
        @returns {void}
    */
	setDialog(dialog) {
        this.dialog = dialog;
	}
    /** Returns the element's factory
	    @returns {FACTORY} An element factory
	*/
    getFactory() {
        //console.log(this.toString() + ': Retrieving ' + this.factory.toString());
        return this.factory;
    }
    /** Sets this element's factory
        @param {FACTORY} factory An element factory
        @returns {void}
    */
    setFactory(factory) {
        if (this.factory === null) {
            //console.log(this.toString() + '.factory set to ' + factory.toString());
            this.factory = factory;
        }
    }
    /** Catches DOM Exception when event is already being dispatched
	    @param {EL} element Element Class to dispatch event
	    @param {Event} event Event
	    @returns {void}
	*/
    filterEventDomException(element, event) {
        try {
            Promise.resolve(element.el.dispatchEvent(event));
        } catch (e) {
            if (!(e instanceof DOMException)) { // DOMException: Event is already being dispatched
                console.warn(e.message);
                throw e;
            }
        }
    }
	/** Get child element by Name and optionally by Class
	    @param {string} name Element Name
        @param {string} className Element Class
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
    /** Retrieves the token value from the DOM Meta tags
	    @returns {string} A request verification token
	*/
    getToken() {
        return document.getElementsByTagName('meta').token.content || '';
    }
    /** Retrieves the user value from the DOM Meta tags
	    @returns {string} Current User
	*/
    getUser() {
        return document.getElementsByTagName('meta').user.content || 'Guest';
    }
    /** Retrieves the user's profile picture / avatar if available
	    @returns {string} Current User
	*/
    getAvatar() {
        return localStorage.getItem('picture') || '/Content/Images/user256.png';
    }
    /** Retrieves the roles value from the DOM Meta tags
	    @returns {string} Current User Role(s) (comma delimited)
	*/
    getRole() {
        return document.getElementsByTagName('meta').roles.content || '';
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
		//console.log(this.toString() + '.create()', model.className, this.constructors);
        try {
            return this.constructors[model.className](model);
        } catch (e) {
            console.warn(this.toString() + '.create(): No constructor exists for className "' + model.className + '"', this, model, e);
            return Promise.reject(e);
        }
	}
	/** Wraps a Synchronous function inside a Promise that returns this element as a callback
	    The function is called within a try/catch block and will reject on error
	    @param {Array<Function>} fn An array of Synchronous functions in performing order
	    @param {string} [msg] Optional message to display on error
	    @returns {Promise<ThisType>} Returns this object as a callback
	*/
	chain(fn, msg = 'Promise Chain Error') {
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
		return this.chain(() => {
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
							case 'id':
							case 'name':
								this.set(prop, model[prop]);
								this.setAttribute(prop, model[prop]);
								break;
                            case 'children':
                                /** @description model.children are processed during this.make() */
                                //this.createChildren(model[prop]);
								break;
							default:
                                this.set(prop, model[prop]);
						}
					}
				}
			}
		}, this.toString() + '.merge(): Failed to merge');
    }
	/** Iterates through attributes and sets accordingly
	    If attribute is 'innerHTML', the element's innerHTML is modified
	    @param {object} attributes A set of key/value pairs
	    @returns {void}
	*/
	processAttributes(attributes) {
		for (let attr in attributes) {
            if (attr !== 'innerHTML') {
                if (attr === 'class') {
                    this.addClass(attributes[attr]);
                } else {
                    this.setAttribute(attr, attributes[attr]);
                }
            } else if (attr === 'innerHTML') {
                console.log(this.toString() + '.processAttributes()', attr, attributes[attr]);
				this.setInnerHTML(attributes[attr]);
			}
		}
	}
    /** Removes all child Elements of this Element from the DOM (Preserves this.children)
        @param {boolean} [preserveChildren] If true (default), children are preserved
	    @returns {Promise<ThisType>} Promise Chain
	*/
	empty(preserveChildren = true) {
		return new Promise((resolve) => {
            while (this.el.firstChild) {
				this.el.removeChild(this.el.firstChild);
            }
            if (!preserveChildren) {
                this.children.length = 0;
            }
			resolve(this);
		});
	}
	/** Removes this HTMLElement from the DOM (MODEL is maintained within node.children)
	    @returns {Promise} Callback on successful destroy()
	*/
	remove() { // delay = 300
		return this.chain(() => {
			if (this.el.parentNode) {
				this.el.parentNode.removeChild(this.el);
            }
        }, 'Unable to remove ' + this.toString() + ' from ' + this.node.toString());
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
						resolve(true);
					});
				} catch (e) {
					if (e instanceof TypeError) {
						console.warn('Unable to destroy ' + this.toString(), this);
						resolve(false);
					} else {
						reject(e);
					}
				}
			}, delay);
		});
	}
	/** Sets the given attribute to the element and its model
	     @param {string} key Attribute name
	     @param {string|number} value Attribute value
	     @returns {Promise<ThisType>} Promise Chain
	*/
	setAttribute(key, value) {
		return this.chain(() => {
			if (typeof key === 'string' && typeof value !== 'undefined' && value !== null) {
                this.el.setAttribute(key, value);
                try {
                    this.attributes.set(key, value);
                } catch (e) {
                    if (e instanceof TypeError) {
                        this.attributes = new ATTRIBUTES().set(key, value);
                    }
                }
			}
		});
    }
    /** Removes the given attribute from the element and sets its model value to null
        @param {string} key Attribute name
        @returns {Promise<ThisType>} Promise Chain
    */
    removeAttribute(key) {
        return this.chain(() => {
            if (typeof key === 'string') {
                try {
                    this.attributes.set(key, null);
                    this.el.removeAttribute(key);
                } catch (e) {
                    console.warn(this.toString() + '.removeAttribute(' + key + '): Unable to remove attribute', e);
                }
            }
        });
    }
	/** Sets container with given CONTAINER or optionsally
        gets the container (by Prototype if exists) and sets it
        @param {CONTAINER} [container] Container
	    @returns {void}
	*/
    setContainer(container = this.getProtoTypeByClass('CONTAINER')) {
		/** @type {EL} */
        this.container = container;
	}
	/** Gets the main (if exists) and sets it
	    @returns {void}
	*/
	setMain() {
		this.main = this.getProtoTypeByClass('MAIN');
	}
	/** Removes the given class name from the element's list of classes
	    @param {string} className the class to be removed
	    @returns {Promise<ThisType>} Promise Chain
	*/
	removeClass(className) {
		/*return this.chain(() => $(this.el).removeClass(className)).then((el) => {
		    el.attributes.set('class', el.attributes.get('class').split(' ').filter((v) => v !== className));
		});*/
		return new Promise((resolve, reject) => {
            try {
                this.el.classList.remove(className);
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
		return this.el.classList.contains(className);
		//return $(this.el).hasClass(className);
	}
	/** Creates given Elements as children of this Element
	    @param {Array<EL>} children model.children
	    @returns {Promise<ThisType>} Promise Chain
	*/
	populate(children) {
        return this.chain(() => Promise.all(children.map((c) => this.create(c))), this.toString() + '.populate() Failed to populate ' + this.toString());
    }
	/** Sets the inner HTML of this element
	    @param {string} innerHTML Html string to be parsed into HTML
	    @returns {ThisType} This node for chaining
	*/
	setInnerHTML(innerHTML = '') {
		this.el.innerHTML = innerHTML;
		return this;
	}
	/** Scrolls MAIN to the top of this element
	    @param {number} speed Millisecond duration
        @param {string} easing JQuery Easing Type
	    @returns {ThisType} Method Chain
	*/
	scrollTo(speed = 500, easing = 'swing') {
		console.log('Scrolling to this element at ' + parseInt($(this.el).offset().top));
		$(this.getMain().body.pane.el).animate({
			scrollTop: parseInt($(this.el).offset().top)
		}, speed, easing);
		return this;
	}
	/** Toggles the given class on this element
	    @param {string} className The classname to toggle on this element
	    @returns {Promise<ThisType>} Promise Chain
	*/
	toggleClass(className = 'active') {
		return this.chain(() => $(this.el).toggleClass(className));
	}
	/** Returns a string representation of this Element
	    @returns {string} Classname
	*/
	toString() {
		return this.className + '()';
	}
}
export { AbstractMethodError, ATTRIBUTES, FACTORY, MissingContainerError, MODEL, PAYLOAD, RecursionLimitError }
/* eslint-enable max-lines, max-statements */