/**
    A COLLAPSE panel within the NAVBAR
    that contains a GROUP of NAVITEMs
*/
class NAVBARCOLLAPSE extends NAVITEMGROUP {
    /**
        Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {MODEL} model The json object representing this element
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('collapse'); //navbar-collapse 
        
        this.populate(model.children);
    }    
}