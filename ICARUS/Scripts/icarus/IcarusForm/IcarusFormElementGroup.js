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
        console.log('new IcarusFormElementGroup');
        super(node, 'DIV', model);
        //this.toggleSidebar(); // temporary
        this.addClass('form-element-group');

        this.addContainerCase('FORMELEMENT');

        /*
        this.addCase('INPUT', function (element, model) {
            model.element = 'INPUT';
            model.tagId = IcarusFormElementHtmlTag.INPUT;
            return this.addFormElement(model);
        }.bind(this));

        this.addCase('SELECT', function (element, model) {
            model.element = 'SELECT';
            model.tagId = IcarusFormElementHtmlTag.SELECT;
            model.typeId = IcarusInputType.NUMBER;
            model.options = [];
            return this.addFormElement(model);
        }.bind(this));

        this.addCase('TEXTAREA', function (element, model) {     
            model.label = 'TEXTAREA';
            model.element = 'TEXTAREA';
            model.tagId = IcarusFormElementHtmlTag.TEXTAREA;
            return this.addFormElement(model);
        }.bind(this));
        */

        //this.header.options.list.emptyGroup('ELEMENTS');

        /* THESE WORK
        this.addCase('INPUT', function (element, model) {
            return this.addInput(model);
        }.bind(this));
        this.addConstructElementButton('INPUT');

        this.addCase('SELECT', function (element, model) {
            return this.addSelect(model);
        }.bind(this));

        this.addCase('TEXTAREA', function (element, model) {
            return this.addTextArea(model);
        }.bind(this));
        */
        // Populate CONTAINER with children 
        this.populate(model.children);
    }

    /**
        Constructs an Input element based on the given model.tagId
        @param {MODEL} model Object Model
        @returns {IcarusFormElement} A Form Element container with the specified element
     */
    addFormElement(model) {
        this.children.push(new IcarusFormElement(this.body.pane, model));
        this.addConstructElementButton(model.element);
        return this.children[this.children.length - 1];
    }

    /**
        Constructs an Input
        @param {MODEL} model datamodel
        @returns {IcarusFormInput} An input
     */
    addInput(model) {
        this.children.push(new IcarusFormInput(this.body.pane, model));
        return this.children[this.children.length - 1];
    }

    /**
        Constructs a Select Input
        @param {MODEL} model datamodel
        @returns {IcarusFormSelect} A select element
     */
    addSelect(model) {
        this.children.push(new IcarusFormSelect(this.body.pane, model));
        return this.children[this.children.length - 1];
    }

    /**
        Constructs a TextArea
        @param {MODEL} model datamodel
        @returns {IcarusFormTextArea} A textarea
     */
    addTextArea(model) {
        this.children.push(new IcarusFormTextArea(this.body.pane, model));
        return this.children[this.children.length - 1];
    }
}