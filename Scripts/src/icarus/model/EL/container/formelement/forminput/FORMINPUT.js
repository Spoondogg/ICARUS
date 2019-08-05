/** @module */
import FORMELEMENT, { ATTRIBUTES, Activate, CONTAINER, Collapse, Deactivate, EL, Expand, ICONS, INPUTTYPES, MODEL, MODELS } from '../FORMELEMENT.js';
import DATALIST from '../../../datalist/DATALIST.js';
import FORMTEXTAREA from '../formtextarea/FORMTEXTAREA.js';
import IMG from '../../../img/IMG.js';
import INPUT from '../../../input/INPUT.js';
import MENU from '../../../nav/menu/MENU.js';
/** Represents an INPUT for an Icarus Form
    @class
*/
export default class FORMINPUT extends FORMELEMENT {
	constructElements() {
        return this.chain(() => {
            this.input = new INPUT(this.body.pane, MODELS.input('INPUT', 
                MODELS.inputAttributes(
                    this.attributes.name,
                    this.attributes.value || '',
                    this.attributes.type || 'TEXT',
                    false,
                    this.attributes.placeholder || ''
                ))
            );
			this.configureInput();
		});
	}
	/** Configures the INPUT Element
        @returns {INPUT} An INPUT EL
        @todo: This should use a factory constructor pattern to create specific input types
        @todo file, text, number, email, phone (html5 inputs) 
        @todo This should use a factory constructor pattern to create specific input types
    */
	configureInput() {
		switch (this.attributes.type) {
			case 'HIDDEN':
                this.body.el.dispatchEvent(new Collapse(this.body));
				break;
            case 'CHECKBOX':
                this.buildCheckbox();
				break;
			default:
				// 'TEXT'
		}
		if (this.attributes.type === 'FILE' || this.attributes.type === 'IMAGE') {
			this.createSubForm();
		} else {
			this.addInputOptions();
		}
		if (this.attributes.readonly) {
			this.input.el.readOnly = true;
		}
		return this.input;
    }
    /** Builds a Checkbox with toggle
        @param {string} labelOn On Label
        @param {string} labelOff Off Label
        @returns {void}
    */
    buildCheckbox(labelOn = 'YES', labelOff = 'NO') {
        this.optionsMenu = new MENU(this.body.pane, MODELS.menu('optionsMenu', new ATTRIBUTES('checkmark-menu')));

        let on = this.optionsMenu.addNavItem(MODELS.navitem(labelOn, ICONS.BLANK, 'yes'));
        let off = this.optionsMenu.addNavItem(MODELS.navitem(labelOff, ICONS.BLANK, 'no'));

        on.el.addEventListener('activate', () => {
            this.input.el.checked = true;
            this.input.setAttribute('value', 1);
            off.el.dispatchEvent(new Deactivate(off));
        });

        off.el.addEventListener('activate', () => {
            this.input.el.checked = false;
            this.input.setAttribute('value', -1);
            on.el.dispatchEvent(new Deactivate(on));
        });

        this.optionsMenu.el.dispatchEvent(new Expand(this.optionsMenu));
        this.input.el.checked = parseInt(this.attributes.value) === 1;
        if (parseInt(this.attributes.value) === 1) {
            on.el.dispatchEvent(new Activate(on));
            off.el.dispatchEvent(new Deactivate(off));
        } else {
            off.el.dispatchEvent(new Activate(off));
            on.el.dispatchEvent(new Deactivate(on));
        }
        this.input.el.onchange = () => {
            this.attributes.value = this.input.el.checked ? 1 : -1;
            this.input.el.value = this.input.el.checked ? 1 : -1;
        }
    }
	/** Add any preset options to the datalist
	    @returns {void}
	*/
	addInputOptions() {
		this.options = [];
		this.datalist = new DATALIST(this.node, new MODEL(new ATTRIBUTES({
			id: this.attributes.name + '-options'
		})));
		if (Array.isArray(this.options)) {
			this.options.forEach((o) => this.addOption(o.value));
			/*for (let o = 0; o < this.options.length; o++) {
				this.addOption(this.options[o].value);
			}*/
		}
	}
	/** Create an empty subform, similar to a data/attributes object to 
	    save the image by FormPostId
	    @returns {void}
	*/
	createSubForm() {
		this.img = new IMG(this.body.pane, new MODEL('input-image-preview'));
		this.img.el.onclick = () => {
			this.input.el.click();
		};
		this.img.el.onload = () => {
			this.dimX.input.el.setAttribute('value', this.img.el.naturalWidth);
			this.dimY.input.el.setAttribute('value', this.img.el.naturalHeight);
		};
		this.base64 = new FORMTEXTAREA(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMTEXTAREA
			name: 'base64'
		}).set({
			name: 'base64'
		})));
		this.fileName = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			name: 'filename',
			label: 'base64'
		}).set({
			name: 'filename'
		})));
		this.fileType = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			name: 'fileType',
			label: 'base64'
		}).set({
			name: 'fileType'
		})));
		this.fileSize = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			name: 'fileSize'
		}).set({
			name: 'fileSize'
		})));
		this.dimX = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			name: 'dimX'
		}).set({
			name: 'dimX'
		})));
		this.dimY = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			name: 'dimY'
		}).set({
			name: 'dimY'
		})));
		this.input.el.onchange = this.readURL.bind(this);
	}
	/** Reads the contents of this FILE INPUT and extracts the base64 values and metadata
        When the input is set (selected from explorer), extract its data into the appropriate inputs (above)
        @description Use FileReader to extract base64 and attributes
        @todo This should detect file types and limit accordingly
        @see https://gist.github.com/batuhangoksu/06bc056399d87b09243d
        @throws Throws an error if unable to successfully read the Url
        @return {boolean} Returns true if successful
    */
	readURL() {
		console.log(10, 'readUrl():  Reading an Image');
		try {
			if (this.input.el.files && this.input.el.files[0]) {
				let reader = new FileReader();
				reader.onload = function(e) {
					$(this.input.el).attr('src', e.target.result);
					this.img.el.src = e.target.result;
					this.base64.input.el.innerHTML = e.target.result;
					this.fileName.input.el.value = this.input.el.files[0].name;
					this.fileType.input.el.value = this.input.el.files[0].type;
					this.fileSize.input.el.value = Math.ceil(this.input.el.files[0].size / 1000);
				}.bind(this);
				reader.readAsDataURL(this.input.el.files[0]); // Load file
				return true;
			}
		} catch (e) {
			throw e;
		}
	}
	/** Adds an option to this input element	        
        @todo Consider how to share these lists with the entire application rather than
        reduntantly load the same data over and over again.  
        Perhaps there should be an OPT-LIST object inside MAIN		    
        @param {string} label The label
        @param {string} value The value
        @returns {ThisType} Returns this object for method chaining
    */
	addOption(label, value) {
		/*if (typeof label === 'undefined' || typeof value === 'undefined') {
			try {
				this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');
				this.prompt.formGroup.addInput('label', INPUTTYPES.TEXT, '');
				this.prompt.formGroup.addInput('value', INPUTTYPES.TEXT, '');
				this.prompt.buttonGroup.addButton('Add Option').el.onclick = function() {
					this.options.push(new Option(this.datalist.el, $(this.prompt.el).find('input[name="label"]')[0].value, $(this.prompt.el).find('input[name="value"]')[0].value));
					this.prompt.hide();
				}.bind(this);
				this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);
				this.prompt.show();
			} catch (e) {
				console.log('Unable to change name for this element');
				console.log(e);
			}
		} else {*/
		this.options.push(new Option(this.datalist.el, label, value));
		//}
		return this;
	}
}
export { ATTRIBUTES, CONTAINER, EL, FORMELEMENT, INPUTTYPES, MODEL }