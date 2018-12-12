/** @module */
import MODEL, { ATTRIBUTES } from '../MODEL.js';
import { HtmlElement } from '../../enums/HtmlElement.js';
import MissingContainerError from '../../error/MissingContainerError.js';
import RecursionLimitError from '../../error/RecursionLimitError.js';
import { STATUS } from '../../enums/STATUS.js';
/** A Generic HTML Element
    @class
    @extends MODEL
*/
export default class EL extends MODEL {
	/** Constructs a generic html element
	    @param {EL} node The object to contain this element
	    @param {string} element The HTML tag that is used for this element
	    @param {MODEL} model A set of key/value pairs for this element's model
	    @param {string} innerHTML This text will be displayed within the HTML element
	    @param {Array<MODEL>} children An object array of child models
	*/
	constructor(node, element = 'DIV', model, innerHTML, children = []) {
		super(model.attributes);
		this.setContainer();
		this.node = node; // The parent EL (or Body) that this ELEMENT is within        
		this.className = this.constructor.name;
		this.element = element || HtmlElement.DEFAULT; // Html Element that this EL represents
		this.status = STATUS.DEFAULT; // Element state changes depend on this.status 

        /** An array of MODELS that are children of this EL
            @property {Array<MODEL>} children 
        */
        this.children = children;

		this.callbacks = {}; // Contains a series of Constructor functions that this element can use
        this.el = document.createElement(this.element);
        this.touchtime = 0; // mobile double click detection
		this.make(this.el, node, model, innerHTML);
	}
	/** Append the HTML element to the appropriate node and apply the given model and optional innerHTML
        @param {HTMLElement} el The HTML Element
	    @param {EL} node Parent node to append to
	    @param {MODEL} model A set of key/value pairs for this element's model
	    @param {string} innerHTML This text will be displayed within the HTML element
	    @returns {HTMLElement} This element
	 */
	make(el, node, model, innerHTML) {
		try {
			if (node === document.body) {
				//this.el = node.appendChild(document.createElement(this.element));
				node.appendChild(el);
			} else {
				//this.el = node.el.appendChild(document.createElement(this.element));
				node.el.appendChild(el);
			}
			this.merge(model);
			this.setInnerHTML(innerHTML);
		} catch (e) {
			throw e;
		}
		return el;
    }
    /** Sets mobile-friendly single and double click events
        @param {function} click Function call on single click
        @param {function} dblclick Function call on double click
        @param {MODEL} options {delay: Delay in milliseconds between clicks, stopPropagation: Stops event propagation}
        @returns {ThisType} callback
    */
    clickHandler(click, dblclick, options = new MODEL().set({
        delay: 500,
        stopPropagation: true
    })) {
        this.el.onclick = (ev) => new Promise((resolve, reject) => {
            try {
                if (options.stopPropagation) {
                    ev.stopPropagation();
                }
                if (this.touchtime === 0) {
                    this.touchtime = new Date().getTime();
                    setTimeout(() => {
                        if (this.touchtime !== 0) {
                            this.touchtime = 0;
                            resolve(click());
                        }
                    }, options.delay);
                } else if (new Date().getTime() - this.touchtime < options.delay) {
                    this.touchtime = 0;
                    resolve(dblclick());
                }
            } catch (e) {
                if (options.stopPropagation) {
                    ev.stopPropagation();
                }
                reject(e);
            }
        });
        return this;
    }
    /** Sets this element as 'selected'
        param {EL} element The element to select
        @returns {ThisType} callback
    */
    select() {
        $('.selected').removeClass('selected');
        $(this.el).toggleClass('selected');
        return this;
    }
	/** Adds the given class name to the element's list of classes
	    @param {string} className the class to be appended
	    @returns {ThisType} Returns this element for chaining purposes
	*/
	addClass(className) {
		$(this.el).addClass(className);
		let prevClass = this.attributes.class || '';
		this.attributes.class = prevClass + ' ' + className;
		return this;
    }
    /** Adds an array of classnames
        @param {Array<string>} classNames An array of class names
        @returns {ThisType} callback
    */
    addClasses(classNames) {
        classNames.forEach((c) => this.addClass(c));
        return this;
    }
    /** Inserts @see {this.el} as the first child of target
        @param {HTMLElement} target Target HTML Element
        @returns {ThisType} callback
    */
    append(target) {
        target.insertBefore(this.el, target.firstChild);
        return this;
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
			return null; // You have reached the top of the chain
		}
		let depth = attempt + 1;
		try {
			//console.log('Searching for __proto__.__proto__.constructor.name: ' + value + '(' + attempt + ')', node);
			if (depth < 100) {
				//if (node.__proto__.__proto__.__proto__.constructor.name === value.toString() || node.__proto__.__proto__.constructor.name === value.toString() || node.__proto__.constructor.name === value.toString()) {
				if (Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(node))).constructor.name === value.toString() || Reflect.getPrototypeOf(Reflect.getPrototypeOf(node)).constructor.name === value.toString() || Reflect.getPrototypeOf(node).constructor.name === value.toString()) {
					//console.log('Found container(' + value.toString() + ')...', node);
					return node;
				} //else {
				return this.getProtoTypeByClass(value, node.node, depth); // attempt++
				//}
			} //else {
			throw new RecursionLimitError(this.className + '.getProtoTypeByClass(): Exceeded attempt limit. (Attempt ' + attempt + ')');
			//}
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
	/** Sets and returns the parent container for this element
	    @returns {CONTAINER} The parent container for this container
	*/
	getContainer() {
		try {
			if (typeof this.container === 'undefined') { // || this.container === null
				this.container = this.getProtoTypeByClass('CONTAINER');
				return this.container;
			}
			return this.container;
		} catch (e) {
			console.log(e);
			throw new MissingContainerError(this.className + ' is unable to find a parent Container');
		}
	}
	/** Returns the MAIN container
	    @returns {CONTAINER} This EL's parent container
	*/
	getMain() {
		if (typeof this.container !== 'undefined') {
			try {
				return this.getContainer().getMain();
			} catch (e) {
				console.warn('EL{' + this.className + '} Unable to retrieve Main Container', e);
				//throw e;
			}
		}
	}
	/** Retrieves the token value from the DOM Meta tags
	    @returns {string} A request verification token
	*/
	getToken() {
		return document.getElementsByTagName('meta').token.content;
	}
	/** Acts like a switch statement, performing actions from the given list of callbacks.
        This is used because constructor functions persist across the inheritance chain,
        whereas an actual SWITCH statement would be overridden on each inheritted class.
        @see https://stackoverflow.com/a/35769291/722785	    
        @param {MODEL} model The object model for the element to be created
        @returns {Promise<EL>} Promise to return a Constructed Element
    */
	create(model) {
		//console.log('EL.create()', model);
		return new Promise((resolve, reject) => {
			try {
				let result = this.callbacks[model.className].forEach((fn) => fn(model));
				resolve(result);
			} catch (e) {
				console.warn(0, this.className + '.create(): No constructor exists for className "' + model.className + '"', e);
				reject(e);
			}
		});
	}
	/** Add a case to the creator EL.create();
        @param {string} className The Icarus Class name that this callback is meant to construct
        @param {Function} fn Function to call (should accept model)
        @returns {void}
    */
	addCase(className, fn) {
		/*try {
            this.callbacks[className].push(fn);
        } catch (e) {
            this.callbacks[className] = [fn];
            //this.callbacks[className].push(fn);
        }*/
		this.callbacks[className] = [];
		this.callbacks[className].push(fn);
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
	/** Opens the ELEMENT up for editing.  This should create a link
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
	/** Closes the EL up for editing.  <br>This should create a link
	    between the object on the server and its client side representation
	    and update accordingly
	    @returns {EL} This EL
	*/
	close() {
		this.status = STATUS.CLOSED;
		//this.el.setAttribute('data-status', 'closed');
		return this;
	}
	/** Empties contents of node element
	    @returns {EL} This EL
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
	/** Override this element's class with the given value
        @param {string} className A class
        @returns {EL} Returns this element for chaining purposes
    */
	setClass(className) {
		this.el.className = className;
		this.attributes.class = className;
		return this;
	}
	/** Retrieves the container (if exists) and sets it
	    @returns {void}
	*/
	setContainer() {
        this.container = this.getContainer(); //this.getProtoTypeByClass('CONTAINER');
	}
	/** Removes the given class name from the element's list of classes
	    @param {string} className the class to be removed
	    @returns {EL} Returns this element for chaining purposes
	*/
    removeClass(className) {
        try {
            $(this.el).removeClass(className);
            //this.attributes.set('class', this.attributes.get('class').replace(className, ''));
            this.attributes.set('class', this.attributes.get('class').split(' ').filter((v) => v !== className));
        } catch (e) {
            if (!(e instanceof TypeError)) {
                throw e;
            }
        }
		return this;
	}
	/** Shows this Element
	    @returns {ThisType} callback
	*/
	show() {
		this.el.style.display = 'block';
		return this;
	}
	/** Hides this Element
	    @returns {ThisType} callback
	*/
    hide() {
        return new Promise((resolve) => {
            this.el.style.display = 'none';
            resolve(this);
        });
    }
	/** Adds 'active' to this element's classes
	    @returns {EL} This EL
    */
	activate() {
		$(this.el).addClass('active');
		return this;
	}
	/** Removes 'active' from this element's classes
	    @returns {EL} This EL
    */
	deactivate() {
		$(this.el).removeClass('active');
		return this;
	}
	/** Toggles the 'active' class on this element
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
	/** Creates given elements as children of this element
	    @param {array} children Array of children object models to be constructed
	    @returns {EL} This EL
	*/
    populate(children) {        
        return new Promise((resolve, reject) => {
            if (children) {
                try {
                    let msg = this.className + '.populate(' + children.length + ');';
                    this.getMain().loader.log(0, msg).then(() => {
                        children.forEach((c) => this.create(c));
                        this.getMain().loader.log(100).then(() => {
                            resolve(this);
                        });
                    });
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
export { MODEL, ATTRIBUTES };