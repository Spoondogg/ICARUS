/**
    A generic Form Element.

    Icarus form elements represent generic required values
    for INPUT, SELECT or TEXTAREA items. This object is
    generally passed into the Input, Select
    or TextArea to set its values.

    @class
    @see IcarusFieldSet
*/
class FORMELEMENT extends CONTAINER {
    /**
        Constructs a Form Element 
        @param {FORMELEMENTGROUP} node The parent
        @param {string} element INPUT, SELECT, TEXTAREA
        @param {MODEL} model the data model
     */
    constructor(node, element, model) {
        model.hasSidebar = false;
        //model.hasTab = false;

        console.log('FORMELEMENT[' + element + ']');
        
        super(node, 'DIV', model);
        this.addClass('form-element');

        // Create the Label
        let label = model ? model.label : '__NoLabel';
        this.label = new LABEL(this.body.pane, label);
        //this.label.el.onclick = this.save.bind(this);

    }
}