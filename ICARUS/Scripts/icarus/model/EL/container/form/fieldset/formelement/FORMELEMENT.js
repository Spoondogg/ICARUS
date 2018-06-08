/**
    A generic Form Element.

    Icarus form elements represent generic required values
    for INPUT, SELECT or TEXTAREA items. This object is
    generally passed into the Input, Select
    or TextArea to set its values.
*/
class FORMELEMENT extends CONTAINER {
    /**
        Constructs a Form Element 
        @param {FORMELEMENTGROUP} node The parent
        @param {string} element INPUT, SELECT, TEXTAREA
        @param {MODEL} model the data model
     */
    constructor(node, element, model) {
        model.hasSidebar = 0;     
        super(node, 'DIV', model);
        this.addClass('form-element');        
    }

    construct() {
        let labelText = this.label ? this.label : this.attributes.name ? this.attributes.name : '__NoLabel';
        this.label = new LABEL(this.body.pane, labelText);        
    }
}