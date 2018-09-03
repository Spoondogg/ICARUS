/**
    Icarus
    @description A Single Page Web Application Engine
    @version 0.5.1.20180830
    @author Ryan Dunphy <ryan@spoonmedia.ca>
*/
console.log('Icarus.main.js');
"use strict";

console.log('Icarus.Index.cshtml > viewInit');

const DEBUGMODE = true; // If true, debug outputs are shown
const TESTING = false; // If true, tests are ran and results are shown in the console.

import './StringMethods.js';
import './DebugMethods.js';
import './DomMethods.js';

import CONTAINERFACTORY from './model/el/container/CONTAINERFACTORY.js';
import MAIN from './model/el/container/main/MAIN.js';

var token = document.getElementsByName('__RequestVerificationToken')[0];
try {
    token.parentNode.removeChild(token);
} catch (e) {
    debug('Failed to remove TOKEN from BODY');
    debug(e);
}

var factory = new CONTAINERFACTORY();



// Set application URL and forward to return URL if required
var app = new MAIN();
app.url = new URL(window.location.href);
let returnUrl = app.url.searchParams.get('ReturnUrl');
if (returnUrl) {
    returnUrl = app.url.origin + returnUrl;
    location.href = returnUrl;
}

console.log('This sentence should be camelcased'.camelcase());
console.log('GUID: ' + new String().guid());
debug('This is debugger output.');

console.log('App ID: ' + app.id + '(From main.js)');

let isLogin = app.url.searchParams.get('login');
if (isLogin) {
    if (user === 'Guest') {
        app.login();
    }
}

app.load(appId);
/**
    A Console Output Watermark
*/
export class WATERMARK {
    /**
        Prints the spoonMEDIA.ca watermark to the console because its cool.
        @See http://ascii.co.uk/text : chunky
    */
    constructor() {
        console.log("\n\n");
        console.log(".-----.-----.-----.-----.-----.--------.-----.--|  |__|.---.-.  .----.---.-.");
        console.log("|__ --|  _  |  _  |  _  |     |        |  -__|  _  |  ||  _  |__|  __|  _  |");
        console.log("|_____|   __|_____|_____|__|__|__|__|__|_____|_____|__||___._|__|____|___._|");
        console.log("      |__|                                                                  ");
        console.log("\n\n");
    }
}
/**
    A generic set of ATTRIBUTES for an EL
    TODO: Consider just extending Map()
 */
export class ATTRIBUTES extends Object { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
    /**
        Constructs a generic Attributes data structure.
        If the 'className' argument is an object, break it out into individual attributes
        Otherwise, map to className, name, type and value (Optionally)

        @param {object} className A collection of attributes || className Element class attribute
        @param {string} name Optional Element name attribute
        @param {string} type Element type attribute
        @param {string} value Element value attribute
     */
    constructor(className, name, type, value) {
        super();
        switch (typeof className) {
            case 'string':            
                this.set('class', className);
                this.set('name', name);
                this.set('type', type);
                this.set('value', value);
                break;

            case 'object':
                for (let attr in className) {
                    this.set(attr, className[attr]);
                }
                break;                
        }        
    }

    /**
        Gets the specified attribute
        @param {string} key Attribute key
        @returns {object} Attribute Object
     */
    get(key) {
        let obj = null;
        try {
            obj = this[key];
        } catch (e) {
            console.log('No attribute exists for key "' + key + '"');
        }
        return obj;
    }

    /**
        @param {string} key Attribute name
        @param {any} value Attribute value
        @returns {ATTRIBUTES} this 
     */
    set(key, value) {
        if (value !== undefined && value !== null) {
            this[key] = value || '';
        }
        return this;
    }
}
import { ATTRIBUTES } from './ATTRIBUTES.js';
/**
    A Map like data structure
    TODO: Consider just extending Map() 
*/
export class MODEL { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
    /**
        Constructs a generic MODEL
        @param {ATTRIBUTES} attributes A collection of attributes
        @param {ATTRIBUTES} data A collection of data attributes
        @param {ATTRIBUTES} description A collection of description attributes
    */
    constructor(attributes, data, description) {
        this.attributes =
            typeof attributes === 'string'
                ? new ATTRIBUTES(attributes)
                : attributes || new ATTRIBUTES();

        this.data = data || new ATTRIBUTES();

        this.description = description || new ATTRIBUTES();
    }

    /**
        Sets a property (or a collection of properties) for this MODEL
        @param {string} key Name of property || An object containing key/value pairs
        @param {any} value Value for property
        @returns {MODEL} The object MODEL
    */
    set(key, value) {
        if (typeof key === 'string') {
            try {
                this[key] = value;
                return this;
            } catch (e) {
                console.log('Unable to set property of this MODEL.');
                console.log(e);
            }

        } else {
            for (let prop in key) {
                this[prop] = key[prop];
            }

        }
        return this;
    }

    /**
        Gets a property from this MODEL
        @param {string} key Name of property
        @returns {any} The value of the given key
    */
    get(key) {
        try {
            return this[key];
        } catch (e) {
            console.log('Unable to get property "'+key+'" of this MODEL.');
            console.log(e);
        }
    }
}
import { MODEL } from '../MODEL.js';
/**
    Generic Element Constructor  

    Ideally, this should be treated like an Abstract rather than
    constructed on its own.  
    
    It can be convenient to do this:
        new EL(node, 'DIV', model)

    But it is better practice to do this:
        new DIV(node, model)
*/
export class EL extends MODEL {
    /**
        Constructs a generic html element.
        @param {EL} node The object to contain this element
        @param {string} element The HTML tag that is used for this element
        @param {MODEL} model A set of key/value pairs for this element's model
        @param {string} innerHTML This text will be displayed within the HTML element
        @param {array} children An object array of child models
    */
    constructor(node, element = 'DIV', model, innerHTML, children) {
        super(model.attributes);
        
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
     * Recursively iterates through parent nodes until an object with the given prototype
     * @param {string} value The value to search for within this key
     * @param {any} node Entry point to traversing the chain
     * @param {any} attempt Recursion loop
     * @returns {CONTAINER} The parent container
     */
    getProtoTypeByClass(value, node = this.node, attempt = 0) {
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
    edit() {

        app.stickyFooter.show();

        $(this.el).addClass('edit');
        this.editor = new TEXTAREA(app.stickyFooter, new MODEL(
            new ATTRIBUTES({
                'value': this.el.innerHTML
            })
        ).set({
            'label': '<' + this.element + '>'
        }));

        //$(this.editor.el).insertAfter(this.el);
        this.editor.input.el.setAttribute('style', 'height:200px;');
        this.editor.input.el.onkeyup = function () {
            this.el.innerHTML = this.editor.input.el.value;
        }.bind(this);
        
        this.editor.input.el.onblur = function () {

            try {
                console.log('Editing ' + this.className + ' inside ' + this.node.className);
                let val = this.editor.input.el.value;
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
        }.bind(this);

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
    create(model) {
        //debug(this.className+'.create(' + model.className + ')');
        let result = null;
        try {
            this.callbacks[model.className].forEach(function (fn) {
                result = fn(model);
            }.bind(this));
        } catch (e) {
            app.loader.log(0,
                this.className + '.create(): No constructor exists '
                + 'for className "' + model.className + '"'
            );
            debug(e);
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

            let denom = children.length;
            let progress = 0; // 0 to 100
            
            //app.loader.log(this.className + '.populate(' + children.length + ');');
            //app.loader.show();
            try {
                for (let c = 0; c < children.length; c++) {
                    progress = Math.round((c+1) / denom * 100);
                    //app.loader.log(progress, this.className+'.populate('+(c+1)+'/'+denom+')');
                    this.create(children[c]);
                }
            } catch (e) { console.log(e); }
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
/**
 * Stores the default DATA ELEMENTS collections for each Class
 * This belongs on the database or within a config
 * 
 * DataElements can act as a mask to filter values for this element
 * 
 * NOTE:  'value' is a reserved keyword... I think
 * 
 */
const DATAELEMENTS = {
    ARTICLE: [],
    SECTION: [
        new MODEL(new ATTRIBUTES({
            'name': 'collapsed',
            'type': 'NUMBER'
        })).set({
            'element': 'INPUT',
            'label': 'Collapsed'
        })
    ],

    CONTAINER: [],
    
    DICTIONARY: [
        new MODEL(new ATTRIBUTES({
            'name': 'language',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'language'
        })
    ],

    LIST: [],
    LISTITEM: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    WORD: [
        new MODEL(new ATTRIBUTES({
            'name': 'language',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'language'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'typeId',
            'type': 'NUMBER'
        })).set({
            'element': 'INPUT',
            'label': 'typeId'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'value',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'value'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'definition',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'definition'
        })
    ],

    MAIN: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    FORM: [],
    FIELDSET: [],
    FORMELEMENTGROUP: [],
    FORMELEMENT: [],

    FORMPOST: [],

    CALLOUT: [
        new MODEL(new ATTRIBUTES({
            'name': 'icon',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'icon'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    INPUT: [
        new MODEL(new ATTRIBUTES({
            'name': 'type',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'type'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'name',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'name'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'value',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'value'
        })
    ],
    FORMPOSTINPUT: [],
    THUMBNAIL: [
        new MODEL(new ATTRIBUTES({
            'name': 'img',
            'type': 'NUMBER'
        })).set({
            'element': 'BUTTON',
            'label': 'img',
            'type': 'FORMPOSTINPUT',
            'inputs': [
                new MODEL(new ATTRIBUTES({
                    'name': 'file',
                    'type': 'file'
                })).set({
                    'element': 'INPUT',
                    'label': 'file'
                })
            ]
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'bgImage',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'bgImage'
        })
    ],

    JUMBOTRON: [
        new MODEL(new ATTRIBUTES({
            'name': 'header',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'header'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        }),
        
        new MODEL(new ATTRIBUTES({
            'name': 'bgimage',
            'type': 'NUMBER'
        })).set({
            'element': 'BUTTON',
            'label': 'bgimage',
            'type': 'FORMPOSTINPUT',
            'inputs': [
                new MODEL(new ATTRIBUTES({
                    'name': 'file',
                    'type': 'file'
                })).set({
                    'element': 'INPUT',
                    'label': 'file'
                })
            ]
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'screencolor',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'screencolor'
        }),

        new MODEL(new ATTRIBUTES({
            'name': 'bgcolor',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'bgcolor'
        })
    ],

    PARAGRAPH: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'p'
        })
    ],

    TEXTBLOCK: [
        new MODEL(new ATTRIBUTES({
            'name': 'p',
            'type': 'text'
        })).set({
            'element': 'INPUT',
            'label': 'text'
        })
    ]
};


/**
    Enumerated list of Input Types
    Matched to IcarusFormGroup Enums
*/
const IcarusInputType = {
    TEXT: 1,
    NUMBER: 2,
    DATE: 3,
    DATETIME: 4,
    HIDDEN: 5,
    PASSWORD: 6
};

/**
 * Supported HTML 5 Elements
 */
const HtmlElement = {
    DEFAULT: "DIV",
    DIV: "DIV",
    SPAN: "SPAN",
    P: "P",
    MAIN: "MAIN",
    ARTICLE: "ARTICLE",
    SECTION: "SECTION",
    UL: "UL",
    OL: "OL",
    LI: "LI",
    FORM: "FORM",
    FIELDSET: "FIELDSET",
    LABEL: "LABEL",
    INPUT: "INPUT",
    SELECT: "SELECT",
    OPTION: "OPTION",
    TEXTAREA: "TEXTAREA"
};

/**
 * CSS Alignment options
 */
const ALIGN = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
    HORIZONTAL: '',
    VERTICAL: 'vertical'
};

/**
 * Bootstrap button types
 */
const BUTTONTYPE = {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    DANGER: 'danger'
};

/**
 * Bootstrap size options
 */
const SIZE = {
    EXTRA_SMALL: 'xs',
    SMALL: 'sm',
    MED: 'md',
    LARGE: 'lg'
};

/**
 * Form methods
 */
const METHOD = {
    DEFAULT: 'POST',
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT'
};

/**
 * Element status for any state changes
 */
const STATUS = {
    DEFAULT: 0,
    OPEN: 1,
    CLOSED: 0,
    LOCKED: 0
};
/**
 * Bootstrap glyphicon references
 */
const ICONS = {
    CHEVRON_UP: 'glyphicon-chevron-up',
    CHEVRON_DOWN: 'glyphicon-chevron-down',
    CHEVRON_LEFT: 'glyphicon-chevron-left',
    CHEVRON_RIGHT: 'glyphicon-chevron-right',
    PENCIL: 'glyphicon-pencil',
    ARROW_UP: 'glyphicon-arrow-up',
    ARROW_DOWN: 'glyphicon-arrow-down',
    LOCK: 'glyphicon-lock',
    UNLOCK: 'glyphicon-pencil',
    COG: 'glyphicon-cog',
    PLUS: 'glyphicon-plus',
    SAVE: 'glyphicon-save',
    DELETE: 'glyphicon-minus',
    LOAD: 'glyphicon-open-file',
    UP: 'glyphicon-triangle-top',
    DOWN: 'glyphicon-triangle-bottom',
    OPTIONS: 'glyphicon-option-vertical',
    RESET: 'glyphicon-refresh',
    REFRESH: 'glyphicon-refresh',
    REMOVE: 'glyphicon-remove-circle',
    LIST: 'glyphicon-th-list',
    CERTIFICATE: 'glyphicon-certificate',
    USER: 'glyphicon-user',
    EXCLAMATION: 'glyphicon-exclamation-sign',
    PUBLIC: 'glyphicon-eye-open',
    PRIVATE: 'glyphicon-eye-close',
    IFRAME: 'glyphicon-new-window',
    CONSOLE: 'glyphicon-new-window',
    FORM: 'glyphicon-list-alt',
    JUMBOTRON: 'glyphicon-blackboard',
    BANNER: 'glyphicon-th-large',
    PARAGRAPH: 'glyphicon-text-background',
    FIELDSET: 'glyphicon-folder-close',
    ARTICLE: 'glyphicon-file',
    SECTION: 'glyphicon-indent-left',
    FORMELEMENTGROUP: 'glyphicon-tasks',
    INPUT: 'glyphicon-log-in',
    SELECT: 'glyphicon-tasks',
    TEXTAREA: 'glyphicon-text-background',
    CALLOUT: 'glyphicon-comment',
    THUMBNAIL: 'glyphicon-credit-card',
    TOGGLE: 'glyphicon-check',
    IMAGE: 'glyphicon-picture',
    CHAT: 'glyphicon-comment',
    MENULIST: 'glyphicon-menu-hamburger',
    WORD: 'glyphicon-tags',
    DICTIONARY: 'glyphicon-book',
    IMAGEGALLERY: 'glyphicon-picture',
    CLASSVIEWER: 'glyphicon-list-alt',
    INDEX: 'glyphicon-th',
    INDEXMAIN: 'glyphicon-th-large',
    HOME: 'glyphicon-home',
    SIDEBAR: 'glyphicon-log-in',
    MAIN: 'glyphicon-modal-window'
};

/**
    SVG_LEGACY
    Preload scalable vector graphic Object into memory
    viewbox: 	    object dimensions ie: '0 0 48 48' equals a 48px box
    fill:			object color value (hex,rgba) '#fff'
    path:           object path values
    svgObj:         SVG Object loaded into memory via loadJSON(svgURL);
    viewbox:
					minx—the beginning x coordinate
					miny—the beginning y coordinate
					width—width of the view box
					height—height of the view box

    SVG_LEGACY(
        '0 0 28 28',
        '#FFF',
        'M24.921,6.199v18.722c0,0.861-0.698,1.561-1.56,1.561H4.639c-0.861,0-1.56-0.699-1.56-1.561V6.199
        c0-0.862,0.699-1.561,1.56-1.561h1.561v-1.56c0-0.862,0.698-1.56,1.561-1.56c0.862,0,1.56,0.698,1.56,1.56v1.56h3.12v-1.56
        c0-0.862,0.699-1.56,1.561-1.56c0.861,0,1.56,0.698,1.56,1.56v1.56h3.121v-1.56c0-0.862,0.699-1.56,1.56-1.56
        c0.861,0,1.56,0.698,1.56,1.56v1.56h1.562C24.223,4.639,24.921,5.337,24.921,6.199z M21.8,10.88H6.199v1.559H21.8V10.88z
        M21.8,15.56H6.199v1.562H21.8V15.56z M21.8,20.239H6.199v1.562H21.8V20.239z',
        header.command[(header.command.length-1)]
    )
    svg.icon[doc.html.dom.article.section[0].id].path

    @param {string} viewbox The 4 coordinates representing the SVG viewbox
    @param {object} svgObj The svg object retrieved from the server
    @param {object} node The element that this SVG is appended to
    @param {string} fill A hex based color value

*/
const SVG_LEGACY = function (viewbox, svgObj, node, fill) {
    // SVG Object
    node.svg = node.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    //parentObj.svg.setAttribute('viewBox',viewbox);
    //parentObj.svg.setAttribute('viewBox','0 0 ' + parentObj.offsetWidth + ' ' + parentObj.offsetHeight);
    node.svg.setAttribute('viewBox', '0 0 32 32'); // temporary fixed size	
    node.svg.path = node.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
    node.svg.path.setAttribute('fill', fill ? fill : svgObj.fill);
    node.svg.path.setAttribute('d', svgObj.path);
};

/**
    Creates a scaleable vector graphic
    @param {EL} node The element that this SVG is appended to
    @param {string} viewbox The 4 coordinates representing the SVG viewbox
    @param {object} svgObj The svg object retrieved from the server
    @param {string} fill A hex based color value
*/
class SVG extends EL {
    constructor(node, viewbox, svgObj, fill) {
        super(node, 'SVG', { 'viewBox': '0 0 32 32' });
        this.path = new EL(super.el, 'PATH', {
            'fill': fill ? fill : svgObj.fill,
            'd': svgObj.fill
        });
    }
}
/**
    An image
*/
class IMG extends EL {
    /**
        Constructs a Paragraph
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
     */
    constructor(node, model){
        super(node, 'IMG', model);
        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }
}
/**
    A hyperlink / page anchor    
*/
class ANCHOR extends EL {
    /**
        Constructs a generic Anchor
        @param {EL} node The object to contain this element
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'A', model);
        
        if (model.icon) {
            let lbl = model.label ? model.label : '';
            this.icon = new GLYPHICON(this, lbl, model.icon);
        } else {
            this.setInnerHTML(this.el.innerHTML += model.label); 
        }
    }
}
/**
    A bootstrap badge, typically contained within a list-item
    @param {EL} node The object to contain this element
    @param {string} label The inner text for this element
    
*/
class BADGE extends EL {
    constructor(node, label) {
        super(node, 'SPAN', { 'class': 'badge' }, label);
    }
}


/**
    A horizontal ruler
*/
class HR extends EL {
    /**
        Constructs a generic Anchor
        @param {EL} node The object to contain this element
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'HR', model);
    }
}
/**
    A standard control-label for form elements
*/
class LABEL extends EL {
    /**
        Constructs a generic Label
        @param {EL} node the parent
        @param {string} label The innerHtml to be displayed
     */
    constructor(node, label) {
        super(node, 'LABEL', new MODEL(new ATTRIBUTES('control-label')), label || 'My Label');
    }

    /**
        Sets the value of this label
        @param {string} name
     */
    rename(name) {
        this.setInnerHTML(name);
    }
}
/**
    A blob of text
*/
class SPAN extends EL {
    /**
        Constructs a blob of text in a SPAN
        @param {EL} node The object to contain this element
        @param {MODEL} model The object attributes
        @param {string} innerHtml The object contents (html)
     */
    constructor(node, model, innerHtml) {
        super(node, 'SPAN', model, innerHtml);
    }
}
/**
    An icon button that toggles a dropdown
*/
class CARET extends SPAN {
    /**
        Construct an Icon button to toggle a dropdown
        @param {EL} node Parent element
     */
    constructor(node) {
        super(node, new MODEL(new ATTRIBUTES('caret')));
    }
}
/**
    Bootstrap style buttons, groups etc
*/
class GLYPHICON extends SPAN {
    /**
        Construct a Glyphicon
        @param {EL} node parent object
        @param {string} label The label
        @param {string} glyphicon The bootstrap glyphicon or ICON enum
     */
    constructor(node, label, glyphicon) {
        super(node, new MODEL(new ATTRIBUTES(glyphicon ? glyphicon : '')));
        this.addClass('icon glyphicon');
        this.label = new SPAN(this, new MODEL(new ATTRIBUTES('icon-label')), label);
    }

    /**
        Sets the ICON class to the given glyphicon
        @param {string} glyphicon The glyphicon name
     */
    setIcon(glyphicon) {
        this.el.className = glyphicon;
    }
}
/**
    A paragraph of text
*/
class P extends EL {
    /**
        Constructs a Paragraph
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
        @param {string} innerHtml Inner HTML within this paragraph
     */
    constructor(node, model, innerHtml){
        super(node, 'P', model, model.innerHtml || innerHtml);
        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }
}
/**
    A block of text contained within a Well.
 */
class WELL extends P {
    /**
        Constructs a Well
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
        @param {string} innerHtml Inner HTML within this paragraph
    */
    constructor(node, model, innerHtml) {
        super(node, model, innerHtml);
        this.addClass('well');
    }
}
import EL from '../EL.js';
/**
    A grouping of list items
 */
export class GROUP extends EL {

    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {string} element HTML Element 
        @param {MODEL} model The json object representing this element
     */
    constructor(node, element, model) {
        super(node, element, model);
        if (model.name) {
            this.name = model.name; // Required
            this.el.setAttribute('name', model.name);
        }
        this.groups = {};
    }

    /**
        Retrieves the specified group
        @param {string} name Name of group
        @returns {GROUP} A group
     */
    getGroup(name) {
        return this.groups[name];
    }

    /**
        Adds the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
     */
    addGroup(group) {
        this.groups[group.name] = group;
        return this.groups[group.name];
    }

    /**
        Adds or Overrides the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
     */
    setGroup(group) {
        if (this.groups[name] === undefined) {
            this.groups[group.name] = group;
        }
        return this.groups[group.name];
    }
}
/**
 * Containers have a 'body' that can contain an optional sidebar
 */
export class CONTAINERBODY extends EL {
    /**
        Construct a body with an optional sidebar
         @param {CONTAINER} node Parent
         @param {MODEL} model Object
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('container-body collapse in'); // q??

        this.sidebar = null;

        this.pane = new EL(this, 'DIV', new MODEL('pane'));

        // Add swipe detection for editing options in sidebar

        this.pane.el.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.pane.el.addEventListener('touchmove', this.handleTouchMove, { passive: true });

        this.xDown = null;
        this.yDown = null;

        if (dev) {
            this.pane.el.ondblclick = function (e) {
                //node.toggleSidebar();
                app.loader.log('Launch Editor for ' + node.className + '(' + node.id + ')');
                $(node.navBar.header.menu.el).collapse('show');
                node.btnSave.el.click();
                e.stopPropagation(); // Prevent parent double click()
            };
        }
    }

    /**
     * Sets start coordinates
     * @param {Event} ev Event
     */
    handleTouchStart(ev) {
        this.xDown = ev.touches[0].clientX;
        this.yDown = ev.touches[0].clientY;
    }


    /**
     *
     * Process the swipe on body.pane
     * Move body.pane into its own PANE class
     * See https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
     * @param {any} evt Event
     */
    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* left swipe */
                console.log(this.className +'left swipe');
            } else {
                /* right swipe */
                console.log(this.className +'right swipe');
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
                console.log(this.className+' up swipe');
            } else {
                /* down swipe */
                console.log(this.className +' down swipe');
            }
        }
        /* reset values */
        this.xDown = null;
        this.yDown = null;
    }

    /**
        Toggle the collapsed state of this container
     */
    collapse() {
        $(this.el).collapse('toggle');
    }
}
/**
    Constructs various Containers and returns them to be appended
 */
export class CONTAINERFACTORY {
    /**
        A Container Factory
     */
    constructor() {

    }

    /**
        Gets this Container from the database via ajax GET request.
        Retrieves object model and returns the container.

        A placeholder object is created to ensure that values are loaded
        in the appropriate order, regardless of any delays from getJson()

        @param {MODEL} node Parent node (Generally append to node.body.pane)
        @param {string} className Container Constructor Name
        @param {number} id Container UId
        @returns {CONTAINER} A newly constructed container
    */
    get(node, className, id) {
        //debug('CONTAINERFACTORY.get(' + className + ',' + id + ');');

        let span = new SPAN(node, new MODEL());
        let index = node.children.push(span); // Reserve the slot in the array
        
        return $.getJSON('/' + className + '/Get/' + id, function (result) {
            let obj = null;
            switch (className) {
                case 'LI':
                    obj = new LI(span, result.model);
                    break;

                case 'UL':
                    obj = new UL(span, result.model);
                    break;

                case 'LISTITEM':
                    obj = new LISTITEM(span, result.model);
                    break;

                case 'LIST':
                    obj = new LIST(span, result.model);
                    break;

                case 'MENULIST':
                    obj = new MENULIST(span, result.model);
                    break;

                case 'MENU':
                    obj = new MENU(span, result.model);
                    break;

                case 'NAVITEM':
                    obj = new NAVITEM(span, result.model);
                    break;

                case 'NAVSEPARATOR':
                    obj = new NAVSEPARATOR(span, result.model);
                    break;

                case 'TEXTBLOCK':
                    obj = new TEXTBLOCK(span, result.model);
                    break;

                case 'JUMBOTRON':
                    obj = new JUMBOTRON(span, result.model);
                    break;

                case 'CLASSVIEWER':
                    obj = new CLASSVIEWER(span, result.model);
                    break;

                case 'INDEX':
                    obj = new INDEX(span, result.model);
                    break;

                case 'INDEXMAIN':
                    obj = new INDEXMAIN(span, result.model);
                    break;

                case 'IMAGEGALLERY':
                    obj = new IMAGEGALLERY(span, result.model);
                    break;

                /*
                case 'HEADER':
                    obj = new HEADER(span, result.model);
                    break;
                */

                case 'DICTIONARY':
                    obj = new DICTIONARY(span, result.model);
                    break;

                case 'PARAGRAPH':
                    obj = new PARAGRAPH(span, result.model);
                    break;

                case 'WORD':
                    obj = new WORD(span, result.model);
                    break;

                case 'BANNER':
                    obj = new BANNER(span, result.model);
                    break;

                case 'CALLOUT':
                    obj = new CALLOUT(span, result.model);
                    break;

                case 'THUMBNAIL':
                    obj = new THUMBNAIL(span, result.model);
                    break;

                case 'INDEXTHUMBNAIL':
                    obj = new INDEXTHUMBNAIL(span, result.model);
                    break;

                case 'IFRAME':
                    obj = new IFRAME(span, result.model);
                    break;

                case 'ARTICLE':
                    obj = new ARTICLE(span, result.model);
                    break;

                case 'SECTION':
                    obj = new SECTION(span, result.model);
                    break;

                case 'CHAT':
                    obj = new CHAT(span, result.model);
                    break;

                case 'FORM':
                    obj = new FORM(span, result.model);
                    break;

                case 'FIELDSET':
                    obj = new FIELDSET(span, result.model);
                    break;

                case 'FORMELEMENTGROUP':
                    obj = new FORMELEMENTGROUP(span, result.model);
                    break;

                case 'FORMPOSTINPUT':
                    obj = new FORMPOSTINPUT(span, result.model);
                    break;

                case 'INPUT':
                    obj = new INPUT(span, result.model);
                    break;

                case 'SELECT':
                    obj = new SELECT(span, result.model);
                    break;

                case 'TEXTAREA':
                    obj = new TEXTAREA(span, result.model);
                    break;

                case 'OPTION':
                    obj = new OPTION(span, result.model);
                    break;
            }
            node.children[index] = obj;
            if (obj !== null) {
                try {
                    span.el.parentNode.replaceChild(obj.el, span.el);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Remove the temporary node
                span.destroy();
                node.children.splice(index, 1);
            }
            return node.children[index];
        });
    }
}
import GROUP from '../group/GROUP.js';
/**
    A generic CONTAINER with a header that controls population of this element.

    A container can be expanded or hidden and
    have elements added to itself.
*/
export class CONTAINER extends GROUP {
    /**
        @param {EL} node The element to contain the section
        @param {string} element HTML element
        @param {MODEL} model The CONTAINER object retrieved from the server
        @param {array} containerList An array of strings representing child Containers that this Container can create
     */
    constructor(node, element, model = new MODEL().set({
        'element': element,
        'name': element || '',
        'label': element,
        'shared': 1
    }), containerList = []) {
        super(node, element, model);
        this.addClass('icarus-container');
        this.isContainer = 1;

        // Data elements contain a list of arguments for a data object
        this.dataElements = DATAELEMENTS[this.className];

        this.attrElements = []; // Attribute elements contain a list of attributes that apply for this object
        
        if (model.id) {
            this.el.setAttribute('id', model.id);
        }

        this.shared = this.shared ? this.shared : 1;

        // Container Properties
        this.prompt = null;
        this.updateUrl = this.element + '/Set';  // model.className should be the actual value, no?                
        this.subsections = (model.subsections) ? model.subsections.split(',') : '0'; // Delimited list of child ids

        // HELLO!!!!!!!!!!!!
        // Consider that if model.navBar doesn't exist, it doesn't need to be created
        // navbar is pretty heavy
        // Create it on demand instead of always being here
        // Use el.make() as required
        // Implement el.make() as an argument of new EL();
        
        if (model.navBar === undefined) {
            model.navBar = {};
            model.navBar.label = model.label;
        }

        let showHeader = false;
        if (dev || model.element === 'MAIN') {
            showHeader = true;
        }

        /*
         * Ok, so you need to create a placeholder or some sort of toggle button to trigger the 
         * navbar.
         * 
         * Pressing the button would then load the entire navbar...  better, right?
         * 
         * The toggle button should only be visible if the user has DEV priveliges
         */


        // Create the full navBar...  Ugh
        this.navBar = new NAVBAR(this, model.navBar);
        if (showHeader) {
            this.showNavBar();
        }

        // On drag, drag this container
        this.navBar.el.setAttribute('draggable', true);

        // https://www.w3schools.com/jsref/event_ondrag.asp
        // Drag containers by their NavBars
        this.navBar.el.ondragstart = function (ev) {
            console.log('Dragging Container: ' + this.className + '(' + this.id + ') ' + this.label);
            this.collapse();
            //console.log(this.el);
            ev.dataTransfer.setData("Container", this.id);
        }.bind(this);

        // Drop the Container
        this.navBar.el.ondrop = function (ev) {
            console.log('Dropping onto Container: ' + this.className + '(' + this.id + ')');
            ev.preventDefault();
            //var containerId = ev.dataTransfer.getData("Container");
            //console.log(data);    

            let container = $(document.getElementById(ev.dataTransfer.getData("Container")));
            container.insertBefore(this.el);
            container.collapse('show');

            setTimeout(function () {
                console.log('QuickSaving drop recipient parent ' + this.className + '(' + this.id + ')');
                this.getProtoTypeByClass('CONTAINER').quickSave(false); // QuickSave Parent
            }.bind(this), 500);

        }.bind(this);

        // Allow drop on this Container
        this.navBar.el.ondragover = function (ev) {
            //console.log('Dragging over ' + this.className + '(' + this.id + ')');
            ev.preventDefault();
        }.bind(this);

        this.navBar.el.ondragend = function (ev) {
            // Drag Ending
        }.bind(this);    

        

        this.body = new CONTAINERBODY(this, model);

        if (model.navBar) {
            this.addNavBarDefaults();
        }

        // Default permitted child containers
        this.addContainerCase('IFRAME');
        this.addContainerCase('FORM');
        this.addContainerCase('LIST');
        this.addContainerCase('MENULIST');
        this.addContainerCase('JUMBOTRON');
        this.addContainerCase('BANNER');
        this.addContainerCase('PARAGRAPH');
        this.addContainerCase('CHAT');

        // Add any additional containers from containerList
        for (let c = 0; c < containerList.length; c++) {
            this.addContainerCase(containerList[c]);
        }        

        // Collapse or Expand Body Pane
        this.expand();
        if (model.dataId > 0) {
            if (model.data.collapsed) {
                this.collapse();
            }

            if (model.data.showNavBar) {
                this.showNavBar();
            }
        }

        // These methods may need to be migrated within the extended objects
        if (this.className !== 'CONTAINER') {
            this.construct();
        } /*else {
            this.populate(model.children);
        }*/
    }

    /** Abstract construct method throws an error if not declared */
    construct() {
        debug('CONTAINER.construct();');
        if (this.className !== 'CONTAINER') {
            throw new Error('Abstract method ' + this.className + '.construct() not implemented.');
        }
    }

    /**
        HTML Encode the given value.

        Create a in-memory div, set it's inner text(which jQuery automatically encodes
        then grab the encoded contents back out.  The div never exists on the page.

        TODO: This really should just be an extention of the String class

        @param {any} value The string to be html encoded
        @returns {text} An html encoded string
     */
    htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    /**
        Decodes an HTML encoded value back into HTML string

        TODO: This really should just be an extention of the String class

        @param {any} value An html encoded string
        @returns {string} A string that was previously html encoded
     */
    htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    /**
     * Moves this element UP one slot
     */
    moveUp() {
        console.log('Move Up');
        let node = $(this.el);
        //let node = $(this.node.el);
        //let container = this.node.node.el;
        if (node.prev().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .prev()
                    .animate({ height: 'toggle' }, 300)
                    .insertAfter(node)
                    .animate({ height: 'toggle' }, 300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300).delay(300);
            }, 300);
        }
    }

    /**
     * Moves this element DOWN one slot
     */
    moveDown() {
        console.log('Move Down');
        let node = $(this.el);
        //let node = $(this.node.el);
        //let container = this.node.node.el;
        if (node.next().length > 0) {
            node.animate({ height: 'toggle' }, 300);
            setTimeout(function () {
                node
                    .next()
                    .animate({ height: 'toggle' }, 300)
                    .insertBefore(node)
                    .animate({ height: 'toggle' }, 300)
                    .delay(300);
            }, 0);
            setTimeout(function () {
                node.animate({ height: 'toggle' }, 300);
            }, 300);
        }
    }

    /**
        Empties the Container Pane and reconstructs its contents 
        based on the current model
    */
    refresh() {
        console.log('Refreshing CONTAINER{' + this.className + '}[' + this.id + ']');

        app.loader.log(20, 'Emptying...', true);
        this.body.pane.empty();

        app.loader.log(30, 'Reconstructing...', true);
        this.construct();

        // Populate based on children
        app.loader.log(60, 'Populating...', true);
        this.populate(this.body.pane.children);

        app.loader.log(100, 'Refreshed ' + this.className + '[' + this.id + ']', true);
    }

    /**
        Shows the Container nav bar
    */
    showNavBar() {
        $(this.navBar.el).collapse('show');
    }

    /**
        Adds default DOM, CRUD and ELEMENT Nav Items to the Option Menu
     */
    addNavBarDefaults() {
        if (this.navBar.header.menu) {

            /** DOM ACTIONS **/
            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.UP,
                        'label': 'UP'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.moveUp();
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.DOWN,
                        'label': 'DOWN'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.moveDown();
            }.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.REFRESH,
                        'label': 'REFRESH'
                    })
                })
            ).el.onclick = this.refresh.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.DELETE,
                        'label': 'REMOVE'
                    })
                })
            ).el.onclick = this.remove.bind(this);

            this.navBar.header.menu.getGroup('DOM').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.EXCLAMATION,
                        'label': 'DELETE'
                    })
                })
            ).el.onclick = this.disable.bind(this);

            /** CRUD ACTIONS **/
            this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.LOAD,
                        'label': 'LOAD'
                    })
                })
            ).el.onclick = this.load.bind(this);

            // Add items to Options Dropdown Tab
            this.btnSave = this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.SAVE,
                        'label': 'SAVE'
                    })
                })
            );
            this.btnSave.el.onclick = function () {
                this.btnSave.toggle('active');

                // CREATE A TEMPORARY wrapper to hold the SAVE FORM
                if ($(this.btnSave.el).hasClass('active')) {
                    let node = this.navBar.header.menu.getGroup('CRUD').wrapper;
                    this.btnSave.wrapper = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('collapse in wrapper')));
                    this.save(this.btnSave.wrapper, this.btnSave); //.bind(this);
                } else {
                    console.log('closing save form');
                    let wrp = this.navBar.header.menu.getGroup('CRUD').el.nextElementSibling;
                    
                    try {
                        $(wrp).collapse('toggle');
                        setTimeout(function () {          
                            wrp.parentNode.removeChild(wrp);
                        }.bind(this), 2000);

                    } catch (e) {
                        console.log('Unable to destroy this ');
                        console.log(e);
                    }
                }

            }.bind(this);

            this.btnQuickSave = this.navBar.header.menu.getGroup('CRUD').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.SAVE,
                        'label': 'QUICKSAVE'
                    })
                })
            );
            this.btnQuickSave.el.onclick = this.quickSave.bind(this);
        }
    }
    
    /**
        Creates a TAB that represents this container
        @param {MODEL} model Object Model
        @returns {NAVITEMLINK} A tab (navitemlink)
    */
    createTab(model) {
        try {
            let tab = null;
            let container = model.node.node.node;

            if (container.tab) {
                tab = container.tab.addMenu(new MODEL()).addNavItem(
                    new MODEL(new ATTRIBUTES()).set({
                        'anchor': new MODEL().set({
                            'label': model.label
                        })
                    })
                );
            } else {
                if (typeof app !== 'undefined' && app.body.sidebar) {
                    tab = app.body.sidebar.menu.addNavItem(
                        new MODEL(new ATTRIBUTES()).set({
                            'anchor': new MODEL().set({
                                'label': model.label
                            })
                        })
                    );
                }
            }

            if (tab !== null) {
                tab.el.onclick = function (e) {
                    // Activate parent(s)
                    app.setArticle(model);
                    let parentNode = model.node.node.node;
                    while (parentNode.node.node) { // 
                        try {
                            parentNode.tab.activate();
                            parentNode.show();
                        } catch (ee) { /*console.log(ee)*/ }
                        parentNode = parentNode.node.node.node;
                    }

                    // Prevent parent click()
                    e.stopPropagation();

                }.bind(this);
            }
            return tab;
        } catch (e) {
            console.log(this.element+' has not been instantiated.  Unable to create tab.');
            console.log(e);
            return null;
        }
    }
    
    /**
        Performs JQuery's ajax method to the given url.
        @param {string} url Target url
        @param {string} type HTTP Method (GET,PUT,POST,DELETE)
        @param {FormPost} formPost Data to be sent to the server
        @param {function} success Function to be called on success
        @returns {object} payload
    */
    ajax(url, type, formPost, success) {
        return $.ajax({
            url: url,
            type: type, //ie: POST
            async: true, 
            data: formPost,
            success: function (result) {
                // Do something with the result
            }
        });
    }

    /**
        Adds the Construct 'element' button to the options menu
        @param {string} className Element constructor class name
    */
    addConstructElementButton(className) {
        if (this.navBar.header.menu) {

            this.navBar.header.menu.getGroup('ELEMENTS').addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS[className],
                        'label': className //'Create ^'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();

                //https://developers.google.com/web/fundamentals/primers/promises
                let promise = new Promise(function (resolve, reject) {

                    console.log('Promise');
                    // do a thing, possibly async, then…
                    let result = this.create(new MODEL().set({
                        'className': className
                    }));
                    console.log(result);
                    if (1 === 1) {
                        //resolve('Successfully created Element');
                        resolve(result);
                    } else {
                        reject(Error('Failed to create element'));
                    }
                }.bind(this));

                // @see https://scotch.io/tutorials/javascript-promises-for-dummies
                promise.then(
                    function (result) {
                        console.log('promise success');
                        //console.log(result); // "Stuff worked!"
                        this.quickSave(true);

                    }.bind(this),
                    function (err) {
                        console.log('promise fail');
                        console.log(err); // Error: "It broke"
                    }.bind(this)
                );

                
            }.bind(this);
        }
    }

    /**
        Performs addCase() for the given Element within a Container of
        an element that extends Container

        Sets the constructor callback for this element
        and adds respective tabs etc to this container

        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
    */
    addContainerCase(className, addButton = true) {
        this.addCase(className,
            function (model) {
                return factory.get(this.body.pane, className, model.id || 0);
            }.bind(this)
        );
        if (addButton) {
            this.addConstructElementButton(className);
        }
    }

    /**
        Overrides EL.open();
        Opens the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
    */
    open() {
        try {
            this.status = STATUS.OPEN;
            super.open();
            this.el.setAttribute('data-status', 'open');
            this.header.btnLock.icon.el.className = ICONS.UNLOCK;
            this.header.options.el.removeAttribute('disabled');
        } catch (e) {
            console.log('Unable to open parent.');
            console.log(e);
        }
    }

    /**
        Closes the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        and update accordingly
    */
    close() {
        console.log('Locking ' + this.element + '(' + this.getId() + ')');
        this.status = STATUS.CLOSED;
        this.node.close();
        this.el.setAttribute('data-status', 'closed');

        // If section is open and we are trying to lock, we must first lock the children
        console.log(this.element + ' has ' + this.children.length + ' child(ren)');
        for (let s = 0; s < this.children.length; s++) {
            if (this.children[s].status === STATUS.OPEN) {
                this.children[s].close();
            }
        }

        console.log('Children are closed. Closing ' + this.element + '(' + this.getId() + ')');
        this.header.btnLock.icon.el.className = ICONS.LOCK;
        $(this.header.btnLock.el).removeClass('active');
        this.header.options.el.setAttribute('disabled', 'disabled');

        console.log('Locked');
    }

    /**
        Returns the CONTAINER's name attribute
        @returns {string} Container name
    */
    getId() {
        return this.el.getAttribute('id');
    }

    /**
        Sets the CONTAINER's ID
        @param {number} id Container database Id
    */
    setId(id) {
        this.id = id;
        this.el.setAttribute('id', id);
        this.data.id = id;
        this.attributes.id = id;
    }

    /**
        Returns the CONTAINER's name attribute
        @returns {string} Container name
    */
    getName() {
        return this.el.getAttribute('name');
    }

    /**
        Sets the name of this element to the given value.
        @param {string} name The name to be set
    */
    setName(name) {
        this.el.setAttribute('name', name);
        this.model.name = name;
    }

    /**
        Collapses the container's body
        @returns {boolean} true if hidden
    */
    collapse() {
        try {
            $(this.body.el).collapse('hide');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
        Expands the container's body
    */
    expand() {
        try {
            $(this.body.el).collapse('show');
        } catch (e) {
            console.log(e);
        }
    }

    /**
        Toggles the collapsed state of the container's body
     */
    toggleBody() {
        $(this.body.el).collapse('toggle');
    }

    

    /**
     * Creates a modal and populates with a list of Form Groups that belong to this user
     */
    load() {
        let modal = new MODAL('Select A Form Group', 'Choose from the following...');
        modal.show();
    }

    /**
        Saves the state of this Element
        @param {EL} node The parent container to hold the save menu
        @param {EL} caller The element (typically a button) that called the save method
     */
    save(node, caller) {
        console.log(this.element + '.save()');
        console.log('Node:');
        console.log(node);
        console.log('Caller:');
        console.log(caller);
        console.log('This:');
        console.log(this);

        // Populate subsections with elements in this body
        let subsections = this.getSubSections();

        debug('Creating save form...');        
        let form = this.createEmptyForm(node, false);
        form.addClass('saveContainer');
        //form.fieldset.formElementGroup.body.pane.addClass('sidebar-formPane');
        //form.el.setAttribute('style', 'background-color:white;');

        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'element',
                'value': this.get('element'),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'element'
            }),

            new MODEL(new ATTRIBUTES({
                'id': 0,
                'name': 'id',
                'value': new String(this.get('id')),
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'ID'
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'label',
                'value': typeof this.get('label') === 'object' ? new String(this.get('label').el.innerHTML) : new String(this.get('label'))
            })).set({
                'element': 'INPUT',
                'label': 'Label'
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'subsections',
                'value': subsections.length > 0 ? subsections.toString() : '0',
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'SubSections'
            }),

            // Should be checkbox or dropdown
            new MODEL(new ATTRIBUTES({
                'name': 'status',
                'type': 'NUMBER',
                'value': new String(this.get('status'))
            })).set({
                'element': 'INPUT',
                'label': 'Status',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'dataId',
                'type': 'NUMBER',
                'value': new String(this.get('dataId'))
            })).set({
                'element': 'BUTTON',
                'label': 'dataId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'attributesId',
                'type': 'NUMBER',
                'value': new String(this.get('attributesId'))
            })).set({
                'element': 'BUTTON',
                'label': 'attributesId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            // FORMPOSTINPUT
            new MODEL(new ATTRIBUTES({
                'name': 'descriptionId',
                'type': 'NUMBER',
                'value': new String(this.get('descriptionId'))
            })).set({
                'element': 'BUTTON',
                'label': 'descriptionId',
                'type': 'FORMPOSTINPUT',
                'addTab': 0
            }),

            new MODEL(new ATTRIBUTES({
                'name': 'shared',
                'type': 'NUMBER',
                'value': new String(this.get('shared')) || '1'
            })).set({
                'element': 'BUTTON',
                'label': 'shared',
                'addTab': 0
            })
        ];

        form.fieldset.formElementGroup.addInputElements(inputs);
        
        form.setPostUrl(this.className + '/Set');

        /*
            THIS IS THE PART THAT USES NODE/CALLER
            to collapse the header.  

            It's dumb.  Get rid of it.
        */
        form.afterSuccessfulPost = function () {
            this.setLabel(form.el.elements['label'].value);
            if (caller) {
                caller.toggle('active');
                console.log(caller);
                caller.node.node.toggleCollapse();
            }
            app.focusBody();
            app.loader.hide();

            let container = this.getProtoTypeByClass('CONTAINER');
            if (container !== 'undefined') {
                container.refresh();
            } else {
                location.reload(true);
            }

        }.bind(this);

        $(node.el).collapse('show');

        return form;
    }

    /**
     * Generates an array of subsection Ids for this Container
     * @returns {array} A collection of subsection ids
     */
    getSubSections() {
        let id = null;
        let subsections = [];
        for (let c = 0; c < this.body.pane.el.children.length; c++) {
            id = parseInt(this.body.pane.el.children[c].id);
            if (!isNaN(id)) {
                subsections.push(id);
            }
        }
        return subsections;
    }

    /**
     * Recursively iterates through parent nodes until an object with the given 'attributeName' is found
     * @param {string} key The object key to search within
     * @param {any} value The value to search for within this key
     * @param {EL} node Entry point to traversing the chain
     * @param {number} attempt Recursion loop
     * @returns {CONTAINER} The parent container
     
    getContainer(key, value, node = this.node, attempt = 0, maxAttempt = 100) {
        attempt++;

        debug('Searching for ' + key + ': ' + value + '(' + attempt + ')');
        debug(node);

        if (attempt < maxAttempt) {
            try {
                debug('id: ' + node.id+', key: '+key);
                if (node[key]) {
                    console.log('\tComparing ' + key + ' > ' + node[key] + ' to ' + value.toString());
                    if (node[key] === value) {
                        console.log('\t\tWe have a match');
                        return node;
                    } else {
                        console.log('\t\t' + node[key] + ' is not equal to ' + value.toString());
                        return this.getContainer(key, value, node.node, attempt++);
                    }
                }
            } catch (e) {
                debug(e);
                return null;
            }
        } else {
            debug('getContainer(): Too many attempts (' + attempt + ')');
            return null;
        }
    }
    */
    

    /**
     * Creates an empty form with a single fieldset and formelementgroup
     * @param {EL} node Parent node
     * @param {boolean} hidden If true, form is hidden
     * @returns {FORM} An empty form container
     */
    createEmptyForm(node, hidden = false) {
        let form = new FORM(
            node,
            new MODEL(new ATTRIBUTES({
                'style': hidden ? 'display:none;' : ''
            })).set({
                'label': 'FORM',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset = new FIELDSET(
            form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset.formElementGroup = new FORMELEMENTGROUP(
            form.fieldset.body.pane, new MODEL().set({
                'label': 'FORMELEMENTGROUP',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        return form;
    }

    /**
     * If dataId or attributesId exists, extract the appropriate values
     * @param {number} modelId The object's unique identifier
     * @param {object} data The object to be saved
     */
    quickSaveFormPost(modelId, data) {
        console.log('QuickSaveFormPost:'+modelId);
        console.log(data);
        if (modelId > 0) {
            app.loader.log(50, 'Saving FormPost: ' + modelId);
            let form = this.createEmptyForm(this, true);
            let inputs = [];
            for (let key in data) {
                debug('Adding data attributes');

                //let value = this.data[key] ? this.data[key] : data[key];
                console.log('Key: ' + key);
                console.log('Value:');
                console.log(this.htmlEncode(data[key]));

                inputs.push(
                    new MODEL(new ATTRIBUTES({
                        'name': key,
                        //'value': this[key] ? this[key].el ? this[key].el.innerHTML : data[key] : data[key]
                        'value': this.htmlEncode(data[key]) //value
                    })).set({
                        'element': 'INPUT',
                        'label': key,
                        'addTab': 0
                    })
                );
            }

            form.fieldset.formElementGroup.addInputElements(inputs);
            form.setPostUrl('FormPost/Set');
            form.post();
            form.afterSuccessfulPost = function () {
                form.destroy();
                debug('FormPost: ' + modelId + ' has been quicksaved');
            }.bind(this);

        } else {
            debug('No modelId provided');
        }
    }

    /**
        Displays a prompt that performs a save of the container, it's 
        attributes and any data objects associated with it.
        @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
        @returns {BOOLEAN} True if successful
     */
    quickSave(noPrompt = false) {

        if (noPrompt || confirm('Quick Save '+this.className+'('+this.id+') : '+this.label+' ?')) {
            app.loader.log(20, 'Quick Save');

            debug(this.element + '.save()');
            debug(this);

            // Populate subsections with elements in this body
            let subsections = this.getSubSections();

            debug('Creating save form...');
            let form = this.createEmptyForm(this, true);
            form.fieldset.formElementGroup.addInputElements([
                new MODEL(new ATTRIBUTES({
                    'name': 'element',
                    'value': this.get('element'),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'element'
                }),

                new MODEL(new ATTRIBUTES({
                    'id': 0,
                    'name': 'id',
                    'value': new String(this.get('id')),
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'ID'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'label',
                    'value': typeof this.get('label') === 'object' ? new String(this.get('label').el.innerHTML) : new String(this.get('label'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Label'
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'subsections',
                    'value': subsections.length > 0 ? subsections.toString() : '0',
                    'readonly': 'readonly'
                })).set({
                    'element': 'INPUT',
                    'label': 'SubSections'
                }),

                // Should be checkbox or dropdown
                new MODEL(new ATTRIBUTES({
                    'name': 'status',
                    'type': 'NUMBER',
                    'value': new String(this.get('status'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Status',
                    'addTab': 0
                }),

                /*new MODEL(new ATTRIBUTES({
                    'name': 'showHeader',
                    'type': 'NUMBER',
                    'value': new String(this.get('showHeader'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Header',
                    'addTab': 0
                }),*/

                /*new MODEL(new ATTRIBUTES({
                    'name': 'hasSidebar',
                    'type': 'NUMBER',
                    'value': new String(this.get('hasSidebar'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Show Sidebar',
                    'addTab': 0
                }),*/

                /*
                new MODEL(new ATTRIBUTES({
                    'name': 'collapsed',
                    'type': 'NUMBER',
                    'value': new String(this.get('collapsed'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Collapsed',
                    'addTab': 0
                }),
                */

                /*new MODEL(new ATTRIBUTES({
                    'name': 'hasTab',
                    'type': 'NUMBER',
                    'value': new String(this.get('hasTab'))
                })).set({
                    'element': 'INPUT',
                    'label': 'Has Tab',
                    'addTab': 0
                }),*/

                new MODEL(new ATTRIBUTES({
                    'name': 'dataId',
                    'type': 'NUMBER',
                    'value': new String(this.get('dataId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'dataId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'attributesId',
                    'type': 'NUMBER',
                    'value': new String(this.get('attributesId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'attributesId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                new MODEL(new ATTRIBUTES({
                    'name': 'descriptionId',
                    'type': 'NUMBER',
                    'value': new String(this.get('descriptionId'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'descriptionId',
                    'type': 'FORMPOSTINPUT',
                    'addTab': 0
                }),

                // TODO Try making this a CHECKBOX or something more BOOLEANesque
                new MODEL(new ATTRIBUTES({
                    'name': 'shared',
                    'type': 'NUMBER',
                    'value': new String(this.get('shared'))
                })).set({
                    'element': 'BUTTON',
                    'label': 'shared',
                    'addTab': 0
                })
            ]);

            form.setPostUrl(this.className + '/Set');
            form.post();
            form.afterSuccessfulPost = function () {
                this.setLabel(form.el.elements['label'].value);
                form.destroy();

                this.quickSaveFormPost(this.dataId, this.data);
                this.quickSaveFormPost(this.attributesId, this.attributes);

                //app.loader.hide();
            }.bind(this);

            app.loader.log(100, 'Quick Save Complete');
            //app.loader.hide();
            return true;

        } else {
            console.log('Quick Save Cancelled');
            return false;
        }
    }

    /**
        Attempts to have the direct parent Container of this Container perform
        a QuickSave
        @returns {Boolean} Returns true if successful
    */
    quickSaveParent() {
        try {
            return this.getProtoTypeByClass('CONTAINER').quickSave(false);
        } catch (e) {
            console.log('Container.QuickSaveParent() No parent exists');
            return false;
        }
    }

    /**
        Actions performed after this container is saved
        @param {EL} node Parent node
        @param {EL} caller This
     */
    afterSuccessfulPost(node, caller) {
        app.loader.log(100, 'Success');
        //app.loader.hide();
    }

    /**
        Returns the label for this section
        @returns {string} The label
    */
    getLabel() {
        return this.header.getLabel();
    }

    /**
        Sets the label of this element to the given value.
        @param {string} label The name to be set
    */
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label = label;
    }

    /**
        Sets the label of this element to the given value.
        @param {string} name The name to be set
    */
    setName(name) {
        this.el.setAttribute('name', name);
        this.model.name = name;
    }

    /**
        Sets the subsection array to the given value
        @param {array} subsections Sub Section UID array
    */
    setSubSections(subsections) {
        this.model.subsections = subsections;
    }

    /**
        Toggles visibility of any child Container Headers
     */
    toggleHeaders() {
        $(this.el).find('.icarus-container nav.navbar-nav').toggle();
    }

    /**
     * 
     @param {any} payload Data returned by server
     */
    updateModel(payload) {
        //console.log('updatemodel');
        //this.setName(payload.name);
        //this.setLabel(payload.label);
        //this.setSubSections(payload.subsections);
    }

    /**
        Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
    */
    remove() {
        let label = 'Remove ' + this.className + '{'+ this.element + '}['+this.id+']';
        let text = 'Remove ' + this.className + ' from ' + this.node.node.node.className + '?';
        try {
            this.prompt = new PROMPT(label, text, [], [], true);
            this.prompt.form.footer.buttonGroup.children[0].setLabel('Remove', ICONS.REMOVE);
            this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
                this.destroy();
                this.prompt.hide();
            }.bind(this);            
            this.prompt.show();
        } catch (e) {
            debug('Unable to disable this ' + this.element);
            debug(e);
        }
    }

    /**
        Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
        Optionally, this should also delete the object from the database
    */
    disable() {
        let label = 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']';
        let text = 'Disable ' + this.className + 'j['+this.id+'] in the Database?<br>This '+this.className+' will be permenantly deleted from database in X days!!!';
        try {
            this.prompt = new PROMPT(label, text, [], [], true);
            this.prompt.form.footer.buttonGroup.children[0].setLabel('Disable', ICONS.REMOVE);
            this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
                this.destroy();
                this.prompt.hide();
                console.log('TODO: Disable method on Container controller.');
                app.loader.log(100, 'Disabling '+this.className);
                $.post('/' + this.className + '/Disable/' + this.id, {
                    '__RequestVerificationToken': token.value
                },
                    function (payload, status) {
                        if (payload.result !== 0) {
                            app.loader.log(100, 'Success');
                            setTimeout(function () {

                                let url = new URL(window.location.href);
                                let returnUrl = url.searchParams.get('ReturnUrl');
                                if (returnUrl) {
                                    returnUrl = url.origin + returnUrl;
                                    location.href = returnUrl;
                                } else {
                                    location.reload(true);
                                }

                            }.bind(this), 1000);
                        } else {
                            app.loader.log(0, 'Login failed. (err_' + status + ').<br>' +
                                payload.message
                            );
                            debug('Failed to POST results to server with status: "' + status + '"');
                            debug('Payload:\n');
                            debug(payload);
                        }
                    }.bind(this)
                );

                app.loader.log(100, 'Disable Complete');




            }.bind(this);
            this.prompt.show();
        } catch (e) {
            debug('Unable to disable this ' + this.element);
            debug(e);
        }
    } 
}
/**
    List Item Constructor
*/
class LI extends EL {
    /**
        Constructs a List Item
        @param {UL} node The object to contain this element
        @param {MODEL} model The element's attributes
     */
    constructor(node, model) {
        super(node, 'LI', model, model.label);
    }
}
/**
    A generic unorganized list
*/
class UL extends GROUP {
    /**
        Constructs an Unordered List
        @param {EL} node The node to contain this element
        @param {MODEL} model The element model
     */
    constructor(node, model) {
        super(node, 'UL', model);
        

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('UL', function (model) {
            return this.addUnorderedList(model);
        }.bind(this));

        this.addCase('LI', function (model) {
            return this.addListItem(model);
        }.bind(this));
    }

    /**
        Construct a generic List Item (LI) and append to this element's children
        @param {MODEL} model Object Model
        @returns {LI} A list item LI
     */
    addListItem(model) {
        this.children.push(new LI(this, model, model.label));
        return this.children[this.children.length - 1];
    }

    /**
        Construct an unordered List (UL) and append to this element's children
        @param {MODEL} model Object Model
        @returns {LI} A list item LI
     */
    addUnorderedList(model) {
        this.children.push(new UL(this, model));
        return this.children[this.children.length - 1];
    }
}
/**
    A console like panel (UL) that contains entries as list items (LI)
 */
class CONSOLE extends UL {

    /**
     * Construct a console
     * @param {EL} node Console parent
     * @param {MODEL} model Console model
     */
    constructor(node, model) {
        super(node, model);        
    }

    /**
     * Adds the given text as a list item to the 
     * console (UL) at the top of the list
     * @param {string} text Text to be added
     * @returns {LI} The console entry
     */
    addEntry(text) {
        let li = this.addListItem(new MODEL().set({
            'label': text
        }));
        $(this.el).prepend(li.el);
        return li;
    }
}
/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them  
    
    CORE ITEMS CAN NOT BECOME CONTAINERS...  STOP TRYING TO MAKE THEM THAT WAY
*/
class NAVITEMICON extends LI {
    /**
        @param {EL} node The element that will contain this object
        @param {MODEL} model The nav-item json object retrieved from the server
     */
    constructor(node, model) {
        super(node, model);
        this.className = 'NAVITEMICON';
        this.addClass('nav-item-icon');
        this.el.setAttribute('title', model.anchor.label);

        this.anchor = model.anchor ? new ANCHOR(this, model.anchor) : null;

        //this.anchor.icon = new GLYPHICON(this.anchor, '', ICON.COG);
        //this.anchor.icon.el.setAttribute('style', 'line-height:64px;font-size:28px;');

        
        
        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('MENU', function (model) {
            return this.addMenu(model);
        }.bind(this));
        
        this.addCase('ANCHOR', function (model) {
            return this.addAnchor(model);
        }.bind(this));

        this.addCase('ARTICLE', function (model) {
            return this.addArticle(model);
        }.bind(this));
    }

    /**
        Add a NavItemGroup to this NavItem
        @param {MODEL} model NavBarNav model
        @returns {MENU} The newly created element
     */
    addMenu(model) {
        this.children.push(new MENU(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addAnchor(model) {
        this.children.push(new ANCHOR(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addArticle(model) {
        this.children.push(new ARTICLE(this, model));
        return this.children[this.children.length - 1];
    }
}
/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them  
    
    CORE ITEMS CAN NOT BECOME CONTAINERS...  STOP TRYING TO MAKE THEM THAT WAY
*/
class NAVITEM extends LI {
    /**
        @param {EL} node The element that will contain this object
        @param {MODEL} model The nav-item json object retrieved from the server
     */
    constructor(node, model) {
        super(node, model);
        this.className = 'NAVITEM';
        this.addClass('nav-item');

        this.anchor = model.anchor ? new ANCHOR(this, model.anchor) : null;
        
        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('MENU', function (model) {
            return this.addMenu(model);
        }.bind(this));
        
        this.addCase('ANCHOR', function (model) {
            return this.addAnchor(model);
        }.bind(this));

        this.addCase('ARTICLE', function (model) {
            return this.addArticle(model);
        }.bind(this));
    }

    /**
        Add a NavItemGroup to this NavItem
        @param {MODEL} model NavBarNav model
        @returns {MENU} The newly created element
     */
    addMenu(model) {
        this.children.push(new MENU(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addAnchor(model) {
        this.children.push(new ANCHOR(this, model));
        return this.children[this.children.length - 1];
    }

    /**
        Add an Anchor to this NavItem
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addArticle(model) {
        this.children.push(new ARTICLE(this, model));
        return this.children[this.children.length - 1];
    }
}
/**
    A search input wrapped in a FORM that filter's the
    contents of a given GROUP
 */
class NAVSEARCH extends NAVITEM { //LI {

    /**
        Construct a NAVSEARCH
        @param {EL} node Parent Node
     */
    constructor(node) {
        super(node, new MODEL().set({
            'anchor': new MODEL().set({
                'label': ''
            })
        }));

        // TODO: Create a proper search element
        this.form = new EL(this, 'FORM', new MODEL(new ATTRIBUTES({
            'name': 'q',
            'method': 'POST',
            'action': '#'
        })));
        this.form.addClass('navbar-search');

        this.inputGroup = new EL(this.form, 'DIV', new MODEL('input-group'));
        this.inputGroup.q = new EL(this.inputGroup, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'text',
            'class': 'form-control',
            'placeholder': 'Search',
            'name': 'q'
        })));
        this.inputGroup.btnGroup = new EL(this.inputGroup, 'DIV', new MODEL('input-group-btn'));
        this.inputGroup.btnGroup.btn = new EL(this.inputGroup.btnGroup, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'btn btn-default',
            'type': 'submit'
        })));
        this.inputGroup.btnGroup.btn.icon = new EL(
            this.inputGroup.btnGroup.btn, 'I', new MODEL('glyphicon glyphicon-search')
        );
    }
}
/**
    A horizontal line that separates content inside a navbar dropdown menu
*/
class NAVSEPARATOR extends NAVITEM {
    /**
        A separator for menus
        @param {EL} node The element that will contain this object
     */
    constructor(node) {
        super(node, new MODEL('divider').set({
            'anchor': new MODEL().set({
                'label': ''
            })
        }));
    }    
}
/**
    Nav item within navbar
*/
class MENU extends UL {
    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {MODEL} model The json object representing this element        
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('nav navbar-nav');
        
        this.wrapper = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('wrapper')));

        if (model.showHeader) {
            this.header = new HEADER(this.wrapper, new MODEL().set({
                'label': model.name
            }));
        }

        $(this.el).appendTo(this.wrapper.el);

        if (model.showHeader) {
            this.header.el.onclick = function () {
                $(this.el).collapse('toggle');
            }.bind(this);
        }

        this.addCase('MENU', function (model) {
            return this.addMenu(model);
        }.bind(this));

        this.addCase('NAVITEM', function (model) {
            return this.addNavItem(model);
        }.bind(this));

        this.addCase('NAVSEPARATOR', function (model) {
            return this.addNavSeparator();
        }.bind(this));
    }

    /**
        Toggles the collapsed state of the 'COLLAPSE'
     */
    toggleCollapse() {
        $(this.el).collapse('toggle');
    }

    /**
        Collapses the container's body
        @returns {boolean} true if hidden
    */
    hide() {
        try {
            $(this.collapse.el).collapse('hide');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
        Expands the container's body
    */
    show() {
        try {
            $(this.collapse.el).collapse('show');
        } catch (e) {
            console.log(e);
        }
    }

    /**
        Constructs a MENU
        @param {MODEL} model Object model
        @returns {MENU} Nav Item with Anchor
    */
    addMenu(model) {
        this.children.push(new MENU(this, model));
        return this.addGroup(this.children[this.children.length - 1]);
    }

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {NAVITEM} Nav Item with Anchor
    */
    addNavItem(model) {
        this.children.push(new NAVITEM(this, model)); //model.url, model.label
        return this.addGroup(this.children[this.children.length - 1]);
    }

    /**
        Constructs a Nav Item with an anchor inside
        @param {MODEL} model Object model
        @returns {NAVITEM} Nav Item with Anchor
    */
    addNavItemIcon(model) {
        this.children.push(new NAVITEMICON(this, model)); //model.url, model.label
        return this.addGroup(this.children[this.children.length - 1]);
    }

    /**
        Adds an array of Nav Items
        @param {Array} navItems An array of NAVITEM
     */
    addNavItems(navItems) {
        for (let i = 0; i < navItems.length; i++) {
            this.addNavItem(navItems[i]);
        }
    }

    /**
        Adds a Separator (UI Only)        
    */
    addNavSeparator() {
        let obj = new NAVSEPARATOR(this);
    }

    /**
        Sets this tab as active
        @returns {boolean} true if successful
     */
    setActive() {
        try {
            $('.dropdown-tab').removeClass('active');
            $(this).toggleClass('active');
            return true;
        } catch (e) {
            console.log('Unable to set this Item Group as active.');
            console.log(e);
            return false;
        }
    }
}
/**
    An expandable menu with clickable header that opens a container full of icons
*/
class NAVHEADER extends MENU {
    /**
        Construct a Nav Header.
        @param {EL} node The object that the navHeader is appended to
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-header');
        
        // Left aligned group
        this.tabs = new MENU(this, 
            new MODEL().set({
                'name': 'tabs'
            })
        );
        
        // Add a default tab to show/hide the collapse
        this.tab = this.tabs.addNavItem(
            new MODEL('pull-left').set({
                'anchor': new MODEL().set({
                    'label': model.label,
                    'url': '#',
                    'icon': ICONS.PLUS
                })
            })
        );

        this.tab.el.onclick = function () {
            this.getProtoTypeByClass('CONTAINER').toggleBody();
        }.bind(this);

        // Simulate LONG CLICK to edit the label
        this.tab.pressTimer;
        this.tab.el.onmousedown = function (ev) {
            this.tab.pressTimer = window.setTimeout(function () {
                console.log('Long Clicked ' + this.tab.anchor.label);
                //this.getProtoTypeByClass('CONTAINER').quickSave(true);    
                app.sidebar.empty();
                app.toggleSidebar();

                let container = this.getProtoTypeByClass('CONTAINER');
                //app.sidebar.el.innerHTML = '<header style="color:white;">Toggled by "' + container.label + '"</header>';

                container.save(app.sidebar);
                app.sidebar.target = container;

                ev.stopPropagation();
            }.bind(this), 1000);
        }.bind(this);

        this.tab.el.onmouseup = function (ev) {
            clearTimeout(this.tab.pressTimer);
            ev.stopPropagation();
            return false;
        }.bind(this);

        // If the user is a 'Guest', show the Login Button
        if (user === 'Guest') {
            this.btnLogin = this.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'icon': ICONS.USER,
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = function () {
                app.login();
            };
        } else {

            // Add a default tab to show/hide the Options Menu
            this.toggle = this.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.COG,
                        'label': '', //Options
                        'url': '#'
                    })
                })
            ).el.onclick = this.toggleCollapse.bind(this);

            // Create the submenu to be toggled
            this.menu = new MENU(this, new MODEL('collapse').set({
                'name': 'menu'
            }));

            // Add Default OPTIONS groupings as HORIZONTAL menus
            let optionGroups = ['ELEMENTS', 'CRUD', 'DOM']; //'USER'
            for (let oG = 0; oG < optionGroups.length; oG++) {
                this.menu.addMenu(
                    new MODEL(new ATTRIBUTES('horizontal collapse')).set({
                        'name': optionGroups[oG],
                        'showHeader': 1,
                        'collapsed': 1
                    })
                );
            }
        }
    }

    /**
        Show/Hide this.menu
     */
    toggleCollapse() {
        console.log('NAVHEADER.toggleCollapse()');
        $(this.menu.el).collapse('toggle');
    }
}
/**
 * A vertical navitemgroup with a search panel
 */
class SIDEBARMENU extends MENU { // NAVBAR

    /**
        A vertical navitemgroup with a search panel
        @param {CONTAINERBODY} node The CONTAINERBODY to contain the sidebar
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, model);
        //this.wrapper.addClass('sidebar');
        this.addClass('sidebar navbar-inverse collapse'); //active

        this.search = new NAVSEARCH(this);
        this.search.el.style.display = 'none'; // TODO: Search isn't necessary just yet
        
        this.search.inputGroup.q.el.onkeypress = function () {
            this.menu.addClass('in');
        }.bind(this);

        this.toggleButton = new NAVITEM(this, new MODEL(new ATTRIBUTES('toggle')).set({
            'anchor': new MODEL().set({
                'label': '<span class="caret"></span>'
            })
        }));
        this.toggleButton.el.style.display = 'none'; // TODO: Search isn't necessary just yet
        this.toggleButton.anchor.addClass('toggle-wide noselect');

        this.toggleButton.el.onclick = this.toggleDocumentMap.bind(this);

        this.menu = new MENU(this, new MODEL('collapse in').set({
            'name': 'document-map'
        }));
    }

    /**
        Show / Hide the Document Map Menu
     */
    toggleDocumentMap() {
        //this.menu.toggle('in');
        $(this.menu.el).collapse('toggle');
    }    
}
/**
    A container for Buttons
*/
class BUTTONGROUP extends GROUP {
    /**
        Constructs a Button Group
        @param {EL} node The parent
        @param {string} className Optional className to be appended to default class
        @param {string} align ALIGN.enum
        @param {string} size SIZE.enum
     */
    constructor(node, className, align, size) {
        let attributes = new ATTRIBUTES('btn-group');
        attributes.set('role', 'group');
        super(node, 'DIV', new MODEL(attributes));

        if (className) { this.addClass(className); }
        if (align === ALIGN.VERTICAL) { this.addClass('btn-group-vertical'); }
        this.addClass('btn-group-' + size ? size : SIZE.EXTRA_SMALL);

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('BUTTON', function (model) {
            return this.addButton(model.label, model.glyphicon, model.buttonType);
        }.bind(this));

        this.addCase('TOGGLEBUTTON', function (model) {
            return this.addToggleButton(model.label, model.glyphicon, model.buttonType);
        }.bind(this));
    }
    
    /**
        Creates a button and adds it to this button group, then adds it to the buttons array
        @param {string} label The label
        @param {string} glyphicon icon,
        @param {string} buttonType button type
        @returns {BUTTON} A generic button object
    */
    addButton(label, glyphicon, buttonType) {
        let btn = new BUTTON(this, label, glyphicon, buttonType);
        btn.el.onclick = function () {
            return false;
        };

        this.children.push(btn);
        return this.children[this.children.length - 1];
    }

    /**
        Createa a toggle button with a corresponding dropdown menu
        @param {string} label The label
        @param {string} glyphicon The icon
        @param {string} buttonType The button type
        @returns {TOGGLEBUTTON} A toggle button
    */
    addToggleButton(label, glyphicon, buttonType) {
        this.children.push(new TOGGLEBUTTON(this, label, glyphicon, buttonType));
        return this.children[this.children.length - 1];
    }

    /**
        Removes all buttons from this group
     
    empty() {
        for (let b = 0; b < this.buttons.length; b++) {
            this.buttons[b].destroy(0);
        }
        this.buttons.length = 0;
    }*/
}
/**
    A generic Bootstrap button    
*/
class BUTTON extends EL {
    /**
        @param {EL} node The parent object
        @param {string} label The label
        @param {string} glyphicon The glyphicon (optional)
        @param {string} buttonType The type of button ie: [button, reset, submit]
     */
    constructor(node, label, glyphicon, buttonType) {

        super(node, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'btn glyphicon',
            'type': buttonType ? buttonType : 'button'
        })));

        // If a glyphicon is supplied, create it , otherwise, just add the label to the button
        this.icon = new GLYPHICON(this, label, glyphicon);
    }

    /**
        Sets the label within the button to the given string
        @param {string} label A button label
        @param {string} glyphicon Glyphicon string or ICON.ENUM
     */
    setLabel(label, glyphicon) {
        console.log('setLabel(' + label + ')');
        this.icon.setIcon(glyphicon);
        this.icon.label.setInnerHTML(label);
    }
}
/**
    Button that show/hides a list of options
*/
class TOGGLEBUTTON extends BUTTON {
    /**
        Construct a toggle button
        @param {EL} node The parent object
        @param {string} label The label
        @param {string} glyphicon glyphicon
        @param {string} buttonType buttonType
     */
    constructor(node, label, glyphicon, buttonType) {
        super(node, label, glyphicon, buttonType);
        this.addClass('dropdown-toggle');
        this.el.setAttribute('data-toggle', 'dropdown');
        this.el.setAttribute('aria-haspopup', 'true');
        this.el.setAttribute('aria-expanded', 'false');

        this.menu = new MENU(node, new MODEL().set('name',friendly(label)));
    }
}
/**
    A Bootstrap 3 Modal
    https://www.w3schools.com/bootstrap/bootstrap_modal.asp    
*/
class MODAL extends EL { // ALIGN VERTICALLY??
    /**
        Constructs a Modal
        @param {string} title The header text for this modal
        @param {string} text The html text that is displayed in the prompt's well
        @param {boolean} vertical If true, modal is vertically aligned
     */
    constructor(title, text, vertical) {
        super(document.body, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'modal fade in', 
            'role': 'dialog'
        })));
    
        // Vertical alignment helper div where required
        this.alignHelper = null;
        if (vertical) {
            this.alignHelper = new EL(this, 'DIV', new MODEL(new ATTRIBUTES('vertical-alignment-helper')));
        }

        // Dialog inside vertical align helper if set to vertical align
        let parentEl = vertical ? this.alignHelper : this;
        let dialogAttr = new ATTRIBUTES('modal-dialog');
        if (vertical) {
            dialogAttr.set('class', dialogAttr.get('class') + ' vertical-align-center');
        }
        this.dialog = new EL(parentEl, 'DIV', new MODEL(dialogAttr));

        // If modal is vertically aligned, set class accordingly
        //if (vertical) { parentEl.dialog.addClass('vertical-align-center'); }

        // If vertical, margin must be set to auto
        this.content = new EL(this.dialog, 'DIV', new MODEL(new ATTRIBUTES('modal-content')));
        if (vertical) { this.content.el.style = 'margin: 0 auto;'; }

        this.header = new EL(this.content, 'DIV', new MODEL(new ATTRIBUTES('modal-header')));

        this.header.btnClose = new EL(this.header, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'close',
            'type': 'BUTTON',
            'data-dismiss': 'modal',
            'aria-hidden': 'true'
        })), 'x');

        this.header.main = new HEADER(this.header, new MODEL());
        this.header.main.addClass('modal-title');

        this.header.text = new EL(this.header.main, 'DIV', new MODEL(), title);

        this.header.btnClose.el.onclick = this.close.bind(this);

        // A well containing various alerts        
        if (text) {
            this.well = new WELL(this.content, new MODEL(), text);
        }

        // Body	: Place forms, objects etc inside 'this.modalbody.el'
        this.container = new CONTAINER(
            this.content, 'DIV',
            new MODEL(new ATTRIBUTES('modal-body')).set({
                'label': 'Modal Body',
                'showHeader': 0
            })
        );

        // Footer : Contains options to save or cancel out of form
        this.footer = new EL(this.content, 'DIV', new MODEL(new ATTRIBUTES('modal-footer' )));
        
        this.footer.btnClose = new EL(this.footer, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'btn btn-default btn-block',
            'data-dismiss': 'modal',
            'aria-hidden': 'true'
        })), 'Close').el.onclick = function () {
            this.hide(1000, true);
        }.bind(this);
    }    

    /**
        Scrolls to top
    */
    scrollUp() {
        alert('scroll to top');
        this.el.scrollTop = 0;
    }

    /**
        Reveal the modal
    */
    show() {
        $(this.el).modal('show');
    }

    /**
        Hide the modal // and remove from DOM
        @param {number} delay Millisecond delay
        @param {boolean} destroy If true, this modal is destroyed
    */
    hide(delay = 1000, destroy = false) {
        try {
            setTimeout(function () {
                $(this.el).modal('hide');
                $('.modal-backdrop').animate({ opacity: 'toggle' }, 0).remove();
                if (destroy) {
                    this.destroy(delay);
                }
            }.bind(this), delay);
        } catch (e) {
            console.log(e);
        }
    }

    /**
        Sets the text to prompt well
        @param {string} text The text contained within the prompt's well
    */
    setText(text) {
        if (text) {
            this.well.el.innerHTML = text;
        }
    }
}
/**
    A Loader type modal.
*/
class LOADER extends MODAL {
    /**
        Constructs a Loader
        @param {string} label The header text for this modal
        @param {string} text Text that appears in modal's well
        @param {number} value Percentage complete (integer)
     */
    constructor(label, text, value) {
        label = label ? label : '';
        value = value ? value : 0;
        
        super(label, null, true);
        this.addClass('modal-loader');
        //this.el.style.zIndex = 99999;
        this.el.setAttribute('name', 'LOADER');

        this.dialog.el.style.width = '80%';
        //this.el.setAttribute('data-backdrop', 'static');
        //this.el.setAttribute('data-keyboard', false);

        this.dialog.addClass('loader');

        this.progress = new EL(this.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('progress')));
        
        this.progressBar = new EL(this.progress, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'progress-bar progress-bar-info progress-bar-striped active noselect',
            'role': 'progressbar',
            'aria-valuenow': value,
            'aria-valuemin': 0,
            'aria-valuemax': 100
        })));
        
        this.console = new CONSOLE(this.container.body.pane, new MODEL(
            new ATTRIBUTES({
                'class': 'console collapse in',
                'aria-expanded': false
            })
        ));

        this.progressBar.el.onclick = function () {
            $(this.console.el).collapse('toggle');
        }.bind(this);

        if (this.well) {
            $(this.progress.el).insertBefore(this.well.el);
            $(this.console.el).insertBefore(this.well.el);
        }

        this.log(value);
    }

    /**
        Sets the progress bar status.

        @param {number} value Percentage as integer (ie: 50 means 50%).
        @param {string} text Text displayed inside progress bar.  
    */
    log(value, text, show = false) {
        if (this.el) {
            this.progressBar.el.style.width = value + '%';
            this.progressBar.el.setAttribute('aria-valuenow', value);
            if (text) {
                let txt = text.substr(0, 32) + '...';
                this.progressBar.setInnerHTML(txt);
                this.console.addEntry(text);
                debug(text);
            }
            if (show) {
                this.show();

                if (value === 100) {
                    this.hide(1500);
                }
            }
        } else {
            debug('Unable to find loader');
        }
    }

    /**
     * Shows the Loader Console
     */
    showConsole() {
        $(this.console.el).collapse('show');
    }

    /**
     * Hides the Loader Console
     */
    hideConsole() {
        $(this.console.el).collapse('hide');
    }
}
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
class MODALMENU extends MODAL { // CALL ME A MENU!!!!
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} children Array of [label, glyphicon, buttonType]
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, children, vertical) {
        console.log('MODALMENU(' + label + ');');
        console.log(children);
        super(label, text, vertical);
        this.addClass('prompt');

        console.log('Creating Modal Menu...');

        this.container.addContainerCase('MENU');

        
        this.menu = new MENU(
            this.container.body.pane,
            new MODEL(
                new ATTRIBUTES('navbar-inverse')
            ).set({
                'className': 'MENU',
                'name': 'menu'
            })
        );
        
        /* THIS IS WRONG, learn from this
         * // Why have a method instead of calling the constructor?
        this.menu = this.container.create(

            new MODEL(
                new ATTRIBUTES('nav navbar-nav navbar-inverse')
            ).set({
                'className'
                'name': 'menu'
            })
        );*/

        this.menu.populate(children);
    }    
}
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
class PROMPT extends MODAL {
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} buttons Array of [label, glyphicon, buttonType]
        @param {array} inputs Array of inputs
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, buttons, inputs, vertical) {
        debug('PROMPT('+label+');');
        super(label, text, vertical);
        this.addClass('prompt');

        this.form = app.createEmptyForm(this.container.body.pane, false);
        this.form.prompt = this;

        // TODO: Fix this up
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                //debug('inputs[' + i + ']: ' + inputs[i].type);
                let inp = null;
                if (inputs[i].type === 'FORMPOSTINPUT') {
                    //debug('FORMPOSTINPUT');
                    new FORMPOSTINPUT(this.formElementGroup.body.pane, inputs[i]);
                } else {
                    new INPUT(this.formElementGroup.body.pane, inputs[i]);
                }
                this.formElementGroup.children.push(inp);
            }
        }        

        // Add any buttons that were provided
        if (buttons) {
            for (let b = 0; b < buttons.length; b++) {
                this.form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
            }
        }
    }    
}
/**
    Generic NAV Element
*/
class NAV extends EL {
    /**
        Constructs a NAV
        @param {EL} node The element that will contain this object
        @param {MODEL} model The object attributes
     */
    constructor(node, model) {
        super(node, 'NAV', model);
        this.addClass('nav navbar navbar-inverse');
    }
}
/**
    A Bootstrap 3 Nav Menu that is fixed to the top of the page.
    See https://getbootstrap.com/docs/3.3/components/#nav
*/
class NAVBAR extends NAV {
    /**
        Constructs a Navigation Panel.
        @param {EL} node The element that will contain this object
        @param {MODEL} model The object
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-nav collapse');

        //this.wrapper = new EL(node, 'DIV', new MODEL('navbar-wrapper'));

        //this.toggler = new EL(this.wrapper, 'DIV', new MODEL('toggler')); //, 'Toggle'

        //this.toggler.el.onclick = function () {
        //    $(this.el).collapse('toggle');
        //}.bind(this);

        //$(this.el).appendTo(this.wrapper.el);

        this.header = new NAVHEADER(this, new MODEL().set({
            'className': 'NAVHEADER',
            'name': 'header',
            'label': node.label
        }));
    }
}
import { BUTTONGROUP } from '../group/buttongroup/BUTTONGROUP.js';
/**
    A generic header that should be placed at the top of content    
*/
export class HEADER extends EL {
    /**
        Constructs a Header.
        @param {EL} node The object to contain the header
        @param {MODEL} model Object model
        @param {number} depth Headers can range from H1 to H6. Undefined returns a standard HEADER element
     */
    constructor(node, model, depth) {
        super(
            node,
            depth ? 'H' + depth : 'HEADER',
            model,
            model.label || ''
        );
        this.depth = depth || 0;

        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }

    /**
        Adds a button group to this header
        @param {string} className The class
        @returns {BUTTONGROUP} A new ButtonGroup instance
    */
    addButtonGroup(className) {
        return new BUTTONGROUP(this, className);
    }
}
/**
    A generic footer that should be placed at the bottom of content
*/
import { EL } from '../EL.js';
class FOOTER extends EL {
    /**
        Constructs a generic footer.
        @param {EL} node The object to contain the footer
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'FOOTER', model);
    }    
}
import { FOOTER } from '../FOOTER.js';
/**
    A Footer that sticks to bottom of page    
*/
export class STICKYFOOTER extends FOOTER {
    /**
        Constructs a footer stuck to the bottom of the viewpane
        @param {EL} node The object to contain the table
        @param {MODEL} model stickyfooter model
     */
    constructor(node, model) {
        super(node, model);
        this.el.setAttribute('class', 'stickyfooter');
    }

    /**
        Expands the footer to include context menu
    */
    show() {
        this.addClass('active');
    }

    /**
        Shrinks the footer down to basics
    */
    hide() {
        this.removeClass('active');
    }
}
/**
    Inline Frame
*/
class IFRAME extends CONTAINER {
    /**
        Constructs an iframe
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        
        //this.populate(model.children);
    }

    construct() {
        this.frame = new EL(this.body.pane, 'IFRAME', new MODEL(
            new ATTRIBUTES({
                'width': '100%',
                'border': 0,
                'frameborder': 0,
                'style': 'height:calc(100vh - 142px);'
            })
        ));
    }
}
/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.body.pane.addClass('jumbotron');
        //this.body.pane.addClass('noselect');
        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Override abstract method
     */
    construct() {
        if (this.dataId > 0) {

            this.screen = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('screen')));
            console.log('screen');
            if (this.data.screencolor && this.data.screencolor !== '.') {
                console.log(this.data.screencolor);
                //this.screen.el.backgroundColor = 'background-color: rgba(162, 34, 34, 0.88);';
                this.screen.el.setAttribute('style', 'background-color: '+this.data.screencolor+';');
            }

            this.header = new HEADER(this.screen, new MODEL().set({
                'label': this.data.header
            }), 1);

            if (this.data.p) {
                if (this.data.p.length > 0) {
                    this.hr = new HR(this.screen, new MODEL());
                    this.p = new P(this.screen, new MODEL(), this.htmlDecode(this.data.p));
                }
            }

            // Test to see if the formpost can be retrieved            
            if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
                //console.log('JUMBOTRON');
                try {
                    $.getJSON('/FORMPOST/Get/' + parseInt(this.data.bgimage), function (data) {

                        // If access granted...
                        if (data.model) {
                            if (data.model.jsonResults) {
                                //console.log('Retrieved image id: ' + parseInt(this.data.bgimage));
                                //console.log(data.model);
                                console.log('Parsed...');
                                let parsed = JSON.parse(data.model.jsonResults);
                                console.log(parsed);

                                // Extract the base64 values and create an image
                                for (let p = 0; p < parsed.length; p++) {
                                    if (parsed[p].name === 'base64') {
                                        this.body.pane.el.setAttribute('style',
                                            'background: url(' + parsed[p].value + ');'
                                        );
                                    }
                                }
                            } else {
                                console.log('Json Results are empty');
                            }
                        }
                    }.bind(this));
                } catch (e) {
                    console.log('Unable to retrieve FormPost.');
                    console.log(e);
                }
            }

            if (this.data.bgcolor && this.data.bgcolor !== '.') {
                this.body.pane.el.style.backgroundColor = this.data.bgcolor;
            }
        }
    }

}
/**
    Jumbotron with centered icon and text
*/
import IMG from '../../../graphic/IMG.js';
import HEADER from '../../../header/header.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
export class THUMBNAIL extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0'); // Override icarus-container 
        this.body.pane.addClass('thumbnail');
        //this.image = new IMG(this.body.pane, new MODEL());
        //this.construct();
        //this.populate(model.children);
    }

    construct() {
        this.image = new IMG(this.body.pane, new MODEL());

        this.header = new HEADER(this.body.pane, new MODEL().set({
            'label': this.data.header
        }));
        this.p = new P(this.body.pane, new MODEL(), truncate(this.data.p, 128));

        this.buttonGroup = new BUTTONGROUP(this.body.pane, 'btn-block');
        this.button = this.buttonGroup.addButton('', ICONS.CHEVRON_RIGHT);
        this.button.addClass('btn-block');

        //console.log('dataId:' + this.dataId);
        if (this.dataId > 0 || this.dataId === -1) {

            let parsed = null;

            if (this.data.img) {

                // If this.data.img is integer, retrieve relevant formpost
                if (Number.isInteger(parseInt(this.data.img))) {

                    // Test to see if the formpost can be retrieved
                    try {
                        $.getJSON('/FORMPOST/Get/' + parseInt(this.data.img), function (data) {

                            // If access granted...
                            if (data.model) {
                                if (data.model.jsonResults) {
                                    parsed = JSON.parse(data.model.jsonResults);

                                    // Extract the base64 values and create an image
                                    let img = {};
                                    for (let p = 0; p < parsed.length; p++) {
                                        img[parsed[p].name] = parsed[p].value;
                                    }

                                    try {
                                        this.image.el.src = img['base64'];
                                    } catch (ee) {
                                        console.log('Unable to set Thumbnail image');
                                        console.log(img);
                                    }


                                    // Set text in Thumbnail when required (see ImageGallery.js)
                                    if (this.data.showImageDetails) {
                                        try {
                                            //this.image.el.src = img['base64'];
                                            this.header.el.innerHTML = img['filename'];
                                            this.p.el.innerHTML =
                                                'Id: ' + img['id'] + '<br>'
                                                + 'Filesize: ' + img['fileSize'] + 'kb ('
                                                + img['dimX'] + ' x ' + img['dimY'] + ')<br>'
                                                + img['fileType'];
                                        } catch (ee) {
                                            console.log('Unable to set Thumbnail attributes');
                                            console.log(img);
                                        }
                                    }

                                } else {
                                    console.log('Json Results empty');
                                }
                            }

                        }.bind(this));
                    } catch (e) {
                        console.log('Unable to retrieve FormPost.');
                        console.log(e);
                    }

                } else {
                    this.image = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                        'src': this.data.img
                    })));
                }
            }

            

            this.button.el.onclick = function () {
                this.launchModal();
            }.bind(this);
        }
    }

    /**
     * Launches a modal that contains the detailed view of the given article
     */
    launchModal() {
        console.log('Launch Modal');

        let modal = new MODAL(this.data.header);
        modal.container.body.pane.addClass('thumbnail');

        modal.container.image = new IMG(modal.container.body.pane, new MODEL());
        modal.container.image.el.src = this.image.el.src;

        modal.container.header = new HEADER(modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        modal.container.p = new P(modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        modal.show();
    }

}
/**
    A thumbnail with a preview window and a list of Containers
    that can be loaded into the preview
*/
class INDEXTHUMBNAIL extends THUMBNAIL {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, model);
        this.setClass('col-xs-12 col-vs-6 col-sm-6 col-md-4 col-lg-offset-0');
        

        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Creates the Modal that contains the list of objects for preview
     * TODO: Consider paging these results
     */
    launchModal() {
        debug('Launch Index Thumbnail Modal');

        this.modal = new MODAL(this.data.header);
        this.modal.container.body.pane.addClass('thumbnail index-thumbnail');
        

        this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        this.modal.container.previewNotes = new EL(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'preview-notes'
        })), '');

        this.modal.container.preview = new CONTAINER(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('preview')), [this.data.listClass.toUpperCase()]);
        this.modal.container.preview.el.setAttribute('style', 'height:400px;max-height:400px;overflow-y:auto;');

        this.modal.container.menulist = new MENULIST(
            this.modal.container.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style':'max-height:200px;overflow-y:auto;'
                })
            ).set({
            'name': 'preview-list',
            'label': this.data.listClass + '(s)'
        }));


        for (let li = 0; li < this.data.list.length; li++) {

            let title = this.data.list[li].label + ' (' + this.data.listClass + '[' + this.data.list[li].id + '])';
            
            this.modal.container.menulist.menu.addNavItem(new MODEL().set({
                'label': title
            })).el.onclick = function () {
                this.modal.container.preview.body.pane.empty();



                this.launchPreview(
                    500, title,
                    this.modal.container.preview.body.pane,
                    this.data.listClass,
                    this.data.list[li].id
                );
            }.bind(this);

        }
        this.modal.show();
    }

    /**
     * Creates a modal and loads the specified container
     * @param {number} delay Delay in milliseconds
     * @param {string} title Modal Title
     * @param {EL} node Modal node to append to
     * @param {string} className Object class name
     * @param {number} id Object id
     */
    launchPreview(delay = 500, title = 'Preview', node, className, id) {
        setTimeout(function () {
            $.getJSON('/' + className + '/Get/' + id, function (result) {
                console.log(className+':');
                console.log(result);
                this.modal.container.preview.create(result.model);
            }.bind(this));
        }.bind(this), delay);

        // Get a list of Parents for this Container
        // TODO: Do something with this, please!
        setTimeout(function () {
            $.getJSON('/' + className + '/GetContainerParents/' + id, function (result) {
                console.log(className + ' Parents:');
                console.log(result); 
                console.log(result.length + ' parent Containers');
                //this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
                this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
            }.bind(this));
        }.bind(this), delay);
    }
}
/**
    Jumbotron with centered icon and text
*/
class CALLOUT extends CONTAINER { 
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('col-lg-4'); // Override icarus-container 
        this.body.pane.addClass('callout');
        //this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0) {
            if (this.data.icon) {
                this.icon = new GLYPHICON(this.body.pane, '', this.data.icon);
            }
            if (this.data.header) {
                this.header = new HEADER(this.body.pane, new MODEL().set({
                    'label': this.data.header
                }), 3);

                if (this.data.align) {
                    this.header.el.setAttribute('style', 'text-align:' + this.data.align + ';');
                }
            }
            if (this.data.p) {
                //this.hr = new HR(this.body.pane, new MODEL());
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        }
    }
}
/**
    A banner that can be populated with CallOuts
*/
import CONTAINER from '../CONTAINER.js';
export class BANNER extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['CALLOUT','THUMBNAIL']);
        this.body.pane.addClass('banner');
        this.body.pane.addClass('noselect');
        this.populate(model.children);
    }

    construct() {

    }
}
/**
    Contains a high level view of all objects owned by this user
*/
import { BANNER } from '../BANNER.js';
import { HEADER } from '../../../header/HEADER.js';
import { NAVITEMICON } from '../../../nav/navitemicon/NAVITEMICON.js';
export class INDEX extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('index');
        //this.populate(model.children);
    }

    construct() {
        this.containerHeader = new HEADER(this.body.pane, new MODEL().set({
            'label': 'INDEX'
        }));
        //$(this.containerHeader.el).insertBefore(this.body.pane);

        let elementList = ['ARTICLE', 'Form', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL', 'CHAT', 'DICTIONARY', 'WORD', 'IMAGEGALLERY']; //'Main',

        app.loader.log('Constructing Container Index...');

        for (let l = 0; l < elementList.length; l++) {

            let thumb = new NAVITEMICON(this.body.pane, new MODEL().set({
                'anchor': new MODEL().set({
                    'icon': ICONS[elementList[l].toUpperCase()],
                    'label': elementList[l],
                    'dataId': -1,
                    'data': {
                        'header': elementList[l],
                        'p': '&nbsp;'
                    }
                })
            }));
            /*
            let thumb = new INDEXTHUMBNAIL(this.body.pane, new MODEL().set({
                'label': elementList[l],
                'dataId': -1,
                'data': {
                    'header': elementList[l],
                    'p': '&nbsp;'
                }
            }));
            */

            //app.loader.log(100, 'Retrieving ' + elementList[l] + '...', true);


           // list = 0;
            $.post('/' + elementList[l] + '/List', {
                '__RequestVerificationToken': token.value
            },
                function (payload, status) {
                    if (status === 'success') {
                        //thumb.data.el.setAttribute('title', 'There are ' + payload.list.length
                        //    + ' instances of ' + payload.className);
                        //thumb.data.listClass = payload.className;
                        //thumb.data.list = payload.list;
                        let str = 'There are ' + payload.list.length + ' instances of ' + payload.className;
                        thumb.el.setAttribute('title', str);
                        thumb.el.onclick = function () {
                            this.launchModal(
                                payload.className,
                                str,
                                payload.className,
                                payload.list
                            );
                        }.bind(this);
                        /*
                        thumb.data.p = 'There are ' + payload.list.length
                            + ' instances of ' + payload.className;
                        thumb.p.setInnerHTML(thumb.data.p);     
                        thumb.data.listClass = payload.className;
                        thumb.data.list = payload.list;
                        */


                    }                    
                }.bind(this)
            );
        }

        //app.loader.hide(500);
    }

    /**
     * Creates the Modal that contains the list of objects for preview
     * TODO: Consider paging these results
     * @param {string} header Header text
     * @param {string} p paragraph
     * @param {string} listClass element class
     * @param {Array} list A list
     */
    launchModal(header, p, listClass, list) {
        debug('Launch Index Thumbnail Modal');
        app.loader.log(100, 'Launching Modal', true);

        this.modal = new MODAL(header);
        this.modal.container.body.pane.addClass('thumbnail index-thumbnail');

        //this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        //this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane,
            new MODEL().set({
            'label': header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane,
            new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), p);

        this.modal.container.previewNotes = new EL(this.modal.container.body.pane,
            'DIV', new MODEL(new ATTRIBUTES({
            'class': 'preview-notes'
        })), '');

        this.modal.container.preview = new CONTAINER(
            this.modal.container.body.pane, 'DIV',
            new MODEL(new ATTRIBUTES('preview')),
            [listClass.toUpperCase()]
        );

        this.modal.container.preview.el.setAttribute(
            'style', 'height:400px;max-height:400px;overflow-y:auto;'
        );

        this.modal.container.menulist = new MENULIST(
            this.modal.container.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style': 'max-height:200px;overflow-y:auto;'
                })
            ).set({
                'name': 'preview-list',
                'label': listClass + '(s)'
            }));


        for (let li = 0; li < list.length; li++) {

            let title = list[li].label + ' (' + listClass + '[' + list[li].id + '])';

            this.modal.container.menulist.menu.addNavItem(new MODEL().set({
                'label': title
            })).el.onclick = function () {
                this.modal.container.preview.body.pane.empty();

                this.launchPreview(
                    500, title,
                    this.modal.container.preview.body.pane,
                    listClass,
                    list[li].id
                );
            }.bind(this);

        }
        this.modal.show();
    }

    /**
     * Creates a modal and loads the specified container
     * @param {number} delay Delay in milliseconds
     * @param {string} title Modal Title
     * @param {EL} node Modal node to append to
     * @param {string} className Object class name
     * @param {number} id Object id
     */
    launchPreview(delay = 500, title = 'Preview', node, className, id) {
        app.loader.log(100, 'Launch Preview', true);
        setTimeout(function () {
            $.getJSON('/' + className + '/Get/' + id, function (result) {
                console.log(className + ':');
                console.log(result);
                this.modal.container.preview.create(result.model);
            }.bind(this));
        }.bind(this), delay);

        // Get a list of Parents for this Container
        // TODO: Do something with this, please!
        setTimeout(function () {
            $.getJSON('/' + className + '/GetContainerParents/' + id, function (result) {
                console.log(className + ' Parents:');
                console.log(result);
                console.log(result.length + ' parent Containers');
                //this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
                this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
            }.bind(this));
        }.bind(this), delay);
    }
}
/**
    Contains a high level view of all objects owned by this user
*/
class IMAGEGALLERY extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('image-gallery');
        //this.populate(model.children);

        this.page = 0;
        this.pageLength = 6;
        this.pageTotal = 0;

        if (this.dataId > 0) {
            //
        }

        this.header = new HEADER(this, new MODEL().set({
            'label': 'Image Gallery'
        }));
        $(this.header.el).insertBefore(this.body.pane.el);

        this.pagination = new FOOTER(this, new MODEL('pagination'));
        this.pagination.el.setAttribute('style', 'text-align:center;');
        $(this.pagination.el).insertBefore(this.body.pane.el);

        this.pagination.btnPrev = new BUTTON(this.pagination, 'Prev');
        this.pagination.btnPrev.el.setAttribute('style', 'margin-right:1em;');
        this.pagination.btnPrev.el.onclick = this.prevPage.bind(this);

        this.pagination.buttonGroup = new BUTTONGROUP(this.pagination);
        this.pagination.buttonGroup.loaded = false;

        this.pagination.btnNext = new BUTTON(this.pagination, 'Next');
        this.pagination.btnNext.el.setAttribute('style', 'margin-left:1em;');
        this.pagination.btnNext.el.onclick = this.nextPage.bind(this);


        this.footer = new FOOTER(this, new MODEL());
        $(this.pagination.el).insertAfter(this.body.pane.el);


        this.loadPage(this.page);



    }

    construct() {
        console.log('Constructing imagegallery');
        let postUrl = '/ImageGallery/ImageIndex';
        if (this.page) {
            postUrl += '?page=' + this.page + '&pageLength=' + this.pageLength;
        }
        $.post(postUrl, {
            '__RequestVerificationToken': token.value
        },
            function (payload, status) {
                if (status === 'success') {

                    console.log('IMAGEGALLERY PAYLOAD:');
                    console.log(payload);

                    this.pageTotal = payload.total;
                    for (let l = 0; l < payload.list.length; l++) {
                        //console.log(payload.list[l]);
                        let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
                            'label': payload.list[l].label,
                            'dataId': -1,
                            'data': {
                                'header': payload.list[l].label,
                                'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>'
                                    + payload.className + '[' + payload.list[l].index + ']',
                                'img': payload.list[l].id,
                                'showImageDetails': true
                            }
                        }));

                        if (payload.list[l].id === 0) {
                            thumb.image.el.setAttribute('style', 'display:none;');
                        }

                        thumb.button.el.onclick = function () {
                            this.launchMain(payload.list[l].id);
                        }.bind(this);
                    }



                    if (!this.pagination.buttonGroup.loaded) {
                        console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
                        this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
                        console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
                        for (let p = 0; p < this.pageCount; p++) {
                            let btn = this.pagination.buttonGroup.addButton(p + 1);
                            btn.el.onclick = function () {
                                this.loadPage(p);
                            }.bind(this);
                        }
                        this.pagination.buttonGroup.loaded = true;
                    }


                }
            }.bind(this)
        );
    }

    loadPage(page) {
        console.log('Loading page ' + page);
        this.header.setInnerHTML('Page ' + (page + 1));

        let buttons = this.pagination.buttonGroup.el.children;
        for (let b = 0; b < buttons.length; b++) {
            $(buttons[b]).removeClass('active');
        }
        //console.log('Activating button[' + page + ']');
        $(buttons[page]).addClass('active');

        /*
        let height = $(this.body.pane.el).height();
        //console.log('Height: ' + height);
        if (height > 0) {
            this.body.pane.el.setAttribute('style', 'height:' + (height + 48) + 'px;display:block;');
        }
        */

        this.body.pane.empty();
        this.page = page;
        this.construct();
        ///this.body.pane.el.setAttribute('style', 'height:auto;');


    }

    nextPage() {
        if (this.pageTotal > this.page * this.pageLength + 1) {
            this.loadPage(this.page + 1);
        } else {
            console.log('No next pages to display');
        }
    }

    prevPage() {
        if (this.page > 0) {
            this.loadPage(this.page - 1);
        } else {
            console.log('No previous pages to display');
        }
    }



    /**
     * Opens the given Image FormPost in a new window
     * @param {number} id Main Container Id
     */
    launchMain(id) {
        window.open(new URL(window.location.href).origin + '/FormPost/Get/' + id);
    }
}
/**
    Contains a high level view of all MAIN Objects available to this user
*/
class INDEXMAIN extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('index-main');
        //this.populate(model.children);

        this.page = 0;
        this.pageLength = 6;
        this.pageTotal = 0;

        //if (this.dataId > 0) {    }

        this.header = new HEADER(this, new MODEL());
        $(this.header.el).insertBefore(this.body.pane.el);

        this.pagination = new FOOTER(this, new MODEL('pagination'));
        this.pagination.el.setAttribute('style', 'text-align:center;');
        $(this.pagination.el).insertBefore(this.body.pane.el);

        this.pagination.btnPrev = new BUTTON(this.pagination, 'Prev');
        this.pagination.btnPrev.el.setAttribute('style', 'margin-right:1em;');
        this.pagination.btnPrev.el.onclick = this.prevPage.bind(this);

        this.pagination.buttonGroup = new BUTTONGROUP(this.pagination);
        this.pagination.buttonGroup.loaded = false;

        this.pagination.btnNext = new BUTTON(this.pagination, 'Next');
        this.pagination.btnNext.el.setAttribute('style', 'margin-left:1em;');
        this.pagination.btnNext.el.onclick = this.nextPage.bind(this);


        this.footer = new FOOTER(this, new MODEL());
        $(this.pagination.el).insertAfter(this.body.pane.el);


        this.loadPage(this.page);
    }

    construct() {
        if (!isNaN(this.page)) {
            console.log('Retrieving page ' + this.page);
            $.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
                '__RequestVerificationToken': token.value
            },
                function (payload, status) {
                    if (status === 'success') {

                        this.pageTotal = payload.total;
                        for (let l = 0; l < payload.list.length; l++) {
                            let thumb = new THUMBNAIL(this.body.pane, new MODEL().set({
                                'label': payload.list[l].label,
                                'dataId': -1,
                                'data': {
                                    'header': payload.list[l].label,
                                    'p': 'Launch ' + payload.list[l].label + ' (' + payload.list[l].id + ')<br>'
                                        + payload.className + '[' + payload.list[l].index + ']'
                                }
                            }));
                            //thumb.image.el.setAttribute('style', 'display:none;');
                            thumb.buttonGroup.removeClass('btn-block');
                            thumb.button.el.onclick = function () {
                                this.launchMain(payload.list[l].id, payload.list[l].label);
                            }.bind(this);
                        }

                        if (!this.pagination.buttonGroup.loaded) {
                            console.log('Page Total: ' + this.pageTotal + ', Length: ' + this.pageLength);
                            this.pageCount = Math.ceil(this.pageTotal / this.pageLength);
                            console.log('PageCount: ' + this.pageCount + ', (' + this.pageTotal / this.pageLength + ')');
                            for (let p = 0; p < this.pageCount; p++) {
                                let btn = this.pagination.buttonGroup.addButton(p + 1);
                                btn.el.onclick = function () {
                                    this.loadPage(p);
                                }.bind(this);
                            }
                            this.pagination.buttonGroup.loaded = true;
                        }
                    }
                }.bind(this)
            );
        } else {
            let note = new P(this.body.pane, new MODEL(), 'No Containers Exist');
        }
    }

    loadPage(page) {
        console.log('Loading page ' + page);
        try {
            this.header.setInnerHTML('Page ' + (page + 1));

            let buttons = this.pagination.buttonGroup.el.children;
            for (let b = 0; b < buttons.length; b++) {
                $(buttons[b]).removeClass('active');
            }
            //console.log('Activating button[' + page + ']');
            $(buttons[page]).addClass('active');

            this.body.pane.empty();
            this.page = page;
            this.construct();
            ///this.body.pane.el.setAttribute('style', 'height:auto;');
        } catch (e) {
            console.log('Unable to load page.');
            console.log(e);
        }
        
    }

    nextPage() {
        if (this.pageTotal > this.page * this.pageLength + 1) {
            this.loadPage(this.page + 1);
        } else {
            console.log('No next pages to display');
        }
    }

    prevPage() {
        if (this.page > 0) {
            this.loadPage(this.page - 1);
        } else {
            console.log('No previous pages to display');
        }
    }



    /**
     * Opens the given Main Id in a new window
     * @param {number} id Main Container Id
     * @param {string} label Main Container Label
     */
    launchMain(id, label) {
        //window.open(new URL(window.location.href).origin + '/' + id);

        // Try opening an IFRAME Modal instead
        debug('Launch Index IFrame Modal');

        this.modal = new MODAL(label);
        this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
            'label': 'iframe',
            'dataId': -1,
            'data': {
                'src': url.origin + '/' + id
            }
        }));
        this.iframe.frame.el.setAttribute('src', url.origin + '/' + id);

        this.modal.show();
    }




    /**
     * Creates the Modal that contains an iFrame with the given page loaded
     * TODO: Consider paging these results
     */
    launchModal() {
        debug('Launch Index IFrame Modal');

        this.modal = new MODAL(this.data.header);
        this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
            'label':'iframe'
        }));


        this.modal.show();
    }


}
/**
    Contains a high level view of all MAIN Objects available to this user
*/
class CLASSVIEWER extends BANNER {
    /**
        Constructs a CLASSVIEWER Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('classviewer');
        //this.populate(model.children);

        this.classType = 'JUMBOTRON';
        //this.classId = 3283;



        

    }

    construct() {

        if (!this.classType) {
            this.classType = 'JUMBOTRON';
        }

        this.h1 = new HEADER(this.body.pane, new MODEL().set({
            'label': this.classType + ' viewer'
        }), 1);

        this.form = this.createEmptyForm(this.body.pane);

        let inputs = [

            // SHOULD BE A SELECT
            new MODEL(new ATTRIBUTES({
                'name': 'classType',
                'value': this.classType,
                'readonly': 'readonly'
            })).set({
                'element': 'INPUT',
                'label': 'Class Type'
            })

        ];

        this.form.fieldset.formElementGroup.addInputElements(inputs);

        this.menulist = new MENULIST(
            this.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style': 'max-height:200px;overflow-y:auto;'
                })
            ).set({
                'name': 'preview-list',
                'label': this.data.listClass + '(s)'
            }));

        let methods = ['Index', 'List', 'Count', 'Page', 'PageIndex', 'GetContainerParents'];
        for (let m = 0; m < methods.length; m++) {
            this.menulist.menu.addNavItem(new MODEL().set({
                'label': this.classType + '.'+methods[m]+'()'
            })).el.onclick = function () {
                window.open(new URL(window.location.href).origin + '/' + this.classType + '/'+methods[m]);
            }.bind(this);
        }
    }
}
/**
    A banner that can be populated with CallOuts
*/
class PARAGRAPH extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('textblock');
        this.body.pane.addClass('paragraph');
        //this.dataElements = DATAELEMENTS.PARAGRAPH;
        this.addContainerCase('IMAGE');
        //this.construct();
        this.populate(model.children);
    }

    construct() {
        
        if (this.dataId > 0) {
            if (this.data.p) {

                let d = getDateObject(getDateValue(this.dateCreated));

                this.header = new HEADER(this.body.pane, new MODEL().set({
                    'label': d.date + ' - ' + d.time//'paragraph header'
                }));
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        } else {
            // This object REQUIRES model.data 
            // Open up the save panel and generate some

            
            let formPostInput = new FORMPOSTINPUT(this, new MODEL().set({
                'inputs': this.inputs
            }));
            formPostInput.newAttributes(this, 'dataId', this);

            


           // app.sidebar.empty();
            //app.toggleSidebar();

            //let saveForm = this.save(app.sidebar);

            
            //app.sidebar.target = this;
        }
    }
}
/**
    Textblock Constructor
    A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.

    A textblock can be recursively stacked

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
    @param {number} depth The heirarchy for header elements, classes etc
*/
class TEXTBLOCK extends CONTAINER {
    constructor(node, model, depth) {
        super(node, 'DIV', model);
        this.addClass('textblock');

        this.body.pane.addClass('container'); // col-lg-offset-2 col-lg-8

        //this.dataElements = ['text'];
        this.dataElements = DATAELEMENTS.TEXTBLOCK;

        this.row = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('row')));
        this.col = new EL(this.row, 'DIV', new MODEL(new ATTRIBUTES('col-lg-offset-2 col-lg-8')));

        if (model.dataId > 0) {
            this.text = new P(this.col, model.data, model.data.text);
        }
        
        this.populate(model.children);
    }
}
/**
    List Item Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class LISTITEM extends CONTAINER {
    /**
        Constructs A List Item
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'LI', model, ['LIST']);
        this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0 || this.dataId === -1) {
            //this.text = new P(this.body.pane, model.data, model.data.label); // 2018-06-13: swap for text
            if (this.data.p) {
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        }
    }
}
/**
    List Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class LIST extends CONTAINER {
    /**
        Constructs An Unordered List
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'UL', model, ['LISTITEM']);
        this.addClass('list');
        this.populate(model.children);
    }

    construct() {

    }

    /**
     * Adds a List Item (LI) to this LIST
     * @param {any} model
     */
    addListItem(model) {
        this.children.push(new LISTITEM(this, model)); //model.url, model.label
        return this.addGroup(this.children[this.children.length - 1]);
    }
}
/**
    MenuList Constructor
    A MENULIST is essentially a UL that is designed to contain List Items (LI)
    Unlike most containers

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class MENULIST extends CONTAINER {
    /**
        Constructs An Unordered List
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'DIV', model, []); //'LISTITEM'
        this.addClass('menulist');
        //this.populate(model.children);
    }

    construct() {
        this.menu = new MENU(this.body.pane, new MODEL('menulist-menu').set({
            'label':this.label
        }));
    }
}
/**
    A generic Form Element.

    Icarus form elements represent generic required values
    for INPUT, SELECT or TEXTAREA items. This object is
    generally passed into the Input, Select
    or TextArea to set its values.
*/
class FORMELEMENT extends CONTAINER {
    /**
        Constructs a Form Element 
        @param {FORMELEMENTGROUP} node The parent
        @param {string} element INPUT, SELECT, TEXTAREA
        @param {MODEL} model the data model
     */
    constructor(node, element, model) {
        model.hasSidebar = 0;     
        super(node, 'DIV', model);
        this.addClass('form-element');        
        //this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0');
    }

    construct() {
        let labelText = this.label ? this.label : this.attributes.name ? this.attributes.name : '__NoLabel';
        this.label = new LABEL(this.body.pane, labelText);        
    }
}
/**
    Represents a <TEXTAREA> for an Icarus Form       
*/
class TEXTAREA extends FORMELEMENT {
    /**
        Construct a Text Area
        @param {EL} node The parent object
        @param {MODEL} model The textarea model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.input = new EL(this.body.pane, 'TEXTAREA', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': model.attributes.name                
            })
        ), model.attributes.value || '');

        //this.construct();
    }

    construct() {

    }
}
/**
    Represents the model for an <OPTION> for an Icarus Form Select
    
*/
class OPTION extends EL {
    /**
        A form option
        @param {SELECT} node The parent
        @param {string} label The element label
        @param {string} value The element value
    */
    constructor(node, label, value) {
        value = value ? value : '';
        label = label ? label : value;
        super(node, 'OPTION', {
            'value': value
        }, label);
    }
}
/**
    Represents a <SELECT> for an Icarus Form    
*/
class SELECT extends FORMELEMENT {
    /**
        An Input/Select OPTION constructor.
        @param {EL} node The parent
        @param {string} model The Form Select model
        @param {array} options A collection of key,value pairs
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.dataElements = ['options'];
        this.createSelect();
    }

    createSelect() {
        this.input = new EL(this.body.pane, 'SELECT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': friendly('INPUT_' + guid())
            })
        ));

        if (this.dataId > 0) {
            let options = this.data.options.split(',');
            try {
                for (let o = 0; o < options.length; o++) {
                    console.log('Option[' + o + ']: ' + options[o]);
                    new OPTION(this.input, options[o], options[o]);
                }
            } catch (e) {
                debug(e);
            }
        }
    }

    /**
        Adds a Nav Item to this Drop Down Menu Group
        @param {MODEL} model Nav Item Model
        @returns {OPTION} An INPUT OPTION
     */
    addFormElementOption(model) {
        this.children.push(
            new OPTION(this, model, model.hasDropdown)
        );
        return this.children[this.children.length - 1];
    }

    /**
        Adds an <OPTION> to this <SELECT>
        @param {string} label The label
        @param {string} value The value
        @param {boolean} selected If true, option is selected
    */
    addOption(label, value) { 
        console.log('addOption(' + label + ',' + value + ');');
        if (label === undefined || value === undefined) {
            try {
                this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');

                this.prompt.formGroup.addInput('Label', IcarusInputType.TEXT, '');
                this.prompt.formGroup.addInput('Value', IcarusInputType.TEXT, '');

                this.prompt.buttonGroup.addButton('Add Option').el.onclick = function () {
                    this.options.push(
                        new Option(
                            this,
                            $(this.prompt.el).find('input[name="Label"]')[0].value,
                            $(this.prompt.el).find('input[name="Value"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = function () {
                    this.prompt.hide();
                }.bind(this);

                this.prompt.show();

            } catch (e) { console.log('Unable to change name for this element\n' + e); }

        } else {
            let opt = new OPTION(this.input, label, value);
            this.input.options.push(opt);
        }
    }    
}
/**
    Represents an <INPUT> for an Icarus Form
*/
class INPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.createInput();        
    }

    /**
     * TODO:
     * This should use a factory constructor pattern to create specific input types 
     */
    createInput() {
        let nm = this.attributes.name || this.data.name;
        let val = this.attributes.value || this.data.value;
        this.input = new EL(this.body.pane, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'type': this.attributes.type || this.data.type || 'TEXT',
                'list': nm + '-options',
                'name': nm,
                'value': val || ''
            })
        ));

        // file, text, number, email, phone (html5 inputs)
        // this should use a factory constructor pattern to create specific input types
        if (this.data.type === 'file' || this.attributes.type === 'image' || this.attributes.type === 'file') {

            // Create an empty subform, similar to a data/attributes object to save the image by FormPostId
            this.img = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                'style': 'min-height:64px;min-width:64px;max-width:120px;height:auto;border:4px solid white;background-color:grey;margin:1em;padding:0.3em;border-radius:0.3em;'
            })));

            this.img.el.onclick = function () {
                this.input.el.click();
            }.bind(this);

            this.img.el.onload = function () {
                this.dimX.input.el.setAttribute('value', this.img.el.naturalWidth);
                this.dimY.input.el.setAttribute('value', this.img.el.naturalHeight);
            }.bind(this);

            this.base64 = new TEXTAREA(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'base64',
                'label': 'base64'
            }).set({
                'name': 'base64',
                'label': 'base64'
            })));

            this.fileName = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'filename',
                'label': 'base64'
            }).set({
                'name': 'filename',
                'label': 'filename'
            })));

            this.fileType = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'fileType',
                'label': 'base64'
            }).set({
                'name': 'fileType',
                'label': 'fileType'
            })));

            this.fileSize = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'fileSize'
            }).set({
                'name': 'fileSize',
                'label': 'fileSize'
            })));

            this.dimX = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'dimX'
            }).set({
                'name': 'dimX',
                'label': 'dimX'
            })));

            this.dimY = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'dimY'
            }).set({
                'name': 'dimY',
                'label': 'dimY'
            })));

            // When the input is set (selected from explorer)
            // extract its data into the appropriate inputs (above)
            this.input.el.onchange = this.readURL.bind(this);

        } else {
            // Add any preset options to the datalist
            this.options = [];
            this.datalist = new EL(this.node, 'DATALIST', new MODEL(
                new ATTRIBUTES({
                    'id': this.attributes.name + '-options'
                })
            ));
            if (Array.isArray(this.options)) {
                for (let o = 0; o < this.options.length; o++) {
                    this.addOption(this.options[o].value);
                }
            }
        }
    }

    /**
     * Reads the contents of this FILE INPUT and extracts the base64 values
     * and metadata
     * 
     * See https://gist.github.com/batuhangoksu/06bc056399d87b09243d
     */
    readURL() {
        console.log('readUrl():  Reading an Image');
        app.loader.log(10, 'Loading...');
        // TODO:  This should detect file types and limit accordingly
        try {
            /* Use FileReader to extract base64 and attributes */
            if (this.input.el.files && this.input.el.files[0]) {

                let reader = new FileReader();
                reader.onload = function (e) {
                    $(this.input.el).attr('src', e.target.result);
                    this.img.el.src = e.target.result;
                    this.base64.input.el.innerHTML = e.target.result;
                    this.fileName.input.el.value = this.input.el.files[0].name;
                    this.fileType.input.el.value = this.input.el.files[0].type;
                    this.fileSize.input.el.value = Math.ceil(this.input.el.files[0].size/1000);
                }.bind(this);

                // Load file
                reader.readAsDataURL(this.input.el.files[0]);
            }
        } catch (e) {
            console.log(e);
        } 
    }

    /**
        Sets the label of this element to the given value.
        @param {string} label The name to be set
    */
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label.setInnerHTML(label);
        this.input.el.setAttribute('name', label);
    }

    /**
        // TODO: Consider how to share these lists with the entire application rather than
        // reduntantly load the same data over and over again
        Adds an option to this input element
        @param {string} label The label
        @param {string} value The value
    */    
    addOption(label, value) {
        if (label === undefined || value === undefined) {
            try {
                this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');

                this.prompt.formGroup.addInput('label', IcarusInputType.TEXT, '');
                this.prompt.formGroup.addInput('value', IcarusInputType.TEXT, '');

                this.prompt.buttonGroup.addButton('Add Option').el.onclick = function () {
                    this.options.push(
                        new Option(
                            this.datalist.el,
                            $(this.prompt.el).find('input[name="label"]')[0].value,
                            $(this.prompt.el).find('input[name="value"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this element');
                console.log(e);
            }
        } else {
            this.options.push(
                new Option(this.datalist.el, label, value)
            );
        }
    }
}
/**
    Represents an file <INPUT> for an Icarus Form
*/
class FILE extends INPUT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, new MODEL(
            new ATTRIBUTES({
                'type': 'FILE',
                'name': model.attributes.name
            })
        ));

        this.base64 = new TEXTAREA(this.body.pane, new MODEL().set({
            'name':'base64'
        }));

        this.dataElements.push(
            new MODEL(new ATTRIBUTES({
                'name': 'accept',
                'type': 'text'
            })).set({
                'element': 'INPUT',
                'label': 'accept'
            })
        );
    }    
}
/**
    A token provided by the client side to authenticate form POST    
*/
class TokenInput extends EL {
    /**
        Constructs an INPUT element that represents the Anti Forgery Token
        @param {EL} node The parent object
     */
    constructor(node) {
        super(node,
            'INPUT',
            new MODEL(
                new ATTRIBUTES('', '__RequestVerificationToken', 'HIDDEN', token.value)
            )
        );
    }
}
/**
    Represents an <INPUT> for an Icarus Form
    A FormPost Input acts as a special input that is populated
    with the Form Post Editor.

    The FormPostInput initially displays an individual INPUT, but can
    retrieve a secondary sub-form based on the input's value (aka: FormPost Id)
*/
class FORMPOSTINPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.createInput();
        //this.populate(model.children);
    }

    createInput() {
        //console.log('FORMPOSTINPUT class');
        //console.log(model);

        this.inputGroup = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('input-group')));
        this.input = new EL(this.inputGroup, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': this.attributes.name,
                'value': this.attributes.value,
                'type': this.attributes.type || 'text'
            })
        ));

        this.form = null;

        //console.log('Val:' + model.attributes.value);
        //console.log(model);

        if (this.attributes.value > 0 || this.value > 0) {
            //console.log('btnEdit');
            this.btnEdit = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'EDIT1');
            this.btnEdit.el.onclick = function () {
                console.log('Editing FormPost: ' + this.label);
                console.log(this);
                this.editFormPost();
            }.bind(this);
        }

        this.btnNew = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'NEW1');
        this.btnNew.el.onclick = function () {
            
            // TODO:  PLEASE, fix this.  This is ugly
            //let container = this.node.node.node.node.node.node.node.node.node.node.node.node.node.node.node;
            //let container = this.getProtoTypeByClass('CONTAINER');
            let container = app.sidebar.target;

            //console.log('Container');
            //console.log(container);    

            this.newAttributes(container, this.attributes.name, this);
            

        }.bind(this);
    }

    /**
     * Sets the id of the original FormPostInput to the given value
     * @param {number} id Id to set
     */
    updateInput(id) {
        this.input.el.value = id;
    }

    /**
     * Opens a Modal Form populated with an open version of the FormPost
     * @param {CONTAINER} container The container that this belongs to
     * @param {string} dataIdLabel The key (dataId or attributesId) to add object to
     * @param {MODEL} model Model
     */
    newAttributes(container, dataIdLabel, model) {
        let inputs = [];

        // Generate new FormPost
        try {
            $.getJSON('/FORMPOST/Get/0', function (data) {
                console.log('Created new Form Post / Attributes / Image / Description');
                console.log(data.model);

                // Id, label and Shared are hardcoded
                inputs = [
                    new MODEL(new ATTRIBUTES({
                        'name': 'shared',
                        'value': data.model.shared
                    })).set({
                        'element': 'INPUT',
                        'label': 'shared',
                        'value': '1'
                    }),

                    new MODEL(new ATTRIBUTES({
                        'name': 'id',
                        'value': data.model.id
                    })).set({
                        'element': 'INPUT',
                        'label': 'id'
                    }) 

                    /*
                    new MODEL(new ATTRIBUTES({
                        'name': 'label',
                        'value': data.model.label
                    })).set({
                        'element': 'INPUT',
                        'label': 'label'
                    })
                    */
                ];

                console.log('dataIdLabel: ' + dataIdLabel);
                console.log('container:');
                console.log(container);

                // Append any model inputs if they exist
                try {
                    for (let m = 0; m < model.inputs.length; m++) {
                        inputs.push(model.inputs[m]);
                    }
                } catch (e) {
                    //console.log(e);
                    console.log('No additional inputs exist for this form post');
                }

                


                // Set values in MODEL and DOM
                this.input.el.setAttribute('value', data.model.id);
                container[dataIdLabel] = data.model.id; 

                if (dataIdLabel === 'dataId') {
                    // Append additional dataElements
                    console.log('DATAELEMENTS:');
                    console.log(container.dataElements);

                    if (container.dataElements.length > 0) {
                        for (let i = 0; i < container.dataElements.length; i++) {
                            inputs.push(container.dataElements[i]);
                        }
                    }
                } 

                if (dataIdLabel === 'descriptionId') {
                    inputs.push(
                        new MODEL(new ATTRIBUTES({
                            'name': 'description',
                            'type': 'text'
                        })).set({
                            'element': 'TEXTAREA',
                            'label': 'description'
                        })
                    );
                }
                
                // Construct empty form
                this.form = container.createEmptyForm(this.body.pane);
                console.log('formpostinput: 3');
                //this.form.formId = 3;
                this.form.id = 3;
                this.form.el.setAttribute('id', 3);

                this.form.prompt = this;

                // TODO: Fix this up
                if (inputs) {
                    console.log('inputs:');
                    console.log(inputs);
                    for (let i = 0; i < inputs.length; i++) {
                        let inp = null;
                        if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
                            console.log('WOOT');
                            console.log('FORMPOSTINPUT');
                            new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        } else {
                            console.log('BLERT');
                            new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        }
                        this.form.fieldset.formElementGroup.children.push(inp);
                    }
                }
                
                //this.form.fieldset.formElementGroup.toggleHeaders();

                this.form.setPostUrl('FormPost/Set');
                this.form.afterSuccessfulPost = function () { 
                    console.log('FormPostInput.form.afterSuccessfulPost()');
                    app.loader.log(100, 'Success');                    
                    this.updateInput(data.model.id);

                    // TODO: Iterate though input values
                    console.log('TODO: Iterate through inputs and update values in model');


                    //https://developers.google.com/web/fundamentals/primers/promises
                    let promise = new Promise(function (resolve, reject) {
                        console.log('Promise: Saving parent form');
                        if (container.quickSave(true)) {
                            resolve('QuickSaved');
                        } else {
                            reject(Error('Failed to QuickSave'));
                        }
                    }.bind(this));

                    // @see https://scotch.io/tutorials/javascript-promises-for-dummies
                    promise.then(
                        function (result) {
                            console.log('Promise success');
                            let cc = container.getProtoTypeByClass('CONTAINER');
                            if (cc !== null) {
                                cc.refresh();
                            }

                        }.bind(this),
                        function (err) {
                            console.log('promise fail');
                            console.log(err); // Error: "It broke"
                        }.bind(this)
                    );


                    

                    // promise to refresh parent?
                    

                    // refresh -- bad idea, creates duplication
                    //container.getProtoTypeByClass('CONTAINER').refresh();

                    //app.loader.hide();
                }.bind(this);

            }.bind(this));

        } catch (e) {
            app.loader.log(0, 'Unable to retrieve FormPost.');
            debug(e);
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
        @param {ARRAY} inputArray Array of inputs
     */
    editFormPost(inputArray) {

        // If given value is an integer, assume this is the FormPostId, 
        // otherwise, retrieve the formpost
        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'id',
                'value': this.input.attributes.value
            })).set({
                'element': 'INPUT',
                'type': 'FORMPOST',
                'label': 'id'
            })
        ];

        // Test to see if the formpost can be retrieved
        try {
            $.getJSON('/FORMPOST/Get/' + this.input.attributes.value, function (data) {

                // If access granted...
                if (data.model) {
                    if (data.model.jsonResults) {
                        console.log('Retrieved form post: ' + this.input.attributes.value);
                        console.log(data.model);
                        console.log('Parsed...');
                        let parsed = JSON.parse(data.model.jsonResults);
                        console.log(parsed);


                        // If retrieved, push each node as an attribute/data value from jsonResults
                        for (let i = 0; i < parsed.length; i++) {
                            if (parsed[i].name !== 'id') {
                                console.log('parsed[' + i + ']:');
                                console.log(parsed[i]);
                                console.log('inputs[]:');
                                console.log(inputs);

                                inputs.push(
                                    new MODEL(new ATTRIBUTES({
                                        'name': parsed[i].name,
                                        'value': this.htmlDecode(parsed[i].value) || ''
                                    })).set({
                                        'element': 'INPUT',
                                        'label': parsed[i].name
                                    })
                                );
                                //inputs[i].attributes.value = this.htmlDecode(parsed[i].value) || '';

                            }
                        }

                        // Instead, set values of preset (based on DATAELEMENTS) inputs

                        this.form = this.createEmptyForm(this.body.pane);
                        console.log('formpostinput: 3');
                        this.form.id = 3;

                        // Empty out and populate with Form Elements only                    
                        this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty();
                        this.form.fieldset.formElementGroup.addContainerCase('INPUT');
                        this.form.fieldset.formElementGroup.addContainerCase('SELECT');
                        this.form.fieldset.formElementGroup.addContainerCase('TEXTAREA');


                        // TODO: Fix this up
                        if (inputs) {
                            for (let i = 0; i < inputs.length; i++) {
                                console.log('inputs[' + i + ']: ' + inputs[i].type);
                                let inp = null;
                                if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT') {
                                    console.log('FORMPOSTINPUT');
                                    new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                } else {
                                    new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                }

                                this.form.fieldset.formElementGroup.children.push(inp);
                            }
                        }


                        /*
                        // NOW, MAKE A PROMPT for this ATTRIBUTES FORMPOST using the given FormPostId/AttributesId
                        this.prompt = new PROMPT(
                            'FORMPOSTINPUT: Save ATTRIBUTES()', 'Saves the ATTRIBUTES() via FORMPOSTINPUT',
                            [], inputs
                        );
                        */
                        this.form.fieldset.formElementGroup.toggleHeaders();

                        this.form.setPostUrl('FormPost/Set');
                        this.form.afterSuccessfulPost = function () {
                            console.log('success');
                            this.updateInput(data.model.id);

                            //this.form.loader.hide(200);
                            //app.loader.hide();
                            //this.prompt.close(300);
                        }.bind(this);
                    } else {
                        console.log('Json Results empty');
                    }

                } else {
                    this.prompt = new MODAL('Exception', data.message);
                    this.prompt.show();

                    app.login();
                }

            }.bind(this));
        } catch (e) {
            console.log('Unable to retrieve FormPost.');
            console.log(e);
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
     */
    editAttributes() {
        //this.prompt = null;
        console.log('editattributes');
        let id = parseInt(this.input.attributes.value);
        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'id',
                'value': id
            })).set({
                'element': 'INPUT',
                'type': 'FORMPOST',
                'label': 'id'
            })
        ];

        // Test to see if the formpost can be retrieved
        try {
            $.getJSON('/FORMPOST/Get/' + id, function (data) {

                // If access granted...
                if (data.model) {
                    if (data.model.jsonResults) {
                        app.loader.log(80, 'Retrieved Post: ' + id);
                        console.log('Data Model:');
                        console.log(data.model);
                        let parsed = JSON.parse(data.model.jsonResults);
                        debug(parsed);

                        console.log('Creating elements for ' + this.node.className);
                        console.log(this.node);

                        let container = this.getContainer('dataId', id, this.node);
                        console.log('getContainer(' + data.model.id + ');');
                        //console.log(container);
                        if (container !== undefined) {

                            for (let i = 0; i < parsed.length; i++) {
                                if (parsed[i].name !== 'id') {

                                    let value = null;
                                    if (container[parsed[i].name]) {
                                        if (container[parsed[i].name].el) {
                                            value = container[parsed[i].name].el.innerHTML;
                                        }
                                    } else {
                                        value = parsed[i].value;
                                    }

                                    inputs.push(
                                        new MODEL(new ATTRIBUTES({
                                            'name': parsed[i].name,
                                            'value': value //parsed[i].value
                                        })).set({
                                            'element': 'INPUT',
                                            'label': parsed[i].name
                                        })
                                    );
                                }
                            }

                            app.loader.log(90, 'Creating Form');
                            try {
                                this.form.destroy();
                            } catch (e) {
                                debug(e);
                            }

                            this.form = this.createEmptyForm();
                            this.form.label = 'Modify';
                            this.form.fieldset.formElementGroup.label = 'Attributes';

                            // Empty out and populate with Form Elements only                    
                            this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty();
                            this.form.fieldset.formElementGroup.addContainerCase('INPUT');
                            this.form.fieldset.formElementGroup.addContainerCase('SELECT');
                            this.form.fieldset.formElementGroup.addContainerCase('TEXTAREA');


                            // TODO: Include other inputs such as SELECT and TEXTAREA
                            if (inputs) {
                                app.loader.log(75, 'Loading Attributes');
                                for (let i = 0; i < inputs.length; i++) {
                                    let inp = null;
                                    if (inputs[i].type === 'FORMPOSTINPUT') {
                                        new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                    } else {
                                        new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                    }
                                    this.form.fieldset.formElementGroup.children.push(inp);
                                }
                            }

                            // Show headers so that inputs can be modified
                            this.form.fieldset.formElementGroup.toggleHeaders();

                            this.form.setPostUrl('FormPost/Set');
                            this.form.afterSuccessfulPost = function () {
                                app.loader.log(100, 'Updated Attributes');
                                this.updateInput(data.model.id);
                                //app.loader.hide();
                            }.bind(this);

                            //app.loader.hide();

                        } else {
                            app.loader.log('Unable to retrieve parent container');

                        }
                    } else {
                        console.log('Json Results empty');
                    }

                } else {
                    app.loader.log(0, data.message);
                    app.loader.log(0, 'An Exception Occurred');
                    app.login();
                }

            }.bind(this));
        } catch (e) {
            app.loader.log(0,'Unable to retrieve FormPost.');
            debug(e);
        }
    }
}
/**
    A container made up of a group of form elements
*/
class FORMELEMENTGROUP extends CONTAINER {
    /**
        Constructs a Form Element Group
        @param {EL} node The parent
        @param {MODEL} model datamodel
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['INPUT', 'SELECT', 'TEXTAREA']);
        this.addClass('form-element-group');
        //this.addContainerCase('INPUT');
        //this.addContainerCase('SELECT');
        //this.addContainerCase('TEXTAREA');
        //this.construct();
        this.populate(model.children);
    }

    construct() {

    }

    /**
     * Adds the array of input elements to this form element group
     * @param {any} inputs A list of inputs
     */
    addInputElements(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            debug('inputs[' + i + ']:');
            debug(inputs[i]);
            let inp = null;
            if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
                inp = new FORMPOSTINPUT(this.body.pane, inputs[i]);
            } else {
                if (inputs[i].element === 'TEXTAREA') {
                    inp = new TEXTAREA(this.body.pane, inputs[i]);
                } else {
                    inp = new INPUT(this.body.pane, inputs[i]);
                }
            }
            this.children.push(inp);
        }
    }
}
/**
    Construct a Form Fieldset
*/
class FIELDSET extends CONTAINER {
    /**
        A field set / form-group that contains form elements within a section.

        @param {FORM} node The parent object
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'FIELDSET', model);
        this.addClass('form-group-container');
        this.body.addClass('form-group'); // The expandable portion of the section
        this.addContainerCase('FORMELEMENTGROUP');
        //this.construct();
        this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0) {
            if (this.data.legend) {
                this.legend = new EL(this.body.pane, 'LEGEND', new MODEL(), this.data.legend);
            }
        }
    }
}
/**
    A generic footer that should be placed at the bottom of content
*/
class IcarusFormFooter extends FOOTER {
    /**
        Constructs a Form Footer
        @param {EL} node The object to contain the table
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.el.className = 'btn-group-justified form-footer';
        this.buttonGroup = new BUTTONGROUP(this, null, ALIGN.VERTICAL, SIZE.MED); // Left aligned button group
    }    
}
/**
    Represents the data object to be submitted to the server for validation.
    @param {FORM} form An Icarus Form
*/
class FORMPOST {
    /**
        @param {FORM} form The form that generated this FORMPOST
     */
    constructor(form) {
        this.__RequestVerificationToken = token.value;
        this.id = form.el.getAttribute('id');
        this.formId = form.el.getAttribute('id');
        this.label = form.el.getAttribute('name');

        // An ordered array of key/value pairs as they appear in the FORM
        this.results = form.getResultsAsArray();

        this.message = '';
    }

    /**
        Serialize the form into a JSON object key/value
        @returns {object} Form Results as an Object
    */
    getResultsAsObject() {
        let obj = {};
        try {
            this.results.forEach(
                function (item, index) {
                    if (obj[item.name] === undefined) { // New
                        obj[item.name] = item.value || '';
                    } else {                            // Existing
                        if (!obj[item.name].push) {
                            obj[item.name] = [obj[item.name]];
                        }
                        obj[item.name].push(item.value || '');
                    }
                }
            );
        } catch (e) {
            console.log('Unable to parse FormPost into an object');
            console.log(e);
        }
        return obj;
    }
}
/**
    Constructs an Icarus Form Object.

    An FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.
*/
class FORM extends CONTAINER {
    /**
        Constructs a Form for collecting and posting

        @param {CONTAINER} node The parent object
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'FORM', model, ['FIELDSET']);
        this.tokenInput = new TokenInput(this);
        this.setPostUrl('Form/Submit');
        this.updateUrl = 'Form/Update';
        this.footer = new IcarusFormFooter(this.body, new MODEL());
        this.footer.buttonGroup.addButton('Submit', ICONS.SAVE).el.onclick = this.post.bind(this);
        this.populate(model.children);
    }

    construct() {

    }

    /**
        Retrieves the Post Url for this class.  // TODO: Is this necessary?
        @returns {string} The Url that this form POSTs to
     */
    getPostUrl() {
        return this.postUrl;
    }

    /**
        Sets the POST url for this form
        @param {string} url Target url
     */
    setPostUrl(url) {
        this.postUrl = url;
    }

    /**
        Disables all fieldsets within this form
    */
    lock() {
        try {
            console.log('Locking form...');
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].el.disabled = true;
            }
        } catch (e) {
            console.log('Unable to lock this form');
            console.log(e);
        }
    }

    /**
        Enables all fieldsets within this form
    */
    unlock() {
        console.log('Unlocking form...');
        for (let i = 0; i < this.children.length; i++) {
            try {
                this.children[i].el.disabled = false;
            } catch (e) {
                console.log(
                    e instanceof TypeError ? 'Unable to lock "' + this.children[i].element + '"' : e
                );
            }
        }
    }
    
    /**
        HTML encodes all form element values.  
    */
    htmlEncodeValues() {
        try {
            for (let e = 0; e < this.el.elements.length; e++) {
                console.log('Encode type: ' + this.el.elements[e].type);
                if (this.el.elements[e].type === 'text' || this.el.elements[e].type === 'textarea') {
                    this.el.elements[e].value = this.htmlEncode(this.el.elements[e].value);
                }                
            }
        } catch (e) {
            console.log('FORM.htmlEncodeValues() failed.');
            console.log(e);
        }
    }

    /**
        Returns only alphanumeric characters
        @param {any} str String to convert
        @returns {string} A string of only alphanumeric characters
     */
    alphaNumeric(str) {
        str = str === undefined ? '' : str.toString().replace(/^[a-zA-Z0-9-_]+$/, '');
        // /^[a-zA-Z0-9-_]+$/
        return str === null || str === undefined ? '' : str.toString().replace(/[\[\]']/g, '');
    }

    /**
     * Flags the given element as invalid 
     * @param {any} element The form element
     */
    setInvalid(element) {
        this.payload.isValid = false;
        element.focus();
        element.setAttribute('data-valid', this.payload.isValid);
        $(element.previousSibling).addClass('invalid'); // Set label class to 'invalid'
    }

    /**
        Validate the current form and return true if form is valid
        Note that this is a simple form of validation that occurs on the
        client side and should not be used as a substitution for
        server side validation.
        @returns {object} The validation payload
    */
    validate() {
        debug('Validating...');

        this.htmlEncodeValues();

        this.payload = {
            isValid: true,
            formName: this.el.name
        };

        for (let e = 0; e < this.el.elements.length; e++) {
            //debug('Element: ' + this.el.elements[e].name);
            switch (this.el.elements[e].type) {
                case 'input':
                case 'text':
                case 'email':
                case 'tel':
                case 'password':
                    if (this.el.elements[e].checkValidity()) { // HTML5 Validation
                        if (this.el.elements[e].value === '') {
                            this.setInvalid(this.el.elements[e]);
                        } else {
                            $(this.el.elements[e]).removeClass('invalid');
                            //this.el.elements[e].focus();
                            this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
                            //$(this.el.elements[e].previousSibling).addClass('invalid');
                        }
                        break;
                    } else {
                        debug(this.el.elements[e].name + ' -- isValid: ' + this.el.elements[e].checkValidity());
                        this.setInvalid(this.el.elements[e]);
                        break;
                    }

                case 'select-one':
                    if (this.el.elements[e].selectedIndex === 0) {
                        this.setInvalid(this.el.elements[e]);
                    } else {
                        $(this.el.elements[e]).removeClass('invalid');
                        this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
                    }
                    break;
            }
        }
        console.log('Validation Result: '+this.payload.isValid);
        return this.payload;
    }

    /**
        Resets the form and any validation notifications.
    */
    reset() {
        console.log('Resetting form[' + this.el.name + ']');
        for (let e = 0; e < this.el.elements.length; e++) {
            this.el.elements[e].removeAttribute('data-valid');
            $(this.el.elements[e].previousSibling).removeClass('invalid');
        }
        this.el.reset();
    }

    /**
        Serialize the form into an array
        @returns {array} Form Results as an Array of key/value pairs
    */
    getResultsAsArray() {
        console.log('FORM.getResultsAsArray()');
        return $(this.el).serializeArray();
    }

    /**
        If valid, Returns a FormPost based on values in this form
        @returns {FormPost} A FormPost Object
    */
    getFormPost() {
        return this.validate().isValid ? new FORMPOST(this) : null;
    }

    /**
        Post values to server.

        Posts the contents of the given Form Post to the specified url
        and updates the given prompt.

        param {CONTAINER} master The master element whos state and id is to be updated
    */
    post() {

        // Post results to server
        app.loader.log(10, 'Posting values to server: ' + this.getPostUrl());
        let formPost = this.getFormPost();
        console.log('FORMPOST: ');
        console.log(formPost);

        if (formPost) {

            this.lock();

            /**
                JQuery POST
            */
            console.log('Posting to: ' + this.postUrl);
            console.log(formPost);
            
            $.ajax({
                url: this.postUrl, 
                type: "POST",
                data: formPost,
                error: function (xhr, statusText, errorThrown) {
                    app.loader.log(100, 'Access Denied: ' + statusText + '('+ xhr.status+')');
                }.bind(this),
                statusCode: {
                    200: function (response) {
                        debug('StatusCode: 200');
                        debug(response);
                        app.loader.log(0, response.message, true);
                    },
                    201: function (response) {
                        debug('StatusCode: 201');
                        debug(response);

                    },
                    400: function (response) {
                        debug('StatusCode: 400');
                        debug(response);
                    },
                    403: function (response) {
                        debug('StatusCode: 403');
                        debug(response);
                        app.loader.log(100, 'Access Denied: ' + response);
                        app.login();
                    },
                    404: function (response) {
                        debug('StatusCode: 404');
                        debug(response);
                    }
                }, success: function (payload) {
                    debug('Success');
                    app.loader.log(25, 'Posted results to server.');

                    app.loader.log(50,
                        'Updating...<br><hr/>'
                        + payload.message + '<br><hr/>'
                    );

                    this.unlock();
                    app.loader.log(100, 'Form Submitted');
                    this.afterSuccessfulPost(payload);
                }.bind(this)
            });
            
        } else {
            debug('FormPost is invalid');
            app.loader.log(0, 'Post Failed to submit.  Values may be invalid.');
            app.loader.showConsole();
            //$(app.loader.console.el).collapse('show');
        }
    }
}
class LogoutForm extends FORM {
    /**
        Constructs an Icarus Logout Form
        @param {APP} node APP element to contain logout form
     */
    constructor(node) {
        // EVERY SINGLE APP requires a LOGOUT form, although it may be possible to
        // create the form on demand rather than clogging up the DOM
        super(node, new MODEL(
            new ATTRIBUTES({
                'id': 'logoutForm',
                'name': 'logoutForm', 
                'method': 'POST',
                'action': '/Account/LogOff'
            })
        ).set({
            'id': 'logoutForm',
            'label': 'Logout Form'            
        }));
    }
}
/**
    A collection of words
*/
class DICTIONARY extends CONTAINER {
    /**
        Construct and ARTICLE
        @param {MAIN} node The APP to contain the article
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['WORD']);
        this.populate(model.children);
    }

    construct() {

    }
}
/**
    A word used in a Vocabulary
*/
class WORD extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {DICTIONARY} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        //this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0) {
            console.log(this);
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': this.data.value
            }), 1);

        } else {
            console.log(this);
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': 'Unknown'
            }), 1);

        }
    }
}
/**
    A Chat Window
*/
class CHAT extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'DIV', model, []);
        this.addClass('chat');

        //this.conversation = new EL(this.body.pane, 'DIV', new MODEL('conversation'));

        

        this.form = this.createEmptyForm(this.body.pane);
        this.form.el.style = 'height:68px;background-color:#5a5a5a;';
        $(this.form.el).insertAfter(this.body.pane.el);

        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'statement',
                'type': 'TEXTAREA',
                'value': ''
            })).set({
                'element': 'TEXTAREA',
                'label': 'element'
            })
        ];

        this.form.fieldset.formElementGroup.addInputElements(inputs);

        this.form.setPostUrl('CHAT/Talk');

        /*
            Show the Payload response
        */
        this.form.afterSuccessfulPost = function (payload) {
            //console.log(payload);
            setTimeout(function () {
                this.addStatement('ICARUS', payload.message);
            }.bind(this), 1000);
        }.bind(this);
        
        this.chatInput = this.form.fieldset.formElementGroup.children[0].input;
        console.log('Chat Input');
        console.log(this.chatInput);
        this.chatInput.el.onkeypress = this.postStatement.bind(this);

    }

    /**
     * Posts the chat statement to the server and handles any responses
     * when the user presses ENTER 
     * @returns {Boolean} True if succeeds
     */
    postStatement() {
        if (window.event.keyCode === 13) {
            this.addStatement(app.getUser(), this.chatInput.el.value);
            this.form.post();
            this.chatInput.el.value = '';
            return false;
        } else {
            return true;
        }
    }

    /**
     * Adds a statement to the conversation window
     * @param {string} username User name
     * @param {string} string Statement
     * @returns {EL} The statement object
     */
    addStatement(username, string) {
        let statement = new EL(this.body.pane, 'DIV', new MODEL('statement'));
        statement.el.style.display = "none";

        statement.thumb = new EL(statement, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'thumb'
        })));
        statement.thumb.img = new EL(statement.thumb, 'IMG', new MODEL(new ATTRIBUTES({
            'class': 'user-photo',
            'src': 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png'
        })));

        statement.bubble = new EL(statement, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'bubble'
        })));
        statement.bubble.panel = new EL(statement.bubble, 'DIV', new MODEL('panel panel-default'));

        statement.bubble.panel.heading = new EL(statement.bubble.panel, 'DIV', new MODEL('panel-heading'));
        statement.bubble.panel.heading.strong = new EL(statement.bubble.panel.heading, 'STRONG', new MODEL(), username);
        statement.bubble.panel.heading.cite = new EL(statement.bubble.panel.heading, 'CITE', new MODEL(), 'commented X mins ago');

        statement.bubble.panel.body = new EL(statement.bubble.panel, 'DIV', new MODEL('panel-body'), string);

        $(statement.el).fadeIn(500);
        $(this.body.pane.el).animate({ scrollTop: $(this.body.pane.el).prop("scrollHeight") }, 1000);



        return statement;
    }

    construct() {
        setTimeout(function () {
            this.addStatement('ICARUS', 'Hello ' + app.getUser());
        }.bind(this), 2000);
    }
}
/**
    A generic SECTION within an ARTICLE.

    A SECTION represents a container that can be expanded or hidden and
    have elements added to itself.    
*/
class SECTION extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {ARTICLE} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'SECTION', model, ['FORM']);
        //this.addContainerCase('FORM');
        this.populate(model.children);
    }

    construct() {

    }
}
/**
    A generic Article    
*/
class ARTICLE extends CONTAINER {
    /**
        Construct and ARTICLE
        @param {MAIN} node The APP to contain the article
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, 'ARTICLE', model, ['SECTION']);    
        //this.addContainerCase('SECTION');
        this.populate(model.children);
    }

    construct() {

    }
}
/**
 * A vertical navitemgroup with a search panel
 */
class SIDEBAR extends CONTAINER { // NAVBAR

    /**
        A Sidebar element
        @param {MAIN} node The CONTAINERBODY to contain the sidebar
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, 'ASIDE', model, ['SECTION', 'FORM', 'LIST', 'MENULIST']);
        this.addClass('sidebar'); 
    }   

    construct() {

    }
}
/**
    A top level application object
*/
import { WATERMARK } from '../../../../WATERMARK.js';
import { CONTAINER } from '../CONTAINER.js';
export class MAIN extends CONTAINER {
    /**
        Constructs an APP
        @param {MODEL} model APP model
     */
    constructor(model) {
        model = model || new MODEL().set({
            'id': 0,
            'dataId': 0,
            'attributesId': 0,
            'descriptionId': 0,
            'shared': 0,
            'element': 'MAIN',
            'navBar': {
                'className': 'NAVBAR',
                'attributes': {
                    'class': 'navbar navbar-fixed-top navbar-inverse'
                },
                'element': 'NAV'
            },
            'footer': {
                'className': 'STICKYFOOTER',
                'attributes': {
                    'class': 'stickyfooter'
                },
                'element': 'FOOTER'
            },
            'className': 'Main',
            'attributes': {
                'class': 'app'
            }
        });

        document.title = model.label;
        new WATERMARK();
        
        super(document.body, 'MAIN', model, ['ARTICLE','INDEX','INDEXMAIN','CLASSVIEWER','IMAGEGALLERY','DICTIONARY','WORD']);
        this.body.pane.addClass('pane-tall');

        this.loader = new LOADER('Loading', 'Loading', 100);
        this.loader.log(100, 'Loading');
        this.sidebar = new SIDEBAR(this, new MODEL().set({
            'label': 'Left Sidebar'
        }));    

        this.addNavOptions();
        
        this.stickyFooter = new STICKYFOOTER(this, new MODEL());

        this.populate(model.children);
    }

    construct() {
        
    }

    /**
     * Return the user or Guest if doesn't exist
     * @returns {string} User string
     */
    getUser() {
        let userVar;
        try {
            userVar = user;
        } catch (e) {
            userVar = 'Guest';
        }
        return userVar;
    }

    /**
        Add items to Options Dropdown Tab
     */
    addNavOptions() {
        if (this.navBar.header.menu) {

            // Add a button to toggle sidebar (modify)
            this.btnSidebar = this.navBar.header.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'anchor': new MODEL().set({
                        'label': '',
                        'url': '#',
                        'icon': ICONS.SIDEBAR
                    })
                })
            );
            //$(this.btnSidebar.el).insertBefore(this.navBar.header.tab.el);
            this.btnSidebar.el.onclick = this.toggleSidebar.bind(this); 

            // Hide Sidebar when container body is focused
            this.body.el.onclick = this.focusBody.bind(this);

            // Add USER options
            let userMenu = this.navBar.header.menu.addMenu(
                new MODEL(new ATTRIBUTES('horizontal collapse')).set({
                    'name': 'USER',
                    'showHeader': 1,
                    'collapsed': 1
                })
            );
            userMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': 'Log Out',
                        'url': '#?url=logout'
                    })
                })
            ).el.onclick = function () {
                this.navBar.header.toggleCollapse();
                this.logout();
            }.bind(this);

            userMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.OPTIONS,
                        'label': 'Manage',
                        'url': 'Manage/Index'
                    })
                })
            );

            let domMenu = this.navBar.header.menu.getGroup('DOM');
            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.HOME,
                        'label': 'Home'
                    })
                })
            ).el.onclick = function () {
                app.loader.log(100, 'Returning Home...');
                setTimeout(function () {
                    location.href = url.origin;
                }.bind(this), 1000);
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.TOGGLE,
                        'label': 'Headers'
                    })
                })
            ).el.onclick = function () {
                this.toggleHeaders();
                this.navBar.header.toggleCollapse();
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.CONSOLE,
                        'label': 'Console'
                    })
                })
            ).el.onclick = function () {
                console.log('Showing Console');
                app.loader.show();
                app.loader.showConsole();
                //$(app.loader.console.el).collapse('show');
            }.bind(this);

            domMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.REFRESH,
                        'label': 'Reload'
                    })
                })
            ).el.onclick = function () {
                app.loader.log(100, 'Reloading');
                setTimeout(function () {
                    location.reload(true);
                }.bind(this), 1000);
                }.bind(this);

            let crudMenu = this.navBar.header.menu.getGroup('CRUD');
            crudMenu.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.MAIN,
                        'label': 'New'
                    })
                })
            ).el.onclick = function () {

                // TODO:  This should be a POST to avoid CSRF
                $.getJSON('/MAIN/Get/0', function (payload) {
                    app.loader.log(100, 'Created MAIN', true);
                    //console.log(payload);
                    setTimeout(function () {
                        location.href = '/' + payload.model.id;
                    }.bind(this), 1000);
                });

                // Something like this...  Coordinate with controller
                /*$.post('/MAIN/Get/0', {},
                    function (payload, status) {
                        //console.log(status);
                        //console.log(payload);
                        app.loader.log(100, 'Launching New Page');
                        setTimeout(function () {
                            location.href = '/' + payload.model.id;
                        }.bind(this), 1000);
                    }
                );*/
            }.bind(this);
        }
    }

    /**
        Sets the focus on the Main container body.  
        This generally is used to hide elements such 
        as a Sidebar, Modal or an EDIT pane
     */
    focusBody() {
        if ($(this.sidebar.el).hasClass('active')) {
            this.sidebar.removeClass('active');
        }
        $(this.navBar.header.menu.el).collapse('hide');
    }

    /**
        Override Container.createTab()
        @param {MODEL} model Object model
     */
    createTab(model) {
        debug('\tMAIN.createTab();');
    }    

    /**
        Loads the specified app by id
        @param {number} id App Id to load
    */
    load(id) {

        id = id ? id : 1;


        let url = new URL(window.location.href);
        let returnUrl = url.searchParams.get('ReturnUrl');
        if (returnUrl) {
            returnUrl = url.origin + returnUrl;
            location.href = returnUrl;
        }

        /*this.prompt = new PROMPT('Load App', 'Loads an Application by Id', [], [
            { 'element': 'INPUT', 'type': 'number', 'name': 'id', 'value': this.id }
        ]);*/
        /*
        prompt.form.submit = function () {
            id = prompt.form.el.elements['id'].value;
            alert('Loading App(' + id + ')');
            window.location.href = id || 0;
        }.bind(this);
        */
        //this.prompt.show();
        // Retrieve object model
        $.getJSON(
            'Main/Get/' + id, function (data) {
                if (data.result === 1) {
                    try {
                        if (data.model.label) {
                            document.title = data.model.label;
                        }
                        app.setId(id);
                        app.setLabel(data.model.label);
                        app.populate(data.model.children);
                    } catch (e) {
                        app.loader.log(0, 'Unable to construct Main(' + id + ')');
                        debug(e);
                    }
                } else {
                    app.loader.log(0, 'Failed to retrieve Main(' + id +
                        ') from server\n' + data.message
                    );
                    app.loader.showConsole();
                }
            }
        );
    }

    /**
        Toggles the active state of the sidebar
     */
    toggleSidebar() {
        this.sidebar.toggle('active');
    }

    /**
        Made obsolete by EL.merge()
     * @param {any} payload Data returned by server
     */
    updateModel(payload) {
        this.setLabel(payload.label);
        this.setSubSections(payload.subsections);
    }

    /**
        Allows the user to open an ARTICLE in this APP.
        @param {number} id Article id
    */
    open(id) {
        id = id || 0;
        console.log('TODO: APP.open(' + id + ')');
    }

    /**
        Sets the given index id article, displaying the corresponding article
        and hiding all others

        @param {ARTICLE} article The article to set
    */
    setArticle(article) {
        debug('APP.setArticle(' + article.getId() + ')');
        $('ul[name=document-map] .nav-item').removeClass('active');
        $('article').hide();
        article.activate();
        article.show();
        try {
            article.tab.activate();
        } catch (e) {
            debug('Article does not have a tab.');
        }
    }

    /**
        Returns the APP Id
        @returns {number} App Id
    */
    getId() {
        return this.id;
    }

    /**
        Launches the External Authentication Process
        The user will be redirected to a third party authenticator
    */
    loginExternal() {
        console.log('Log In - External OAuth Provider');

        this.prompt = new PROMPT('Log In - OAuth', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.postUrl = '/Account/ExternalLogin';
        this.prompt.form.provider = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));

        this.prompt.form.returnUrl = new EL(this.prompt.form.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'ReturnUrl'
        })));
        this.prompt.form.destroy(0);

        /*
            Check results of challenge
        
        this.prompt.form.afterSuccessfulPost = function (payload) {
            console.log('form.afterSuccessfulPost');
            console.log(payload);

            if (payload.model.RedirectUri !== '') {
                //location.href = payload.model.RedirectUri;
            }

            /*
            $(node.el).collapse('toggle');
            node.empty();
            this.setLabel(form.el.elements['label'].value);
            if (caller) {
                caller.toggle('active');
                console.log(caller);
                caller.node.node.toggleCollapse();
            }
            app.loader.hide();
            
        }.bind(this); */
        

        // Create a new form to submit 3rd party logins
        this.externalLogin = this.createEmptyForm(this.prompt.container.body.pane);
        this.externalLogin.el.setAttribute('method', 'post');
        this.externalLogin.el.setAttribute('action', '/Account/ExternalLogin?ReturnUrl=%2F');
        this.externalLogin.footer.buttonGroup.children[0].el.style.display = 'none';
        this.provider = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));

        this.returnUrl = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'ReturnUrl'
        })));
        let btnOAuth = this.externalLogin.footer.buttonGroup.addButton('OAuth - Google');
        btnOAuth.el.onclick = function () {

            app.loader.log(50, 'Launching OAuth2 Authenticator...');
            
            let url = new URL(window.location.href);
            let returnUrl = url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);
            

            let postUrl = '/Account/ExternalLogin/externalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl);

            location.href = postUrl;

            /*
            // Callback to self
            $.post(postUrl, $(this.prompt.form.el).serialize(),
                function (payload, status) {

                    console.log('callback to self');
                    console.log(payload);

                    if (status === "success") {
                        app.loader.log(100, 'Success', true);

                        console.log('Payload:::');
                        console.log(payload);

                        setTimeout(function () {

                            let url = new URL(window.location.href);
                            let returnUrl = url.searchParams.get('ReturnUrl');
                            if (payload.model.RedirectUri) {
                                //returnUrl = url.origin + returnUrl;
                                //location.href = payload.model.RedirectUri;

                                // Post to Account/ExternalLoginCallback
                                
                                //console.log('RedirectUri Exists...  Posting...');
                                //$.post(payload.model.RedirectUri, "", function (payload2, status2) {
                                //    console.log('New Payload: ' + status2);
                                //    console.log(payload2);
                                //}.bind(this));
                                

                                
                                console.log('RedirectUri Exists...  Redirecting...');
                                //location.href = http://localhost:8052/signin-google;
                                
                                $.post('http://localhost:8052/signin-google;', "", function (payload2, status2) {
                                    console.log('New Payload: ' + status2);
                                    console.log(payload2);
                                }.bind(this));
                                

                            } else {
                                //location.reload(true);
                                console.log('something went wrong');
                                console.log(payload);
                            }

                        }.bind(this), 1000);
                    } else {
                        app.loader.log(0, 'Login failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
            */

        }.bind(this);

        this.prompt.show();

    }

    /**
     * Log into the application using the given credentials
     * @param {string} email Username / Email 
     * @param {string} password Account Password
     */
    login(email, password) {
        console.log('Log In');
        // TODO Handle supplied arguments... Or don't... Not sure yet.

        this.prompt = new PROMPT('Log In', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Login');
        this.prompt.form.el.setAttribute('class', 'login');
        this.prompt.form.el.setAttribute('method', 'POST');
        this.prompt.form.el.setAttribute('action', '#');

        //this.email = new INPUT(this.prompt.formElementGroup.body.pane,
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'Email',
                    'name': 'Email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );
        
        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'Password',
                    'name': 'Password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        //this.prompt.form.footer.buttonGroup.children[0].el.style.display = 'none';
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            app.loader.log(25, 'Logging In', true);
            $.post('/Account/LogIn', $(this.prompt.form.el).serialize(),
                function (payload, status) {           
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);
                        setTimeout(function () {

                            let url = new URL(window.location.href);
                            let returnUrl = url.searchParams.get('ReturnUrl');
                            if (returnUrl) {
                                returnUrl = url.origin + returnUrl;
                                location.href = returnUrl;
                            } else {
                                location.reload(true);
                            }

                        }.bind(this), 1000);
                    } else {
                        app.loader.log(0, 'Login failed. (err_'+status+').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
        }.bind(this);

        this.prompt.form.footer.buttonGroup.addButton('Register').el.onclick = this.register;


        // Create a new form to submit 3rd party logins
        this.externalLogin = this.createEmptyForm(this.prompt.container.body.pane);
        this.externalLogin.el.setAttribute('method', 'post');
        this.externalLogin.el.setAttribute('action', '/Account/ExternalLogin');
        this.externalLogin.footer.buttonGroup.children[0].el.style.display = 'none';
        this.provider = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'provider'
        })));

        this.returnUrl = new EL(this.externalLogin.fieldset.formElementGroup.body.pane, 'INPUT', new MODEL(new ATTRIBUTES({
            'type': 'hidden',
            'name': 'returnUrl'
        })));
        let btnOAuth = this.externalLogin.footer.buttonGroup.addButton('OAuth');
        btnOAuth.el.onclick = function () {

            app.loader.log(50, 'Launching OAuth2 Authenticator...');

            /*
            let url = new URL(window.location.href);
            let returnUrl = url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);
            

            let postUrl = '/Account/ExternalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl); 
            */

            location.href = '/Account/ExternalLogin';

            /****
            
            <form action="/Account/ExternalLogin?ReturnUrl=%2F" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="NUl4K_C0ubvHbrEeyfF19jddMf9-BZ-MTIuA33kSxdhMJoh5TEvV53sbv61vtRCp_vbWI2DQzFENnljDRpx2srlaBpQZQRsWZoKkLwSjTek1">                <div id="socialLoginList">
                <p>
                    <button type="submit" 
                        class="btn btn-default" id="Google" 
                        name="provider" value="Google" 
                        title="Log in using your Google account"
                    >Google</button>
                </p>
                </div>
            </form>

            ****/


            //window.open(postUrl, '_blank');

            /*
            this.modal = new MODAL('Google Login');
            this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
                'label': 'iframe',
                'dataId': -1,
                'data': {
                    'src': postUrl
                }
            }));
            this.iframe.frame.el.setAttribute('src', postUrl);
            this.modal.show();
            */

            /*
            $.post(postUrl, $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);

                        console.log('Payload:::');
                        console.log(payload);

                        setTimeout(function () {

                            //let url = new URL(window.location.href);
                            //let returnUrl = url.searchParams.get('ReturnUrl');
                            if (payload.model.RedirectUri) {
                                //returnUrl = url.origin + returnUrl;
                                location.href = payload.model.RedirectUri;
                            } else {
                                //location.reload(true);
                                console.log('something went wrong');
                                console.log(payload);
                            }

                        }.bind(this), 1000);
                    } else {
                        app.loader.log(0, 'Login failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
            */

        }.bind(this);

        this.prompt.show();

        /*
            TODO:
            Create INPUT CHECKBOX called 'RememberMe'
            Create BUTTON to launch 'Register as new User'
            Create AHREF to 'ForgotPassword'
        */
    }

    /**
        Logs the current user out
    */
    logout() {
        app.loader.log(25, 'Logging out', true);
        $.post('/Account/LogOff', {
            '__RequestVerificationToken': token.value
        }, function (payload, status) {
            this.loader.log(50, 'Status: ' + status, true);
            debug('Payload:');
            debug(payload);

            // textStatus contains the status: success, error, etc
            // If server responds with 'success'            
            if (status === "success") {
                app.loader.log(99, 'Logging Out...');
                setTimeout(function () {
                    location.reload(true); //https://www.w3schools.com/jsref/met_loc_reload.asp
                }.bind(this), 1000);

            } else {
                debug('Failed to POST results to server with status: "' + status + '"');
                app.loader.log(0, 'Failed to send<br>' +
                    payload.message + '<br><hr/>', true
                );
                app.loader.showConsole();
                //$(app.loader.console.el).collapse('show');
                debug('Payload:\n');
                debug(payload);
            }
        }.bind(this), "json");
    }

    /**
     * Log into the application using the given credentials
     * @param {string} email Username / Email 
     * @param {string} password Account Password
     */
    register() {
        console.log('Register');

        this.prompt = new PROMPT('Register', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.setPostUrl('/Account/Register');
        this.prompt.form.el.setAttribute('class', 'register');
        //this.prompt.form.el.setAttribute('method', 'POST');
        //this.prompt.form.el.setAttribute('action', 'Account/Register');
        this.prompt.form.postUrl = "Account/Register";

        //this.email = new INPUT(this.prompt.formElementGroup.body.pane,
        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'Email',
                    'name': 'email'
                })
            ).set({
                'label': 'Username',
                'showHeader': 0
            })
        );

        this.password = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'Password',
                    'name': 'password'
                })
            ).set({
                'label': 'Password',
                'showHeader': 0
            })
        );

        this.passwordConfirm = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.PASSWORD,
                    'type': 'Password',
                    'name': 'PasswordConfirm'
                })
            ).set({
                'label': 'Confirm Password',
                'showHeader': 0
            })
        );
        this.prompt.form.afterSuccessfulPost = function (payload) {
            this.prompt.hide();
            if (payload.result === 1) {
                setTimeout(function () {

                    let url = new URL(window.location.href);
                    let returnUrl = url.searchParams.get('ReturnUrl');
                    if (returnUrl) {
                        returnUrl = url.origin + returnUrl;
                        location.href = returnUrl;
                    } else {
                        location.reload(true);
                    }

                }.bind(this), 1000);
            }
        };
        /*
        //this.prompt.form.footer.buttonGroup.children[0].el.style.display = 'none';
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            app.loader.log(25, 'Register User', true);
            $.post('/Account/Register', $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        app.loader.log(100, 'Success', true);
                        setTimeout(function () {

                            let url = new URL(window.location.href);
                            let returnUrl = url.searchParams.get('ReturnUrl');
                            if (returnUrl) {
                                returnUrl = url.origin + returnUrl;
                                location.href = returnUrl;
                            } else {
                                location.reload(true);
                            }

                        }.bind(this), 1000);
                    } else {
                        app.loader.log(0, 'Registration failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );
        }.bind(this);
        */


        this.prompt.show();
    }

    /**
         Sets the application url on view initialization 
         @returns {URL} Current url
    */
    getUrl() {
        return new URL(window.location.href);
    }


    /**
     * Log into the application using the given credentials
     * @param {string} email Username / Email 
     */
    registerExternal(email) {
        console.log('Register External Login');

        this.prompt = new PROMPT('Associate your OAuth2 Id', '', [], [], true);
        this.prompt.addClass('prompt');

        this.prompt.form.destroy();

        let tmp = new EL(this.prompt.container.body.pane, 'DIV', new MODEL());
        $(document.getElementById('externalLoginConfirmation')).insertBefore(tmp.el);
        tmp.destroy();

        

        /*
        this.prompt.form.setPostUrl('/Account/ExternalLoginConfirmation?ReturnUrl=%2F');
        this.prompt.form.el.setAttribute('class', 'register');
        this.prompt.form.el.setAttribute('method', 'POST');
        this.prompt.form.el.setAttribute('action', '/Account/ExternalLoginConfirmation?ReturnUrl=%2F');

        this.email = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'Email',
                    'name': 'Email',
                    'value': email
                })
            ).set({
                'label': 'Email',
                'showHeader': 0
            })
        );

        this.name = new INPUT(this.prompt.form.fieldset.formElementGroup.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'typeId': IcarusInputType.INPUT,
                    'type': 'text',
                    'name': 'Name',
                    'value': email
                })
            ).set({
                'label': 'Name',
                'showHeader': 0
            })
        );
        
        this.prompt.form.footer.buttonGroup.children[0].el.onclick = function () {
            app.loader.log(25, 'Register User', true);

            $.post('/Account/ExternalLoginConfirmation?ReturnUrl=%2F', $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        console.log(payload);
                        app.loader.log(100, 'Success', true);
                        setTimeout(function () {

                            let url = new URL(window.location.href);
                            let returnUrl = url.searchParams.get('ReturnUrl');
                            if (returnUrl) {
                                returnUrl = url.origin + returnUrl;
                                //location.href = returnUrl;
                                console.log('Return Url: ' + returnUrl);
                            } else {
                                //location.reload(true);
                                console.log('Reload!');
                            }

                        }.bind(this), 1000);
                    } else {
                        app.loader.log(0, 'Registration failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        debug('Failed to POST results to server with status: "' + status + '"');
                        debug('Payload:\n');
                        debug(payload);
                    }
                }.bind(this)
            );

            return false;

        }.bind(this);
        */

        this.prompt.show();
    }
}