/**
    Generic Element Constructor    
*/
class EL extends MODEL {
    /**
        Constructs a generic html element.
        @param {EL} node The object to contain this element
        @param {string} element The HTML tag that is used for this element
        @param {MODEL} model A set of key/value pairs for this element's model
        @param {string} innerHTML This text will be displayed within the HTML element
        @param {array} children An object array of child models
    */
    constructor(node, element = CONTAINERTYPES.DEFAULT, model, innerHTML, children) {
        super(model.attributes);

        this.node = node; // The parent EL (or Body) that this ELEMENT is within        
        this.className = this.constructor.name;
        this.element = element || HtmlElement.DEFAULT; // Html Element that this EL represents

        this.status = STATUS.DEFAULT; // Element state changes depend on this.status 

        this.children = children ? children : []; // Contains an array of child element models
        this.callbacks = {}; // Contains a series of Constructor functions that this element can use

        this.make(node);

        this.merge(model);
        this.setInnerHTML(innerHTML);
    }

    /**
        Create the HTML element in the DOM, appended to the given node
        // Append the element to its parent and set its inner HTML (when available)
        @param {EL} node Parent node to append to
        @returns {EL} This element
     */
    make(node) {        
        if (node === document.body) {
            debug('BODY.create(' + this.element + ')');
            this.el = node.appendChild(document.createElement(this.element));
            node = this;
        } else {
            this.el = node.el.appendChild(document.createElement(this.element));
        }
        return this;
    }

    /**
        Acts like a switch statement, performing actions from the given list of callbacks.
        This is used because constructor functions persist across the inheritance chain,
        whereas an actual SWITCH statement would be overridden on each inheritted class.
        @see https://stackoverflow.com/a/35769291/722785
    
        param {string} className HTML Element and Javascript Class to construct
        @param {MODEL} model The object model for the element to be created
        @returns {EL} Constructed Element
     */
    create(model) {
        debug(this.className+'.create(' + model.className + ')');
        let result = null;
        try {
            this.callbacks[model.className].forEach(function (fn) {
                result = fn(model);
            }.bind(this));
        } catch (e) {
            console.log(
                this.className + '.create(): No constructor exists '
                + 'for className "' + model.className + '"'
            );
            console.log(e);
        }
        return result;
    }

    /**
        Add a case to the creator EL.create();
        @param {string} className The Icarus Class name that this callback is meant to construct
        @param {Function} fn Function to call (should accept model)
    */
    addCase(className, fn) {
        //this.callbacks[className] = this.callbacks[className] || [];
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
    */
    open() {
        this.status = STATUS.OPEN;
        try {
            this.node.open();
            //this.el.setAttribute('data-status', 'open'); // TODO: Does this need to be exposed?
        } catch (e) {
            console.log('Unable to open parent element('+this.element+')');
            console.log(e);
        }
    }

    /**
        Closes the EL up for editing.  This should create a link
        between the object on the server and its client side representation
        and update accordingly
    */
    close() {
        this.status = STATUS.CLOSED;
        this.el.setAttribute('data-status', 'closed');
    }

    /**
        Empties contents of node element
    */
    empty() {	// Remove all children
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    }

    /**
        Removes this element from the DOM
        @param {number} delay Millisecond delay 
    */
    destroy(delay) {
        delay = delay ? delay : 300;
        try {
            setTimeout(function () {
                //this.node.el.removeChild(this.el);            
                this.el.parentNode.removeChild(this.el);
            }.bind(this), delay);

            try {
                let i = this.node.children.indexOf(this);
                this.node.children.splice(i, 1);
            } catch (ee) {
                console.log('Unable to remove ' + this.element + ' from node.children');
            }

        } catch (e) {
            console.log('Unable to destroy this ' + this.element);
            console.log(e);
        }
    }

    /**
        Override this element's class with the given value
        @param {string} className A class
     */
    setClass(className) {
        this.el.className = className;
        this.attributes.class = className;
    }

    /**
        Adds the given class name to the element's list of classes
        @param {string} className the class to be appended
    */
    addClass(className) {
        $(this.el).addClass(className);
        let prevClass = this.attributes.class || '';
        this.attributes['class'] = prevClass += ' ' + className;
    }

    /**
        Revoves the given class name from the element's list of classes
        @param {string} className the class to be removed
    */
    removeClass(className) {
        $(this.el).removeClass(className);
        this.attributes.set('class',
            this.attributes.get('class').replace(className, '')
        );
    }

    /**
        Shows this Element
    */
    show() {
        this.el.style.display = 'block';
    }

    /**
        Hides this Element
    */
    hide() {
        this.el.style.display = 'none';
    }

    /**
        Adds 'active' to this element's classes
     */
    activate() {
        $(this.el).addClass('active');
    }

    /**
        Removes 'active' from this element's classes
     */
    deactivate() {
        $(this.el).removeClass('active');
    }

    /**
        Toggles the 'active' class on this element
        @param {string} className Optionally toggle this class
    */
    toggle(className) {
        if (className) {
            $(this.el).toggleClass(className); // || 'active'
        } else {
            $(this.el).toggle();
        }
    }

    /**
        Create all children elements in the order that
        they were pushed into provided array
        @param {array} children Array of children object models to be constructed
    */
    populate(children) {
        if (children) {
            debug(this.className + '.populate(' + children.length + ');');
            try {
                for (let c = 0; c < children.length; c++) {
                    this.create(children[c]);
                }
            } catch (e) { console.log(e); }
        }
    }

    /**
        Modifies the element
        @param {string} name The name to be assigned to this element
    
    save(name) {
        this.el.setAttribute('name', name);
    }*/

    /**
        Sets the inner HTML of this element
        @param {string} innerHTML Html string to be parsed into HTML
    */
    setInnerHTML(innerHTML) {
        //this.el.innerHTML = innerHTML ? innerHTML : '';
        this.el.innerHTML = innerHTML || '';
    }

    /**
        Scrolls page to the top of this element
     * @param {any} speed Millisecond duration
     */
    scrollTo(speed = 1000) {
        console.log('Scrolling to this element at ' + parseInt($(this.el).offset().top));
        $(this.node.el).animate({
            scrollTop: parseInt($(this.el).offset().top)
        }, speed);
    }
}