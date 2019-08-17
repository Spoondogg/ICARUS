/* eslint-disable max-lines */
/** @module */
import MODEL, { ATTR, ATTRIBUTES, DATA } from '../model/MODEL.js';
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
/** Model Constructor Factory
    @description See https://stackoverflow.com/a/502384/722785
    let options = this.makeStruct([['woot', 'one'], ['snoot', 'two'], ['boot', 'three']]);
    console.log('Options', options('a', 'b'), options(null, 'b'));

    @param {Array<[string,any]>} params Constructor parameters and default values names ie: [['first','john'],['last','smith']]
    @returns {function(): ATTRIBUTES} Attributes Constructor
*/
export const makeAttrStruct = (params = []) => {
    let count = params.length;
    /** Structure Constructor
        @returns {ATTRIBUTES} Newly created ATTRIBUTES
    */
    let constructor = (...args) => {
        let attributes = new ATTRIBUTES();
        for (let i = 0; i < count; i++) {
            attributes.set(params[i][0], args[i] || params[i][1]); // fallback to default value
        }
        return attributes;
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
     * element, name, value = '', label = name, type = 'TEXT', readonly = false, showNav = 0
        @type {function(InputModel): MODEL}
        @param {InputModel} Model
        @returns {MODEL} Model
    */
    input: makeStruct([
        ['element', 'INPUT'],
        ['attributes'],
        ['label', null],
        ['type', 'TEXT'],
        ['showNav', 0]        
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
        ['label', ''],
        ['attributes', {}]
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
    icon: makeStruct([
        //['icon', ICONS.BLANK]
        ['attributes', new ATTRIBUTES()],
        ['data', DATA.icon()]
    ]),

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
        ['attributes', ATTR.menu()],
        ['data', DATA.menu()],
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
        ['attributes', ATTR.navitem()],
        ['data', DATA.navitem()]
    ]),
    /** Create a paragraph model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} Model
        @returns {MODEL} Model
    */
    p: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', DATA.text()]
    ]),
    /** Create a span model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} Model
        @returns {MODEL} Model
    */
    text: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', DATA.text()]
    ])
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
                MODELS.input('INPUT', ATTR.input('showNav', '-1', 'CHECKBOX'), 'showNav', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('collapsed', '-1', 'CHECKBOX'), 'collapsed', 'CHECKBOX')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('name'), 'name'),
                MODELS.input('INPUT', ATTR.input('class'), 'class')
            ],
            meta: [ // Conside a list of author ids (ie: authors)
                MODELS.input('TEXTAREA', ATTR.input('description'), 'description')
            ]
        }
    ],
    [
        'ARTICLE', {
            containers: ['JUMBOTRON', 'FORM', 'SECTION'],
            data: [MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX')]
        }
    ],
    [
        'BANNER', {
            data: [
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'Header'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description'))
            ]
        }
    ],
    [
        'CALLOUT', {
            data: [
                MODELS.input('INPUT', ATTR.input('icon'), 'icon'),
                MODELS.input('INPUT', ATTR.input('header', 'Header'), 'header'),
                MODELS.input('INPUT', ATTR.input('p', 'Text'), 'p')
            ]
        }
    ],
    [
        'CHAT', {
            data: [
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'Header'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description'))
            ]
        }
    ],
    [
        'CLASSINDEX', {
            data: [
                MODELS.input('INPUT', ATTR.input('classType', 'MAIN'), 'classType'),
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'MAIN'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description'))
            ]
        }
    ],
    [
        'CLASSVIEWER', {
            
            data: [MODELS.input('INPUT', ATTR.input('classType', 'MAIN'), 'classType')]
        }
    ],
    [
        'CONTAINERINDEX', {
            data: [
                MODELS.input('INPUT', ATTR.input('classType', 'MAIN'), 'classType'),
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'MAIN'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description')),
                MODELS.input('INPUT', ATTR.input('searchType', 'CLASS'), 'searchType'),
                MODELS.input('INPUT', ATTR.input('query', ''), 'query')
            ]
        }
    ],
    [
        'DICTIONARY', {
            data: [MODELS.input('INPUT', ATTR.input('language'), 'language')]
        }
    ],
    [
        'FIELDSET', {
            data: [MODELS.input('INPUT', ATTR.input('legend'), 'legend')],
            attributes: [MODELS.input('INPUT', ATTR.input('name', 'fieldset-name'), 'name')]
        }
    ],
    [
        'FORM', {
            containers: ['TEXTBLOCK', 'JUMBOTRON', 'FIELDSET'],
            data: [
                MODELS.input('INPUT', ATTR.input('header', 'Header', 'TEXT'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description')),
                MODELS.input('INPUT', ATTR.input('hidden', '0', 'CHECKBOX'), 'hidden')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('name', 'text-input'), 'name'),
                MODELS.input('INPUT', ATTR.input('method', 'POST'), 'method'),
                MODELS.input('INPUT', ATTR.input('action', 'FORM/SUBMIT'), 'action')
            ]
        }
    ],
    [
        'FORMELEMENT', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'Text Input'), 'name'),
                MODELS.input('INPUT', ATTR.input('label', 'Input Label'), 'label'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('placeholder', ''), 'placeholder')
            ]
        }
    ],
    [
        'FORMELEMENTGROUP', {
            containers: ['FORMINPUT', 'FORMTEXTAREA', 'TEXTBLOCK'],
            data: [MODELS.input('INPUT', ATTR.input('header'), 'header')],
            attributes: [MODELS.input('INPUT', ATTR.input('name', 'text-input'), 'name')]
        }
    ],
    [
        'FORMINPUT', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'Text Input'), 'name'),
                MODELS.input('INPUT', ATTR.input('label', 'Input Label'), 'label'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('placeholder', ''), 'placeholder')
            ]
        }
    ],
    ['FORMPOST', {}],
    [
        'FORMPOSTINDEX', {
            data: [
                MODELS.input('INPUT', ATTR.input('header', 'FORMPOSTINDEX'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description')),
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('formId', '-1'), 'formId'),
                MODELS.input('INPUT', ATTR.input('query', ''), 'query')
            ]
        }
    ],
    [
        'FORMPOSTINPUT', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'Text Input'), 'name'),
                MODELS.input('INPUT', ATTR.input('label', 'Input Label'), 'label'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'text-input'), 'name'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('placeholder', ''), 'placeholder')
            ]
        }
    ],
    [
        'FORMPOSTLIST', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'Text Input'), 'name'),
                MODELS.input('INPUT', ATTR.input('label', 'Input Label'), 'label'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'text-input'), 'name'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('placeholder', ''), 'placeholder')
            ]
        }
    ],
    [
        'FORMTEXTAREA', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name', 'Text Input'), 'name'),
                MODELS.input('INPUT', ATTR.input('label', 'Input Label'), 'label'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('placeholder', ''), 'placeholder')
            ]
        }
    ],
    [
        'IMAGEINDEX', {
            data: [
                MODELS.input('INPUT', ATTR.input('header', 'IMAGEINDEX'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description')),
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                //createInputModel('INPUT', 'formId', '-1'),
                MODELS.input('INPUT', ATTR.input('query', ''), 'query')
            ]
        }
    ],
    [
        'INDEX', {
            data: [
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'INDEX'), 'header')
            ]
        }
    ],
    [
        'INPUT', {
            data: [
                MODELS.input('INPUT', ATTR.input('showNav', '1', 'NUMBER'), 'showNav'),
                MODELS.input('INPUT', ATTR.input('type', 'TEXT'), 'type'),
                MODELS.input('INPUT', ATTR.input('name'), 'name'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value')
            ],
            attributes: [MODELS.input('INPUT', ATTR.input('placeholder'), 'placeholder')]
        }
    ],
    [
        'JUMBOTRON', {
            data: [
                MODELS.input('INPUT', ATTR.input('slogan', 'JT Slogan'), 'slogan'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'JT Textarea'), 'p'),                
                MODELS.input('BUTTON', ATTR.input('bgimage', '-1', 'NUMBER', true), 'bgimage', 'FORMPOSTINPUT').set({
                    inputs: [MODELS.input('INPUT', ATTR.input('file', null, 'FILE', true), 'file')]
                }),
                MODELS.input('INPUT', ATTR.input('screencolor', '.', 'TEXT', true), 'screencolor'),
                MODELS.input('INPUT', ATTR.input('bgcolor', '.', 'TEXT', true), 'bgcolor')
            ],
            attributes: [MODELS.input('INPUT', ATTR.input('bgcolor', '#333'), 'bgcolor')]
        }
    ],
    ['LIST', {}],
    [
        'LISTITEM', {

            data: [MODELS.input('INPUT', ATTR.input('p', 'Text'), 'p')]
        }
    ],
    [
        'MAIN', {
            containers: ['ARTICLE', 'FORM', 'TABLE', 'BANNER', 'JUMBOTRON', 'TEXTBLOCK', 'INDEX', 'CLASSINDEX', 'FORMPOSTINDEX', 'CONTAINERINDEX', 'CLASSVIEWER', 'CHAT', 'IMAGEINDEX', 'DICTIONARY', 'WORD'],
            data: [
                MODELS.input('INPUT', ATTR.input('author', 'AuthorName'), 'author'),
                MODELS.input('INPUT', ATTR.input('title', 'MAIN'), 'title')
            ]
        }
    ],
    [
        'PARAGRAPH', {
            data: [MODELS.input('INPUT', ATTR.input('p', 'Paragraph Text'), 'p')]
        }
    ],
    [
        'SECTION', {
            data: [
                MODELS.input('INPUT', ATTR.input('showHeader', '1', 'CHECKBOX'), 'showHeader', 'CHECKBOX'),
                MODELS.input('INPUT', ATTR.input('header', 'Header', 'TEXT'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description'))
            ]
		}
	],
	['SIDEBAR', {}],
    [
        'TABLE', {
            data: [MODELS.input('INPUT', ATTR.input('header', 'Header', 'TEXT'), 'header')]
        }
    ],
    [
        'TGROUP', {
            data: [MODELS.input('INPUT', ATTR.input('name'), 'name')]
        }
    ],
    [
        'TBODY', {
            data: [MODELS.input('INPUT', ATTR.input('name'), 'name')]
        }
    ],
    [
        'THEAD', {
            data: [MODELS.input('INPUT', ATTR.input('name'), 'name')]
        }
    ],
    [
        'TFOOT', {
            data: [MODELS.input('INPUT', ATTR.input('name'), 'name')]
        }
    ],
    [
        'TR', {
            data: [MODELS.input('INPUT', ATTR.input('columns'), 'columns')]
        }
    ],
    [
        'TD', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'text'), 'type'),
                MODELS.input('INPUT', ATTR.input('name'), 'name'),
                MODELS.input('INPUT', ATTR.input('span'), 'span')
            ]
        }
    ],
    [
        'TH', {
            data: [
                MODELS.input('INPUT', ATTR.input('type', 'text'), 'type'),
                MODELS.input('INPUT', ATTR.input('name'), 'name'),
                MODELS.input('INPUT', ATTR.input('span'), 'span')
            ]
        }
    ],
	[
		'TEXTBLOCK', {
			data: [
                MODELS.input('INPUT', ATTR.input('header', 'Header', 'TEXT'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description'))
			]
		}
	],
	[
		'THUMBNAIL', {
            data: [
                MODELS.input('BUTTON', ATTR.input('img', '-1', 'NUMBER', true), 'bgimage', 'FORMPOSTINPUT').set({
                    inputs: [MODELS.input('INPUT', ATTR.input('file', null, 'FILE'), 'file')]
                }),
                MODELS.input('INPUT', ATTR.input('header', 'Header', 'TEXT'), 'header'),
                MODELS.input('TEXTAREA', ATTR.input('p', 'Description')),
                MODELS.input('INPUT', ATTR.input('bgImage'), 'bgImage')
			]
		}
	],
	[
		'WORD', {
            data: [
                MODELS.input('INPUT', ATTR.input('language'), 'language'),
                MODELS.input('INPUT', ATTR.input('typeId', '-1', 'NUMBER', true), 'typeId'),
                MODELS.input('INPUT', ATTR.input('value', ''), 'value'),
                MODELS.input('INPUT', ATTR.input('definition'), 'definition')
			]
		}
	]
]);
/* eslint-enable max-params */
export { ALIGN, ATTR, ATTRIBUTES, DATA }
/* eslint-enable max-lines */