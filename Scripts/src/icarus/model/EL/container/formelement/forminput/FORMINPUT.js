/** @module */
import FORMELEMENT, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../FORMELEMENT.js';
import DATALIST from '../../../datalist/DATALIST.js';
//import PROMPT from '../../../modal/prompt/PROMPT.js';
import FORMTEXTAREA from '../formtextarea/FORMTEXTAREA.js';
import IMG from '../../../img/IMG.js';
import INPUT from '../../../input/INPUT.js';
//import STRING from '../../../../../STRING.js';
/** Represents an INPUT for an Icarus Form
    @class
    @extends FORMELEMENT
*/
export default class FORMINPUT extends FORMELEMENT {
	/** Constructs a FORMINPUT element
	    @param {EL} node Parent
	    @param {MODEL} model The model
	 */
	constructor(node, model) {
		console.log('FORMINPUT');
		super(node, 'DIV', model);
		this.createInput();
	}
	/** Creates an INPUT Element
        @returns {INPUT} An INPUT EL
        @todo: This should use a factory constructor pattern to create specific input types
        @todo file, text, number, email, phone (html5 inputs) 
        @todo This should use a factory constructor pattern to create specific input types
    */
	createInput() {
		let nm = this.attributes.name || this.data.name;
		let val = this.attributes.value || this.data.value;
		this.input = new INPUT(this.body.pane, new MODEL(new ATTRIBUTES({
			'class': 'form-control',
			'type': this.attributes.type || this.data.type || 'TEXT',
			'list': nm + '-options',
			'name': nm,
			'value': val || ''
		})));
		if (this.data.type === 'file' || this.attributes.type === 'image' || this.attributes.type === 'file') {
			this.createSubForm();
		} else {
			this.addInputOptions();
		}
		return this.input;
	}
	/** Add any preset options to the datalist
	    @returns {void}
	*/
	addInputOptions() {
		this.options = [];
		this.datalist = new DATALIST(this.node, new MODEL(new ATTRIBUTES({
			'id': this.attributes.name + '-options'
		})));
		if (Array.isArray(this.options)) {
			for (let o = 0; o < this.options.length; o++) {
				this.addOption(this.options[o].value);
			}
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
			'name': 'base64'
			//'label': 'base64'
		}).set({
			'name': 'base64'
			//'label': 'base64'
		})));
		this.fileName = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			'name': 'filename',
			'label': 'base64'
		}).set({
			'name': 'filename'
			//'label': 'filename'
		})));
		this.fileType = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			'name': 'fileType',
			'label': 'base64'
		}).set({
			'name': 'fileType'
			//'label': 'fileType'
		})));
		this.fileSize = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			'name': 'fileSize'
		}).set({
			'name': 'fileSize'
			//'label': 'fileSize'
		})));
		this.dimX = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			'name': 'dimX'
		}).set({
			'name': 'dimX'
			//'label': 'dimX'
		})));
		this.dimY = new FORMINPUT(this.body.pane, new MODEL(new ATTRIBUTES({ //FORMINPUT
			'name': 'dimY'
		}).set({
			'name': 'dimY'
			//'label': 'dimY'
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
	/** Sets the label of this element to the given value.
        @param {string} label The name to be set
        @returns {ThisType} Returns this object for method chaining
    */
	setLabel(label) {
		this.navBar.menu.tab.anchor.setInnerHTML(label);
		this.label.setInnerHTML(label);
		this.input.el.setAttribute('name', label);
		return this;
	}
	/**
		    Adds an option to this input element
	        
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
export { ATTRIBUTES, EL, FORMELEMENT, INPUTTYPES, MODEL };