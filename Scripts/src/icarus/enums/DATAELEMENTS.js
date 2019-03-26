/** @module */
import MODEL, { ATTRIBUTES } from '../model/MODEL.js';
/* eslint-disable max-params */
/** Instantiates an INPUT MODEL with all required values
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
/** A collection of INPUT Models that are required on all CONTAINER Classes
    @returns {Array<MODEL>} An ordered array of INPUT Models
*/
const defaultContainerData = () => [
	createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
	createInputModel('INPUT', 'collapsed', '1', 'collapsed', 'NUMBER')
];
/** @typedef {Object} DATAEL A generic Data Element collection for a CONTAINER 
    @property {Array<string>} containers A list of container Classes that this CONTAINER can contain
    @property {Array<MODEL>} data A collection of editable data available to this CONTAINER
    @property {Array<MODEL>} attributes A collection of key/value pairs representing the CONTAINER Element's attributes
*/
/** Stores the default DATA ELEMENTS collections for each Class
    @type {Map<string, DATAEL>}
*/
export const DATAELEMENTS = new Map();
DATAELEMENTS.set('ARTICLE', {
    containers: ['JUMBOTRON', 'FORM', 'SECTION'],
    data: [createInputModel('INPUT', 'header')],
    attributes: [createInputModel('INPUT', 'name')]
});
DATAELEMENTS.set('CALLOUT', {
    data: [
        createInputModel('INPUT', 'icon'),
        createInputModel('INPUT', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'Text')
    ]
});
DATAELEMENTS.set('CONTAINER', {
    data: defaultContainerData()
});
DATAELEMENTS.set('DICTIONARY', {
    data: [createInputModel('INPUT', 'language')]
});
DATAELEMENTS.set('FIELDSET', {
    data: [createInputModel('INPUT', 'legend')],
    attributes: [createInputModel('INPUT', 'name', 'text-input')]
});
DATAELEMENTS.set('FORM', {
    data: [createInputModel('INPUT', 'header')],
    attributes: [
        createInputModel('INPUT', 'name', 'text-input'),
        createInputModel('INPUT', 'method', 'POST'),
        createInputModel('INPUT', 'action', 'FORM/SUBMIT')
    ]
});
DATAELEMENTS.set('FORMELEMENT', {
    data: [
        createInputModel('INPUT', 'type', 'TEXT'),
        createInputModel('INPUT', 'name', 'Text Input'),
        createInputModel('INPUT', 'label', 'Input Label'),
        createInputModel('INPUT', 'value')
    ],
    attributes: [
        createInputModel('INPUT', 'type', 'TEXT'),
        createInputModel('INPUT', 'name', 'text-input'),
        createInputModel('INPUT', 'value', ''),
        createInputModel('INPUT', 'placeholder', '')
    ]
});
DATAELEMENTS.set('FORMELEMENTGROUP', {
    data: [createInputModel('INPUT', 'header')],
    attributes: [createInputModel('INPUT', 'name', 'text-input')]
});
DATAELEMENTS.set('FORMINPUT', {}); // Extends FORMELEMENT
DATAELEMENTS.set('FORMPOST', {});
DATAELEMENTS.set('FORMPOSTINPUT', {}); // already in FORMELEMENT
DATAELEMENTS.set('FORMTEXTAREA', {}); // already in FORMELEMENT
DATAELEMENTS.set('INDEX', {});
DATAELEMENTS.set('INDEXMAIN', {});
DATAELEMENTS.set('INPUT', {
    data: [
        createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
        createInputModel('INPUT', 'type', 'TEXT'),
        createInputModel('INPUT', 'name'),
        createInputModel('INPUT', 'value')
    ],
    attributes: [createInputModel('INPUT', 'placeholder')]
});
DATAELEMENTS.set('JUMBOTRON', {
    data: [
        createInputModel('INPUT', 'header', 'JT Header'),
        createInputModel('TEXTAREA', 'p', 'JT Textarea'),
        createInputModel('BUTTON', 'bgimage', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE', true)]
        }),
        createInputModel('INPUT', 'screencolor', '.', 'screencolor', 'TEXT', true),
        createInputModel('INPUT', 'bgcolor', '.', 'bgcolor', 'TEXT', true)
    ],
    attributes: [createInputModel('INPUT', 'bgcolor', '#333')]
});
DATAELEMENTS.set('LIST', {});
DATAELEMENTS.set('LISTITEM', {
    data: [createInputModel('INPUT', 'p', 'Text')]
});
DATAELEMENTS.set('MAIN', {
    containers: ['ARTICLE', 'TABLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER', 'IMAGEGALLERY', 'DICTIONARY', 'WORD'],
    data: [createInputModel('INPUT', 'title', 'MAIN')],
    attributes: [createInputModel('INPUT', 'title', 'MAIN')]
});
DATAELEMENTS.set('PARAGRAPH', {
    data: [createInputModel('INPUT', 'p', 'Paragraph Text')]
});
DATAELEMENTS.set('SECTION', {
    data: [createInputModel('INPUT', 'header')],
    attributes: [createInputModel('INPUT', 'name')]
});
DATAELEMENTS.set('SIDEBAR', {});
DATAELEMENTS.set('TABLE', {});
DATAELEMENTS.set('TEXTBLOCK', {
    data: [
        createInputModel('INPUT', 'header'),
        createInputModel('TEXTAREA', 'p', ' ')
    ]
});
DATAELEMENTS.set('THUMBNAIL', {
    data: [
        createInputModel('BUTTON', 'img', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
            inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
        }),
        createInputModel('INPUT', 'header', 'Header'),
        createInputModel('INPUT', 'p', 'Text'),
        createInputModel('INPUT', 'bgImage')
    ]
});
DATAELEMENTS.set('WORD', {
    data: [
        createInputModel('INPUT', 'language'),
        createInputModel('INPUT', 'typeId', '-1', 'typeId', 'NUMBER', true),
        createInputModel('INPUT', 'value'),
        createInputModel('INPUT', 'definition')
    ]
});
/* eslint-enable max-params */