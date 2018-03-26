/**
    A generic Form Element.

    Icarus form elements represent generic required values
    for INPUT, SELECT or TEXTAREA items. This object is
    generally passed into the IcarusFormInput, IcarusFormSelect
    or IcarusFormTextArea to set its values.

    @class
    @see IcarusFieldSet
*/
class IcarusFormElement extends CONTAINER {
    /**
        Constructs a Form Element 
        @param {EL} node The parent
        @param {MODEL} model the data model
     */
    constructor(node, model) {

        // Instantiate
        super(node, 'DIV', model);
        this.addClass('form-element');
        this.toggleSidebar(); // temporary

        // Create the Label
        let label = model ? model.label : '__NoLabel';
        this.label = new LABEL(this.body.pane, label);
        this.label.el.onclick = this.save.bind(this);

        // Create the INPUT, SELECT or TEXTAREA 
        //this.tagId = model.tagId || 1;
        this.inp = this.create(
            IcarusFormElementTagId[1], //this.tagId
            model
        );

        // Populate CONTAINER with children 
        try {
            this.populate(model.children);
        } catch (e) {
            console.log(e);
            console.log('Did you forget to provide a model for this IcarusFormElement?');
        }
    }

    /**
        Modify the Icarus Form Element.

        Accepts a name and sets the elements label and input to the
        given value unless no value is given, in which case the user
        is prompted for one.

        @override
        @param {string} name The name to be assigned/displayed
    
    save(name) {
        if (name === undefined) {
            try {

                this.prompt = new PROMPT('Modify Element', 'Modify this element using the following:');
                this.prompt.form.formGroup.addInput('Label', IcarusInputType.TEXT, this.label.el.innerHTML, false);
                this.prompt.form.formGroup.addInput('Name', IcarusInputType.TEXT, this.inp.el.getAttribute('name'), false);
                this.prompt.form.footer.buttonGroup.addButton('Modify').el.onclick = function () {

                    let friendlyName = friendly($(this.prompt.el).find('input[name="Name"]')[0].value);
                    let labelText = $(this.prompt.el).find('input[name="Label"]')[0].value;

                    //this.header.setLabel(labelText);

                    this.label.el.innerHTML = labelText;
                    this.inp.el.setAttribute('name', friendlyName);
                    this.inp.el.setAttribute('list', friendlyName + '-options');

                    try {
                        this.inp.datalist.el.setAttribute('id', friendlyName + '-options');
                    } catch (ex) { 
                        // Datalist does not exist
                    }

                    this.prompt.hide();

                }.bind(this);

                this.prompt.form.footer.buttonGroup.addButton('Cancel').el.onclick = function () {
                    this.prompt.hide();
                }.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this '+this.element+'\n' + e);
            }
        }
    }  
    */
}