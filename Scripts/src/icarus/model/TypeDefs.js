﻿/** A collection of globally available Type Definitions for JSDoc
    @see {@link http://usejsdoc.org|JSDoc}
    @see {@link https://github.com/Microsoft/TypeScript/wiki/JsDoc-support-in-JavaScript|Supported}
    @module icarus/typedefs
*/

/// IMPORTS
/*@typedef {import("./el/EL").default} EL El */

/** @typedef {import('./el/EL.js').EL} El Model */

/// GENERIC
/** Unique Identifying Number
    @typedef {number} UId - Unique Identifying Number
*/
/** String of comma delimited values
    @typedef {string} CSV - String of comma delimited values
*/
/** Timed delay in milliseconds
    @typedef {number} Delay - Timed delay in milliseconds
*/
/**
    @typedef {string} Label - A user-friendly string
*/
/** A Machine Friendly String should only contain alphanumeric characters and dashes (-).
    No spaces are permitted
    @typedef {string} Name - A machine-friendly string
*/
/** A valid email address in the format of user@domain
    @typedef {string} EmailAddress - A valid email address string
*/
/** A list of Container Class Names
    @typedef {Array<Name>} ContainerList - A list of Container Class Names
*/
/** A list of CONTAINER Class UIds
    @typedef {Array<UId>} UIdList - A list of Container Class UIds
*/
/** An ordered array of MODEL Classes
    @typedef {Array<MODEL>} Models - An ordered array of MODEL Classes
*/
/** An ordered array of EL Classes
    @typedef {Array<El>} Elements - An ordered array of EL Classes
*/
/** A key/value pair based on name
    @typedef {{Name, value:string}} NameValuePair - A key/value pair based on name
*/

/// STRUCTURES
/** A collection of Attributes
    @typedef {Object} Attributes A collection of Attributes
    @property {Attributes|string} [className] - A collection of attributes | Element className attribute
	@property {string} [name] - Element name attribute
    @property {string} [type] - Element type attribute
    @property {string} [value] - Element value attribute
*/
/**
    @typedef {Object} Model A Element MODEL like structure
    @property {Attributes} [attributes] Attributes
    @property {Attributes} [data] Data
    @property {Attributes} [meta] Meta
*/
/** Represents a CONTAINER Class Structure
    @typedef {Object} ContainerLike A Container-like Object Model
    @property {UId} id UId
    @property {Label} label Label
    @property {boolean} [shared=false] Shared
    @property {string} [status=1] Status
    @property {UIdList} [subsections] Child Container UIds
    @property {UIdList} [tags] Tag UIds
    @property {string} [name] Name
*/
/** Represents a LOADER Class Structure
    @typedef {Object} LoaderLike A Container-like Object Model
    @property {string} [name] Name
*/

/** An abstract CONTAINER Class
    @typedef {Model & ContainerLike} Container - Represents a {@link CONTAINER} Container Object Model
*/
/**
    FORM generators often need to pass on a Container reference
    @typedef {Model & {container: ContainerLike, loader: LoaderLike}} ModelWithContainer - A MODEL requiring a CONTAINER
*/
/**
    @typedef {Model & {loader: LoaderLike}} ModelWithLoader - A MODEL requiring a LOADER
*/
/**
    @typedef {Model & {caller: LoaderLike}} ModelWithCaller - A MODEL requiring a CALLER
*/
/** A Model used to generate a DIALOG
    @typedef {ModelWithContainer & ContainerLike} DialogModel - Represents a {@link DIALOG} Dialog Object Model
*/
/**
    See FORM.createFormPostForm
    @typedef {Object} FormPostFormModel A MODEL used to generate a FORM based on a FORMPOST
    @property {string} className Class Name
    @property {string} type Type
    @property {boolean} [hidden="false"] If true, hidden
    @property {UId} id UId
*/
/** A Form-like Model, used in FORM.createForm()
    @typedef {Container} FormModel A Form Model Constructor TypeDef
    @property {Container} container Container
    @property {boolean} [hidden="false"] If true, hidden
*/

/// OPTIONS
/** If true, this class can be activated
    @typedef {boolean} canActivate - If true, this class can be activated
*/
/** If true, the menu is scrolled into view when activated
    @typedef {boolean} scrollIntoView - If true, the menu is scrolled into view when activated
*/
/** A Class Type / name of a Class (ie: CONTAINER, FORMPOST)
    @typedef {string} classType - A Class Type / name of Class (ie: CONTAINER, FORMPOST)
*/
/** Optional QueryString
    @typedef {string} query - Optional QueryString
*/
/** Optional FormUId reference
    @typedef {UId} formId - Optional FormUId Reference
*/
/** Represents a set of options for a ClassIndex
    @typedef {Object} ClassIndexOptions A set of options for a ClassIndex
    @property {classType} [classType="MAIN"] A Class Type / name of Class (ie: CONTAINER, FORMPOST)
    @property {query} [query=""] Optional QueryString / comma delimited list of tags/tag uids
    @property {string} [searchType="CLASS"] Optional search Type
*/
/** A ClassIndexOption with formId for FormPostIndex(es)
    @typedef {ClassIndexOptions & {formId:formId}} FormPostIndexOptions - FormPost Index Options
*/

///// LOADER.log Specific

/** Represents a set of options for a Loader log
    @typedef {Object} LoaderLogOptions Represents a set of options for a Loader log
    @property {boolean} show If true, the log will be displayed
    @property {boolean} toConsole If true, logs to console as well
    @property {Delay} delay Delay to hide when value reaches 100 or stay visible if value === 0
    @property {string} type ie success, info, warning, danger
*/

///// END LOADER.log

///// CONTAINERTHUMBNAIL

/** Represents a Container Thumbnail Model
    @typedef {Object} ContainerThumbnailModel Represents a set of options for a Loader log
    @property {UId} id Container UId
    @property {CSV} subsections Delimited list of subsections
    @property {string} authorId Author UId
    @property {string} label Container Label
    @property {string} description Container Description
    @property {CSV} tags Delimited list of tag UIds
    @property {string} key Key
    @property {string} value Value
    @property {object} jsonResults JSON Results
*/

/////

///// NAVITEM 

/** Represents a set of options for a ClassIndex
    @typedef {Object} NavItemOptions A set of options for a NavItem
    @property {boolean} [deactivateSiblings="false"] If true, siblings are deactivated when element is activated
*/

/** Represents a set of options for a Clickable interface
    @typedef {Object} ClickableOptions A set of options for a NavItem
    @property {boolean} [deactivateSiblings="false"] If true, siblings are deactivated when element is activated
    @property {number} [delay="200"] Single Click Delay
    @property {number} [longClickDelay="2000"] Press/Hold duration before long click is triggered
    @property {boolean} [stopPropagation="true"] If true, siblings are deactivated when element is activated
*/

/** Represents a set of options for a Clickable interface
    @typedef {Object} ButtonAttributes A set of options for a NavItem
    @property {string} [label=""] Button text
    @property {string} [glyphicon="ICONS.BLANK"] Button Icon
    @property {string} [buttonType="BUTTON"] Button Type ie: BUTTON, RESET, SUBMIT
*/

/** Represents a model for a BUTTON
    @typedef {Object} ButtonModel A Button Model
    @property {ButtonAttributes} [attributes] Button Attributes
*/

/** Represents a set of attributes for an IMG Class
    @typedef {Object} ImageAttributes A set of options for an Image
    @property {string} [src=""] Image source url
    @property {string} [class=""] Image class
*/

/** Represents a model for an IMG Class
    @typedef {Object} ImageModel Image Model
    @property {ImageAttributes} [attributes] Image Attributes
*/

////