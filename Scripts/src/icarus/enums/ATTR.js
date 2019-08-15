/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
/** Attribute Constructor Factory
    @description See https://stackoverflow.com/a/502384/722785
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
/** A collection of Object Attributes constructors
    @description Each constructor constructs the default model 
    for the element it represents.  Structures are created using
    a centralized structure constructor.
*/
export const ATTR = { ////  CACHE THESE CONSTRUCTORS
    /** Create a button model structure constructor
        @type {function(ButtonAttributes): ATTRIBUTES}
        @param {ButtonAttributes} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    button: makeAttrStruct([
        ['type', 'BUTTON'],
        ['name'],
        ['title']
    ]),
    /** Create a buttonGroup model structure constructor
        @type {function(ClickableOptions): ATTRIBUTES}
        @param {ClickableOptions} Attributes
        @returns {ATTRIBUTES} Attributes
    */
    clickableOptions: makeAttrStruct([
        ['deactivateSiblings', false],
        ['delay', 200],
        ['longClickDelay', 2000],
        ['stopPropagation', true]
    ]),
    /** Create an anchor model structure constructor
        @type {function(TextData): ATTRIBUTES}
        @param {TextData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    text: makeAttrStruct([['text', '']]),
    /** Create a navitem model structure constructor
     * element, name, value = '', label = name, type = 'TEXT', readonly = false, showNav = 0
        @type {function(InputAttributes): ATTRIBUTES}
        @param {InputAttributes} Attributes
        @returns {ATTRIBUTES} Attributes
    */
    input: makeAttrStruct([
        ['name'],
        ['value'],
        ['type', 'TEXT'], //type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
        ['readonly'],
        ['placeholder'],
        ['autocomplete']
    ]),
    /** Create an anchor model structure constructor
        @type {function(AnchorData): ATTRIBUTES}
        @param {AnchorData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    aData: makeAttrStruct([
        ['name'],
        ['target']
    ]),
    /** Create an anchor model structure constructor
        @type {function(AnchorAttributes): ATTRIBUTES}
        @param {AnchorAttributes} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    anchor: makeAttrStruct([
        ['href', '#'],
        ['name'],
        ['target']
    ]),
    /** Create a navitem model structure constructor
        @type {function(NavItemAttributes): ATTRIBUTES}
        @param {NavItemAttributes} Attributes
        @returns {ATTRIBUTES} Model
    */
    navitem: makeAttrStruct([
        ['name'],
        ['title'],
        ['target']
    ]),
    /** Create a buttonGroup model structure constructor
        @type {function(SearchData): ATTRIBUTES}
        @param {SearchData} Attributes
        @returns {ATTRIBUTES} Attributes
    */
    search: makeAttrStruct([
        ['searchClass', 'MAIN'],
        ['searchType', 'TAG'],
        ['query', ''],
        ['formId', '-1']
    ])
}
export { ATTRIBUTES }