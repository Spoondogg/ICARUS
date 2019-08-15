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
    @typedef {number} [Delay=0] - Timed delay in milliseconds
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
/** An ICON class identifier
    @typedef {string} Icon - An ICON Class identifier
*/
/** A Key/Value Tuple
    @typedef {[Name, any]} KeyValuePair - Key/Value Pair
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
/** A collection of Attributes
    @typedef {Object} Attributes A collection of Element Attributes
    @property {string} [className] - Element className attribute
	@property {Name} [name] - Element name attribute
    @property {string} [type] - Element type attribute
    @property {any} [value] - Element value attribute
*/
/** A collection of Attributes
    @typedef {Object} Data A collection of Data Attributes
*/
/** A collection of Attributes
    @typedef {Object} ContainerData A collection of ContainerData Attributes
	@property {number} [collapsed] - Element collapsed attribute
    @property {number} [showNav] - Element showNav attribute
    @property {number} [showHeader] - Element showHeader attribute
*/
/** A collection of Attributes
    @typedef {Object} Meta A collection of Meta Attributes
	@property {string} [description] - Element description text
*/
/** Represents a generic Object Element Model
    @typedef {Object} Model An Element MODEL like structure
    @property {Attributes} [attributes] Attributes
    @property {Data} [data] Data
    @property {Meta} [meta] Meta    
*/
/** Represents a generic Object Element Model
    @typedef {Object} ListModel A LIST like structure
    @property {Attributes} [attributes] Attributes
    @property {Data} [data] Data
    @property {Meta} [meta] Meta    
*/
/** Represents a generic EL Model
    @typedef {Object} El An Element MODEL like structure
    @property {string} element HTML Element Tag Name
    @property {string} className HTML Element Class Name
    @property {Array<Model>} [children] Children
    
*/
/** Represents a Controller Class Structure
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
    @typedef {Object} ClassModel A generic Class-like Object Model
    @property {UId} [id] UId
    @property {string} [authorId=null] Author Id
    @property {number} [shared=-1] Shared
    @property {number} [isPublic=1] Public/Viewable status
    @property {string} [status=1] Status
    @property {string} [dateCreated=null] Date Created
    @property {string} [dateLastModified=null] Date LastModified
*/
/** Represents a collection of Container Properties
    @typedef {Object} ContainerProps A collections of Container Properties
    @property {Label} [label=""] Label
    @property {CSV} [subsections] Child Container UIds
    @property {CSV} [tags] Tag UIds
    @property {string} [name=""] Name
    @property {string} [className=null] Model Class Name
    @property {string} [element=null] Model HTML Element
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
    @typedef {ContainerProps & ClassModel & {attributes:Attributes, data:ContainerData, meta:Meta} ContainerModel - Represents a Container Object Model
*/
/** An abstract FORM CONTAINER Class
    @typedef {{name: string, method: string} & ContainerModel} FormModel - Represents a Container Object Model
    @property {Name} [name] Name
    @property {string} [method] Method
*/
/**
    FORM generators often need to pass on a Container reference
    @typedef {ContainerModel & {container: ContainerModel, loader: LoaderLike}} ModelWithContainer - A MODEL requiring a CONTAINER
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
/** ClassIndex Model
    typedef {ContainerModel & {data:SearchData}} ClassIndexModel - ClassIndex Model
    @typedef {ContainerProps & ClassModel & {attributes:Attributes, data:ContainerData & SearchData, meta:Meta} ClassIndexModel - ClassIndex Model
*/
/** FormPostIndex Model
    @typedef {ContainerModel & {data:SearchData}} FormPostIndexModel - FormPostIndexModel Model
*/
/** Represents a set of search options for a ClassIndex
    @typedef {Object} SearchData A set of options for a ClassIndex
    @property {classType} [searchClass="MAIN"] A Class Type / name of Class (ie: CONTAINER, FORMPOST)
    @property {string} [searchType="CLASS"] Optional search Type
    @property {query} [query=""] Optional QueryString / comma delimited list of tags/tag uids
    @property {query} [formId=""] Optional FormPost Form UId
*/
/** Represents a set of options for a Loader log
    @typedef {Object} LoaderLogOptions Represents a set of options for a Loader log
    @property {boolean} show If true, the log will be displayed
    @property {boolean} toConsole If true, logs to console as well
    @property {Delay} delay Delay to hide when value reaches 100 or stay visible if value === 0
    @property {string} type ie success, info, warning, danger
*/
/** Represents a MENU Object Model
    @typedef {{name: Name} & Model} MenuModel Represents a MENU Object Model
*/
/** Represents a set of options for a Loader log
    @typedef {Object} MenuOptions Represents a set of options for a Menu
    @property {boolean} canActivate Can be activated
    @property {boolean} scrollIntoView Scrolls into view
*/
///// CONTAINERTHUMBNAIL
/** Represents a generic Thumbnail Model
    @typedef {Object} ThumbnailModel Represents a generic Thumbnail Model
    @property {UId} id Unique Identifier that this thumbnail represents
    @property {string} label Label
*/
/** Represents a Container Thumbnail Model
    @typedef {Object} ContainerThumbnailModel Represents a set of options for a Container Thumbnail
    @property {UId} id Container UId
    @property {CSV} subsections Delimited list of subsections
    @property {string} authorId Author UId
    @property {string} label Container Label
    @property {string} description Container Description
    @property {CSV} tags Delimited list of tag UIds
    @property {string} key Key - Search Key
    @property {string} value Value - Search Value
    @property {object} jsonResults JSON Results
*/
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
    @typedef {{align:string, name: Name} & Model} ButtonGroupModel Represents a model for a ButtonGroup
*/
/** Represents a set of options for a Clickable interface
    @typedef {Object} ButtonAttributes A set of options for a NavItem
    @property {string} [type="BUTTON"] Type ie: BUTTON, RESET, SUBMIT
    @property {string} [name=""] Name
    @property {string} [title=""] Title
*/
/** Represents a set of options for a Clickable interface
    @typedef {Object} NavItemAttributes A set of options for a NavItem
    @property {string} [name=""] Name
    @property {string} [title=""] Title
    @property {string} [target=""] Target
*/
/** Represents a set of data for an anchor
    @typedef {Object} ButtonData A set of options for an anchor button
    @property {string} [label=""] Label
    @property {string} [icon="ICONS.BLANK"] Icon
*/
/** Represents a set of data for a NavItem
    @typedef {ButtonData} NavItemData A set of options for a navitem
*/
/** Represents a model for a NAVITEM
    @typedef {{attributes:NavItemAttributes, data:NavItemData}} NavItemModel Model
*/
/** Represents a model for a BUTTON
    @typedef {{attributes:ButtonAttributes, data:ButtonData}} ButtonModel Model
*/
/** Represents a set of data for an anchor
    @typedef {{attributes:AAttributes}} AModel A set of options for an anchor A element
*/
/** Represents a set of data for an anchor
    @typedef {Object} AAttributes A set of options for an anchor A element    
    @property {string} [href="#"] Anchor target url
    @property {string} [name=""] Name
    @property {string} [target="_blank"] Target
*/
/** Represents a set of attributes for an anchor
    @typedef {AAttributes} AnchorAttributes A set of options for an anchor
*/
/** Represents a set of data for an anchor
    @typedef {Object} AnchorData A set of options for an anchor
    @property {string} [label=""] Label
    @property {string} [icon="ICONS.BLANK"] Icon
*/
/** Represents a model for an Anchor
    @typedef {{attributes:AnchorAttributes, data:AnchorData}} AnchorModel Model
*/
/** Represents a model for a FormFooter
    @typedef {Object} FormFooterModel Model
    @property {string} [align="vertical"] Alignment
*/
/** Represents a model for a Group
    @typedef {Object} GroupModel Model
    @property {Name} name Group Name
*/
/** Represents a model for an Icon
    @typedef {{attributes:Attributes, data:IconData}} IconModel Model
*/
/** Represents a model for an Icon
    @typedef {AnchorData} IconData Model
*/
/** Represents a model for an Icon
    @typedef {{formId:number} & ClassModel & {jsonResults:object}} FormPostModel Model
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
/** An abstract CONTAINER Class
    @typedef {ContainerModel & MainProperties} MainModel - Represents a Container Object Model
*/
/** Represents a set of attributes for an MAIN
    @typedef {Object} MainProperties A set of options for an anchor
    @property {FactoryLike} [factory] Factory
    @property {LoaderLike} [loader] Loader
    @property {URL} [url] Url
*/
/** Represents a model for an Form Element / Input Class
    @typedef {ContainerModel & {element:string, type:string}} FormElementModel - Represents a FormElement Container Object Model
*/
/** Represents a model for an Input Class
    @typedef {Object} InputModel Model
    @property {string} [element="INPUT"] Element
    @property {InputAttributes} [attributes] Input Attributes
    @property {string} [label] Label
    @property {string} [type="TEXT"] Type // type: type === 'FORMPOSTINPUT' ? 'NUMBER' : type,
    @property {string} [showNav="0"] Show Nav
*/
/** Represents a set of attributes for an input
    @typedef {Object} InputAttributes A set of attributes for an Input
    @property {string} [name=""] Name
    @property {string} [value=""] Value
    @property {string} [type="TEXT"] Type
    @property {string} [readonly="false"] Name
    @property {string} [placeholder=""] Placeholder text
    @property {string} [autocomplete="false"] Enables browser autocomplete
*/
/** Represents a model for a NAVITEM
    @typedef {ButtonModel} NavItemModel - NavItemModel
*/
/** Represents a model for a NAVITEM
    @typedef {NavItemModel & {data:SearchModel}} NavItemSearchModel - NavItemModel
*/
/** Represents a data model for a labeled object
    @typedef {Object} LabeledData Model
    @property {string} [label=""] Label
*/
/** Represents a model for a NavHeader
    @typedef {LabeledData} NavHeaderModel Model
*/
/** Represents a model for a Search Method
    @typedef {Object} SearchModel Model
    @property {string} [searchClass="MAIN"] Class to search/display
    @property {string} [searchType="TAG"] Type/filter to apply to query
    @property {string} [query=""] Search QueryString
    @property {number} [formId="-1"] Optional FormPost Form UId
*/
/** Represents a model for an element that contains text
    @typedef {{attributes:Attributes, data:TextData}} TextModel Model
*/
/** Represents a model for an element that contains text
    @typedef {Object} TextData Model
    @property {string} [text=""] Text / InnerHTML
*/