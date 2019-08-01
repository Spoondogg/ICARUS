/* eslint-disable max-lines */
/** @module */
import MODEL, { ATTRIBUTES } from '../model/MODEL.js';
import { ALIGN } from '../enums/ALIGN.js';
import { ICONS } from '../enums/ICONS.js';
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
    @returns {InputModel} An input model
*/
export const createInputModel = (element, name, value = '', label = name, type = 'TEXT', readonly = false, showNav = 0, ...attr) => new MODEL({
	name,
	value,
	type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
	readonly
}).set({
	showNav,
	element,
	label,
	type
}).setAttribute(attr);
/** Model Constructor Factory
    @description See https://stackoverflow.com/a/502384/722785
    let options = this.makeStruct([['woot', 'one'], ['snoot', 'two'], ['boot', 'three']]);
    console.log('Options', options('a', 'b'), options(null, 'b'));

    @param {Array<[string,any]>} params Constructor parameters and default values names ie: [['first','john'],['last','smith']]
    @returns {function(): MODEL} Model Constructor
*/
export const makeStruct = (params = []) => {
    let count = params.length;
    /** Structure Constructor
        @returns {MODEL} Newly created model
    */
    let constructor = (...args) => {
        let model = new MODEL(); // {};
        for (let i = 0; i < count; i++) {
            //obj[params[i][0]] = args[i] || params[i][1]; // fallback to default value
            model.set(params[i][0], args[i] || params[i][1]); 
        }
        return model;
    }
    return constructor;
}
/** A collection of Object model constructors
    @description Each constructor constructs the default model 
    for the element it represents.  Structures are created using
    a centralized structure constructor.
*/
export const MODELS = { ////  CACHE THESE CONSTRUCTORS
    /** Create a navitem model structure constructor
        @type {function(InputModel): MODEL}
        @param {InputModel} Model
        @returns {MODEL} Model
    */
    input: makeStruct([
        ['model', new MODEL()],
        ['attributes']
        //['type'],
        //['class'],
        //['value'],
        //['readonly'],
        //['placeholder'],
        //['autocomplete']
    ]),
    /* Create a generic element model structure constructor
        type {function(object): MODEL}
        param {object} Model Model
        returns {MODEL} Model
    
    EL: () => new MODEL(),*/
    /** Create an anchor model structure constructor
        @type {function(AnchorModel): MODEL}
        @param {AnchorModel} Model
        @returns {MODEL} Model
    */
    anchor: makeStruct([
        ['icon', ICONS.BLANK],
        ['label', '']
    ]),

    /** Create a buttonGroup model structure constructor
        @type {function(ButtonGroupModel): MODEL}
        @param {ButtonGroupModel} Model
        @returns {MODEL} Model
    */
    buttongroup: makeStruct([
        ['label', 'buttons'],
        ['align'],
        ['name'],
        ['attributes', {}],
        ['data', {}],
        ['meta', {}]
    ]),

    /** Create a button model structure constructor
        @type {function(ButtonModel): MODEL}
        @param {ButtonModel} Model
        @returns {MODEL} Model
    */
    button: makeStruct([
        ['label', ''],
        ['icon', ICONS.BLANK],
        ['type', 'BUTTON']
    ]),

    /** Create a generic container model structure constructor
        @type {function(ClassModel): MODEL}
        @param {ClassModel} Model
        @returns {MODEL} Model
    */
    class: makeStruct([
        ['id'],
        ['shared', -1],
        ['status', 1],
        ['authorId'],
        ['dateCreated'],
        ['dateLastModified']
    ]),

    /** Create a generic container model structure constructor
        @type {function(ContainerModel): MODEL}
        @param {ContainerModel} Model
        @returns {MODEL} Model
    */
    container: makeStruct([
        ['id'],
        ['label'],
        ['shared', -1],
        ['status', 1],
        ['subsections', '0'],
        ['tags', '0'],
        ['name'],
        ['authorId'],
        ['dateCreated'],
        ['dateLastModified'],
        ['dataId', '0'],
        ['attributesId', '0'],
        ['metaId', '0']
    ]),

    /** Create a generic container model structure constructor
        @type {function(ContainerModel): MODEL}
        @param {ContainerModel} Model
        @returns {MODEL} Model
    */
    containerThumbnail: makeStruct([
        ['id'],
        ['label'],
        ['shared', -1],
        ['status', 1],
        ['subsections', '0'],
        ['tags', '0'],
        ['name'],
        ['authorId'],
        ['dateCreated'],
        ['dateLastModified'],
        ['dataId', '0'],
        ['attributesId', '0'],
        ['metaId', '0']
    ]),

    /** Create a generic container model structure constructor
        @type {function(ContainerModel): MODEL}
        @param {ContainerModel} Model
        @returns {MODEL} Model
    */
    thumbnail: makeStruct([
        ['id'],
        ['label']
    ]),

    /** Create a buttonGroup model structure constructor
        @type {function(FormPostIndexOptions): MODEL}
        @param {FormPostIndexOptions} Model
        @returns {MODEL} Model
    */
    formPostIndexOptions: makeStruct([
        ['classType', 'MAIN'],
        ['query', ''],
        ['searchType', 'CLASS'],
        ['formId']
    ]),

    /** Create a buttonGroup model structure constructor
        @type {function(ClassIndexOptions): MODEL}
        @param {ClassIndexOptions} Model
        @returns {MODEL} Model
    */
    classIndexOptions: makeStruct([
        ['classType', 'MAIN'],
        ['query', ''],
        ['searchType', 'CLASS']
    ]),

    /** Create a buttonGroup model structure constructor
        @type {function(ClickableOptions): MODEL}
        @param {ClickableOptions} Model
        @returns {MODEL} Model
    */
    clickableOptions: makeStruct([
        ['deactivateSiblings', false],
        ['delay', 200],
        ['longClickDelay', 2000],
        ['stopPropagation', true]
    ]),

    /** Create a dialog model structure constructor
        @type {function(DialogModel): MODEL}
        @param {DialogModel} Model
        @returns {MODEL} Model
    */
    dialog: makeStruct([
        ['label', 'Dialog'],
        ['text', ''],
        ['showHeader', true],
        ['container', null],
        ['caller', null],
        ['loader', null]        
    ]),

    /** Create a form model structure constructor
        @type {function(FormModel): MODEL}
        @param {FormModel} Model
        @returns {MODEL} Model
    */
    form: makeStruct([
        ['label', 'Dialog'],
        //['text', ''],
        //['showHeader', true],
        ['container', null]
        //['caller', null],
        //['loader', null]
    ]),

    /** Create a navheader model structure constructor
        @type {function(FormFooterModel): MODEL}
        @param {FormFooterModel} Model
        @returns {MODEL} Model
    */
    formfooter: makeStruct([['align', ALIGN.VERTICAL]]),

    /** Create a dialog model structure constructor
        @type {function(GroupModel): MODEL}
        @param {GroupModel} Model
        @returns {MODEL} Model
    */
    group: makeStruct([['name', '']]),

    /** Create an icon model structure constructor
        @type {function(IconModel): MODEL}
        @param {IconModel} Model
        @returns {MODEL} Model
    */
    icon: makeStruct([['icon', ICONS.BLANK]]),

    /** Create a buttonGroup model structure constructor
        @type {function(LoaderLogOptions): MODEL}
        @param {LoaderLogOptions} Model
        @returns {MODEL} Model
    */
    loaderLogOptions: makeStruct([
        ['show', true],
        ['toConsole', false],
        ['delay', 300],
        ['type', 'info']
    ]),

    /** Create a Menu model structure constructor
        @type {function(MenuModel): MODEL}
        @param {MenuModel} Model
        @returns {MODEL} Model
    */
    menu: makeStruct([
        ['name', ''],
        ['attributes', {}],
        ['data', {}],
        ['meta', {}]
    ]),

    /** Create a menu options model structure constructor
        @type {function(MenuOptions): MODEL}
        @param {MenuOptions} Model
        @returns {MODEL} Model
    */
    menuOptions: makeStruct([
        ['canActivate', true],
        ['scrollIntoView', false]
    ]),

    /** Create a navitem model structure constructor
        @type {function(MainModel): MODEL}
        @param {MainModel} Model
        @returns {MODEL} Model
    */
    main: makeStruct([
        ['model', new MODEL()],
        ['props']
    ]),

    /** Create a navheader model structure constructor
        @type {function(NavHeaderModel): MODEL}
        @param {NavHeaderModel} Model
        @returns {MODEL} Model
    */
    navheader: makeStruct([['label', '']]),

    /** Create a navitem model structure constructor
        @type {function(NavItemModel): MODEL}
        @param {NavItemModel} Model
        @returns {MODEL} Model
    */
    navitem: makeStruct([
        ['label'],
        ['icon', ICONS.BLANK],
        ['name'],
        ['target']
    ]),

    /** Create a paragraph model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} Model
        @returns {MODEL} Model
    */
    p: makeStruct([['text', '']]),

    /** Create a span model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} Model
        @returns {MODEL} Model
    */
    text: makeStruct([['text', '']])
}
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
                createInputModel('INPUT', 'showNav', '-1', 'showNav', 'CHECKBOX'),
                createInputModel('INPUT', 'collapsed', '-1', 'collapsed', 'CHECKBOX')
            ],
            attributes: [
                createInputModel('INPUT', 'name'),
                createInputModel('INPUT', 'class')
            ],
            meta: [
                createInputModel('TEXTAREA', 'description')
                //createInputModel('INPUT', 'tags', '0')
                // Conside a list of author ids (ie: authors)
            ]
        }
    ],
    [
        'ARTICLE', {
            containers: ['JUMBOTRON', 'FORM', 'SECTION'],
            data: [createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX')]
        }
    ],
    [
        'BANNER', {
            data: [
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description')
            ]
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
        'CHAT', {
            data: [
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'Header'),
                createInputModel('TEXTAREA', 'p', 'Description')
            ]
        }
    ],
    [
        'CLASSINDEX', {
            data: [
                createInputModel('INPUT', 'classType', 'MAIN'),
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'MAIN'),
                createInputModel('TEXTAREA', 'p', 'Description')
            ]
        }
    ],
    [
        'CLASSVIEWER', {
            data: [createInputModel('INPUT', 'classType', 'MAIN')]
        }
    ],
    [
        'CONTAINERINDEX', {
            data: [
                createInputModel('INPUT', 'classType', 'MAIN'),
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'MAIN'),
                createInputModel('TEXTAREA', 'p', 'Description'),
                createInputModel('INPUT', 'searchType', 'CLASS'),
                createInputModel('INPUT', 'query', '')
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
            containers: ['FORMINPUT', 'FORMTEXTAREA', 'TEXTBLOCK'],
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
    /*[
        'FORMPOST', {
            data: [
                createInputModel('INPUT', 'id', '-1', 'id', 'NUMBER', true),
                createInputModel('INPUT', 'shared', '-1', 'shared', 'CHECKBOX'),
                createInputModel('INPUT', 'isPublic', '-1', 'isPublic', 'CHECKBOX')
            ]
        }
    ],*/
    [
        'FORMPOSTINDEX', {
            data: [
                createInputModel('INPUT', 'header', 'FORMPOSTINDEX'),
                createInputModel('TEXTAREA', 'p', 'Description'),
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'formId', '-1'),
                createInputModel('INPUT', 'query', '')
            ]
        }
    ],
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
        'FORMPOSTLIST', {
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
    [
        'IMAGEINDEX', {
            data: [
                createInputModel('INPUT', 'header', 'IMAGEINDEX'),
                createInputModel('TEXTAREA', 'p', 'Description'),
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                //createInputModel('INPUT', 'formId', '-1'),
                createInputModel('INPUT', 'query', '')
            ]
        }
    ],
    [
        'INDEX', {
            data: [
                createInputModel('INPUT', 'showHeader', '1', 'showHeader', 'CHECKBOX'),
                createInputModel('INPUT', 'header', 'INDEX')
            ]
        }
    ],
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
            containers: ['ARTICLE', 'FORM', 'TABLE', 'BANNER', 'JUMBOTRON', 'TEXTBLOCK', 'INDEX', 'CLASSINDEX', 'FORMPOSTINDEX', 'CONTAINERINDEX', 'CLASSVIEWER', 'CHAT', 'IMAGEINDEX', 'DICTIONARY', 'WORD'],
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
            data: [createInputModel('INPUT', 'header', 'Header')]
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
                createInputModel('INPUT', 'type', 'text'),
                createInputModel('INPUT', 'name', 'null'),
                createInputModel('TEXTAREA', 'span', 'null')
            ]
        }
    ],
    [
        'TH', {
            data: [
                createInputModel('INPUT', 'type', 'text'),
                createInputModel('INPUT', 'name', 'null'),
                createInputModel('TEXTAREA', 'span', 'null')
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
export { ATTRIBUTES }
/* eslint-enable max-lines */