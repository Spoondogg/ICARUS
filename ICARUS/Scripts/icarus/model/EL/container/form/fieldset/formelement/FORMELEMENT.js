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
        model.hasSidebar = 0;

        console.log('FORMELEMENT[' + element + ']');        
        super(node, 'DIV', model);
        this.addClass('form-element');

        this.label = new LABEL(this.body.pane, model ? model.label : '__NoLabel');        
    }
    /*
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label.setInnerHTML(label);
        this.label.el.setAttribute('name', label);
    }
    */
}