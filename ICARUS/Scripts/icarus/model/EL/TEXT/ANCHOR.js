﻿/**
    A hyperlink / page anchor    
*/
class ANCHOR extends EL {
    /**
        Constructs a generic Anchor
        @param {EL} node The object to contain this element
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'A', model);
        this.setInnerHTML(this.el.innerHTML += model.label); 
        if (model.icon) {
            this.icon = new GLYPHICON(this, '', model.icon);
        }               
    }
}