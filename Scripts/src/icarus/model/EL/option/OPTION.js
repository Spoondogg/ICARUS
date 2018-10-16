/**
    @module
*/
import EL from '../EL.js';
/**
    Represents the model for an <OPTION> for an Icarus Form Select
    @class
    @extends EL
*/
export default class OPTION extends EL {
	/**
		    A form option
		    @param {SELECT} node The parent
		    @param {string} value The element value
	        @param {string} label The element label	    
		*/
	constructor(node, value, label) {
		let val = value ? value : '';
		let lbl = label ? label : value;
		super(node, 'OPTION', {
			'value': val
		}, lbl);
	}
}