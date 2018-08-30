﻿/**
    A banner that can be populated with CallOuts
*/
class PARAGRAPH extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('textblock');
        this.body.pane.addClass('paragraph');
        //this.dataElements = DATAELEMENTS.PARAGRAPH;
        this.addContainerCase('IMAGE');
        //this.construct();
        this.populate(model.children);
    }

    construct() {
        
        if (this.dataId > 0) {
            if (this.data.p) {

                let d = getDateObject(getDateValue(this.dateCreated));

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

            


           // app.sidebar.empty();
            //app.toggleSidebar();

            //let saveForm = this.save(app.sidebar);

            
            //app.sidebar.target = this;
        }
    }
}