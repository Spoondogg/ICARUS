/**
    Construct a Form Fieldset
*/
class IcarusFieldSet extends CONTAINER {
    /**
        A field set / form-group that contains form elements within a section.

        @param {IcarusForm} node The parent object
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'FIELDSET', model);
        this.addClass('form-group-container');
        this.body.addClass('form-group'); // The expandable portion of the section
        this.addContainerCase('FORMELEMENTGROUP');
        this.populate(model.children);
    }
}