/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
import { ALIGN } from '../enums/ALIGN.js';
import { ICONS } from '../enums/ICONS.js';
/** Attribute Constructor Factory
    @description See https://stackoverflow.com/a/502384/722785
    @param {Array<[string,any]>} params Constructor parameters and default values names ie: [['first','john'],['last','smith']]
    @returns {function(): ATTRIBUTES} Attributes Constructor
*/
export const makeDataStruct = (params = []) => {
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
/** A collection of Object Data constructors
    @description Each constructor constructs the default model 
    for the element it represents.  Structures are created using
    a centralized structure constructor.
*/
export const DATA = { ////  CACHE THESE CONSTRUCTORS
    /** Create an anchor model structure constructor
        @type {function(AnchorData): ATTRIBUTES}
        @param {AnchorData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    anchor: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK]
    ]),
    /** Create a button model structure constructor
        @type {function(ButtonData): ATTRIBUTES}
        @param {ButtonData} [Attributes] Attributes
        @returns {ATTRIBUTES} Attributes
    */
    button: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK]
    ]),
    /** Create a buttongroup model structure constructor
        @type {function(ButtonGroupData): ATTRIBUTES}
        @param {ButtonGroupData} Attributes
        @returns {ATTRIBUTES} Model
    */
    buttongroup: makeDataStruct([['align']]),
    /** Create an icon data structure constructor
        @type {function(IconData): ATTRIBUTES}
        @param {IconData} Attributes Attributes
        @returns {ATTRIBUTES} Attributes
    */
    icon: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK],
        ['name']
    ]),
    /** Create a text model structure constructor
        @type {function(TextData): ATTRIBUTES}
        @param {TextData} [Attributes] Attributes
        @returns {ATTRIBUTES} Attributes
    */
    text: makeDataStruct([['text', '']]),
    /** Create an menu attributes structure constructor
        @type {function(MenuData): ATTRIBUTES}
        @param {MenuData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    menu: makeDataStruct([['name']]),
    /** Create a navitem model structure constructor
        @type {function(NavItemData): ATTRIBUTES}
        @param {NavItemData} Attributes Attributes
        @returns {ATTRIBUTES} Attributes
    */
    navitem: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK]
    ]),
    /** Create a navitem model structure constructor
        @type {function({NavItemData & SearchData}): ATTRIBUTES}
        @param {{NavItemData & SearchData}} Attributes Attributes
        @returns {ATTRIBUTES} Attributes
    */
    navitemsearch: makeDataStruct([
        ['label', ''],
        ['icon', ICONS.BLANK],
        ['searchClass', 'MAIN'],
        ['searchType', 'TAG'],
        ['query', ''],
        ['formId', '-1']
    ]),
    /** Create a search data structure constructor
        @type {function(SearchData): ATTRIBUTES}
        @param {SearchData} Attributes
        @returns {ATTRIBUTES} Attributes
    */
    search: makeDataStruct([
        ['searchClass', 'MAIN'],
        ['searchType', 'TAG'],
        ['query', ''],
        ['formId', '-1']
    ])
}
export { ICONS }