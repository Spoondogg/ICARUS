/** @module */
import FACTORY, { ATTRIBUTES, EL, MODEL, PAYLOAD, SPAN } from '../FACTORY.js';
import FORM, { BUTTON, BUTTONGROUP } from '../form/FORM.js';
import MENU, { Deactivate, LI, UL } from '../nav/menu/MENU.js';
import PROMPT, { DIALOGMODEL } from '../dialog/prompt/PROMPT.js';
//import TABLE, { TBODY, TD, TFOOT, TH, THEAD, TR } from '../table/TABLE.js';
import ARTICLE from '../article/ARTICLE.js';
import BANNER from '../container/banner/BANNER.js';
import CALLOUT from '../container/banner/callout/CALLOUT.js';
import CLASSVIEWER from '../container/banner/classviewer/CLASSVIEWER.js';
import CONTAINER from '../container/CONTAINER.js';
import IMAGEGALLERY from '../container/banner/imagegallery/IMAGEGALLERY.js';
import INDEX from '../container/banner/index/INDEX.js';
import INDEXMAIN from '../container/banner/indexmain/INDEXMAIN.js';
import INDEXTHUMBNAIL from '../container/banner/thumbnail/indexthumbnail/INDEXTHUMBNAIL.js';
import JUMBOTRON from '../container/jumbotron/JUMBOTRON.js';
import NAVITEM from '../nav/navitem/NAVITEM.js';
import NAVSEPARATOR from '../nav/navitem/NAVSEPARATOR.js';
import NAVTHUMBNAIL from '../nav/navitem/navthumbnail/NAVTHUMBNAIL.js';
import SECTION from '../section/SECTION.js';
import TABLE from '../table/TABLE.js';
import TEXTBLOCK from './textblock/TEXTBLOCK.js';
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
        @param {SPAN} span Element Placeholder
        @param {MODEL} model Element MODEL
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
            case 'CLASSVIEWER':
                element = new CLASSVIEWER(span, model);
                break;
            case 'FORM':
                element = new FORM(span, model);
                element.setFactory(this.factories.get('FORMFACTORY'));
                break;
            case 'IMAGEGALLERY':
                element = new IMAGEGALLERY(span, model);
                break;
            case 'INDEX':
                element = new INDEX(span, model);
                break;
            case 'INDEXMAIN':
                element = new INDEXMAIN(span, model);
                break;
            case 'INDEXTHUMBNAIL':
                element = new INDEXTHUMBNAIL(span, model);
                break;
            case 'JUMBOTRON':
                element = new JUMBOTRON(span, model);
                break;
            case 'LI':
                element = new LI(span, model);
                break;
            case 'MENU':
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
        @returns {Promise<PROMPT>} Prompt configured to view given classType
    */
    launchViewer(classType = 'MAIN', container = this, caller = this) {
        return new Promise((resolve) => {
            container.getLoader().log(25).then((loader) => {
                let prompt = new PROMPT(new DIALOGMODEL(new MODEL(), {
                    container,
                    caller,
                    label: 'View ' + classType + '(s)',
                    text: 'Viewer Text'
                }));
                let viewer = new INDEXMAIN(prompt.body.pane, new MODEL().set({
                    container
                }), classType);
                // Do viewer config here
                loader.log(100).then(() => resolve(prompt.show()));
            });
        });
    }
}
export { ATTRIBUTES, BUTTON, BUTTONGROUP, CONTAINER, DIALOGMODEL, Deactivate, EL, FACTORY, FORM, MODEL, PAYLOAD, PROMPT, SPAN }