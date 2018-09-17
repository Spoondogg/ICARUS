/**
    @module
*/
import JUMBOTRON from '../JUMBOTRON.js';
import HEADER from '../../../header/HEADER.js';
import P from '../../../p/P.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
import EL, { MODEL, ATTRIBUTES } from '../../../EL.js';
import { ICONS } from '../../../../../enums/ICONS.js';
/**
    Jumbotron with centered icon and text
    @class
    @extends JUMBOTRON
*/
export default class HEADERWRAP extends JUMBOTRON {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('headerwrap');
        
        this.header = new HEADER(this.body.pane, new MODEL(new ATTRIBUTES('clearfix')));
        this.header.h1 = new HEADER(this.header, new MODEL().set({ 'label': 'Hello World' }), 1);
        this.header.h1.icon = new GLYPHICON(this.header.h1, '', ICONS.PLUS);
        this.header.p = new P(this.header, new MODEL(), 'Woot to the Woot');
        
        this.populate(model.children);
    }
}