/**
    @module
*/
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../../CONTAINER.js';
import BUTTONGROUP from '../../../group/buttongroup/BUTTONGROUP.js';
import HEADER from '../../../header/header.js';
import { ICONS } from '../../../../../enums/ICONS.js';
import IMG from '../../../img/IMG.js';
import MODAL from '../../../modal/MODAL.js';
import P from '../../../p/P.js';
/**
    Jumbotron with centered icon and text
    @class
    @extends CONTAINER
*/
export default class THUMBNAIL extends CONTAINER {
/**
    Constructs a Bootstrap Jumbotron.
    @param {CONTAINER} node The model
     @param {MODEL} model Object Model
 */
constructor(node, model) {
super(node, 'DIV', model);
this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0'); // Override icarus-container 
this.body.pane.addClass('thumbnail');
//this.image = new IMG(this.body.pane, new MODEL());
//this.construct();
//this.populate(model.children);
}
construct() {
this.image = new IMG(this.body.pane, new MODEL());
this.header = new HEADER(this.body.pane, new MODEL().set({ 'label': this.data.header }));
this.p = new P(this.body.pane, new MODEL(), String(this.data.p).truncate(128));
this.buttonGroup = new BUTTONGROUP(this.body.pane, 'btn-block');
this.button = this.buttonGroup.addButton('', ICONS.CHEVRON_RIGHT);
this.button.addClass('btn-block');
if (this.dataId > 0 || this.dataId === -1) {
let parsed = null;
if (this.data.img) {
// If this.data.img is integer, retrieve relevant formpost
if (Number.isInteger(parseInt(this.data.img))) {
// Test to see if the formpost can be retrieved
try {
$.getJSON('/FORMPOST/Get/' + parseInt(this.data.img), (data) => { // If access granted...
if (data.model) {
if (data.model.jsonResults) {
parsed = JSON.parse(data.model.jsonResults);
// Extract the base64 values and create an image
let img = {};
for (let p = 0; p < parsed.length; p++) {
img[parsed[p].name] = parsed[p].value;
}
try {
//this.image.el.src = img['base64'];
this.image.el.src = img.base64;
} catch (ee) {
console.log('Unable to set Thumbnail image', img);
}
// Set text in Thumbnail when required (see ImageGallery.js)
if (this.data.showImageDetails) {
try {
//this.image.el.src = img['base64'];
//this.header.el.innerHTML = img['filename'];
this.header.el.innerHTML = img.filename;
//this.p.el.innerHTML = 'Id: ' + img['id'] + '<br>' + 'Filesize: ' + img['fileSize'] + 'kb (' + img['dimX'] + ' x ' + img['dimY'] + ')<br>' + img['fileType'];
this.p.el.innerHTML = 'Id: ' + img.id + '<br>Filesize: ' + img.fileSize + 'kb (' + img.dimX + ' x ' + img.dimY + ')<br>' + img.fileType;
} catch (ee) {
console.log('Unable to set Thumbnail attributes', img);
}
}
} else {
console.log('Json Results empty');
}
}
});
} catch (e) {
console.log('Unable to retrieve FormPost.', e);
}
} else {
this.image = new IMG(this.body.pane, new MODEL(new ATTRIBUTES({ 'src': this.data.img })));
}
}
this.button.el.onclick = this.launchModal.bind(this);
}
}
/**
	    Launches a modal that contains the detailed view of the given article
        @returns {void}
	 */
launchModal() {
console.log('Launch Modal');
this.modal = new MODAL(this.data.header);
this.modal.container.body.pane.addClass('thumbnail');
this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
this.modal.container.image.el.src = this.image.el.src;
this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
'label': this.data.header
}));
this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
'style': 'height:auto;'
})), this.data.p);
this.modal.show();
}
}
export { ATTRIBUTES, EL, MODEL };