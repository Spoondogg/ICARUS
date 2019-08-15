/** @module */
import ATTRIBUTES from '../model/ATTRIBUTES.js';
//import { ALIGN } from '../enums/ALIGN.js';
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
        @param {ButtonData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    button: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK]
    ]),
    /** Create an icon data structure constructor
        @type {function(IconData): ATTRIBUTES}
        @param {IconData} Attributes
        @returns {ATTRIBUTES} Model
    */
    icon: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK],
        ['name']
    ]),
    /** Create a text model structure constructor
        @type {function(TextData): ATTRIBUTES}
        @param {TextData} [Attributes]
        @returns {ATTRIBUTES} Attributes
    */
    text: makeDataStruct([['text', '']]),
    /** Create a navitem model structure constructor
        @type {function(NavItemData): ATTRIBUTES}
        @param {NavItemData} Attributes
        @returns {ATTRIBUTES} Model
    */
    navitem: makeDataStruct([
        ['label'],
        ['icon', ICONS.BLANK]
    ])
}
export { ICONS }