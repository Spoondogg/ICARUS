﻿/**
    Construct a Form Fieldset
*/
class FIELDSET extends CONTAINER {
    /**
        A field set / form-group that contains form elements within a section.

        @param {FORM} node The parent object
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'FIELDSET', model);
        this.addClass('form-group-container');
        this.body.addClass('form-group'); // The expandable portion of the section
        this.addContainerCase('FORMELEMENTGROUP');
        //this.construct();
        this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0) {
            if (this.data.legend) {
                this.legend = new EL(this.body.pane, 'LEGEND', new MODEL(), this.data.legend);
            }
        }
    }
}