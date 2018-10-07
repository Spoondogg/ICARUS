/**
    @module
*/
import GROUP, { ATTRIBUTES, EL, MODEL } from '../group/GROUP.js';
//import PROMPT, { MODAL } from '../modal/prompt/PROMPT.js';
import AbstractMethodError from '../../../error/AbstractMethodError.js';
import CONTAINERBODY from './CONTAINERBODY.js';
//import CONTAINERFACTORY from './CONTAINERFACTORY.js';
import { DATAELEMENTS } from '../../../enums/DATAELEMENTS.js';
import DIALOG from '../dialog/DIALOG.js';
//import FORM, { FORMINPUT, INPUTTYPES } from '../container/form/FORM.js';
import { ICONS } from '../../../enums/ICONS.js';
import { INPUTTYPES } from '../../../enums/INPUTTYPES.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import { STATUS } from '../../../enums/STATUS.js';
/**
    An abstract Container element with NAVBAR
    @description A container can be expanded or hidden and have elements added to itself
    @class
    @extends GROUP
*/
export default class CONTAINER extends GROUP {
/**
    @constructs CONTAINER
    @param {EL} node The element to contain the section
    @param {string} element HTML element
    @param {MODEL} model The CONTAINER object retrieved from the server
    @param {array} containerList An array of strings representing child Containers that this Container can create
 */
constructor(node, element, model = new MODEL().set({
element, //'element': 
'name': element || '',
'label': element,
'shared': 1
}), containerList = []) {
super(node, element, model);
//console.log('CONTAINER{' + this.className + '}');
this.addClass('icarus-container');
//this.isContainer = 1;
this.dataElements = DATAELEMENTS[this.className];
this.attrElements = [];
// Eventually, this needs to go.  I don't like cluttering up the DOM with attributes
if (model.id) {
this.el.setAttribute('id', model.id);
}
/**
    @property {number} shared If shared == 1
*/
//this.shared = this.shared ? this.shared : 1;
this.shared = this.shared || 1;
/**
    @property {PROMPT} prompt A local PROMPT
    @type {PROMPT}
    @todo This should really only be needed in the MAIN Container.  
    There should never be more than one prompt in the DOM.
    Consider creating a queue to hold multiple prompts
		
this.prompt = null;*/
this.updateUrl = this.element + '/Set'; // model.className should be the actual value, no?                
this.subsections = model.subsections ? model.subsections.split(',') : '0'; // Delimited list of child ids
this.navBar = this.createDraggableNavBar();
this.body = new CONTAINERBODY(this, model);
this.addNavBarDefaults();
this.addDefaultContainers(containerList);
this.setDefaultVisibility(model);
if (this.className !== 'CONTAINER') {
this.construct();
}
}
/** 
	    Abstract construct method throws an error if not declared 
	    @abstract
        @returns {void}
	*/
construct() {
if (this.className !== 'CONTAINER') {
throw new AbstractMethodError('CONTAINER{' + this.className + '} : Abstract method ' + this.className + '.construct() not implemented.');
}
}
/**
    The default visibility state for menus and collapseable content
    @param {MODEL} model The CONTAINER object retrieved from the server
    @returns {void}
*/
setDefaultVisibility(model) {
this.expand(); // Collapse or Expand Body Pane
if (model.dataId > 0) {
if (model.data.collapsed) {
this.collapse();
}
if (model.data.showNavBar) {
this.showNavBar();
}
}
}
/**
    Adds the default Container Cases to the CRUD Menu
    @param {Array} containerList An array of container class names
    @returns {void}
*/
addDefaultContainers(containerList) {
let defaultContainers = ['IFRAME', 'FORM', 'LIST', 'MENULIST', 'JUMBOTRON', 'BANNER', 'PARAGRAPH', 'CHAT'];
containerList.splice(2, 0, ...defaultContainers);
for (let c = 0; c < containerList.length; c++) {
this.addContainerCase(containerList[c]);
}
}
/**
    Drag containers by their NavBars
    @see https://www.w3schools.com/jsref/event_ondrag.asp
    @param {string} label The header text
    @returns {NAVBAR} A draggable navbar
*/
createDraggableNavBar(label) {
let navBar = new NAVBAR(this, new MODEL().set({
'label': this.label // model.label
}));
navBar.el.setAttribute('draggable', true);
navBar.el.ondragstart = (ev) => {
console.log('Dragging Container: ' + this.className + '(' + this.id + ') ' + this.label);
this.collapse();
ev.dataTransfer.setData("Container", this.id);
};
// Drop the Container
navBar.el.ondrop = (ev) => {
console.log('Dropping onto Container: ' + this.className + '(' + this.id + ')');
ev.preventDefault();
//var containerId = ev.dataTransfer.getData("Container");
//console.log(data);    
let container = $(document.getElementById(ev.dataTransfer.getData("Container")));
container.insertBefore(this.el);
container.collapse('show');
/*
setTimeout(function () {
    console.log('QuickSaving drop recipient parent ' + this.className + '(' + this.id + ')');
    this.getProtoTypeByClass('CONTAINER').quickSave(false); // QuickSave Parent
}.bind(this), 500);
*/
console.log('You should save your changes');
};
// Allow drop on this Container
navBar.el.ondragover = (ev) => {
//console.log('Dragging over ' + this.className + '(' + this.id + ')');
ev.preventDefault();
};
navBar.el.ondragend = () => { //this.navBar.el.ondragend = (ev) => {
// Drag Ending
};
return navBar;
}
/**
    HTML Encode the given value.

    Create a in-memory div, set it's inner text(which jQuery automatically encodes
    then grab the encoded contents back out.  The div never exists on the page.

    TODO: This really should just be an extention of the String class

    @param {any} value The string to be html encoded
    @returns {text} An html encoded string
 */
htmlEncode(value) {
return $('<div/>').text(value).html();
}
/**
    Decodes an HTML encoded value back into HTML string

    TODO: This really should just be an extention of the String class

    @param {any} value An html encoded string
    @returns {string} A string that was previously html encoded
 */
htmlDecode(value) {
return $('<div/>').html(value).text();
}
/**
    Moves this element UP one slot
    @returns {ThisType} This Container
*/
moveUp() {
console.log('Move Up');
let node = $(this.el);
if (node.prev().length > 0) {
node.animate({ height: 'toggle' }, 300);
setTimeout(() => {
node.prev().animate({ height: 'toggle' }, 300).insertAfter(node).animate({ height: 'toggle' }, 300);
}, 0);
setTimeout(() => {
node.animate({ height: 'toggle' }, 300).delay(300);
}, 300);
}
return this;
}
/**
    Moves this element DOWN one slot
    @returns {ThisType} This Container
*/
moveDown() {
console.log('Move Down');
let node = $(this.el);
if (node.next().length > 0) {
node.animate({ height: 'toggle' }, 300);
setTimeout(() => {
node.next().animate({ height: 'toggle' }, 300).insertBefore(node).animate({ height: 'toggle' }, 300).delay(300);
}, 0);
setTimeout(() => {
node.animate({ height: 'toggle' }, 300);
}, 300);
}
return this;
}
/**
	    Empties the Container Pane and reconstructs its contents 
	    based on the current model
        @returns {void}
	*/
refresh() {
console.log(0, 'Refreshing CONTAINER{' + this.className + '}[' + this.id + ']');
this.body.pane.empty();
this.construct();
this.populate(this.body.pane.children);
}
/**
	    Shows the Container NavBar
        @returns {void}
	*/
showNavBar() {
$(this.navBar.el).collapse('show');
}
/**
	    Adds default DOM, CRUD and ELEMENT Nav Items to the Option Menu
        @returns {void}
	 */
addNavBarDefaults() {
if (this.navBar.header.menu) {
/** DOM ACTIONS **/
let domGroup = this.navBar.header.menu.getGroup('DOM');
domGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.UP,
'label': 'UP'
})
})).el.onclick = this.moveContainerUp.bind(this);
domGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.DOWN,
'label': 'DOWN'
})
})).el.onclick = this.moveContainerDown.bind(this);
domGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.REFRESH,
'label': 'REFRESH'
})
})).el.onclick = this.refresh.bind(this);
domGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.DELETE,
'label': 'REMOVE'
})
})).el.onclick = this.remove.bind(this);
domGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.EXCLAMATION,
'label': 'DELETE'
})
})).el.onclick = this.disable.bind(this);
/* CRUD ACTIONS */
let crudGroup = this.navBar.header.menu.getGroup('CRUD');
crudGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.LOAD,
'label': 'LOAD'
})
})).el.onclick = this.load.bind(this);
// Add items to Options Dropdown Tab
this.btnSave = crudGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.SAVE,
'label': 'SAVE'
})
}));
this.btnSave.el.onclick = this.createWrappedSaveForm.bind(this);
this.btnQuickSave = crudGroup.addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS.SAVE,
'label': 'QUICKSAVE'
})
}));
this.btnQuickSave.el.onclick = this.quickSave.bind(this);
}
}
/**
	    Moves the Container up one slot in the DOM
        @returns {void}
	*/
moveContainerUp() {
this.navBar.header.toggleCollapse();
this.moveUp();
}
/**
	    Moves the Container down one slot in the DOM
        @returns {void}
	*/
moveContainerDown() {
this.navBar.header.toggleCollapse();
this.moveDown();
}
/**
	    Creates a save form for this Container and places it in a wrapper
	    inside the CRUD Group
        @returns {void}
	*/
createWrappedSaveForm() {
this.btnSave.toggle('active');
// CREATE A TEMPORARY wrapper to hold the SAVE FORM
if ($(this.btnSave.el).hasClass('active')) {
let node = this.navBar.header.menu.getGroup('CRUD').wrapper;
this.btnSave.wrapper = new EL(node, 'DIV', new MODEL(new ATTRIBUTES('collapse in wrapper')));
this.save(this.btnSave.wrapper);
} else {
console.log(0, 'Closing ' + this.className + '.save() form.');
let wrp = this.navBar.header.menu.getGroup('CRUD').el.nextElementSibling;
try {
$(wrp).collapse('toggle');
setTimeout(() => {
wrp.parentNode.removeChild(wrp);
}, 2000);
} catch (e) {
console.log('Unable to destroy this', e);
}
}
}
/**
    Performs JQuery's ajax method to the given url.
    @param {string} url Target url
    @param {string} type HTTP Method (GET,PUT,POST,DELETE)
    @param {FormPost} formPost Data to be sent to the server
    param {function} success Function to be called on success
    @returns {{}} payload
*/
ajax(url, type, formPost) { // success
return $.ajax({
url,
type, //ie: POST
async: true,
data: formPost,
success: (result) => result
});
}
/**
	    Adds the Construct 'element' button to the options menu
	    @param {string} className Element constructor class name
        @returns {void}
	*/
addConstructElementButton(className) {
if (this.navBar.header.menu) {
this.navBar.header.menu.getGroup('ELEMENTS').addNavItemIcon(new MODEL().set({
'anchor': new MODEL().set({
'icon': ICONS[className],
'label': className //'Create ^'
})
})).el.onclick =
/**
				    Makes a Promise to perform Container.create() with the
				    response (MODEL) and performs a QuickSave on the parent Container
                    @see https://scotch.io/tutorials/javascript-promises-for-dummies
                    @see https://developers.google.com/web/fundamentals/primers/promises
				*/
() => {
this.navBar.header.toggleCollapse();
let promise = new Promise((resolve, reject) => {
console.log('Promise');
// do a thing, possibly async, then…
let result = this.create(new MODEL().set({
className
}));
console.log('Promise', result);
if (result === null) {
reject(Error('Failed to create element'));
} else {
resolve(result); // Successfully created Element
}
});
promise.then((result) => {
console.log('promise success', result);
this.quickSave(true);
}, (err) => {
console.log('promise fail', err); // Error: "It broke"
});
};
}
}
/**
	    Performs addCase() for the given Element within a 
	    Container of an element that extends Container

	    Sets the constructor callback for this element
	    and adds respective button to this container

	    @param {string} className ie SECTION or FORM
        param {CONTAINERFACTORY} factory A Container Factory
	    @param {boolean} addButton If false, no button is created

        @returns {void}
	*/
addContainerCase(className, addButton = true) {
try {
if (typeof this.getMainContainer() !== 'undefined') {
this.addCase(className, function(model) {
console.log(this.className + ': CALLING CASE: ' + className);
try {
return this.factory.get(this.body.pane, className, model.id || 0);
} catch (ee) {
console.warn('Unable to retrieve factory for Container Case', ee);
}
}.bind(this)); // CONTAINERFACTORY
if (addButton) {
this.addConstructElementButton(className);
}
}
} catch (e) {
console.warn(this.className + ': Unable to add Container Case', e);
}
}
/**
	    Overrides EL.open();
	    Opens the CONTAINER up for editing.  This should create a link
	    between the object on the server and its client side representation
        @returns {void}
	*/
open() {
try {
this.status = STATUS.OPEN;
super.open();
this.el.setAttribute('data-status', 'open');
this.header.btnLock.icon.el.className = ICONS.UNLOCK;
this.header.options.el.removeAttribute('disabled');
} catch (e) {
console.log('Unable to open parent.', e);
}
}
/**
	    Closes the CONTAINER up for editing.  This should create a link
	    between the object on the server and its client side representation
	    and update accordingly
        @returns {void}
	*/
close() {
console.log('Locking ' + this.element + '(' + this.getId() + ')');
this.status = STATUS.CLOSED;
this.node.close();
this.el.setAttribute('data-status', 'closed');
// If section is open and we are trying to lock, we must first lock the children
console.log(this.element + ' has ' + this.children.length + ' child(ren)');
for (let s = 0; s < this.children.length; s++) {
if (this.children[s].status === STATUS.OPEN) {
this.children[s].close();
}
}
console.log('Children are closed. Closing ' + this.element + '(' + this.getId() + ')');
this.header.btnLock.icon.el.className = ICONS.LOCK;
$(this.header.btnLock.el).removeClass('active');
this.header.options.el.setAttribute('disabled', 'disabled');
console.log('Locked');
}
/**
    Returns the CONTAINER's name attribute
    @returns {string} Container name
*/
getId() {
return this.el.getAttribute('id');
}
/**
	    Sets the CONTAINER's ID
	    @param {number} id Container database Id
        @returns {void}
	*/
setId(id) {
this.id = id;
this.el.setAttribute('id', id);
this.data.id = id;
this.attributes.id = id;
}
/**
    Returns the CONTAINER's name attribute
    @returns {string} Container name
*/
getName() {
return this.el.getAttribute('name');
}
/**
	    Sets the name of this element to the given value.
	    @param {string} name The name to be set
        @returns {void}
	*/
setName(name) {
this.el.setAttribute('name', name);
this.model.name = name;
}
/**
	    Collapses the container's body
	    @returns {boolean} true if hidden
        @returns {void}
	*/
collapse() {
try {
$(this.body.el).collapse('hide');
return true;
} catch (e) {
console.log(e);
return false;
}
}
/**
	    Expands the container's body
        @returns {void}
	*/
expand() {
try {
$(this.body.el).collapse('show');
} catch (e) {
console.warn(e);
}
}
/**
	    Toggles the collapsed state of the container's body
        @returns {void}
	 */
toggleBody() {
$(this.body.el).collapse('toggle');
}
/**
	    An abstract load method for a CONTAINER
        @abstract
        @returns {void}
	 */
load() {
//let modal = new MODAL('Select A Form Group', 'Choose from the following...');
//modal.show();
throw new AbstractMethodError('CONTAINER{' + this.className + '}.load() : Abstract method ' + this.className + '.load() not implemented.');
}
/**
	    Saves the state of this Element
	    @param {EL} node The parent container to hold the save menu
        @returns {void}
	 */
save(node) {
console.log(this.element + '.save()');
let subsections = this.getSubSections(); // Populate subsections with elements in this body
let form = FORM.createEmptyForm(node, false);
form.addClass('saveContainer');
form.setPostUrl(this.className + '/Set');
let inputs = [
new MODEL(new ATTRIBUTES({
'name': 'element',
'value': this.get('element'),
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'element'
}),
new MODEL(new ATTRIBUTES({
'id': 0,
'name': 'id',
'value': this.get('id').toString(),
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'ID'
}),
new MODEL(new ATTRIBUTES({
'name': 'label',
'value': typeof this.get('label') === 'object' ? this.get('label').el.innerHTML : this.get('label')
})).set({
'element': 'INPUT',
'label': 'Label'
}),
new MODEL(new ATTRIBUTES({
'name': 'subsections',
'value': subsections.length > 0 ? subsections.toString() : '0',
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'SubSections'
}),
// Should be checkbox or dropdown
new MODEL(new ATTRIBUTES({
'name': 'status',
'type': 'NUMBER',
'value': this.get('status').toString()
})).set({
'element': 'INPUT',
'label': 'Status',
'addTab': 0
}),
// FORMPOSTINPUT
new MODEL(new ATTRIBUTES({
'name': 'dataId',
'type': 'NUMBER',
'value': this.get('dataId').toString()
})).set({
'element': 'BUTTON',
'label': 'dataId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
// FORMPOSTINPUT
new MODEL(new ATTRIBUTES({
'name': 'attributesId',
'type': 'NUMBER',
'value': this.get('attributesId').toString()
})).set({
'element': 'BUTTON',
'label': 'attributesId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
// FORMPOSTINPUT
new MODEL(new ATTRIBUTES({
'name': 'descriptionId',
'type': 'NUMBER',
'value': this.get('descriptionId').toString()
})).set({
'element': 'BUTTON',
'label': 'descriptionId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
new MODEL(new ATTRIBUTES({
'name': 'shared',
'type': 'NUMBER',
'value': this.get('shared').toString() || '1'
})).set({
'element': 'BUTTON',
'label': 'shared',
'addTab': 0
})
];
form.fieldset.formElementGroup.addInputElements(inputs);
/*
    Restore Container View to defaults and refresh parent Container
*/
form.afterSuccessfulPost = () => {
this.setLabel(form.el.elements.label.value);
try {
this.getMainContainer().focusBody();
this.getMainContainer().loader.hide();
} catch (e) {
console.log(e);
}
try {
this.getContainer().refresh();
} catch (e) {
//console.log('Unable to reload Container);
//location.reload(true);
this.getMainContainer().refresh();
}
};
$(node.el).collapse('show');
return form;
}
/**
     Generates an array of subsection Ids for this Container
     @returns {array} A collection of subsection ids
 */
getSubSections() {
let id = null;
let subsections = [];
for (let c = 0; c < this.body.pane.el.children.length; c++) {
id = parseInt(this.body.pane.el.children[c].id);
if (!isNaN(id)) {
subsections.push(id);
}
}
return subsections;
}
/**
    Returns the parent container for this container or null if it does not exist
    @returns {CONTAINER} The parent container for this container
*/
getContainer() {
return this.container;
}
/**
    Returns the MAIN container
    @returns {CONTAINER} The MAIN Container
    @throws Will throw an error 
*/
getMainContainer() {
try {
return this.getProtoTypeByClass('MAIN');
} catch (e) {
switch (this.getProtoTypeByClass('MODAL').className) {
case 'LOADER':
console.warn('Modals exist in body.document and do not have a parent Container');
break;
default:
console.log(this.className + ' does not have a parent Container.', this, this.getProtoTypeByClass('MODAL'));
}
//return null;
//console.log('CONTAINER.getMainContainer() caught an error');
//throw e;
}
}
/**
    Retrieves the application {@link PROMPT}
    @returns {PROMPT} The application prompt
    @throws Will throw an error if unable to retrieve the application prompt
*/
getPrompt() {
try {
return this.getMainContainer().prompt;
} catch (e) {
console.warn('Unable to retrieve the application prompt');
throw e;
}
}
/**
	    If dataId or attributesId exists, extract the appropriate values
	    @param {number} modelId The object's unique identifier
	    @param {object} data The object to be saved
        @returns {void}
	*/
quickSaveFormPost(modelId, data) {
console.log('QuickSaveFormPost:' + modelId, data);
if (modelId > 0) {
console.log(50, 'Saving FormPost: ' + modelId);
let form = FORM.createEmptyForm(this, true);
let inputs = [];
console.log('Adding data attributes');
for (let key in data) {
if (Reflect.call(data, key)) { // if (Object.prototype.hasOwnProperty.call(data, key)) {
console.log('Key', key);
console.log('Value', this.htmlEncode(data[key]));
inputs.push(new MODEL(new ATTRIBUTES({
'name': key,
'value': this.htmlEncode(data[key]) //value
})).set({
'element': 'INPUT',
'label': key,
'addTab': 0
}));
}
}
form.fieldset.formElementGroup.addInputElements(inputs);
form.setPostUrl('FormPost/Set');
form.post();
form.afterSuccessfulPost = () => {
form.destroy();
console.log('FormPost: ' + modelId + ' has been quicksaved');
};
} else {
console.log('No modelId provided');
}
}
/**
    Displays a prompt that performs a save of the container, it's 
    attributes and any data objects associated with it.

    @param {BOOLEAN} noPrompt If false (default), no prompt is displayed
    @returns {BOOLEAN} True if successful
 */
quickSave(noPrompt = false) {
if (noPrompt || confirm('Quick Save ' + this.className + '(' + this.id + ') : ' + this.label + ' ?')) {
//console.log(this.className + '.save()', this);
// Populate subsections with elements in this body
let subsections = this.getSubSections();
let form = FORM.createEmptyForm(this, true);
form.fieldset.formElementGroup.addInputElements([
new MODEL(new ATTRIBUTES({
'name': 'element',
'value': this.get('element'),
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'element'
}),
new MODEL(new ATTRIBUTES({
'id': 0,
'name': 'id',
'value': this.get('id').toString(),
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'ID'
}),
new MODEL(new ATTRIBUTES({
'name': 'label',
'value': typeof this.get('label') === 'object' ? this.get('label').el.innerHTML.toString() : this.get('label').toString()
})).set({
'element': 'INPUT',
'label': 'Label'
}),
new MODEL(new ATTRIBUTES({
'name': 'subsections',
'value': subsections.length > 0 ? subsections.toString() : '0',
'readonly': 'readonly'
})).set({
'element': 'INPUT',
'label': 'SubSections'
}),
// Should be checkbox or dropdown
new MODEL(new ATTRIBUTES({
'name': 'status',
'type': 'NUMBER',
'value': this.get('status').toString()
})).set({
'element': 'INPUT',
'label': 'Status',
'addTab': 0
}),
new MODEL(new ATTRIBUTES({
'name': 'dataId',
'type': 'NUMBER',
'value': this.get('dataId').toString()
})).set({
'element': 'BUTTON',
'label': 'dataId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
new MODEL(new ATTRIBUTES({
'name': 'attributesId',
'type': 'NUMBER',
'value': this.get('attributesId').toString()
})).set({
'element': 'BUTTON',
'label': 'attributesId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
new MODEL(new ATTRIBUTES({
'name': 'descriptionId',
'type': 'NUMBER',
'value': this.get('descriptionId').toString()
})).set({
'element': 'BUTTON',
'label': 'descriptionId',
'type': 'FORMPOSTINPUT',
'addTab': 0
}),
new MODEL(new ATTRIBUTES({
'name': 'shared',
'type': 'NUMBER',
'value': this.get('shared').toString()
})).set({
'element': 'BUTTON',
'label': 'shared',
'addTab': 0
})
]);
form.setPostUrl(this.className + '/Set');
form.post();
form.afterSuccessfulPost = () => {
this.setLabel(form.el.elements.label.value);
form.destroy();
this.quickSaveFormPost(this.dataId, this.data);
this.quickSaveFormPost(this.attributesId, this.attributes);
};
console.log(100, 'Quick Save Complete');
return true;
}
/*else {
	console.log('Quick Save Cancelled');
	return false;
}*/
}
/**
    Attempts to have the direct parent Container of this Container perform
    a QuickSave
    @returns {Boolean} Returns true if successful
*/
quickSaveParent() {
try {
return this.container.quickSave(false);
} catch (e) {
console.log('Container.QuickSaveParent() No parent exists');
return false;
}
}
/**
	    Actions performed after this container is saved
	    @param {EL} node Parent node
	    @param {EL} caller This
        @returns {void}
	 */
afterSuccessfulPost(node, caller) {
console.log(100, 'Successful Post', node, caller);
}
/**
    Returns the label for this section
    @returns {string} The label
*/
getLabel() {
return this.header.getLabel();
}
/**
	    Sets the label of this element to the given value.
	    @param {string} label The name to be set
        @returns {void}
	*/
setLabel(label) {
this.navBar.header.tab.anchor.setInnerHTML(label);
this.label = label;
}
/**
	    Sets the subsection array to the given value
	    @param {array} subsections Sub Section UID array
        @returns {void}
	*/
setSubSections(subsections) {
this.model.subsections = subsections;
}
/**
	    Toggles visibility of any child Container Headers
        @returns {void}
	 */
toggleHeaders() {
$(this.el).find('.icarus-container nav.navbar-nav').toggle();
}
/**
	    Updates the model
	    @param {any} payload Data returned by server
        @returns {void}
	 */
updateModel() { //payload
//console.log('updatemodel');
//this.setName(payload.name);
//this.setLabel(payload.label);
//this.setSubSections(payload.subsections);
}
/**
	    Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
	    Optionally, this should also delete the object from the database
        @returns {void}
	*/
remove() {
let label = 'Remove ' + this.className + '{' + this.element + '}[' + this.id + ']';
let text = 'Remove ' + this.className + ' from ' + this.node.node.node.className + '?';
try {
/*
            let dialog = new PROMPT(label, text, [], [], true); // label, text, buttons, inputs, vertical            
			dialog.form.footer.buttonGroup.children[0].setLabel('Remove', ICONS.REMOVE);
			dialog.form.footer.buttonGroup.children[0].el.onclick = () => {
				this.destroy();
				this.prompt.hide();
			};
			dialog.show();
            */
let dialog = new DIALOG(new MODEL().set({
'text': 'woot',
'token': this.getMainContainer().getToken()
}));
dialog.show();
} catch (e) {
console.log('Unable to disable this ' + this.element, e);
}
}
/**
	    Typically this function is used within JQuery posts.
	    If the results are a Payload and its status is "success",
	    the page is reloaded.

	    @param {object} payload A post payload
	    @param {any} status Result status
        @returns {void} 
	*/
ajaxRefreshIfSuccessful(payload, status) {
console.log('ajaxRefreshIfSuccessful: Payload', payload, 'status', status);
if (payload.result) { //!== 0
let url = new URL(window.location.href);
let returnUrl = url.searchParams.get('ReturnUrl');
if (returnUrl) {
returnUrl = url.origin + returnUrl;
location.href = returnUrl;
} else {
location.reload(true);
}
} else {
console.log('Login failed. (err_' + status + ')', payload.message);
console.log('Failed to POST results to server with status: "' + status + '"', payload);
}
}
/**
	    Creates a PROMPT and if user permits, deletes this CONTAINER from the DOM.
	    Optionally, this should also delete the object from the database
        @returns {void}
	*/
disable() {
let label = 'Disable ' + this.className + '{' + this.element + '}[' + this.id + ']';
let text = 'Disable ' + label + ' in the Database?<br>This ' + this.className + ' will be permenantly deleted from database in X days!!!';
//let container = this.getContainer();
//let main = container.getMainContainer();
let token = this.getMainContainer().getToken();
//console.log('Token', token);
try {
this.prompt = new PROMPT(label, text, [], [], true);
this.prompt.form.footer.buttonGroup.children[0].setLabel('Disable', ICONS.REMOVE);
this.prompt.form.footer.buttonGroup.children[0].el.onclick = () => {
this.destroy();
this.prompt.hide();
console.log('TODO: Disable method on Container controller.');
console.log(100, 'Disabling ' + this.className);
$.post('/' + this.className + '/Disable/' + this.id, {
'__RequestVerificationToken': token //token.value
}, this.ajaxRefreshIfSuccessful);
console.log(100, 'Disable Complete');
};
this.prompt.show();
} catch (e) {
console.log('Unable to disable this ' + this.element, e);
}
}
}
export { ATTRIBUTES, DATAELEMENTS, DIALOG, INPUTTYPES, EL, ICONS, MODEL };