/**
    A container made up of a group of form elements
*/
class FORMELEMENTGROUP extends CONTAINER {
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