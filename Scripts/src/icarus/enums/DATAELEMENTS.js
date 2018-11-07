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
export const createInputModel = (element, name, value = '', label = name, type = 'TEXT', readonly = false, showNav = 0) => new MODEL(
    new ATTRIBUTES({
        name,
        value,
        type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
        readonly
    })
).set({
    showNav,
    element,
    label,
    type
});
/* eslint-enable max-params */
/** Stores the default DATA ELEMENTS collections for each Class
    This belongs on the database or within a config 
    DataElements can act as a mask to filter values for this element
    @see CONTAINER.createInputModel() Consider a static method
    @readonly
    @enum {any}
*/
export const DATAELEMENTS = {
    ARTICLE: [createInputModel('INPUT', 'header', 'header', 'Article Header')],
    CALLOUT: [
        createInputModel('INPUT', 'icon'),
        createInputModel('INPUT', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'Text')
    ],
    CONTAINER: [createInputModel('INPUT', 'showNav', 'showNav', '1', 'NUMBER')],
    DICTIONARY: [createInputModel('INPUT', 'language')],
    FIELDSET: [],
    FORM: [],
    FORMELEMENT: [createInputModel('INPUT', 'showNav', 'showNav', '1', 'NUMBER')],
    FORMELEMENTGROUP: [],
    FORMPOST: [],
    FORMPOSTINPUT: [],
    INDEX: [],
    INDEXMAIN: [],
    INPUT: [
        createInputModel('INPUT', 'showNav', 'showNav', '-1', 'NUMBER'),
        createInputModel('INPUT', 'type', 'TEXT'),
        createInputModel('INPUT', 'name', 'Text Input'),
        createInputModel('INPUT', 'value', 'Text Value')
    ],
    JUMBOTRON: [
        createInputModel('INPUT', 'header', 'JT Header'),
        createInputModel('INPUT', 'p'),
        createInputModel('BUTTON', 'bgimage', '-1', 'bgimage', 'FORMPOSTINPUT').set({
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
        }),
        /*new MODEL(new ATTRIBUTES({
            name: 'bgimage',
            type: 'NUMBER',
            value: '-1'
        })).set({
            element: 'BUTTON',
            label: 'bgimage',
            type: 'FORMPOSTINPUT',
            showNav: 0,
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
        }),*/
        createInputModel('INPUT', 'screencolor', '.'),
        createInputModel('INPUT', 'bgcolor', '.')
    ],	
	LIST: [],
    LISTITEM: [createInputModel('INPUT', 'p', 'Text')],	
    MAIN: [],
    PARAGRAPH: [createInputModel('INPUT', 'p', 'Paragraph Text')],
    SECTION: [createInputModel('INPUT', 'collapsed', 'collapsed', '-1', 'NUMBER')],
    SIDEBAR: [],
    TEXTBLOCK: [createInputModel('INPUT', 'text', 'Text')],
    THUMBNAIL: [
        createInputModel('BUTTON', 'img', '-1', 'bgimage', 'FORMPOSTINPUT').set({
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
        }),
		/*new MODEL(new ATTRIBUTES({
			name: 'img',
			type: 'NUMBER'
		})).set({
			element: 'BUTTON',
			label: 'img',
			type: 'FORMPOSTINPUT',
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
        }),*/
        createInputModel('INPUT', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'Text'),
        createInputModel('INPUT', 'bgImage')
	],
    WORD: [
        createInputModel('INPUT', 'language'),
        createInputModel('INPUT', 'typeId', '-1', 'typeId', 'NUMBER'),
        createInputModel('INPUT', 'value'),
        createInputModel('INPUT', 'definition')
    ]
};