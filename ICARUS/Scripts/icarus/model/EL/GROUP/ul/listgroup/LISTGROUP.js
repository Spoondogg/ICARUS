/**
    A bootstrap list-group    
*/
class LISTGROUP extends UL {
    /**
        Constructs a UL as a Bootstrap ListGroup
        @param {EL} node The object to contain this element
        @param {MODEL} model The element model
     */
    constructor(node, model) {
        super(node, new MODEL(new ATTRIBUTES('list-group')));

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('LISTGROUPITEM', function (element, model) {
            this.children.push(
                new LISTGROUPITEM(this, model.attributes, model.innerHtml, model.badgeText)
            );
            return this.children[this.children.length - 1];
        }.bind(this));
    }
}