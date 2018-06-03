/**
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
        
        if (model.icon) {
            let lbl = model.label ? model.label : '';
            this.icon = new GLYPHICON(this, lbl, model.icon);
        } else {
            this.setInnerHTML(this.el.innerHTML += model.label); 
        }
    }
}