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

        if (model.dataId > 0) {
            this.text = new P(this.body.pane, model.data, model.data.label);
        }

        this.populate(model.children);
    }
}