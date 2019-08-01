/** @module */
import FACTORY, { ATTRIBUTES, EL, MODEL, PAYLOAD, SPAN } from '../FACTORY.js';
import FORM, { BUTTON, BUTTONGROUP } from '../form/FORM.js';
import MENU, { Deactivate, LI, UL } from '../nav/menu/MENU.js';
import ARTICLE from '../article/ARTICLE.js';
import BANNER from '../container/banner/BANNER.js';
import CALLOUT from '../container/banner/callout/CALLOUT.js';
import CHAT from '../container/chat/CHAT.js';
import CLASSVIEWER from '../container/index/classindex/classviewer/CLASSVIEWER.js';
import CONTAINER from '../container/CONTAINER.js';
import CONTAINERINDEX from './index/classindex/containerindex/CONTAINERINDEX.js';
import DICTIONARY from '../container/dictionary/DICTIONARY.js';
import FORMPOSTINDEX from '../container/index/classindex/formpostindex/FORMPOSTINDEX.js';
import IMAGEINDEX from '../container/index/classindex/formpostindex/imageindex/IMAGEINDEX.js';
import INDEX from '../container/index/INDEX.js';
import JUMBOTRON from '../container/jumbotron/JUMBOTRON.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
import NAVITEM from '../nav/navitem/NAVITEM.js';
import NAVSEPARATOR from '../nav/navitem/NAVSEPARATOR.js';
import NAVTHUMBNAIL from '../nav/navitem/navthumbnail/NAVTHUMBNAIL.js';
import PROMPT from '../dialog/prompt/PROMPT.js';
import SECTION from '../section/SECTION.js';
import TABLE from '../table/TABLE.js';
import TEXTBLOCK from './textblock/TEXTBLOCK.js';
import WORD from '../container/word/WORD.js';
/** Constructs various Containers and returns them to be appended
    Each Container child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
*/
export default class CONTAINERFACTORY extends FACTORY {
    /* eslint-disable max-lines-per-function, complexity, max-statements */
    /** Constructs a FACTORY to build CONTAINER Classes 
        @param {string} type Identifies what Class(es) the factory will construct
    */
    constructor(type = 'CONTAINER') {
        super(type);
    }
    /** Switch statement to determine appropriate element for this factory to construct
        @param {string} className Container Constructor Name
        @param {SPAN} span Placeholder
        @param {ContainerModel} model Model
        @returns {CONTAINER} Newly constructed CONTAINER Class
    */
    build(className, span, model) {
        let element = null;
        switch (className) {
            case 'ARTICLE':
                element = new ARTICLE(span, model);
                break;
            case 'BANNER':
                element = new BANNER(span, model);
                break;
            case 'CALLOUT':
                element = new CALLOUT(span, model);
                break;
            case 'CHAT':
                element = new CHAT(span, model);
                element.setFactory(this.factories.get('CHATFACTORY'));
                break;
            case 'CLASSVIEWER':
                element = new CLASSVIEWER(span, model);
                break;
            case 'DICTIONARY':
                element = new DICTIONARY(span, model);
                break;
            case 'FORM':
                element = new FORM(span, model);
                element.setFactory(this.factories.get('FORMFACTORY'));
                break;
            ////////////
            case 'INDEX':
                element = new INDEX(span, model);
                break;
            /*case 'CLASSINDEX':
                element = new CLASSINDEX(span, model);
                element.setFactory(this.factories.get('CLASSINDEXFACTORY'));
                break;*/
            case 'CONTAINERINDEX':
                element = new CONTAINERINDEX(span, model);
                break;
            case 'FORMPOSTINDEX':
                element = new FORMPOSTINDEX(span, model);
                break;
            case 'IMAGEINDEX':
                element = new IMAGEINDEX(span, model);
                break;
            case 'JUMBOTRON':
                element = new JUMBOTRON(span, model);
                break;
            case 'LI':
                element = new LI(span, model);
                break;
            case 'MENU': // MIGHT NOT BE NEEDED
                element = new MENU(span, model);
                break;
            case 'NAVITEM':
                element = new NAVITEM(span, model);
                break;
            case 'NAVSEPARATOR':
                element = new NAVSEPARATOR(span, model);
                break;            
            case 'SECTION':
                element = new SECTION(span, model);
                break;
            case 'SPAN':
                element = new SPAN(span, model);
                break;
            case 'TABLE':
                element = new TABLE(span, model);
                element.setFactory(this.factories.get('TABLEFACTORY'));
                break;
            case 'TEXTBLOCK':
                element = new TEXTBLOCK(span, model);
                break;
            case 'THUMBNAIL':
                element = new NAVTHUMBNAIL(span, model);
                break;
            case 'UL':
                element = new UL(span, model);
                break;       
            case 'WORD':
                element = new WORD(span, model);
                break;       
            default:
                throw Error(this.toString() + ' No constructor exists for "' + className + '"');
        }
        return element;
    }
    /** Launches a viewer in a dialog for the given class type.
        Selecting an element loads it into the calling CONTAINER.
        @param {string} [classType] Default class to display (ie: MAIN)
        @param {CONTAINER} [container] Calling container
        @param {EL} [caller] Calling element (ie: switchable element resolved)
        @param {string} [query] Optional Query String
        @param {string} [searchType] Optional Search Type
        @returns {Promise<PROMPT>} Prompt configured to view given classType
    */
    launchViewer(classType = 'MAIN', container = this, caller = this, query = null, searchType = null) {
        console.log(container.toString() + '.launchViewer()', query, searchType);
        return new Promise((resolve) => {
            let label = classType === '*' ? 'Containers' : classType + '(s)';
            label += query === null ? '' : ': ' + query;
            container.getLoader().log(25).then((loader) => {
                let prompt = new PROMPT(MODELS.dialog(
                    label, '', true, container, caller, container.getLoader()
                ));
                let viewer = new CONTAINERINDEX(prompt.body.pane, new MODEL(), {
                    classType,
                    query,
                    searchType
                });
                viewer.setContainer(container);
                // Do viewer config here
                loader.log(100).then(() => resolve(prompt.show()));
            });
        });
    }
}
export { ATTRIBUTES, BUTTON, BUTTONGROUP, CONTAINER, Deactivate, EL, FACTORY, FORM, MODEL, MODELS, PAYLOAD, PROMPT, SPAN, TEXTBLOCK }