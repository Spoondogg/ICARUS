import CONTAINER from '../CONTAINER.js';
import DATEOBJECT from '../../../../DATEOBJECT.js';
import HEADER from '../../header/HEADER.js';
import MODEL from '../../../MODEL.js';
import P from '../../p/P.js';
import '../../../../StringMethods.js';
import FORMPOSTINPUT from '../formelement/formpostinput/FORMPOSTINPUT.js';
/**
    A banner that can be populated with CallOuts
*/
export default class PARAGRAPH extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['IMAGE']);
        this.addClass('textblock');
        this.body.pane.addClass('paragraph');
        //this.dataElements = DATAELEMENTS.PARAGRAPH;
        //this.construct();
        this.populate(model.children);
    }

    /**
        Constructs a Paragraph Container.
    */
    construct() {        
        if (this.dataId > 0) {
            if (this.data.p) {
                let d = DATEOBJECT.getDateObject(String(this.dateCreated).getDateValue(this.dateCreated));
                this.header = new HEADER(this.body.pane, new MODEL().set({
                    'label': d.date + ' - ' + d.time//'paragraph header'
                }));
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        } else {
            // This object REQUIRES model.data 
            // Open up the save panel and generate some
            
            let formPostInput = new FORMPOSTINPUT(this, new MODEL().set({
                'inputs': this.inputs
            }));
            formPostInput.newAttributes(this, 'dataId', this);
        }
    }
}