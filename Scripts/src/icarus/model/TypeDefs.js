/** @module */
/** @typedef {import("./el/EL").default} EL El */
/** @typedef {number} UId Unique Identifying Number */
/** @typedef {string} Label A user-friendly string */
/** @typedef {string} Name A machine-friendly string */
/** @typedef {Object} CONTAINERMODEL Container Model 
    @property {UId} id UId
    @property {Label} label Label
    @property {boolean} shared Shared
    @property {string} status Status
    @property {Array<number>} subsections Child Container UIds
    @property {string} name Name
*/
/** @typedef {Object} DATAEL A generic Data Element collection for a CONTAINER 
    @property {Array<string>} containers A list of container Classes that this CONTAINER can contain
    @property {Array<MODEL>} data A collection of editable data available to this CONTAINER
    @property {Array<MODEL>} attributes A collection of key/value pairs representing the CONTAINER Element's attributes
*/
/** @typedef {Object} Attributes A collection of Attributes
    @property {Attributes|string} className A collection of attributes | Element className attribute
	@property {string} name Optional Element name attribute
    @property {string} type Element type attribute
    @property {string} value Element value attribute
*/
/** @typedef {Object} Model A Model Constructor TypeDef
    @property {ATTRIBUTES} attributes Attributes
    @property {ATTRIBUTES} data Data
    @property {ATTRIBUTES} meta Meta
*/
/** @typedef {Object} FORMMODEL A Form Model Constructor TypeDef
    @property {CONTAINER} container Container
*/