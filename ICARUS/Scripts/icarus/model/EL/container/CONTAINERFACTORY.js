/**
    @module
*/
import ATTRIBUTES from '../../ATTRIBUTES.js';
import MODEL from '../../MODEL.js';
import ARTICLE from '../container/article/ARTICLE.js';
import INDEX from '../container/banner/index/INDEX.js';
import INDEXMAIN from '../container/banner/indexmain/INDEXMAIN.js';
import CHAT from '../container/chat/CHAT.js';
import DICTIONARY from '../container/dictionary/DICTIONARY.js';
import FIELDSET from '../container/fieldset/FIELDSET.js';
import FORM from '../container/form/FORM.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
import INPUT from '../container/formelement/input/INPUT.js';
import SELECT, { OPTION } from '../container/formelement/select/SELECT.js';
import TEXTAREA from '../container/formelement/textarea/TEXTAREA.js';
import JUMBOTRON from '../container/jumbotron/JUMBOTRON.js';
import PARAGRAPH from '../container/paragraph/PARAGRAPH.js';
import SECTION from '../container/section/SECTION.js';
import WORD from '../container/word/WORD.js';
import LI from '../group/li/li.js';
import SPAN from '../span/SPAN.js';
import TOKEN from '../container/formelement/input/TOKEN.js';
import BANNER from '../container/banner/BANNER.js';
import THUMBNAIL from '../container/banner/thumbnail/THUMBNAIL.js';
import CALLOUT from '../container/banner/callout/CALLOUT.js';
import IFRAME from '../container/iframe/IFRAME.js';
import IMAGEGALLERY from '../container/banner/imagegallery/IMAGEGALLERY.js';
export { FORM, TOKEN, MODEL };

/**
    Constructs various Containers and returns them to be appended
    @class
 */
export default class CONTAINERFACTORY {
    /**
        A Container Factory
     */
    constructor() {

    }
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
    static get(node, className, id) {
        //DEBUG.log('CONTAINERFACTORY.get(' + className + ',' + id + ');');
        let span = new SPAN(node, new MODEL());
        let index = node.children.push(span); // Reserve the slot in the array        
        return $.getJSON('/' + className + '/Get/' + id, function (result) {
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

                case 'FORMPOSTINPUT':
                    obj = new FORMPOSTINPUT(span, result.model);
                    break;

                case 'INPUT':
                    obj = new INPUT(span, result.model);
                    break;

                case 'SELECT':
                    obj = new SELECT(span, result.model);
                    break;

                case 'TEXTAREA':
                    obj = new TEXTAREA(span, result.model);
                    break;

                case 'OPTION':
                    obj = new OPTION(span, result.model);
                    break;
            }

            node.children[index] = obj;
            if (obj !== null) {
                try {
                    span.el.parentNode.replaceChild(obj.el, span.el);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Remove the temporary node
                span.destroy();
                node.children.splice(index, 1);
            }
            return node.children[index];
        });
    }

    /**
     * Creates an empty form with a single fieldset and formelementgroup
     * @param {EL} node Parent node
     * @param {boolean} hidden If true, form is hidden
     * @returns {FORM} An empty form container
     */
    static createEmptyForm(node, hidden = false) {
        let form = new FORM(
            node,
            new MODEL(new ATTRIBUTES({
                'style': hidden ? 'display:none;' : ''
            })).set({
                'label': 'FORM',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset = new FIELDSET(
            form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        form.fieldset.formElementGroup = new FORMELEMENTGROUP(
            form.fieldset.body.pane, new MODEL().set({
                'label': 'FORMELEMENTGROUP',
                //'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        return form;
    }
}