/**
    A container for form elements
    This container should be drag and drop friendly, allowing the
    editor to move the element up or down in the sequence

    TODO: Implement drag and drop in IcarusSectionHeader
*/
class IcarusFormElementGroup extends CONTAINER {
    /**
        Constructs a Form Element Group
        @param {EL} node The parent
        @param {MODEL} model datamodel
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('form-element-group');

        this.addContainerCase('INPUT');
        this.addContainerCase('SELECT');
        this.addContainerCase('TEXTAREA');
        
        this.populate(model.children);
    }
}