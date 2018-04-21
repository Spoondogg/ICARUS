/**
    List Item Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class LISTITEM extends CONTAINER {
    /**
        Constructs A List Item
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'LI', model);
        //this.addContainerCase('LIST');
        this.populate(model.children);
    }
}