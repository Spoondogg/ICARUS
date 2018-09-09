/**
    A Console Output Watermark
*/
export default class WATERMARK {
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
export default class ATTRIBUTES extends Object { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
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
import ATTRIBUTES from './ATTRIBUTES.js';
export { ATTRIBUTES };
/**
    A Map like data structure
    TODO: Consider just extending Map() 
*/
export default class MODEL { // extends Map https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
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
import MODEL from '../MODEL.js';
export { MODEL };
import { STATUS } from '../../enums/STATUS.js';
import DEBUG from '../../DEBUG.js';
/**
    Generic Element Constructor  

    Ideally, this should be treated like an Abstract rather than
    constructed on its own.  
    
    It can be convenient to do this:
        new EL(node, 'DIV', model)

    But it is better practice to do this:
        new DIV(node, model)
*/
export default class EL extends MODEL {
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
        Recursively iterates through parent nodes until an object with the given prototype is found
        @param {string} value The value to search for within this key
        @param {EL} node Entry point to traversing the chain
        @param {number} attempt Recursion loop
        @returns {CONTAINER} The parent container
    */
    getProtoTypeByClass(value, node = this.node, attempt = 0) {

        /*if (attempt === 0) {
            console.log('Getting prototype...', node);
        }*/

        attempt++;

        if (node === document.body) {
            //console.log('YOU HAVE REACHED THE BODY');
            return null;
        } else {
            try {
                //console.log('Searching for __proto__.__proto__.constructor.name: ' + value + '(' + attempt + ')');
                //console.log(node);

                if (attempt < 100) {
                    try {
                        //console.log('id: ' + node.id);
                        //console.log('super class: ' + node.__proto__.__proto__.constructor.name);
                        //console.log(node.__proto__);
                        if (node.__proto__.__proto__.constructor.name === value.toString()) {
                            //console.log('Found container(' + value.toString() + ')...', node);
                            return node;
                        } else {
                            return this.getProtoTypeByClass(value, node.node, attempt++);
                        }
                    } catch (e) {
                        console.log(e);
                        return null;
                    }
                } else {
                    console.log('getProtoTypeByClass(): Too many attempts (' + attempt + ')', this);
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
    }
    
    /**
     * Creates a TEXTAREA and populates with this element's contents
     */
    edit() {
        try {
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
                DEBUG.log('QuickSave');
                this.getProtoTypeByClass('CONTAINER').quickSave(true);

                app.stickyFooter.hide();
                app.stickyFooter.empty();
            }.bind(this);

            this.editor.input.el.focus();
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
            this.callbacks[model.className].forEach(function (fn) {
                result = fn(model);
            }.bind(this));
        } catch (e) {
            console.log(0,
                this.className + '.create(): No constructor exists '
                + 'for className "' + model.className + '"'
            );
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
            //console.log(this.className + '.populate(' + children.length + ');');
            //app.loader.show();
            try {
                for (let c = 0; c < children.length; c++) {
                    progress = Math.round((c+1) / denom * 100);
                    //console.log(progress, this.className+'.populate('+(c+1)+'/'+denom+')');
                    this.create(children[c]);
                }
            } catch (e) {
                console.log(e);
            }
            //console.log(100, 'Success');

            /*
            if (!DEBUGMODE) {
                app.loader.hide();
            }
            */
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
import MODEL from '../model/MODEL.js';
import ATTRIBUTES from '../model/ATTRIBUTES.js';
/**
 * Stores the default DATA ELEMENTS collections for each Class
 * This belongs on the database or within a config
 * 
 * DataElements can act as a mask to filter values for this element
 * 
 * NOTE:  'value' is a reserved keyword... I think
 * 
 */
export const DATAELEMENTS = {
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
 * Bootstrap glyphicon references
 */
export const ICONS = {
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
import EL from '../EL.js';
/**
    An image
*/
export default class IMG extends EL {
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
import EL from '../EL.js';
/**
    A grouping of list items
 */
export default class GROUP extends EL {
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
import EL from '../EL.js';
import MODEL from '../../MODEL.js';
/**
    Containers have a 'body' that can contain an optional sidebar
    and detect swipe events
 */
export default class CONTAINERBODY extends EL {
    /**
        Construct a body with an optional sidebar
         @param {CONTAINER} node Parent
         @param {MODEL} model Object
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('container-body collapse in');
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
                console.log('Launch Editor for ' + node.className + '(' + node.id + ')');
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
import ATTRIBUTES from '../../ATTRIBUTES.js';
import MODEL from '../../MODEL.js';
import ARTICLE from '../container/article/ARTICLE.js';
import INDEX from '../container/banner/index/INDEX.js';
import INDEXMAIN from '../container/banner/indexmain/INDEXMAIN.js';
import CHAT from '../container/chat/CHAT.js';
import DICTIONARY from '../container/dictionary/DICTIONARY.js';
import FIELDSET from '../container/fieldset/FIELDSET.js';
import FORM from '../container/form/FORM.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
import INPUT from '../container/formelement/input/INPUT.js';
import SELECT, { OPTION } from '../container/formelement/select/SELECT.js';
import TEXTAREA from '../container/formelement/textarea/TEXTAREA.js';
import JUMBOTRON from '../container/jumbotron/JUMBOTRON.js';
import PARAGRAPH from '../container/paragraph/PARAGRAPH.js';
import SECTION from '../container/section/SECTION.js';
import WORD from '../container/word/WORD.js';
import LI from '../group/li/li.js';
import SPAN from '../span/SPAN.js';
import TOKEN from '../container/formelement/input/TOKEN.js';
import BANNER from '../container/banner/BANNER.js';
import THUMBNAIL from '../container/banner/thumbnail/THUMBNAIL.js';
import CALLOUT from '../container/banner/callout/CALLOUT.js';
import IFRAME from '../container/iframe/IFRAME.js';
export { FORM, TOKEN };

/**
    Constructs various Containers and returns them to be appended
 */
export default class CONTAINERFACTORY {
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
    static get(node, className, id) {
        //DEBUG.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
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

    /**
     * Creates an empty form with a single fieldset and formelementgroup
     * @param {EL} node Parent node
     * @param {boolean} hidden If true, form is hidden
     * @returns {FORM} An empty form container
     */
    static createEmptyForm(node, hidden = false) {
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
}
import { ICONS } from '../../../enums/ICONS.js';
import { STATUS } from '../../../enums/STATUS.js';
import { DATAELEMENTS } from '../../../enums/DATAELEMENTS.js';
import GROUP from '../group/GROUP.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import CONTAINERBODY from './CONTAINERBODY.js';
import EL, { MODEL } from '../EL.js';
import ATTRIBUTES from '../../ATTRIBUTES.js';
import CONTAINERFACTORY from './CONTAINERFACTORY.js';
import DEBUG from '../../../DEBUG.js';
/**
    A generic CONTAINER with a header that controls population of this element.

    A container can be expanded or hidden and
    have elements added to itself.
*/
export default class CONTAINER extends GROUP {
    /**
        @param {EL} node The element to contain the section
        @param {string} element HTML element
        @param {MODEL} model The CONTAINER object retrieved from the server
        @param {array} containerList An array of strings representing child Containers that this Container can create
        @param {CONTAINERFACTORY} factory A container constructor factory class
     */
    constructor(
        node,
        element,
        model = new MODEL().set({
            'element': element,
            'name': element || '',
            'label': element,
            'shared': 1
        }),
        containerList = [],
        factory
    ) {
        super(node, element, model);
        this.addClass('icarus-container');
        this.isContainer = 1;
        this.container = null; //this.getContainer();

        //this.main = this.getMainContainer();

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

            /*
            setTimeout(function () {
                console.log('QuickSaving drop recipient parent ' + this.className + '(' + this.id + ')');
                this.getProtoTypeByClass('CONTAINER').quickSave(false); // QuickSave Parent
            }.bind(this), 500);
            */
            console.log('You should save your changes');

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

        let defaultContainers = [
            'IFRAME', 'FORM', 'LIST', 'MENULIST',
            'JUMBOTRON', 'BANNER', 'PARAGRAPH', 'CHAT'
        ];
        containerList.splice(2, 0, ...defaultContainers);

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
        DEBUG.log('CONTAINER.construct();');
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

        console.log(20, 'Emptying...', true);
        this.body.pane.empty();

        console.log(30, 'Reconstructing...', true);
        this.construct();

        // Populate based on children
        console.log(60, 'Populating...', true);
        this.populate(this.body.pane.children);

        console.log(100, 'Refreshed ' + this.className + '[' + this.id + ']', true);
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
            let domGroup = this.navBar.header.menu.getGroup('DOM');
            domGroup.addNavItemIcon(
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

            domGroup.addNavItemIcon(
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

            domGroup.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.REFRESH,
                        'label': 'REFRESH'
                    })
                })
            ).el.onclick = this.refresh.bind(this);

            domGroup.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.DELETE,
                        'label': 'REMOVE'
                    })
                })
            ).el.onclick = this.remove.bind(this);

            domGroup.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.EXCLAMATION,
                        'label': 'DELETE'
                    })
                })
            ).el.onclick = this.disable.bind(this);

            /** CRUD ACTIONS **/
            let crudGroup = this.navBar.header.menu.getGroup('CRUD');
            crudGroup.addNavItemIcon(
                new MODEL().set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.LOAD,
                        'label': 'LOAD'
                    })
                })
            ).el.onclick = this.load.bind(this);

            // Add items to Options Dropdown Tab
            this.btnSave = crudGroup.addNavItemIcon(
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

            this.btnQuickSave = crudGroup.addNavItemIcon(
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
        Performs addCase() for the given Element within a 
        Container of an element that extends Container

        Sets the constructor callback for this element
        and adds respective button to this container

        @param {string} className ie SECTION or FORM
        @param {boolean} addButton If false, no button is created
    */
    addContainerCase(className, addButton = true) {
        this.addCase(className,
            function (model, factory) {
                return CONTAINERFACTORY.get(this.body.pane, className, model.id || 0);
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
        //console.log('Node:');
        //console.log(node);
        //console.log('Caller:');
        //console.log(caller);
        //console.log('This:');
        //console.log(this);

        // Populate subsections with elements in this body
        let subsections = this.getSubSections();
       
        let form = CONTAINERFACTORY.createEmptyForm(node, false);
        form.addClass('saveContainer');
        form.setPostUrl(this.className + '/Set');

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

            try {
                this.getMainContainer().focusBody();
                this.getMainContainer().loader.hide();
            } catch (e) {
                console.log(e);
            }
            
            try {
                this.getContainer().refresh();
            } catch (e) {
                //console.log('Unable to reload Container);
                //location.reload(true);
                this.getMainContainer().refresh();
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
        Sets the parent container for this container if it does not exist,
        then returns it or null
        @returns {CONTAINER} The parent container for this container
    */
    getContainer() {
        if (this.className.toUpperCase() === 'MAIN') {
            console.log(this.className+'.getContainer() has no parent container', this);
            return this;

        } else {
            if (this.container === undefined || this.container === null) {
                this.container = this.getProtoTypeByClass('CONTAINER');
            }
            return this.container;
        }
    }

    /**
        Returns the MAIN container
    */
    getMainContainer() {
        if (this.className.toUpperCase() === 'MAIN') {
            return this;
        } else {
            //let container = this.getContainer().getContainer();
            let container = this.getContainer();
            if (container.className !== 'MAIN') {
                return container.getMainContainer();
            }
        }
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
            console.log(50, 'Saving FormPost: ' + modelId);
            let form = CONTAINERFACTORY.createEmptyForm(this, true);
            let inputs = [];
            for (let key in data) {
                DEBUG.log('Adding data attributes');

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
                DEBUG.log('FormPost: ' + modelId + ' has been quicksaved');
            }.bind(this);

        } else {
            DEBUG.log('No modelId provided');
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
            console.log(20, 'Quick Save');

            DEBUG.log(this.element + '.save()');
            DEBUG.log(this);

            // Populate subsections with elements in this body
            let subsections = this.getSubSections();

            DEBUG.log('Creating save form...');
            let form = CONTAINERFACTORY.createEmptyForm(this, true);
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

            console.log(100, 'Quick Save Complete');
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
        console.log(100, 'Success');
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
            DEBUG.log('Unable to disable this ' + this.element);
            DEBUG.log(e);
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
                console.log(100, 'Disabling '+this.className);
                $.post('/' + this.className + '/Disable/' + this.id, {
                    '__RequestVerificationToken': token.value
                },
                    function (payload, status) {
                        if (payload.result !== 0) {
                            console.log(100, 'Success');
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
                            console.log(0, 'Login failed. (err_' + status + ').<br>' +
                                payload.message
                            );
                            DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                            DEBUG.log('Payload:\n');
                            DEBUG.log(payload);
                        }
                    }.bind(this)
                );

                console.log(100, 'Disable Complete');




            }.bind(this);
            this.prompt.show();
        } catch (e) {
            DEBUG.log('Unable to disable this ' + this.element);
            DEBUG.log(e);
        }
    } 
}
import EL from '../../EL.js';
/**
    List Item Constructor
*/
export default class LI extends EL {
    /**
        Constructs a List Item
        @param {UL} node The object to contain this element
        @param {MODEL} model The element's attributes
     */
    constructor(node, model) {
        super(node, 'LI', model, model.label);
    }
}
import GROUP from '../GROUP.js';
import LI from '../li/LI.js';
/**
    A generic unorganized list
*/
export default class UL extends GROUP {
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
import UL from '../UL.js';
import MODEL from '../../../../MODEL.js';
/**
    A console like panel (UL) that contains entries as list items (LI)
 */
export default class CONSOLE extends UL {

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
import LI from '../../group/li/LI.js';
import ANCHOR from '../../anchor/ANCHOR.js';
import ARTICLE from '../../container/article/ARTICLE.js';
/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them  
    
    CORE ITEMS CAN NOT BECOME CONTAINERS...  STOP TRYING TO MAKE THEM THAT WAY
*/
export default class NAVITEMICON extends LI {
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
import ANCHOR from '../../anchor/ANCHOR.js';
import ARTICLE from '../../container/article/ARTICLE.js';
import MENU from '../menu/MENU.js';
import LI from '../../group/li/LI.js';
/**
    A navigation item that populates a Bootstrap 3 navbar.
    Nav items can be single buttons or dropdowns with nav items nested within them  
    
    CORE ITEMS CAN NOT BECOME CONTAINERS...  STOP TRYING TO MAKE THEM THAT WAY
*/
export default class NAVITEM extends LI {
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
export default class NAVSEARCH extends NAVITEM { //LI {

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
import NAVITEM from '../navitem/NAVITEM.js';
/**
    A horizontal line that separates content inside a navbar dropdown menu
*/
export default class NAVSEPARATOR extends NAVITEM {
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
import UL from '../../group/ul/UL.js';
import EL from '../../el.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import NAVITEM from '../navitem/NAVITEM.js';
import HEADER from '../../header/HEADER.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
/**
    Nav item within navbar
*/
export default class MENU extends UL {
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
import MENU from '../menu/MENU.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import { ICONS } from '../../../../enums/ICONS.js';
/**
    An expandable menu with clickable header that opens a container full of icons
*/
export default class NAVHEADER extends MENU {
    /**
        Construct a Nav Header.
        @param {EL} node The object that the navHeader is appended to
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-header');

        /**
            A container
            @type {CONTAINER}
        
        console.log('NavHeader getting Container', this.el);
        this.container = null; //this.getContainer(); //this.getProtoTypeByClass('CONTAINER');
        console.log('NavHeader Container', this.container);*/
        
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
            this.getContainer().toggleBody();
        }.bind(this);

        // Simulate LONG CLICK to edit the label
        this.tab.pressTimer;
        this.tab.el.onmousedown = function (ev) {
            this.tab.pressTimer = window.setTimeout(function () {
                console.log('Long Clicked ' + this.tab.anchor.label);
                try {
                    let container = this.getContainer();
                    let main = container.getMainContainer();
                    main.sidebar.empty();
                    main.toggleSidebar();

                    container.save(main.sidebar);
                    main.target = container;
                } catch (e) {
                    console.log(e);
                }
                ev.stopPropagation();
            }.bind(this), 1000);
        }.bind(this);

        this.tab.el.onmouseup = function (ev) {
            clearTimeout(this.tab.pressTimer);
            ev.stopPropagation();
            return false;
        }.bind(this);

        // If the user is a 'Guest', show the Login Button        
        if (this.getUser() !== 'Guest') {

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
        Show/Hide this.menu
     */
    toggleCollapse() {
        //console.log('NAVHEADER.toggleCollapse()');
        $(this.menu.el).collapse('toggle');
    }

    /**
        Sets the parent container for this Nav Header if it does not exist,
        then returns it or null
        @returns {CONTAINER} The parent container for this container
    */
    getContainer() {
        //console.log('NAVHEADER.getContainer()', this.container);
        if (this.container === undefined) {
            this.container = this.getProtoTypeByClass('CONTAINER');
        }
        return this.container;
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
import GROUP from '../GROUP.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import BUTTON from '../../button/BUTTON.js';
import TOGGLEBUTTON from '../../button/togglebutton/TOGGLEBUTTON.js';
import MODEL from '../../../MODEL.js';
import { ALIGN } from '../../../../enums/ALIGN.js';
/**
    A container for Buttons
*/
export default class BUTTONGROUP extends GROUP {
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
}
import EL from '../EL.js';
import GLYPHICON from '../span/GLYPHICON.js';
import MODEL from '../../MODEL.js';
import ATTRIBUTES from '../../ATTRIBUTES.js';
/**
    A generic Bootstrap button    
*/
export default class BUTTON extends EL {
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
import MENU from '../../nav/menu/MENU.js';
import BUTTON from '../BUTTON.js';
/**
    Button that show/hides a list of options
*/
export default class TOGGLEBUTTON extends BUTTON {
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
import ATTRIBUTES from '../../ATTRIBUTES.js';
import EL, { MODEL } from '../EL.js';
import CONTAINER from '../container/CONTAINER.js';
import HEADER from '../header/HEADER.js';
/**
    A Bootstrap 3 Modal
    https://www.w3schools.com/bootstrap/bootstrap_modal.asp    
*/
export default class MODAL extends EL { // ALIGN VERTICALLY??
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
import CONSOLE from '../../group/ul/console/CONSOLE.js';
import EL from '../../EL.js';
import PROGRESSBAR from './PROGRESSBAR.js';
import MODAL from '../MODAL.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
/**
    A Loader type modal.
*/
export default class LOADER extends MODAL {
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
        this.el.setAttribute('name', 'LOADER');

        this.dialog.el.style.width = '80%';
        //this.el.setAttribute('data-backdrop', 'static');
        //this.el.setAttribute('data-keyboard', false);

        this.dialog.addClass('loader');

        this.progress = new EL(this.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('progress')));

        this.progressBar = new PROGRESSBAR(this.progress, new MODEL());
        
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
                try {
                    app.DEBUG.log(text);
                } catch (e) {
                    console.log(text);
                }
            }
            if (show) {
                this.show();
                if (value === 100) {
                    this.hide(1500);
                }
            }
        } else {
            try {
                app.DEBUG.log('Unable to find loader');
            } catch (e) {
                console.log('Unable to find loader');
            }
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
import MODAL from '../MODAL.js';
import MENU from '../../nav/menu/MENU.js';
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
export default class MODALMENU extends MODAL { // CALL ME A MENU!!!!
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} children Array of [label, glyphicon, buttonType]
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, children, vertical) {
        super(label, text, vertical);
        this.addClass('prompt');
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
        this.menu.populate(children);
    }    
}
import MODAL from '../MODAL.js';
import DEBUG from '../../../../DEBUG.js';
import CONTAINERFACTORY, { FORM } from '../../container/CONTAINERFACTORY.js';
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
export default class PROMPT extends MODAL {
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} buttons Array of [label, glyphicon, buttonType]
        @param {array} inputs Array of inputs
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, buttons, inputs, vertical) {
        DEBUG.log('PROMPT('+label+');');
        super(label, text, vertical);
        this.addClass('prompt');

        this.form = CONTAINERFACTORY.createEmptyForm(this.container.body.pane, false);
        this.form.prompt = this;

        // TODO: Fix this up
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                //DEBUG.log('inputs[' + i + ']: ' + inputs[i].type);
                let inp = null;
                if (inputs[i].type === 'FORMPOSTINPUT') {
                    //DEBUG.log('FORMPOSTINPUT');
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
import EL from '../EL.js';
/**
    Generic NAV Element
*/
export default class NAV extends EL {
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
import NAV from '../NAV.js';
import NAVHEADER from '../menu/NAVHEADER.js';
import MODEL from '../../../MODEL.js';
/**
    A Bootstrap 3 Nav Menu that is fixed to the top of the page.
    See https://getbootstrap.com/docs/3.3/components/#nav
*/
export default class NAVBAR extends NAV {
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
import EL from '../EL.js';
import BUTTONGROUP from '../group/buttongroup/BUTTONGROUP.js';
/**
    A generic header that should be placed at the top of content    
*/
export default class HEADER extends EL {
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
import EL from '../EL.js';
/**
    A generic footer that should be placed at the bottom of content
*/
export default class FOOTER extends EL {
    /**
        Constructs a generic footer.
        @param {EL} node The object to contain the footer
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'FOOTER', model);
    }    
}
import FOOTER from '../FOOTER.js';
/**
    A Footer that sticks to bottom of page    
*/
export default class STICKYFOOTER extends FOOTER {
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
import CONTAINER from '../CONTAINER.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import EL, { MODEL } from '../../EL.js';
/**
    Inline Frame
*/
export default class IFRAME extends CONTAINER {
    /**
        Constructs an iframe
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        
        //this.populate(model.children);
    }

    /**
        TODO: Remove inline styles
    */
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
import CONTAINER from '../CONTAINER.js';
import HEADER from '../../header/HEADER.js';
import HR from '../../hr/HR.js';
import P from '../../p/P.js';
import EL from '../../EL.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
/**
    A lightweight, flexible component that can optionally extend the entire 
    viewport to showcase key content on your site.
    See https://getbootstrap.com/docs/3.3/components/#jumbotron }
*/
export default class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap style Jumbotron
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model        
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.body.pane.addClass('jumbotron');
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

            this.loadBgImage();

            if (this.data.bgcolor && this.data.bgcolor !== '.') {
                this.body.pane.el.style.backgroundColor = this.data.bgcolor;
            }
        }
    }

    /**
        Attempt to retrieve a background image if one is specified
        in this.data.bgimage
    */
    loadBgImage() {           
        if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
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
    }
}
import IMG from '../../../graphic/IMG.js';
import HEADER from '../../../header/header.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
import CONTAINER from '../../CONTAINER.js';
import EL, { MODEL } from '../../../EL.js';
import P from '../../../p/P.js';
import ATTRIBUTES from '../../../../ATTRIBUTES.js';
import MODAL from '../../../modal/MODAL.js';
import { ICONS } from '../../../../../enums/ICONS.js';
/**
    Jumbotron with centered icon and text
*/
export default class THUMBNAIL extends CONTAINER {
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
        this.p = new P(this.body.pane, new MODEL(), String(this.data.p).truncate(128));

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
        this.modal = new MODAL(this.data.header);
        this.modal.container.body.pane.addClass('thumbnail');

        this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        this.modal.show();
    }

}
import THUMBNAIL from '../THUMBNAIL.js';
import '../../../../../../StringMethods.js';
/**
    A thumbnail with a preview window and a list of Containers
    that can be loaded into the preview
*/
export default class INDEXTHUMBNAIL extends THUMBNAIL {
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
        DEBUG.log('Launch Index Thumbnail Modal');

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
import CONTAINER from '../../CONTAINER.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
import HEADER from '../../../header/HEADER.js';
import MODEL from '../../../../MODEL.js';
import P from '../../../p/P.js';
/**
    Jumbotron with centered icon and text
*/
export default class CALLOUT extends CONTAINER { 
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
import CONTAINER from '../CONTAINER.js';
/**
    A horizontal container designed to be
    populated with self contained objects
*/
export default class BANNER extends CONTAINER {
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
import BANNER from '../BANNER.js';
import HEADER from '../../../header/HEADER.js';
import NAVITEMICON from '../../../nav/navitemicon/NAVITEMICON.js';
//import MODEL from '../../../../MODEL.js';
import EL, { MODEL } from '../../../EL.js';
import ATTRIBUTES from '../../../../ATTRIBUTES.js';
import P from '../../../p/P.js';
import TOKEN from '../../formelement/input/TOKEN.js';
import DEBUG from '../../../../../DEBUG.js';
import MODAL from '../../../modal/MODAL.js';
import CONTAINER from '../../CONTAINER.js';
import MENULIST from '../../menulist/MENULIST.js';
import { ICONS } from '../../../../../enums/ICONS.js';
/**
    Contains a high level view of all objects owned by this user
    @extends BANNER
*/
export default class INDEX extends BANNER {
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

        this.token = TOKEN.getToken();

        this.containerHeader = new HEADER(this.body.pane, new MODEL().set({
            'label': 'INDEX'
        }));
        //$(this.containerHeader.el).insertBefore(this.body.pane);

        let elementList = [
            'ARTICLE', 'FORM', 'JUMBOTRON', 'BANNER', 'CALLOUT', 'THUMBNAIL',
            'CHAT', 'DICTIONARY', 'WORD', 'IMAGEGALLERY'
        ];

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


           // list = 0;
            $.post('/' + elementList[l] + '/List', {
                '__RequestVerificationToken': this.token.value
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
        DEBUG.log('Launch Index Thumbnail Modal');

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
import BANNER from '../BANNER.js';
/**
    Contains a high level view of all objects owned by this user
*/
export default class IMAGEGALLERY extends BANNER {
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
import BANNER from '../BANNER.js';
import P from '../../../p/P.js';
import MODEL from '../../../../MODEL.js';
import HEADER from '../../../header/HEADER.js';
import FOOTER from '../../../footer/FOOTER.js';
import BUTTON from '../../../button/BUTTON.js';
import IFRAME from '../../iframe/IFRAME.js';
import MODAL from '../../../modal/MODAL.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
import TOKEN from '../../formelement/input/TOKEN.js';
import THUMBNAIL from '../thumbnail/THUMBNAIL.js';
/**
    Contains a high level view of all MAIN Objects available to this user
*/
export default class INDEXMAIN extends BANNER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node Parent node
        @param {MODEL} model INDEX model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('index-main');
        //this.populate(model.children);

        this.token = TOKEN.getToken();

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
            //let token = TOKEN.getToken();
            $.post('/Main/PageIndex?page=' + this.page + '&pageLength=' + this.pageLength, {
                '__RequestVerificationToken': this.token.value
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
        DEBUG.log('Launch Index IFrame Modal');

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
        DEBUG.log('Launch Index IFrame Modal');

        this.modal = new MODAL(this.data.header);
        this.iframe = new IFRAME(this.modal.container.body.pane, new MODEL().set({
            'label':'iframe'
        }));


        this.modal.show();
    }


}
import BANNER from '../BANNER.js';

/**
    Contains a high level view of all MAIN Objects available to this user
*/
export default class CLASSVIEWER extends BANNER {
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

        this.form = CONTAINERFACTORY.createEmptyForm(this.body.pane);

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
import CONTAINER from '../CONTAINER.js';
import DATEOBJECT from '../../../../DATEOBJECT.js';
import HEADER from '../../header/HEADER.js';
import MODEL from '../../../MODEL.js';
import P from '../../p/P.js';
import '../../../../StringMethods.js';
/**
    A banner that can be populated with CallOuts
*/
export default class PARAGRAPH extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['IMAGE']);
        this.addClass('textblock');
        this.body.pane.addClass('paragraph');
        //this.dataElements = DATAELEMENTS.PARAGRAPH;
        //this.construct();
        this.populate(model.children);
    }

    construct() {        
        if (this.dataId > 0) {
            if (this.data.p) {
                let d = DATEOBJECT.getDateObject(String(this.dateCreated).getDateValue(this.dateCreated));
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
import CONTAINER from '../CONTAINER.js';
/**
    Textblock Constructor
    A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.

    A textblock can be recursively stacked

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
    @param {number} depth The heirarchy for header elements, classes etc
*/
export default class TEXTBLOCK extends CONTAINER {
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
import CONTAINER from './CONTAINER.js';
/**
    List Item Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
export default class LISTITEM extends CONTAINER {
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
import CONTAINER from '../CONTAINER.js';
import LISTITEM from './listitem/LISTITEM.js';
/**
    List Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
export default class LIST extends CONTAINER {
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
     * @param {MODEL} model List Item Model
     * @returns {LISTITEM} A list item
     */
    addListItem(model) {
        this.children.push(new LISTITEM(this, model)); //model.url, model.label
        return this.addGroup(this.children[this.children.length - 1]);
    }
}
import CONTAINER from '../CONTAINER.js';
import MENU from '../../nav/menu/MENU.js';
import EL, { MODEL } from '../../EL.js';
//import ATTRIBUTES from '../../../ATTRIBUTES.js';
/**
    MenuList Constructor
    A MENULIST is essentially a UL that is designed to contain List Items (LI)
    Unlike most containers

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
export default class MENULIST extends CONTAINER {
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
import FOOTER from '../../footer/FOOTER.js';
import BUTTONGROUP from '../../group/buttongroup/BUTTONGROUP.js';
import { ALIGN } from '../../../../enums/ALIGN.js';
import { SIZE } from '../../../../enums/SIZE.js';
/**
    A generic footer that should be placed at the bottom of content
*/
export default class FORMFOOTER extends FOOTER {
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
import TOKEN from '../formelement/input/TOKEN.js';
/**
    Represents the data object to be submitted to the server for validation.
    @param {FORM} form An Icarus Form
*/
export default class FORMPOST {
    /**
        @param {FORM} form The form that generated this FORMPOST
     */
    constructor(form) {
        this.__RequestVerificationToken = TOKEN.getToken().value;
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
import CONTAINER from '../CONTAINER.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMELEMENTGROUP from '../formelement/FORMELEMENTGROUP.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import TOKEN from '../formelement/input/TOKEN.js';
import FORMFOOTER from './FORMFOOTER.js';
import FORMPOST from './FORMPOST.js';
import DEBUG from '../../../../DEBUG.js';
import { ICONS } from '../../../../enums/ICONS.js';
/**
    Constructs an Icarus Form Object.

    An FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.
*/
export default class FORM extends CONTAINER {
    /**
        Constructs a Form for collecting and posting

        @param {CONTAINER} node The parent object
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'FORM', model, ['FIELDSET']);
        this.tokenInput = new TOKEN(this);
        this.setPostUrl('Form/Submit');
        this.updateUrl = 'Form/Update';
        this.footer = new FORMFOOTER(this.body, new MODEL());
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
        console.log('Validating...');

        this.htmlEncodeValues();

        this.payload = {
            isValid: true,
            formName: this.el.name
        };

        for (let e = 0; e < this.el.elements.length; e++) {
            //DEBUG.log('Element: ' + this.el.elements[e].name);
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
                        console.log(this.el.elements[e].name + ' -- isValid: ' + this.el.elements[e].checkValidity());
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
        console.log(10, 'Posting values to server: ' + this.getPostUrl());
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
                    console.log(100, 'Access Denied: ' + statusText + '('+ xhr.status+')');
                }.bind(this),
                statusCode: {
                    200: function (response) {
                        console.log('StatusCode: 200');
                        console.log(response);
                        console.log(0, response.message, true);
                    },
                    201: function (response) {
                        console.log('StatusCode: 201');
                        console.log(response);

                    },
                    400: function (response) {
                        console.log('StatusCode: 400');
                        console.log(response);
                    },
                    403: function (response) {
                        console.log('StatusCode: 403');
                        console.log(response);
                        console.log(100, 'Access Denied: ' + response);
                        app.login();
                    },
                    404: function (response) {
                        console.log('StatusCode: 404');
                        console.log(response);
                    }
                }, success: function (payload) {
                    DEBUG.log('Success');
                    console.log(25, 'Posted results to server.');

                    console.log(50,
                        'Updating...<br><hr/>'
                        + payload.message + '<br><hr/>'
                    );

                    this.unlock();
                    console.log(100, 'Form Submitted');
                    this.afterSuccessfulPost(payload);
                }.bind(this)
            });
            
        } else {
            DEBUG.log('FormPost is invalid');
            console.log(0, 'Post Failed to submit.  Values may be invalid.');
            app.loader.showConsole();
            //$(app.loader.console.el).collapse('show');
        }
    }
}
import FORM from '../FORM.js';
export default class LogoutForm extends FORM {
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
import CONTAINER from '../CONTAINER.js';
import WATERMARK from '../../../../WATERMARK.js';
import EL, { MODEL } from '../../EL.js';
import LOADER from '../../modal/loader/LOADER.js';
import SIDEBAR from '../sidebar/SIDEBAR.js';
import { ICONS } from '../../../../enums/ICONS.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import STICKYFOOTER from '../../footer/stickyfooter/STICKYFOOTER.js';
import CONTAINERFACTORY from '../CONTAINERFACTORY.js';
import TOKEN from '../formelement/input/TOKEN.js';
import DEBUG from '../../../../DEBUG.js';
import PROMPT from '../../modal/prompt/PROMPT.js';
import INPUT from '../formelement/input/INPUT.js';
import { INPUTTYPES } from '../../../../enums/INPUTTYPES.js';
import FORM from '../form/FORM.js';
/**
    A top level View that holds all other child Containers
*/
export default class MAIN extends CONTAINER {
    /**
        Constructs a MAIN Container
        @param {MODEL} model APP model
     */
    constructor(model, loader) {
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
        
        super(document.body, 'MAIN', model, [
            'ARTICLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER',
            'IMAGEGALLERY', 'DICTIONARY', 'WORD'
        ]);
        this.body.pane.addClass('pane-tall');

        /**
            The primary LOADER
        */
        this.loader = new LOADER('Loading', 'Loading', 100);
        this.loader.log(100, 'Loading');

        //this.factory = new CONTAINERFACTORY(); // APP.factory ?

        this.sidebar = new SIDEBAR(this, new MODEL().set({
            'label': 'Left Sidebar'
        }));    

        this.addNavOptions();
        
        this.stickyFooter = new STICKYFOOTER(this, new MODEL());

        this.populate(model.children);
    }

    construct() {
        if (this.getUser() === 'Guest') {
            this.btnLogin = this.navBar.header.tabs.addNavItem( //this.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'icon': ICONS.USER,
                    'anchor': new MODEL().set({
                        'icon': ICONS.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = function () {
                this.login();
            }.bind(this);
        }
    }

    /**
        Sets the controller value for this application
        @param {any} app
     */
    setApp(app) {
        this.app = app;
    }

    /**
        Return the user or Guest if doesn't exist
        @returns {string} User string
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
                console.log(100, 'Returning Home...');
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
                console.log(100, 'Reloading');
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
                    console.log(100, 'Created MAIN', true);
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
                        console.log(100, 'Launching New Page');
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
        DEBUG.log('\tMAIN.createTab();');
    }    

    /**
        Loads the specified app by id
        @param {number} id App Id to load
    */
    load(id = 1) {
        //id = id ? id : 1;

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
                        this.setId(id);
                        this.setLabel(data.model.label);
                        this.populate(data.model.children);
                    } catch (e) {
                        this.loader.log(0, 'Unable to construct Main(' + id + ')');
                        this.DEBUG.log(e);
                    }
                } else {
                    this.loader.log(0, 'Failed to retrieve Main(' + id +
                        ') from server\n' + data.message
                    );
                    this.loader.showConsole();
                }
            }.bind(this)
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
        DEBUG.log('APP.setArticle(' + article.getId() + ')');
        $('ul[name=document-map] .nav-item').removeClass('active');
        $('article').hide();
        article.activate();
        article.show();
        try {
            article.tab.activate();
        } catch (e) {
            DEBUG.log('Article does not have a tab.');
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

        // Create a new form to submit 3rd party logins
        this.externalLogin = CONTAINERFACTORY.createEmptyForm(this.prompt.container.body.pane);
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

            console.log(50, 'Launching OAuth2 Authenticator...');
            
            let url = new URL(window.location.href);
            let returnUrl = url.origin + '/signin-google';
            this.returnUrl.el.setAttribute('value', returnUrl);
            
            let provider = 'Google';
            this.provider.el.setAttribute('value', provider);
            

            let postUrl = '/Account/ExternalLogin/externalLogin?provider='
                + provider + '&returnUrl=' + encodeURI(returnUrl);

            location.href = postUrl;
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
                    'typeId': INPUTTYPES.INPUT,
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
                    'typeId': INPUTTYPES.PASSWORD,
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
            console.log(25, 'Logging In', true);
            $.post('/Account/LogIn', $(this.prompt.form.el).serialize(),
                function (payload, status) {           
                    if (status === "success") {
                        console.log(100, 'Success', true);
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
                        console.log(0, 'Login failed. (err_'+status+').<br>' +
                            payload.message
                        );
                        DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                        DEBUG.log('Payload:\n');
                        DEBUG.log(payload);
                    }
                }.bind(this)
            );
        }.bind(this);

        this.prompt.form.footer.buttonGroup.addButton('Register').el.onclick = this.register;


        // Create a new form to submit 3rd party logins
        this.externalLogin = CONTAINERFACTORY.createEmptyForm(this.prompt.container.body.pane);
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

            console.log(50, 'Launching OAuth2 Authenticator...');

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
                        console.log(100, 'Success', true);

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
                        console.log(0, 'Login failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                        DEBUG.log('Payload:\n');
                        DEBUG.log(payload);
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
        console.log(25, 'Logging out', true);
        $.post('/Account/LogOff', {
            '__RequestVerificationToken': TOKEN.getToken().value
        }, function (payload, status) {
            this.loader.log(50, 'Status: ' + status, true);
            DEBUG.log('Payload:');
            DEBUG.log(payload);

            // textStatus contains the status: success, error, etc
            // If server responds with 'success'            
            if (status === "success") {
                console.log(99, 'Logging Out...');
                setTimeout(function () {
                    location.reload(true); //https://www.w3schools.com/jsref/met_loc_reload.asp
                }.bind(this), 1000);

            } else {
                DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                console.log(0, 'Failed to send<br>' +
                    payload.message + '<br><hr/>', true
                );
                app.loader.showConsole();
                //$(app.loader.console.el).collapse('show');
                DEBUG.log('Payload:\n');
                DEBUG.log(payload);
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
                    'typeId': INPUTTYPES.INPUT,
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
                    'typeId': INPUTTYPES.PASSWORD,
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
                    'typeId': INPUTTYPES.PASSWORD,
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
            console.log(25, 'Register User', true);
            $.post('/Account/Register', $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        console.log(100, 'Success', true);
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
                        console.log(0, 'Registration failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                        DEBUG.log('Payload:\n');
                        DEBUG.log(payload);
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
            console.log(25, 'Register User', true);

            $.post('/Account/ExternalLoginConfirmation?ReturnUrl=%2F', $(this.prompt.form.el).serialize(),
                function (payload, status) {
                    if (status === "success") {
                        console.log(payload);
                        console.log(100, 'Success', true);
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
                        console.log(0, 'Registration failed. (err_' + status + ').<br>' +
                            payload.message
                        );
                        DEBUG.log('Failed to POST results to server with status: "' + status + '"');
                        DEBUG.log('Payload:\n');
                        DEBUG.log(payload);
                    }
                }.bind(this)
            );

            return false;

        }.bind(this);
        */

        this.prompt.show();
    }
}