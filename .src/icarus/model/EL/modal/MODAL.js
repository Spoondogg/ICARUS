/**
    @module
*/
//import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../container/CONTAINER.js';
import BUTTON from '../button/BUTTON.js';
import DIV from '../div/DIV.js';
import HEADER from '../header/HEADER.js';
import WELL from '../p/WELL.js';
/**
    A Bootstrap 3 Modal
    @see https://www.w3schools.com/bootstrap/bootstrap_modal.asp    
    @class
    @extends DIV
*/
export default class MODAL extends DIV { // ALIGN VERTICALLY??
/**
	    Constructs a Modal
	    @param {string} title The header text for this modal
	    @param {string} text The html text that is displayed in the prompt's well
	    @param {boolean} vertical If true, modal is vertically aligned
        @todo There should not be any extentions of CONTAINER.  It is abstract
	*/
constructor(title, text, vertical) {
super(document.body, new MODEL(new ATTRIBUTES({
'class': 'modal fade in',
'role': 'dialog'
})));
// Vertical alignment helper div where required
//this.alignHelper = null;
if (vertical) {
this.alignHelper = new DIV(this, new MODEL('vertical-alignment-helper'));
}
// Dialog inside vertical align helper if set to vertical align
let parentEl = vertical ? this.alignHelper : this;
//let dialogAttr = new ATTRIBUTES('modal-dialog');
this.dialog = new DIV(parentEl, new MODEL('modal-dialog' + vertical ? ' vertical-align-center' : ''));
//if (vertical) {
//this.dialog.addClass('vertical-align-center');
//}
// If modal is vertically aligned, set class accordingly
//if (vertical) { parentEl.dialog.addClass('vertical-align-center'); }
// If vertical, margin must be set to auto
this.content = new DIV(this.dialog, new MODEL(new ATTRIBUTES('modal-content')));
/*if (vertical) {
	this.content.el.setAttribute('style', 'margin: 0 auto;');
}*/
this.header = this.createModalHeader(title);
// A well containing various alerts        
if (text) {
this.well = new WELL(this.content, new MODEL(), text);
}
this.container = new CONTAINER(this.content, 'DIV', new MODEL(new ATTRIBUTES('modal-body')).set({
'label': 'Modal Body',
'showHeader': 0
}));
// Footer : Contains options to save or cancel out of form
this.footer = new DIV(this.content, new MODEL(new ATTRIBUTES('modal-footer')));
this.footer.btnClose = new BUTTON(this.footer, new MODEL(new ATTRIBUTES({
'class': 'btn btn-default btn-block',
'data-dismiss': 'modal',
'aria-hidden': 'true'
})), 'Close');
try {
this.footer.btnClose.el.onclick = () => {
this.hide(1000, true);
};
} catch (e) {
console.log('No footer exists for this modal', this, e);
}
}
/**
    Creates a generic Modal header with close button
    @param {string} title The Header Title Text
    @returns {DIV} A generic Modal Header
*/
createModalHeader(title) {
let header = new DIV(this.content, new MODEL(new ATTRIBUTES('modal-header')));
header.btnClose = new BUTTON(header, new MODEL(new ATTRIBUTES({
'class': 'close',
//'type': 'BUTTON',
'data-dismiss': 'modal',
'aria-hidden': 'true'
})), 'x');
header.main = new HEADER(header, new MODEL('modal-title'));
//this.header.main.addClass('modal-title');
header.text = new DIV(header.main, new MODEL(), title);
try {
header.btnClose.el.onclick = this.close.bind(this);
} catch (ee) {
console.log('Unable to add close to modal', this, ee);
}
return header;
}
/**
    Set Global Modal animation for show/hide
    @returns {void}
*/
setModalAnimation() {
$(this.el).on('show.bs.modal', () => {
$('.modal .modal-dialog').addClass('fadeOut').removeClass('fadeIn');
});
$(this.el).on('hide.bs.modal', () => {
$('.modal .modal-dialog').addClass('fadeIn').remove('fadeOut');
});
}
/**
	    Scrolls to top
        @returns {void}
	*/
scrollUp() {
//alert('scroll to top');
this.el.scrollTop = 0;
}
/**
	    Reveal the modal
        @returns {ThisType} Returns MODAL for method chaining
	*/
show() {
$(this.el).modal('show');
return this;
}
/**
	    Hide the modal // and remove from DOM
	    @param {number} delay Millisecond delay
	    @param {boolean} destroy If true, this modal is destroyed
        @returns {void}
	*/
hide(delay = 1000, destroy = false) {
try {
setTimeout(function() {
$(this.el).modal('hide');
$('.modal-backdrop').animate({ opacity: 'toggle' }, 0).remove();
if (destroy) {
this.destroy(delay);
}
}.bind(this), delay);
} catch (e) {
console.log(e);
}
}
/**
	    Sets the text to prompt well
	    @param {string} text The text contained within the prompt's well
        @returns {void}
	*/
setText(text) {
if (text) {
this.well.el.innerHTML = text;
}
}
/**
    Modals can not return a Container. 
    @returns {null} A modal can not return a Container
*/
getContainer() {
console.warn('You are attempting to get the Container of a modal, however a Modal does not have a parent Container because it belongs to document.body');
return null;
}
}
export { ATTRIBUTES, BUTTON, DIV, EL, MODAL, MODEL };