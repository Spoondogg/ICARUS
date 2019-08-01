/** A collection of globally available Type Definitions for JSDoc
    @see {@link http://usejsdoc.org|JSDoc}
    @see {@link https://github.com/Microsoft/TypeScript/wiki/JsDoc-support-in-JavaScript|Supported}
    @module icarus/typedefs
*/
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
    @typedef {Object} Attributes A collection of Element Attributes
    @property {string} [className] - Element className attribute
	@property {Name} [name] - Element name attribute
    @property {string} [type] - Element type attribute
    @property {any} [value] - Element value attribute
*/
/** A collection of Attributes
    @typedef {Object} Data A collection of Data Attributes
	@property {number} [collapsed] - Element collapsed attribute
    @property {number} [showNav] - Element showNav attribute
    @property {number} [showHeader] - Element showHeader attribute
*/
/** A collection of Attributes
    @typedef {Object} Meta A collection of Meta Attributes
	@property {string} [description] - Element description text
*/
/**
    @typedef {Object} Model A Element MODEL like structure
    @property {Attributes} [attributes] Attributes
    @property {Data} [data] Data
    @property {Meta} [meta] Meta
*/
/** Represents a CONTAINER Class Structure
    @typedef {Object} Controller A Controller-like Object Model
    @param {UId} id The unique application id
        @param {Name} user A machine friendly username
        @param {boolean} dev If true, dev-options are enabled
        @param {number} recursionLimit The maximum number of recursive loops before an error is thrown
        @param {Name} name The application name
        @param {string} version The application version
        @param {string} token The session token
        @param {FACTORY} factory The default FACTORY
*/
/** Represents a CONTAINER Class Structure
    @typedef {Object} ContainerLike A Container-like Object Model
    @property {UId} [id] UId
    @property {Label} [label=""] Label
    @property {boolean} [shared=false] Shared
    @property {string} [status=1] Status
    @property {UIdList} [subsections] Child Container UIds
    @property {UIdList} [tags] Tag UIds
    @property {string} [name=''] Name
    @property {string} [authorId=null] Author Id
    @property {string} [dateCreated=null] Date Created
    @property {string} [dateLastModified=null] Date LastModified
    @property {UId} [dataId] Data Formpost UId
    @property {UId} [attributesId] Attributes Formpost UId
    @property {UId} [metaId] Meta Formpost UId
    property {object} [jsonResults=null] JSON Results
*/
/** Represents a LOADER Class Structure
    @typedef {Object} LoaderLike A Container-like Object Model
    @property {Name} [name] Name
*/

/** Represents a LOADER Class Structure
    @typedef {Object} FactoryLike A Factory-like Object Model
    @property {string} [type] Type
*/

/** An abstract CONTAINER Class
    @typedef {Model & ContainerLike} ContainerModel - Represents a Container Object Model
*/

/** An abstract CONTAINER Class
    @typedef {{name: string, method: string} & ContainerModel} FormModel - Represents a Container Object Model
    @property {Name} [name] Name
    @property {string} [method] Method
*/

/**
    FORM generators often need to pass on a Container reference
    @typedef {Model & {container: ContainerLike, loader: LoaderLike}} ModelWithContainer - A MODEL requiring a CONTAINER
*/
/**
    @typedef {Model & {loader: LoaderLike}} ModelWithLoader - A MODEL requiring a LOADER
*/
/**
    @typedef {Model & {caller: ContainerLike}} ModelWithCaller - A MODEL requiring a CALLER
*/
/** A Model used to generate a DIALOG
    typedef {{label: string, container: ContainerLike, caller: Model} & Model} DialogModel - Represents a Dialog Model
    @typedef {Object} DialogModel A dialog model
    @property {string} [label="Dialog"] Dialog Label
    @property {string} [text=""] Dialog Text
    @property {boolean} [showHeader="true"] Show/Hide header
    @property {ContainerLike} container Container
    @property {ContainerLike} caller Caller
    @property {LoaderLike} loader Loader
    
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

/** Represents a set of options for a Loader log
    @typedef {Object} MenuOptions Represents a set of options for a Menu
    @property {boolean} canActivate Can be activated
    @property {boolean} scrollIntoView Scrolls into view
*/

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
    @property {Delay} [delay="200"] Single Click Delay
    @property {Delay} [longClickDelay="2000"] Press/Hold duration before long click is triggered
    @property {boolean} [stopPropagation="true"] If true, siblings are deactivated when element is activated
*/

/** Represents a model for a ButtonGroup
    @typedef {Object} ButtonGroupModel Model
    @property {string} [label="buttons"] Label
    @property {string} [align=""] Alignment
    @property {string} [name=""] Name
*/

/** Represents a set of options for a Clickable interface
    @typedef {Object} ButtonAttributes A set of options for a NavItem
    @property {string} [type="BUTTON"] Type ie: BUTTON, RESET, SUBMIT
    @property {string} [title=""] Title text
*/

/** Represents a model for a BUTTON
    @typedef {Object} ButtonModel Model
    @property {string} [label=""] Label
    @property {string} [icon="ICONS.BLANK"] Icon
    @property {ButtonAttributes} [attributes] Button Attributes
*/

/** Represents a set of attributes for an anchor
    @typedef {Object} AnchorAttributes A set of options for an anchor
    @property {string} [href="#"] Anchor target url
    @property {string} [target="_blank"] Anchor target method
*/

/** Represents a model for an Anchor
    @typedef {Object} AnchorModel Model
    @property {IconModel & {label: string}} model
    @property {AnchorAttributes} [attributes] Attributes
*/

/** Represents a model for a FormFooter
    @typedef {Object} FormFooterModel Model
    @property {string} [align="vertical"] Alignment
*/

/** Represents a model for a Group
    @typedef {Object} GroupModel Model
    @property {string} name Group Name
*/

/** Represents a model for an Icon
    @typedef {Object} IconModel Model
    @property {string} icon Icon
*/

/** Represents a model for an Icon
    @typedef {Object} FormPostModel Model
    @property {UId} id Unique Identifier that this FormPost represents
    @property {UId} formId Unique Identifier that this FormPost belongs to
    @property {string} authorId Author Id
    @property {int} shared Shared status
    @property {int} isPublic Public status
    @property {int} status Status
    @property {string} dateCreated Date Created
    @property {string} dateLastModified Date LastModified
    property {object} xmlResults Shared status
    @property {object} jsonResults JSON Results
*/

/** Represents a set of attributes for an IMG Class
    @typedef {Object} ImageAttributes A set of options for an Image
    @property {string} [src=""] Image source url
    @property {string} [class=""] Image class
*/

/** Represents a model for an IMG Class
    @typedef {Object} ImageModel Model
    @property {ImageAttributes} [attributes] Image Attributes
*/

/* Represents a model for a NAVITEM
    @typedef {Object} NavItemModel Model
    @property {string} [label=""] Label
    @property {string} [icon="ICONS.BLANK"] Icon
    @property {EL} [target=""] Switchable EL for NAV related events
    property {NavItemAttributes} [attributes] Button Attributes
*/

/** Represents a model for an Input Class
    @typedef {Object} MainModelz Model
    @property {ContainerModel} model Model
    @property {MainProperties} [attributes] Main Properties
*/

/** An abstract CONTAINER Class
    @typedef {ContainerModel & MainProperties} MainModel - Represents a Container Object Model
*/


/** Represents a set of attributes for an MAIN
    @typedef {Object} MainProperties A set of options for an anchor
    @property {FactoryLike} [factory] Factory
    @property {LoaderLike} [loader] Loader
    @property {URL} [url] Url
*/

/** Represents a model for an Input Class
    @typedef {Object} InputModel Model
    @property {ContainerModel} model Model
    @property {InputAttributes} [attributes] Input Attributes
*/

/** Represents a set of attributes for an input
    @typedef {Object} InputAttributes A set of options for an anchor
    @property {string} [name=""] Name
    @property {string} [type="TEXT"] Type
    @property {string} [class=""] Class Name
    @property {string} [value=""] Value
    @property {string} [readonly="false"] Name
    @property {string} [placeholder=""] Placeholder text
    @property {string} [autocomplete="false"] Enables browser autocomplete
*/

/** Represents a model for a NAVITEM
    @typedef {ButtonModel & {target:EL}} NavItemModel - NavItemModel
*/

/** Represents a model for an IMG Class
    @typedef {Object} NavHeaderModel Model
    @property {string} [label=""] Label
*/

/** Represents a model for an element that contains text
    @typedef {Object} TextModel Model
    @property {string} [text=""] InnerText
*/

////