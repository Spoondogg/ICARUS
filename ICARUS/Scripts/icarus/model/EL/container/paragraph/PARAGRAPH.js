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
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        }
    }
}