/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
import MODEL from '../model/MODEL.js';
/* eslint-disable max-params */
/** Instantiates an INPUT MODEL
    @param {string} element Element name
    @param {string} name Input name
    @param {string} value Value of input
    @param {string} label Label to display
    @param {string} type The input type
    @param {boolean} readonly If true, element is readonly
    @param {number} showNav If 1, NavBar is shown
    @returns {MODEL} An input model
*/
export const createInputModel = (element, name, value = '', label = name, type = 'TEXT', readonly = false, showNav = 0, ...attr) => new MODEL(new ATTRIBUTES({
	name,
	value,
	type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
	readonly
})).set({
	showNav,
	element,
	label,
	type
}).setAttribute(attr);
/* eslint-enable max-params */
/** Stores the default DATA ELEMENTS collections for each Class
    This belongs on the database or within a config 
    DataElements can act as a mask to filter values for this element
    @see CONTAINER.createInputModel() Consider a static method
    @readonly
    @enum {any}
*/
export const DATAELEMENTS = {
    ARTICLE: {
        data: [createInputModel('INPUT', 'header')],
        attributes: []
    },
    CALLOUT: {
        data: [
            createInputModel('INPUT', 'icon'),
            createInputModel('INPUT', 'header', 'Header'),
            createInputModel('INPUT', 'p', 'Text')
        ],
        attributes: []
    },
    CONTAINER: {
        data: [createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER')],
        attributes: []
    },
    DICTIONARY: {
        data: [createInputModel('INPUT', 'language')],
        attributes: []
    },
    FIELDSET: {
        data: [createInputModel('INPUT', 'legend')],
        attributes: []
    },
    FORM: {
        data: [createInputModel('INPUT', 'header')],
        attributes: [
            createInputModel('INPUT', 'method', 'POST'),
            createInputModel('INPUT', 'action', 'FORM/SUBMIT')
        ]
    },
    FORMELEMENT: {
        data: [
            createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
            createInputModel('INPUT', 'type', 'TEXT'),
            createInputModel('INPUT', 'name', 'Text Input'),
            createInputModel('INPUT', 'value')
        ],
        attributes: [
            createInputModel('INPUT', 'type', 'TEXT'),
            createInputModel('INPUT', 'name', 'text-input'),
            createInputModel('INPUT', 'value', ''),
            createInputModel('INPUT', 'placeholder')
        ]
    },
    FORMELEMENTGROUP: {
        data: [createInputModel('INPUT', 'header')],
        attributes: []
    },
    FORMINPUT: {
        data: [
            createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
            createInputModel('INPUT', 'type', 'TEXT'),
            createInputModel('INPUT', 'name', 'Text Input'),
            createInputModel('INPUT', 'value')
        ],
        attributes: [
            createInputModel('INPUT', 'name', 'text-input'),
            createInputModel('INPUT', 'value')
        ]
    },
    FORMTEXTAREA: {
        data: [
            createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
            createInputModel('INPUT', 'type', 'TEXT'),
            createInputModel('INPUT', 'name', 'Text Input'),
            createInputModel('INPUT', 'value')
        ],
        attributes: [
            createInputModel('INPUT', 'name', 'text-input'),
            createInputModel('INPUT', 'value')
        ]
    },
    FORMPOST: {
        data: [],
        attributes: []
    },
    FORMPOSTINPUT: {
        data: [],
        attributes: []
    },
    INDEX: {
        data: [],
        attributes: []
    },
    INDEXMAIN: {
        data: [],
        attributes: []
    },
    INPUT: {
        data: [
            createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
            createInputModel('INPUT', 'type', 'TEXT'),
            createInputModel('INPUT', 'name', 'Text Input'),
            createInputModel('INPUT', 'value', 'Text Value')
        ],
        attributes: []
    },
    JUMBOTRON: {
        data: [
            createInputModel('INPUT', 'header', 'JT Header'),
            createInputModel('TEXTAREA', 'p', 'JT Textarea'),
            createInputModel('BUTTON', 'bgimage', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
                inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE', true)]
            }),
            createInputModel('INPUT', 'screencolor', '.', 'screencolor', 'TEXT', true),
            createInputModel('INPUT', 'bgcolor', '.', 'bgcolor', 'TEXT', true)
        ],
        attributes: []
    },
    LIST: {
        data: [],
        attributes: []
    },
    LISTITEM: {
        data: [createInputModel('INPUT', 'p', 'Text')],
        attributes: []
    },
    MAIN: {
        data: [],
        attributes: []
    },
    PARAGRAPH: {
        data: [createInputModel('INPUT', 'p', 'Paragraph Text')],
        attributes: []
    },
    SECTION: {
        data: [createInputModel('INPUT', 'collapsed', 'collapsed', '-1', 'NUMBER')],
        attributes: []
    },
    SIDEBAR: {
        data: [],
        attributes: []
    },
    TABLE: {
        data: [],
        attributes: []
    },
    TEXTBLOCK: {
        data: [createInputModel('INPUT', 'text', '')],
        attributes: []
    },
    THUMBNAIL: {
        data: [
            createInputModel('BUTTON', 'img', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
                inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
            }),
            createInputModel('INPUT', 'header', 'Header'),
            createInputModel('INPUT', 'p', 'Text'),
            createInputModel('INPUT', 'bgImage')
        ],
        attributes: []
    },
    WORD: {
        data: [
            createInputModel('INPUT', 'language'),
            createInputModel('INPUT', 'typeId', '-1', 'typeId', 'NUMBER', true),
            createInputModel('INPUT', 'value'),
            createInputModel('INPUT', 'definition')
        ],
        attributes: []
    }
};