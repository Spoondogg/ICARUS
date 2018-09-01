/**
    Icarus
    @description A Single Page Web Application Engine
    @version 0.5.1.20180830
    @author Ryan Dunphy <ryan@spoonmedia.ca>
*/
"use strict";
const DEBUGMODE = true; // If true, debug outputs are shown
const TESTING = false; // If true, tests are ran and results are shown in the console.
const THEME = 0; //0=dark,1=light...
/**
    See http://2ality.com/2014/09/es6-modules-final.html 
    See http://exploringjs.com/es6/ch_modules.html#sec_overview-modules
 */
//import * from 'WATERMARK.js';
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
        let i = 0;
        let result = 0;
        let numberOfProperties = props.length;
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
function truncate(str, length = 100, ending = "...") {
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
    let s = num + '';
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
}

/**
     * Returns a Javascript date object from a .NET JavaScriptSerializer date
     * See https://stackoverflow.com/a/50292370/722785
     * @param {string} dateString from .NET Serializer ie: Date(1534759609990)
     * @returns {Date} Javascript Date Object
     */
function getDateValue(dateString) {
    return new Date(parseInt(dateString.replace(/\D+/g, '')));
}

/**
 * This should be a class...  But anyways,
 * Generates a generic Date object for print
 * @param {Date} dateObj A Javascript Date object
 * @returns {Object} A broken down set of date values that should actually be a class
 */
function getDateObject(dateObj) {
    //console.log('getDateObject');
    // splits the string to array ie: ["2014-05-10", "22:00:00.000Z"]
    let d = dateObj.toISOString().split('T');

    // Splits the date ie: ['2014','05','10']
    let dd = d[0].split('-');

    // Splits the time ie: ['22','00','00.000Z']
    let t = d[1].split(':');
    let tt = t[2].split('.');

    return {
        'date': d[0],
        'year': dd[0],
        'month': dd[1],
        'day': dd[2],
        'time': t[0] + ':' + t[1] + ':' + tt[0],
        'hour': t[0],
        'minute': t[1],
        'second': tt[0],
        'millisecond': tt[1].replace('Z', '')
    };
}


/**
 * Create a globally unique identifier
    @returns {string} Unique string
 */
const guid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};

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
//woot