﻿/**
    Represents a <TEXTAREA> for an Icarus Form       
*/
class TEXTAREA extends FORMELEMENT {
    /**
        Construct a Text Area
        @param {EL} node The parent object
        @param {MODEL} model The textarea model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.input = new EL(this.body.pane, 'TEXTAREA', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': model.attributes.name                
            })
        ), model.attributes.value || '');

        //this.construct();
    }

    construct() {

    }
}