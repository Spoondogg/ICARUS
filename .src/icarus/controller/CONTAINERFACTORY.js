/**
    @module

    Each Container child must be imported individually to avoid cyclic redundancy
*/
import SPAN, { ATTRIBUTES, EL, MODEL } from '../model/el/span/SPAN.js';
//import EL, { ATTRIBUTES, MODEL } from '../model/el/EL.js';
import FORMSELECT, { OPTION } from '../model/el/container/formelement/formselect/FORMSELECT.js';
import MENULIST, { LI, UL } from '../model/el/container/menulist/MENULIST.js';
import ARTICLE from '../model/el/container/article/ARTICLE.js';
import BANNER from '../model/el/container/banner/BANNER.js';
import CALLOUT from '../model/el/container/banner/callout/CALLOUT.js';
import CHAT from '../model/el/container/chat/CHAT.js';
import CLASSVIEWER from '../model/el/container/banner/classviewer/CLASSVIEWER.js'; // banners are dumb
import DICTIONARY from '../model/el/container/dictionary/DICTIONARY.js';
import FIELDSET from '../model/el/container/fieldset/FIELDSET.js';
import FORM from '../model/el/container/form/FORM.js';
import FORMELEMENTGROUP from '../model/el/container/formelement/FORMELEMENTGROUP.js';
import FORMINPUT from '../model/el/container/formelement/forminput/FORMINPUT.js';
import FORMTEXTAREA from '../model/el/container/formelement/formtextarea/FORMTEXTAREA.js';
//import FORMPOSTINPUT from '../model/el/container/formelement/formpostinput/FORMPOSTINPUT.js';
import IFRAME from '../model/el/container/iframe/IFRAME.js';
import IMAGEGALLERY from '../model/el/container/banner/imagegallery/IMAGEGALLERY.js';
import INDEX from '../model/el/container/banner/index/INDEX.js';
import INDEXMAIN from '../model/el/container/banner/indexmain/INDEXMAIN.js';
import INDEXTHUMBNAIL from '../model/el/container/banner/thumbnail/indexthumbnail/INDEXTHUMBNAIL.js';
import JUMBOTRON from '../model/el/container/jumbotron/JUMBOTRON.js';
import LIST from '../model/el/container/list/LIST.js';
import LISTITEM from '../model/el/container/list/listitem/LISTITEM.js';
import MENU from '../model/el/nav/menu/MENU.js';
import NAVITEM from '../model/el/nav/navitem/NAVITEM.js';
import NAVSEPARATOR from '../model/el/nav/navitem/NAVSEPARATOR.js';
import PARAGRAPH from '../model/el/container/paragraph/PARAGRAPH.js';
import SECTION from '../model/el/container/section/SECTION.js';
import TEXTBLOCK from '../model/el/container/textblock/TEXTBLOCK.js';
import THUMBNAIL from '../model/el/container/banner/thumbnail/THUMBNAIL.js';
//import TOKEN from '../model/el/container/formelement/forminput/TOKEN.js';
import WORD from '../model/el/container/word/WORD.js';
/**
    Constructs various Containers and returns them to be appended
    @class
 */
export default class CONTAINERFACTORY {
/**
    A Container Factory
 
constructor() {}*/
/**
    Gets this Container from the database via ajax GET request.
    Retrieves object model and returns the container.

    A placeholder object is created to ensure that values are loaded
    in the appropriate order, regardless of any delays from getJson()

    @param {MODEL} node Parent node (Generally append to node.body.pane)
    @param {string} className Container Constructor Name
    @param {number} id Container UId
    @returns {CONTAINER} A newly constructed container
*/
get(node, className, id) {
//DEBUG.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
let span = new SPAN(node, new MODEL());
let index = node.children.push(span); // Reserve the slot in the array        
return $.getJSON('/' + className + '/Get/' + id, function(result) {
let obj = null;
switch (className) {
case 'LI':
obj = new LI(span, result.model);
break;
case 'UL':
obj = new UL(span, result.model);
break;
case 'LISTITEM':
obj = new LISTITEM(span, result.model);
break;
case 'LIST':
obj = new LIST(span, result.model);
break;
case 'MENULIST':
obj = new MENULIST(span, result.model);
break;
case 'MENU':
obj = new MENU(span, result.model);
break;
case 'NAVITEM':
obj = new NAVITEM(span, result.model);
break;
case 'NAVSEPARATOR':
obj = new NAVSEPARATOR(span, result.model);
break;
case 'TEXTBLOCK':
obj = new TEXTBLOCK(span, result.model);
break;
case 'JUMBOTRON':
obj = new JUMBOTRON(span, result.model);
break;
case 'CLASSVIEWER':
obj = new CLASSVIEWER(span, result.model);
break;
case 'INDEX':
obj = new INDEX(span, result.model);
break;
case 'INDEXMAIN':
obj = new INDEXMAIN(span, result.model);
break;
case 'IMAGEGALLERY':
obj = new IMAGEGALLERY(span, result.model);
break;
case 'DICTIONARY':
obj = new DICTIONARY(span, result.model);
break;
case 'PARAGRAPH':
obj = new PARAGRAPH(span, result.model);
break;
case 'WORD':
obj = new WORD(span, result.model);
break;
case 'BANNER':
obj = new BANNER(span, result.model);
break;
case 'CALLOUT':
obj = new CALLOUT(span, result.model);
break;
case 'THUMBNAIL':
obj = new THUMBNAIL(span, result.model);
break;
case 'INDEXTHUMBNAIL':
obj = new INDEXTHUMBNAIL(span, result.model);
break;
case 'IFRAME':
obj = new IFRAME(span, result.model);
break;
case 'ARTICLE':
obj = new ARTICLE(span, result.model);
break;
case 'SECTION':
obj = new SECTION(span, result.model);
break;
case 'CHAT':
obj = new CHAT(span, result.model);
break;
case 'FORM':
obj = new FORM(span, result.model);
break;
case 'FIELDSET':
obj = new FIELDSET(span, result.model);
break;
case 'FORMELEMENTGROUP':
obj = new FORMELEMENTGROUP(span, result.model);
break;
//case 'FORMPOSTINPUT':
//	obj = new FORMPOSTINPUT(span, result.model);
//	break;
case 'FORMINPUT':
obj = new FORMINPUT(span, result.model);
break;
case 'FORMSELECT':
obj = new FORMSELECT(span, result.model);
break;
case 'FORMTEXTAREA':
/** @todo THIS NEEDS TO BE CORRECTED ON SERVER */
obj = new FORMTEXTAREA(span, result.model);
break;
case 'OPTION':
obj = new OPTION(span, result.model);
break;
default:
/** @todo Verify */
obj = new EL(span, result.model);
}
//obj.factory = this;
node.children[index] = obj;
try {
span.el.parentNode.replaceChild(obj.el, span.el);
} catch (e) {
/** @todo Should be a method to remove the temporary node */
span.destroy();
node.children.splice(index, 1);
console.log(e);
}
return node.children[index];
});
}
/**
    Creates an empty form with a single fieldset and formelementgroup
    @param {EL} node Parent node
    @param {boolean} hidden If true, form is hidden
    @returns {FORM} An empty form container
*/
static createEmptyForm(node, hidden = false) {
console.log('Creating empty form');
let form = new FORM(node, new MODEL(new ATTRIBUTES({
'style': hidden ? 'display:none;' : ''
})).set({
'label': 'FORM',
'showHeader': 0
}));
form.fieldset = new FIELDSET(form.body.pane, new MODEL().set({
'label': 'FIELDSET',
'showHeader': 0
}));
form.fieldset.formElementGroup = new FORMELEMENTGROUP(form.fieldset.body.pane, new MODEL().set({
'label': 'FORMELEMENTGROUP',
'showHeader': 0
}));
return form;
}
}
export { ATTRIBUTES, EL, FORM, MODEL };