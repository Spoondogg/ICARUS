/** @module */
import MODEL, { ATTRIBUTES } from '../model/MODEL.js';
import INPUTMODEL from '../model/el/input/INPUT.js';
/* eslint-disable max-params */
/** Instantiates an INPUT MODEL with all required values
    @todo Refactor to MODELS, a class that handles the Application MODEL(s), caching, queueing etc
    @param {string} element Element name
    @param {string} name Input name
    @param {string} value Value of input
    @param {string} label Label to display
    @param {string} type The input type
    @param {boolean} readonly If true, element is readonly
    @param {number} showNav If 1, NavBar is shown
    @returns {INPUTMODEL} An input model
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
/** Stores the default DATA ELEMENTS collections for each Class
    
    @description When working with a CONTAINER class, it makes more sense
    to be able to control its default variables in one place...  
    This is that place.
    Think of this as a namaepace for CONTAINER configuration

    @type {Map<string, DATAEL>}
*/
export const DATAELEMENTS = new Map([
    [
        'CONTAINER', {
            data: [
                createInputModel('INPUT', 'showNav', '1', 'showNav', 'CHECKBOX'),
                createInputModel('INPUT', 'collapsed', '1', 'collapsed', 'CHECKBOX')
            ],
            attributes: [
                createInputModel('INPUT', 'name'),
                createInputModel('INPUT', 'class')
            ],
            meta: [createInputModel('TEXTAREA', 'description')]
        }
    ],
    [
        'ARTICLE', {
            containers: ['JUMBOTRON', 'FORM', 'SECTION'],
            data: [createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX')]
        }
    ],
    [
        'CALLOUT', {
            data: [
                createInputModel('INPUT', 'icon'),
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('INPUT', 'p', 'Text')
            ]
        }
    ],
    [
        'DICTIONARY', {
            data: [createInputModel('INPUT', 'language')]
        }
    ],
    [
        'FIELDSET', {
            data: [createInputModel('INPUT', 'legend')],
            attributes: [createInputModel('INPUT', 'name', 'fieldset-name')]
        }
    ],
    [
        'FORM', {
            containers: ['TEXTBLOCK', 'JUMBOTRON', 'FIELDSET'],
            data: [
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description'),
                createInputModel('INPUT', 'hidden', '0', 'hidden', 'CHECKBOX')
            ],
            attributes: [
                createInputModel('INPUT', 'name', 'text-input'),
                createInputModel('INPUT', 'method', 'POST'),
                createInputModel('INPUT', 'action', 'FORM/SUBMIT')
            ]
        }
    ],
    [
        'FORMELEMENT', {
            data: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'name', 'Text Input'),
                createInputModel('INPUT', 'label', 'Input Label'),
                createInputModel('INPUT', 'value')
            ],
            attributes: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'value', ''),
                createInputModel('INPUT', 'placeholder', '')
            ]
        }
    ],
    [
        'FORMELEMENTGROUP', {
            containers: ['FORMINPUT', 'FORMTEXTAREA'],
            data: [createInputModel('INPUT', 'header')],
            attributes: [createInputModel('INPUT', 'name', 'text-input')]
        }
    ],
    [
        'FORMINPUT', {
            data: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'name', 'Text Input'),
                createInputModel('INPUT', 'label', 'Input Label'),
                createInputModel('INPUT', 'value')
            ],
            attributes: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'value', ''),
                createInputModel('INPUT', 'placeholder', '')
            ]
        }
    ],
    ['FORMPOST', {}],
    [
        'FORMPOSTINPUT', {
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
        }
    ],
    [
        'FORMTEXTAREA', {
            data: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'name', 'Text Input'),
                createInputModel('INPUT', 'label', 'Input Label'),
                createInputModel('INPUT', 'value')
            ],
            attributes: [
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'value', ''),
                createInputModel('INPUT', 'placeholder', '')
            ]
        }
    ],
    ['INDEX', {}],
    ['INDEXMAIN', {}],
    [
        'INPUT', {
            data: [
                createInputModel('INPUT', 'showNav', '1', 'showNav', 'NUMBER'),
                createInputModel('INPUT', 'type', 'TEXT'),
                createInputModel('INPUT', 'name'),
                createInputModel('INPUT', 'value')
            ],
            attributes: [createInputModel('INPUT', 'placeholder')]
        }
    ],
    [
        'JUMBOTRON', {
            data: [
                createInputModel('INPUT', 'slogan', 'JT Slogan'),
                createInputModel('TEXTAREA', 'p', 'JT Textarea'),
                createInputModel('BUTTON', 'bgimage', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
                    inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE', true)]
                }),
                createInputModel('INPUT', 'screencolor', '.', 'screencolor', 'TEXT', true),
                createInputModel('INPUT', 'bgcolor', '.', 'bgcolor', 'TEXT', true)
            ],
            attributes: [createInputModel('INPUT', 'bgcolor', '#333')]
        }
    ],
    ['LIST', {}],
    [
        'LISTITEM', {
            data: [createInputModel('INPUT', 'p', 'Text')]
        }
    ],
    [
        'MAIN', {
            containers: ['ARTICLE', 'TABLE', 'INDEX', 'INDEXMAIN', 'CLASSVIEWER', 'IMAGEGALLERY', 'DICTIONARY', 'WORD'],
            data: [
                createInputModel('INPUT', 'author', 'AuthorName'),
                createInputModel('INPUT', 'title', 'MAIN')
            ]
        }
    ],
    [
        'PARAGRAPH', {
            data: [createInputModel('INPUT', 'p', 'Paragraph Text')]
        }
    ],
    [
        'SECTION', {
            data: [
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description')
            ]
		}
	],
	['SIDEBAR', {}],
    [
        'TABLE', {
            data: [
                createInputModel('INPUT', 'columns'),
                createInputModel('INPUT', 'header', 'Header')
            ]
        }
    ],
    [
        'TGROUP', {
            data: [createInputModel('INPUT', 'name')]
        }
    ],
    [
        'TBODY', {
            data: [createInputModel('INPUT', 'name')]
        }
    ],
    [
        'THEAD', {
            data: [createInputModel('INPUT', 'name')]
        }
    ],
    [
        'TFOOT', {
            data: [createInputModel('INPUT', 'name')]
        }
    ],
    [
        'TR', {
            data: [createInputModel('INPUT', 'columns')]
        }
    ],
    [
        'TD', {
            data: [
                createInputModel('INPUT', 'type'),
                createInputModel('INPUT', 'name'),
                createInputModel('INPUT', 'value')
            ]
        }
    ],
    [
        'TH', {
            data: [
                createInputModel('INPUT', 'type'),
                createInputModel('INPUT', 'name'),
                createInputModel('INPUT', 'value')
            ]
        }
    ],
	[
		'TEXTBLOCK', {
			data: [
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description')
			]
		}
	],
	[
		'THUMBNAIL', {
			data: [
				createInputModel('BUTTON', 'img', '-1', 'bgimage', 'FORMPOSTINPUT', true).set({
					inputs: [createInputModel('INPUT', 'file', null, 'file', 'FILE')]
				}),
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description'),
				createInputModel('INPUT', 'bgImage')
			]
		}
	],
	[
		'WORD', {
			data: [
				createInputModel('INPUT', 'language'),
				createInputModel('INPUT', 'typeId', '-1', 'typeId', 'NUMBER', true),
				createInputModel('INPUT', 'value'),
				createInputModel('INPUT', 'definition')
			]
		}
	]
]);
/* eslint-enable max-params */
export { INPUTMODEL }