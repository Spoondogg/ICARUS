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
        console.log('Anchor Label: ' + model.label);
        super(node, 'A', model, model.label || '&nbsp;');
    }
}