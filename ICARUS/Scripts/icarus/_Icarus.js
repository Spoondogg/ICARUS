/**
    Icarus Web Engine
    Dynamically load objects into Containers 
    @language Typescript ES6
    
    @description Requires Typescript ES6
    @version 0.4.0.20180428
    @author Ryan Dunphy <ryan@spoonmedia.ca>
*/

//"use strict";

/**
    Sorts an object array by the specified property.
    @see https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
    @param {string} property Name of property to sort by
    @returns {number} Sorting index
 */
function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        let result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
    };
}

/**
    Sorts an object array with multiple paramaters.
    Accepts multiple params.
    @example People.sort(dynamicSortMultiple("Name", "-Surname"));
    @returns {number} result
 */
function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    let props = arguments;
    return function (obj1, obj2) {
        let i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}

/**
 * Converts the given string to an html-name friendly value
    @param {string} str The string to process
    @returns {string} An html friendly string for input names
 */
function friendly(str) {

    try {
        //console.log('Friendly: ' + str);

        let table = {
            '<': 'lt',
            '>': 'gt',
            '"': 'quot',
            '\'': 'apos',
            '&': 'amp',
            '\r': '#10',
            '\n': '#13',
            //'?': '#63',
            ':': '#58',
            ';': '#59'
        };

        return str.toString().replace(/[<>"'\r\n&]/g, function (chr) { // Strip out characters
            return '&' + table[chr] + ';';
        }).replace(/[?=\s]+/g, '-'); // replace spaces with dashes

    } catch (e) { console.log(e); }
}

/**
    Returns string as camelcase
    https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    @param {string} str String to convert
    @returns {string} A camelcased version of the string
 */
function camelCase(str) {
    str = str === undefined ? '' : str;
    return str.split(' ').map(function (word, index) {
        // If it is the first word make sure to lowercase all the chars.
        if (index === 0) {
            return word.toLowerCase();
        }
        // If it is not the first word only upper case the first char and lowercase the rest.
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

/**
 * Trims the given string to the specified length and applies the given ending
 * @param {string} str Text to truncate
 * @param {number} length Length to trim string
 * @param {string} ending String to append
 * @returns {string} A string truncated to the given length
 */
function truncate(str, length = 100, ending = '...') {
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
    Pad with zeroes
    @param {number} num The original number to be padded
    @param {number} size The number of zeros to pad with
    @returns {string} A zero padded string
*/
function pad(num, size) {
    var s = num + '';
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
}

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
 * Bootstrap glyphicon references
 */
const ICON = {
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
    WORD: 'glyphicon-tags'
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
 * Create a globally unique identifier
    @returns {string} Unique string
 */
const guid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};



/////////////////////////////
// https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            console.log('left swipe');
        } else {
            /* right swipe */
            console.log('right swipe');
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
            console.log('up swipe');
        } else {
            /* down swipe */
            console.log('down swipe');
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}


/**
 * If application is set to debug mode, debug details
 * are logged to the console.
 * 
 * @param {string} output A string or an exception
 */
function debug(output) {
    if (DEBUGMODE) {
        console.log(output);
    }
}
const DEBUGMODE = false; // If true, debug outputs are shown
const TESTING = false; // If true, tests are ran and results are shown in the console.
/**
 * Main method that launches the application
 * @param {number} id Application Id
 * param {string} user User identifier
 * param {boolean} dev Dev Mode
 * param {HTMLInputElement} token Token Element
 * 
 */
function main(id) {
    document.title = 'Loading...';
    debug('Launching Main(' + id + ')...');
    debug('User: ' + user);
    debug('Dev: ' + dev);
    debug('Token: ' + token.value);
    debug('DebugMode: ' + DEBUGMODE);

    // Modal animation
    $('.modal').on('show.bs.modal', function (e) {
        $('.modal .modal-dialog').addClass('fadeOut').removeClass('fadeIn');

    });
    $('.modal').on('hide.bs.modal', function (e) {
        $('.modal .modal-dialog').addClass('fadeIn').remove('fadeOut');
    });

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
                    app.loader.log(0, 'Unable to construct Main('+id+')');
                    debug(e);
                }
            } else {
                app.loader.log(100, 'Failed to retrieve Main(' + id +
                    ') from server\n' + data.message
                );
                app.loader.log(100, 'Access Denied');
                $(app.loader.console.el).collapse('show');
            }
        }
    );
    try {
        token.parentNode.removeChild(token);
    } catch (e) {
        debug('Failed to remove TOKEN from BODY');
        debug(e);
    }
}