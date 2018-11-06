/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
import MODEL from '../model/MODEL.js';
/* eslint-disable max-params */
/** Instantiates an INPUT MODEL
    @param {string} element Element name
    @param {string} name Input name
    @param {string} label Label to display
    @param {string} value Value of input
    @param {string} type The input type
    @param {number} showNav If 1, NavBar is shown
    @returns {MODEL} An input model
*/
export const createInputModel = (element, name, label = name, value = '', type = 'TEXT', showNav = 0) => new MODEL(
    new ATTRIBUTES({
        name,
        value,
        type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type
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
        createInputModel('INPUT', 'header', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'p', 'Text')
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
        createInputModel('INPUT', 'type', 'type', 'TEXT'),
        createInputModel('INPUT', 'name', 'name', 'Text Input'),
        createInputModel('INPUT', 'value', 'value', 'Text Value')
    ],
    JUMBOTRON: [
        createInputModel('INPUT', 'header', 'header', 'JT Header'),
        createInputModel('INPUT', 'p'),
        //createInputModel('BUTTON', 'bgimage', 'bgimage', 0, 'FORMPOSTINPUT'),
        new MODEL(new ATTRIBUTES({
            name: 'bgimage',
            type: 'NUMBER',
            value: '-1'
        })).set({
            element: 'BUTTON',
            label: 'bgimage',
            type: 'FORMPOSTINPUT',
            showNav: 0,
            inputs: [
                createInputModel('INPUT', 'file', 'file', null, 'FILE')
                /*new MODEL(new ATTRIBUTES({
                    name: 'file',
                    type: 'file'
                })).set({
                    element: 'INPUT',
                    label: 'file'
                })*/
            ]
        }),
        createInputModel('INPUT', 'screencolor', 'screencolor', '.'),
        createInputModel('INPUT', 'bgcolor', 'bgcolor', '.')
    ],	
	LIST: [],
    LISTITEM: [createInputModel('INPUT', 'p', 'p', 'Text')],	
    MAIN: [],
    PARAGRAPH: [createInputModel('INPUT', 'p', 'p', 'Paragraph Text')],
    SECTION: [createInputModel('INPUT', 'collapsed', 'collapsed', '-1', 'NUMBER')],
    SIDEBAR: [],
    TEXTBLOCK: [createInputModel('INPUT', 'text', 'text', 'Text')],
	THUMBNAIL: [
		new MODEL(new ATTRIBUTES({
			name: 'img',
			type: 'NUMBER'
		})).set({
			element: 'BUTTON',
			label: 'img',
			type: 'FORMPOSTINPUT',
            inputs: [createInputModel('INPUT', 'file', 'file', null, 'FILE')]
        }),
        createInputModel('INPUT', 'header', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'p', 'Text'),
        createInputModel('INPUT', 'bgImage')
	],
    WORD: [
        createInputModel('INPUT', 'language'),
        createInputModel('INPUT', 'typeId', 'typeId', '-1', 'NUMBER'),
        createInputModel('INPUT', 'value'),
        createInputModel('INPUT', 'definition')
    ]
};