/**
    @module
*/
import '../../../../../StringMethods.js';
import FORMELEMENT, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../FORMELEMENT.js';
import OPTION from '../../../option/OPTION.js';
import SELECT from '../../../select/SELECT.js';
/**
    Represents a <SELECT> for an Icarus Form    
    @class
    @extends FORMELEMENT
*/
export default class FORMSELECT extends FORMELEMENT {
/**
    An Input/Select OPTION constructor.
    @param {EL} node The parent
    @param {string} model The Form Select model
    @param {array} options A collection of key,value pairs
 */
constructor(node, model) {
super(node, 'DIV', model);
this.dataElements = ['options'];
this.createSelect();
}
/**
	    Creates the SELECT Element
        @returns {EL} A SELECT input Element
	*/
createSelect() {
this.input = new SELECT(this.body.pane, new MODEL(new ATTRIBUTES({
'class': 'form-control',
'name': ('INPUT_' + String().guid()).friendly()
})));
if (this.dataId > 0) {
let options = this.data.options.split(',');
try {
for (let o = 0; o < options.length; o++) {
//console.log('Option[' + o + ']: ' + options[o]);
//let opt = new OPTION(this.input, options[o], options[o]); // omit new ???
this.addOption(options[o], options[o]);
}
} catch (e) {
console.log(e);
}
}
return this.input;
}
/**
	    Adds an OPTION to this SELECT
	    @param {string} value The value
        @param {string} label The label	    
	    @param {boolean} selected If true, option is selected
        @returns {void}
        @throws Throws an error if unable to create the OPTION element
	*/
addOption(value, label) {
try {
/*if (typeof label === 'undefined' || typeof value === 'undefined') {
	this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');
	this.prompt.formGroup.addInput('Label', INPUTTYPES.TEXT, '');
	this.prompt.formGroup.addInput('Value', INPUTTYPES.TEXT, '');
	this.prompt.buttonGroup.addButton('Add Option').el.onclick = () => {
		this.options.push(new Option(this, $(this.prompt.el).find('input[name="Label"]')[0].value, $(this.prompt.el).find('input[name="Value"]')[0].value));
		this.prompt.hide();
	};
	this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);
	this.prompt.show();
} else {*/
this.input.options.push(new OPTION(this.input, value, label));
//}
} catch (e) {
throw e;
}
}
}
export { EL, INPUTTYPES, OPTION };