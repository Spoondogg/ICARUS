/**
    A generic unorganized list
*/
class UL extends GROUP {
    /**
        Constructs an Unordered List
        @param {EL} node The node to contain this element
        @param {MODEL} model The element model
     */
    constructor(node, model) {
        super(node, 'UL', model);

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('UL', function (element, model) {
            return this.addUnorderedList(model);
        }.bind(this));

        this.addCase('LI', function (element, model) {
            return this.addListItem(model);
        }.bind(this));
    }

    /**
        Construct a generic List Item (LI) and append to this element's children
        @param {MODEL} model Object Model
        @returns {LI} A list item LI
     */
    addListItem(model) {
        this.children.push(new LI(this, model, model.label));
        return this.children[this.children.length - 1];
    }

    /**
        Construct an unordered List (UL) and append to this element's children
        @param {MODEL} model Object Model
        @returns {LI} A list item LI
     */
    addUnorderedList(model) {
        this.children.push(new UL(this, model));
        return this.children[this.children.length - 1];
    }
}