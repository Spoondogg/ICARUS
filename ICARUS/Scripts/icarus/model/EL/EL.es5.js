/**
    Generic Element Constructor  

    Ideally, this should be treated like an Abstract rather than
    constructed on its own.  
    
    It can be convenient to do this:
        new EL(node, 'DIV', model)

    But it is better practice to do this:
        new DIV(node, model)
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EL = (function (_MODEL) {
    _inherits(EL, _MODEL);

    /**
        Constructs a generic html element.
        @param {EL} node The object to contain this element
        @param {string} element The HTML tag that is used for this element
        @param {MODEL} model A set of key/value pairs for this element's model
        @param {string} innerHTML This text will be displayed within the HTML element
        @param {array} children An object array of child models
    */

    function EL(node, element, model, innerHTML, children) {
        if (element === undefined) element = 'DIV';

        _classCallCheck(this, EL);

        _get(Object.getPrototypeOf(EL.prototype), 'constructor', this).call(this, model.attributes);

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
        // Append the element to its parent and set its inner HTML (when available)
        @param {EL} node Parent node to append to
        @param {MODEL} model A set of key/value pairs for this element's model
        @param {string} innerHTML This text will be displayed within the HTML element
        @returns {EL} This element
     */

    _createClass(EL, [{
        key: 'make',
        value: function make(node, model, innerHTML) {
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
         * Recursively iterates through parent nodes until an object with the given prototype
         * @param {string} value The value to search for within this key
         * @param {any} node Entry point to traversing the chain
         * @param {any} attempt Recursion loop
         * @returns {CONTAINER} The parent container
         */
    }, {
        key: 'getProtoTypeByClass',
        value: function getProtoTypeByClass(value) {
            var node = arguments.length <= 1 || arguments[1] === undefined ? this.node : arguments[1];
            var attempt = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            attempt++;
            try {
                debug('Searching for __proto__.__proto__.constructor.name: ' + value + '(' + attempt + ')');
                //debug(node);

                if (attempt < 100) {
                    try {
                        debug('id: ' + node.id);
                        debug('super class: ');
                        debug(node.__proto__);
                        if (node.__proto__.__proto__.constructor.name === value.toString()) {
                            return node;
                        } else {
                            return this.getProtoTypeByClass(value, node.node, attempt++);
                        }
                    } catch (e) {
                        debug(e);
                        return null;
                    }
                } else {
                    debug('getProtoTypeByClass(): Too many attempts (' + attempt + ')');
                    return null;
                }
            } catch (e) {
                //TypeError: this.getProtoTypeByClass is not a function
                if (e.name === 'TypeError') {
                    console.log('Error Caught: ' + e.message);
                } else {
                    console.log('Error not caught.');
                }
                console.log(e);
            }
        }

        /**
         * Creates a TEXTAREA and populates with this element's contents
         */
    }, {
        key: 'edit',
        value: function edit() {

            app.stickyFooter.show();

            $(this.el).addClass('edit');
            this.editor = new TEXTAREA(app.stickyFooter, new MODEL(new ATTRIBUTES({
                'value': this.el.innerHTML
            })).set({
                'label': '<' + this.element + '>'
            }));

            //$(this.editor.el).insertAfter(this.el);
            this.editor.input.el.setAttribute('style', 'height:200px;');
            this.editor.input.el.onkeyup = (function () {
                this.el.innerHTML = this.editor.input.el.value;
            }).bind(this);

            this.editor.input.el.onblur = (function () {

                try {
                    console.log('Editing ' + this.className + ' inside ' + this.node.className);
                    var val = this.editor.input.el.value;
                    console.log('Value: ' + val);
                    this.node.node.node.data[this.className.toLowerCase()] = val;

                    console.log('THIS.NODE.NODE (Container) ELEMENT DATA:');
                    console.log(this.node.node.node);
                } catch (e) {
                    console.log(e);
                }

                this.editor.destroy();
                $(this.el).removeClass('edit');
                debug('QuickSave');
                this.getProtoTypeByClass('CONTAINER').quickSave(true);

                app.stickyFooter.hide();
                app.stickyFooter.empty();
            }).bind(this);

            this.editor.input.el.focus();
            event.stopPropagation();
        }

        /**
            Acts like a switch statement, performing actions from the given list of callbacks.
            This is used because constructor functions persist across the inheritance chain,
            whereas an actual SWITCH statement would be overridden on each inheritted class.
            @see https://stackoverflow.com/a/35769291/722785
        
            @param {MODEL} model The object model for the element to be created
            @returns {EL} Constructed Element
         */
    }, {
        key: 'create',
        value: function create(model) {
            //debug(this.className+'.create(' + model.className + ')');
            var result = null;
            try {
                this.callbacks[model.className].forEach((function (fn) {
                    result = fn(model);
                }).bind(this));
            } catch (e) {
                app.loader.log(0, this.className + '.create(): No constructor exists ' + 'for className "' + model.className + '"');
                debug(e);
            }
            return result;
        }

        /**
            Add a case to the creator EL.create();
            @param {string} className The Icarus Class name that this callback is meant to construct
            @param {Function} fn Function to call (should accept model)
        */
    }, {
        key: 'addCase',
        value: function addCase(className, fn) {
            this.callbacks[className] = [];
            this.callbacks[className].push(fn);
        }

        /**
            Combines the given model with this model, overriding initial values
            with given ones
            @param {MODEL} model A generic MODEL object
         */
    }, {
        key: 'merge',
        value: function merge(model) {
            if (typeof model === 'object') {
                for (var prop in model) {
                    if (prop !== 'attributes') {
                        /*
                        if (this.hasOwnProperty(prop)) {
                            console.log('Property "' + prop + '" already exists as ' + this[prop].value);
                        }
                        console.log('Setting ' + this.element + '[' + prop + '] to ' + model[prop]);
                        */
                        this[prop] = model[prop];
                    } else {
                        for (var attr in model.attributes) {
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
    }, {
        key: 'open',
        value: function open() {
            this.status = STATUS.OPEN;
            try {
                this.node.open();
                //this.el.setAttribute('data-status', 'open'); // TODO: Does this need to be exposed?
            } catch (e) {
                console.log('Unable to open parent element(' + this.element + ')');
                console.log(e);
            }
        }

        /**
            Closes the EL up for editing.  This should create a link
            between the object on the server and its client side representation
            and update accordingly
        */
    }, {
        key: 'close',
        value: function close() {
            this.status = STATUS.CLOSED;
            this.el.setAttribute('data-status', 'closed');
        }

        /**
            Empties contents of node element
        */
    }, {
        key: 'empty',
        value: function empty() {
            // Remove all children
            while (this.el.firstChild) {
                this.el.removeChild(this.el.firstChild);
            }
        }

        /**
            Removes this element from the DOM
            @param {number} delay Millisecond delay 
        */
    }, {
        key: 'destroy',
        value: function destroy(delay) {
            delay = delay ? delay : 300;
            try {
                setTimeout((function () {
                    //this.node.el.removeChild(this.el);           
                    this.el.parentNode.removeChild(this.el);
                }).bind(this), delay);

                try {
                    var i = this.node.children.indexOf(this);
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
    }, {
        key: 'setClass',
        value: function setClass(className) {
            this.el.className = className;
            this.attributes['class'] = className;
        }

        /**
            Adds the given class name to the element's list of classes
            @param {string} className the class to be appended
        */
    }, {
        key: 'addClass',
        value: function addClass(className) {
            $(this.el).addClass(className);
            var prevClass = this.attributes['class'] || '';
            this.attributes['class'] = prevClass += ' ' + className;
        }

        /**
            Revoves the given class name from the element's list of classes
            @param {string} className the class to be removed
        */
    }, {
        key: 'removeClass',
        value: function removeClass(className) {
            $(this.el).removeClass(className);
            this.attributes.set('class', this.attributes.get('class').replace(className, ''));
        }

        /**
            Shows this Element
        */
    }, {
        key: 'show',
        value: function show() {
            this.el.style.display = 'block';
        }

        /**
            Hides this Element
        */
    }, {
        key: 'hide',
        value: function hide() {
            this.el.style.display = 'none';
        }

        /**
            Adds 'active' to this element's classes
         */
    }, {
        key: 'activate',
        value: function activate() {
            $(this.el).addClass('active');
        }

        /**
            Removes 'active' from this element's classes
         */
    }, {
        key: 'deactivate',
        value: function deactivate() {
            $(this.el).removeClass('active');
        }

        /**
            Toggles the 'active' class on this element
            @param {string} className Optionally toggle this class
        */
    }, {
        key: 'toggle',
        value: function toggle(className) {
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
    }, {
        key: 'populate',
        value: function populate(children) {
            if (children) {

                var denom = children.length;
                var progress = 0; // 0 to 100

                //app.loader.log(this.className + '.populate(' + children.length + ');');
                //app.loader.show();
                try {
                    for (var c = 0; c < children.length; c++) {
                        progress = Math.round((c + 1) / denom * 100);
                        //app.loader.log(progress, this.className+'.populate('+(c+1)+'/'+denom+')');
                        this.create(children[c]);
                    }
                } catch (e) {
                    console.log(e);
                }
                //app.loader.log(100, 'Success');
                if (!DEBUGMODE) {
                    app.loader.hide();
                }
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
    }, {
        key: 'setInnerHTML',
        value: function setInnerHTML(innerHTML) {
            //this.el.innerHTML = innerHTML ? innerHTML : '';
            this.el.innerHTML = innerHTML || '';
        }

        /**
            Scrolls page to the top of this element
         * @param {any} speed Millisecond duration
         */
    }, {
        key: 'scrollTo',
        value: function scrollTo() {
            var speed = arguments.length <= 0 || arguments[0] === undefined ? 1000 : arguments[0];

            console.log('Scrolling to this element at ' + parseInt($(this.el).offset().top));
            $(this.node.el).animate({
                scrollTop: parseInt($(this.el).offset().top)
            }, speed);
        }
    }]);

    return EL;
})(MODEL);

