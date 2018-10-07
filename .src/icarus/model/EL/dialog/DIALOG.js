/**
    @module
*/
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import BUTTON from '../button/BUTTON.js';
import DIV from '../div/DIV.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
/**
    An HTML5 Dialog Element (Only supported in Chrome as of 2018-09-28)
    @class
    @extends EL
    @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    @see https://webdesign.tutsplus.com/tutorials/native-popups-and-modals-with-the-html5-dialog-element--cms-23876
    @see https://github.com/GoogleChrome/dialog-polyfill
    @see https://keithjgrant.com/posts/2018/01/meet-the-new-dialog-element/
*/
export default class DIALOG extends EL {
/**
    Constructs a generic A (anchor) Element
    @constructs A
    @param {EL} node The object to contain this element
    @param {MODEL} model The object model
 */
constructor(model) {
super(document.body, 'DIALOG', model);
//this.setInnerHTML(model.text + '<br>' + model.token);
this.header = new HEADER(this, new MODEL('modal-header'));
this.body = new DIV(this, new MODEL('modal-body'));
this.body.setInnerHTML(model.text);
this.footer = new FOOTER(this, new MODEL('modal-footer'));
this.btnClose = new BUTTON(this.footer, new MODEL()).el.onclick = () => {
this.close();
}
//this.token = model.token;
/*
<dialog id="demo-modal">
  <h3 class="modal-header">A native modal dialog box</h3>
  <div class="modal-body">
    <p>Finally, HTML has a native dialog box element! This is fantastic.</p>
    <p>And a polyfill makes this usable today.</p>
  </div>
  <footer class="modal-footer">
    <button id="close" type="button">close</button>
  </footer>
</dialog>
*/
}
/**
    Makes modal appear (adds `open` attribute)
    @returns {void}
*/
show() {
this.el.showModal();
}
/**
    Hides the modal
    @returns {void}
*/
close() {
this.el.close();
}
}
export { ATTRIBUTES, EL, MODEL };