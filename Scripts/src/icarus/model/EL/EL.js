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
        this.transition = null; // Transition type: ie: collapse, accordion, fade etc @todo Transition Event
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
    /** On PressDown Event, starts a timer that triggers the Long Press Event
        @param {Event} ev Event
        @param {string} eventName Event Name
        @param {object} options Options
        @param {Function} longclick Long Press Function
        @returns {Promise<any>} Promise to resolve given function
    */
    pressDown(ev, eventName, options, longclick) {
        //console.log('Press: ' + eventName, this.timer);
        if (options.stopPropagation) {
            ev.stopPropagation();
        }
        this.timer = window.setTimeout(() => {
            //console.log('Pressing ' + eventName, this.timer);
            clearTimeout(this.timer);
            //ev.preventDefault();
            this.touchtime = 1;
            Promise.resolve(longclick(ev));
        }, options.longClickDelay);
    }
    /** On PressUp Event, cancels PressDown Timer
        @param {Event} ev Event
        @param {string} eventName Event Name
        @param {object} options Options
        @returns {void} 
    */
    pressUp(ev, eventName, options) {
        //console.log(eventName, this.timer);
        if (options.stopPropagation) {
            ev.stopPropagation();
        }
        clearTimeout(this.timer);  
    }
    /** Press Event occurs after Press Down/Up events complete
        @param {Event} ev Event
        @param {object} options Options
        @param {Function} click Single Press Function
        @param {Function} dblclick Double Press Function
        param {Function} longclick Long Press Function
        @returns {Promise<any>} Promise to resolve appropriate Press Event
    */
    pressed(ev, options, click, dblclick) {
        //console.log('Pressed', this.timer, ev);
        try {
            if (this.touchtime === 0) {
                this.touchtime = new Date().getTime();
                setTimeout(() => {
                    if (this.touchtime !== 0) {
                        //console.log('singleclick', this.timer);
                        this.touchtime = 0;
                        clearTimeout(this.timer);
                        Promise.resolve(click(ev));
                    }
                }, options.delay);
            } else if (new Date().getTime() - this.touchtime < options.delay) {
                //console.log('doubleclick', this.timer);
                this.touchtime = 0;
                clearTimeout(this.timer);
                Promise.resolve(dblclick(ev));
            } else {
                //console.log('longclick', this.timer);
                this.touchtime = 0;
                clearTimeout(this.timer);
                //Promise.resolve(longclick(ev));
            }
        } catch (e) {
            console.warn('error', e);
            this.touchtime = 0;
            clearTimeout(this.timer);
            if (options.stopPropagation) {
                ev.stopPropagation();
            }
            Promise.reject(e);
        }
    }
    /** Sets mobile-friendly single and double click events
        @param {Function} click Function call on single click
        @param {Function} dblclick Function call on double click
        @param {Function} longclick Funciton call on long click
        @param {MODEL} options {delay: Delay in milliseconds between clicks, stopPropagation: Stops event propagation}
        @returns {ThisType} callback
    */
    clickHandler(click, dblclick = () => false, longclick = () => false, options = new MODEL().set({
        delay: 300,
        longClickDelay: 1000,
        stopPropagation: true
    })) {
        this.addClass('clickable');
        this.el.style.webkitTouchCallout = 'none';
        this.timer = null;
        // Detect Long click on desktop (MouseEvent) and mobile (TouchEvent) 
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
        this.el.onmousedown = (ev) => this.pressDown(ev, 'mousedown', options, longclick);
        this.el.onmouseup = (ev) => this.pressUp(ev, 'mouseup', options);
        //this.el.ontouchstart = (ev) => this.pressDown(ev, 'touchstart', options, longclick);
        this.el.addEventListener('touchstart', (ev) => this.pressDown(ev, 'touchstart', options, longclick), { passive: true });
        //this.el.ontouchend = (ev) => this.pressUp(ev, 'touchend', options);
        this.el.addEventListener('touchend', (ev) => this.pressUp(ev, 'touchend', options), { passive: true });
        // Detect Single and Double Click
        this.el.onclick = (ev) => this.pressed(ev, options, click, dblclick, longclick);
        return this;
    }
    /** Deselects any selected elements and sets this element as 'selected'
        param {EL} element The element to select
        param {Event} event Event
        @returns {Promise<ThisType>} callback
    */
    select() { // event
        return new Promise((resolve, reject) => {
            try {
                this.deselectAll()
                    .then(() => this.addClass('selected')
                        .then(() => resolve(this)));
            } catch (e) {
                reject(e);
            }
        });
    }
    /** Deselect this element
        @returns {Promise<ThisType>} callback
    */
    deselect() {
        return Promise.resolve(this.removeClass('selected'));
    }
    /** Deselects any 'selected' elements 
        @returns {Promise<void>} callback
    */
    deselectAll() {
        return Promise.resolve($('.selected').removeClass('selected'));
    }
    /** Sets the given attribute to the element and its model
         @param {string} key Attribute name
         @param {any} value Attribute value
         @returns {ThisType} callback
    */
    setAttribute(key, value) {
        this.el.setAttribute(key, value);
        try {
            this.attributes.set(key, value);
        } catch (e) {
            if (e instanceof TypeError) {
                this.attributes = new ATTRIBUTES().set(key, value);
            }
        }
        return this;
    }
    /** Adds given child element to this element's children
	    @param {EL} model Object model
	    @returns {EL} Nav Item with Anchor
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
        return new Promise((resolve, reject) => {
            try {
                if (className === 'undefined') {
                    console.log('ClassName Undefined');
                } else {
                    $(this.el).addClass(className);
                    let prevClass = this.attributes.class || '';
                    this.attributes.class = prevClass + ' ' + className;
                }
                resolve(this);
            } catch (e) {
                reject(e);
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
        return new Promise((resolve) => {
            target.insertBefore(this.el, target.firstChild);
            resolve(this);
        });
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
				if (Reflect.getPrototypeOf(Reflect.getPrototypeOf(Reflect.getPrototypeOf(node))).constructor.name === value.toString() || Reflect.getPrototypeOf(Reflect.getPrototypeOf(node)).constructor.name === value.toString() || Reflect.getPrototypeOf(node).constructor.name === value.toString()) {
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
        return new Promise((resolve, reject) => {
            try {
                //return this.getProtoTypeByClass('MAIN');
                if (typeof this.container === 'undefined') {
                    this.getProtoTypeByClass('MAIN');
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
                reject(e);
            }
        });
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
	    @returns {Promise<ThisType>} callback
	*/
    removeClass(className) {
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
    /** Toggles the 'active' class on this element
	    @param {string} className Optionally toggle this class
	    @returns {EL} This EL
	*/
    toggle(className) {
        return new Promise((resolve, reject) => {
            try {
                if (className) {
                    $(this.el).toggleClass(className); // || 'active'
                } else {
                    $(this.el).toggle();
                }
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Promises to collapse the MENU
	    @returns {Promise<ThisType>} callback
	*/
    hide() {
        return new Promise((resolve, reject) => {
            try {
                this.el.style.display = 'none';
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Expands the MENU body
        @returns {Promise<ThisType>} callback
    */
    show() {
        return new Promise((resolve, reject) => {
            try {
                this.el.style.display = 'block';
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Adds 'active' to this element's classes
	    @returns {EL} This EL
    */
    activate() {
        return Promise.resolve(this.addClass('active'));
	}
	/** Removes 'active' from this element's classes
	    @returns {EL} This EL
    */
	deactivate() {
		$(this.el).removeClass('active');
		return this;
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
                    this.getMain().loader.log(10, msg)
                        .then((loader) => Promise.all(children.map((c) => this.create(c)))
                            .then(() => loader.log(100).then(() => resolve(this))));
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