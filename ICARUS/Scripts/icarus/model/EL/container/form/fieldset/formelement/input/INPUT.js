/**
    Represents an <INPUT> for an Icarus Form
*/
class INPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.createInput();        
    }

    /**
     * TODO:
     * This should use a factory constructor pattern to create specific input types 
     */
    createInput() {
        let nm = this.attributes.name || this.data.name;
        let val = this.attributes.value || this.data.value;
        this.input = new EL(this.body.pane, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'type': this.attributes.type || this.data.type || 'TEXT',
                'list': nm + '-options',
                'name': nm,
                'value': val || ''
            })
        ));

        // file, text, number, email, phone (html5 inputs)
        // this should use a factory constructor pattern to create specific input types
        if (this.data.type === 'file' || this.attributes.type === 'image' || this.attributes.type === 'file') {

            // Create an empty subform, similar to a data/attributes object to save the image by FormPostId
            this.img = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                'style': 'min-height:64px;min-width:64px;max-width:120px;height:auto;border:4px solid white;background-color:grey;margin:1em;padding:0.3em;border-radius:0.3em;'
            })));

            this.img.el.onclick = function () {
                this.input.el.click();
            }.bind(this);

            this.img.el.onload = function () {
                this.dimX.input.el.setAttribute('value', this.img.el.naturalWidth);
                this.dimY.input.el.setAttribute('value', this.img.el.naturalHeight);
            }.bind(this);

            this.base64 = new TEXTAREA(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'base64',
                'label': 'base64'
            }).set({
                'name': 'base64',
                'label': 'base64'
            })));

            this.fileName = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'filename',
                'label': 'base64'
            }).set({
                'name': 'filename',
                'label': 'filename'
            })));

            this.fileType = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'fileType',
                'label': 'base64'
            }).set({
                'name': 'fileType',
                'label': 'fileType'
            })));

            this.fileSize = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'fileSize'
            }).set({
                'name': 'fileSize',
                'label': 'fileSize'
            })));

            this.dimX = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'dimX'
            }).set({
                'name': 'dimX',
                'label': 'dimX'
            })));

            this.dimY = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
                'name': 'dimY'
            }).set({
                'name': 'dimY',
                'label': 'dimY'
            })));

            // When the input is set (selected from explorer)
            // extract its data into the appropriate inputs (above)
            this.input.el.onchange = this.readURL.bind(this);

        } else {
            // Add any preset options to the datalist
            this.options = [];
            this.datalist = new EL(this.node, 'DATALIST', new MODEL(
                new ATTRIBUTES({
                    'id': this.attributes.name + '-options'
                })
            ));
            if (Array.isArray(this.options)) {
                for (let o = 0; o < this.options.length; o++) {
                    this.addOption(this.options[o].value);
                }
            }
        }
    }

    /**
     * Reads the contents of this FILE INPUT and extracts the base64 values
     * and metadata
     * 
     * See https://gist.github.com/batuhangoksu/06bc056399d87b09243d
     */
    readURL() {
        console.log('readUrl():  Reading an Image');
        app.loader.log(10, 'Loading...');
        // TODO:  This should detect file types and limit accordingly
        try {
            /* Use FileReader to extract base64 and attributes */
            if (this.input.el.files && this.input.el.files[0]) {

                let reader = new FileReader();
                reader.onload = function (e) {
                    $(this.input.el).attr('src', e.target.result);
                    this.img.el.src = e.target.result;
                    this.base64.input.el.innerHTML = e.target.result;
                    this.fileName.input.el.value = this.input.el.files[0].name;
                    this.fileType.input.el.value = this.input.el.files[0].type;
                    this.fileSize.input.el.value = Math.ceil(this.input.el.files[0].size/1000);
                }.bind(this);

                // Load file
                reader.readAsDataURL(this.input.el.files[0]);
            }
        } catch (e) {
            console.log(e);
        } 
    }

    /**
        Sets the label of this element to the given value.
        @param {string} label The name to be set
    */
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label.setInnerHTML(label);
        this.input.el.setAttribute('name', label);
    }

    /**
        // TODO: Consider how to share these lists with the entire application rather than
        // reduntantly load the same data over and over again
        Adds an option to this input element
        @param {string} label The label
        @param {string} value The value
    */    
    addOption(label, value) {
        if (label === undefined || value === undefined) {
            try {
                this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');

                this.prompt.formGroup.addInput('label', IcarusInputType.TEXT, '');
                this.prompt.formGroup.addInput('value', IcarusInputType.TEXT, '');

                this.prompt.buttonGroup.addButton('Add Option').el.onclick = function () {
                    this.options.push(
                        new Option(
                            this.datalist.el,
                            $(this.prompt.el).find('input[name="label"]')[0].value,
                            $(this.prompt.el).find('input[name="value"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this element');
                console.log(e);
            }
        } else {
            this.options.push(
                new Option(this.datalist.el, label, value)
            );
        }
    }
}