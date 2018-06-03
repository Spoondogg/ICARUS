﻿/**
    Represents an file <INPUT> for an Icarus Form
*/
class FILE extends INPUT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, new MODEL(
            new ATTRIBUTES({
                'type': 'FILE',
                'name': model.attributes.name
            })
        ));

        this.base64 = new TEXTAREA(this.body.pane, new MODEL().set({
            'name':'base64'
        }));

        this.dataElements.push(
            new MODEL(new ATTRIBUTES({
                'name': 'accept',
                'type': 'text'
            })).set({
                'element': 'INPUT',
                'label': 'accept'
            })
        );
    }    
}