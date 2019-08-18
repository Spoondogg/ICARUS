import MODEL, { ALIGN, ATTR, ATTRIBUTES, ICONS } from '../model/MODEL.js';
/** Model Constructor Factory
    @see https://stackoverflow.com/a/502384/722785
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
    /** Create a navitem model structure constructor
        @type {function(InputModel): MODEL}
        @param {InputModel} Model
        @returns {MODEL} Attributes
    */
    inputAttributes: makeStruct([
        ['name'],
        ['value'],
        ['type', 'TEXT'], //type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
        ['readonly'],
        ['placeholder'],
        ['autocomplete']
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
        ['attributes', {}]
        //['target']
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
export { ALIGN, ATTR, ATTRIBUTES, ICONS, MODEL }