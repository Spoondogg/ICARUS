/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
import HEADER from '../../header/HEADER.js';
import MODEL from '../../../MODEL.js';
/**
    A word used in a Vocabulary
    @class
    @extends CONTAINER
*/
export default class WORD extends CONTAINER {
/**
    Constructs a SECTION Container Element
    @param {DICTIONARY} node The ARTICLE to contain the section
    @param {MODEL} model The SECTION object retrieves from the server
 */
constructor(node, model) {
super(node, 'DIV', model);
//this.populate(model.children);
}
construct() {
if (this.dataId > 0) {
console.log(this);
this.header = new HEADER(this.body.pane, new MODEL().set({
'label': this.data.value
}), 1);
} else {
console.log(this);
this.header = new HEADER(this.body.pane, new MODEL().set({
'label': 'Unknown'
}), 1);
}
}
}