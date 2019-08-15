/** @module */
//import { ATTR, ATTRIBUTES } from './ATTR.js';
//import MODEL, { ATTR, ATTRIBUTES, DATA, ICONS } from '../model/MODEL.js';
import { ATTR, ATTRIBUTES, DATA, ICONS, MODEL } from '../enums/DATAELEMENTS.js';
import { ALIGN } from '../enums/ALIGN.js';
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
        let model = new MODEL();
        for (let i = 0; i < count; i++) {
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
    /** Create an anchor model structure constructor
        @type {function(AnchorModel): MODEL}
        @param {AnchorModel} Model
        @returns {MODEL} Model
    */
    anchor: makeStruct([
        ['attributes', ATTR.anchor()],
        ['data', DATA.anchor()]
    ]),
    /** Create an anchor model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} [Model]
        @returns {MODEL} Model
    */
    text: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', DATA.text()]
    ]),
    /** Create an anchor model structure constructor
        @type {function(Model): MODEL}
        @param {Model} Model
        @returns {MODEL} Model
    */
    model: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
    ]),
    /** Create an anchor model structure constructor
        @type {function(El): MODEL}
        @param {El} Model
        @returns {MODEL} Model
    */
    el: makeStruct([
        ['element'],
        ['className'],
        ['children']
    ]),
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
    /** Create an anchor model structure constructor
        @type {function(ListModel): MODEL}
        @param {ListModel} Model
        @returns {MODEL} Model
    */
    list: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
    ]),
    /** Create a buttonGroup model structure constructor
        @type {function(ButtonGroupModel): MODEL}
        @param {ButtonGroupModel} Model
        @returns {MODEL} Model
    */
    buttongroup: makeStruct([
        ['align'],
        ['name'],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
    ]),
    /** Create a button model structure constructor
        @type {function(ButtonModel): MODEL}
        @param {ButtonModel} Model
        @returns {MODEL} Model
    */
    button: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()]
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

    /** Create a generic ClassIndex Model structure constructor
        @type {function(ClassIndexModel): MODEL}
        @param {ClassIndexModel} Model
        @returns {MODEL} Model
    */
    classIndex: makeStruct([
        ['label'],
        ['subsections', '0'],
        ['tags', '0'],
        ['name', ''],
        ['id'],
        ['authorId'],
        ['shared', -1],
        ['status', 1],
        ['dateCreated'],
        ['dateLastModified'],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
    ]),
    /** Create a generic container model structure constructor
        @type {function(ContainerModel): MODEL}
        @param {ContainerModel} Model
        @returns {MODEL} Model
    */
    container: makeStruct([
        ['label'],
        ['subsections', '0'],
        ['tags', '0'],
        ['name', ''],
        ['id'],
        ['authorId'],
        ['shared', -1],
        ['status', 1],
        ['dateCreated'],
        ['dateLastModified'],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
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

    /** Create a generic container model structure constructor
        @type {function(FormPostModel): MODEL}
        @param {FormPostModel} Model
        @returns {MODEL} Model
    */
    formPost: makeStruct([
        ['formId', '-1'],
        ['id'],
        ['authorId'],
        ['shared', -1],
        ['isPublic', 1],
        ['status', 1],
        ['dateCreated'],
        ['dateLastModified'],
        ['jsonResults']
    ]),

    /** Create a generic ClassIndex Model structure constructor
        @type {function(FormPostIndexModel): MODEL}
        @param {FormPostIndexModel} Model
        @returns {MODEL} Model
    */
    formPostIndex: makeStruct([
        ['label'],
        ['subsections', '0'],
        ['tags', '0'],
        ['name', ''],
        ['id'],
        ['authorId'],
        ['shared', -1],
        ['status', 1],
        ['dateCreated'],
        ['dateLastModified'],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
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
        ['name', ''],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()],
        ['meta', new ATTRIBUTES()]
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
    /** Create a navitem model structure constructor
        @type {function(NavItemSearchModel): MODEL}
        @param {NavItemSearchModel} Model
        @returns {MODEL} Model
    */
    navitemsearch: makeStruct([
        ['label'],
        ['icon', ICONS.BLANK],
        ['name'],
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()]
    ]),
    /** Create a paragraph model structure constructor
        @type {function(TextModel): MODEL}
        @param {TextModel} Model
        @returns {MODEL} Model
    */
    p: makeStruct([
        ['attributes', new ATTRIBUTES()],
        ['data', new ATTRIBUTES()]
    ])
}
export { ALIGN, ATTR, ATTRIBUTES, DATA, ICONS, MODEL }