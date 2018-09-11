﻿import EL from '../../../EL.js';
/**
    Represents the model for an <OPTION> for an Icarus Form Select
    
*/
export default class OPTION extends EL {
    /**
        A form option
        @param {SELECT} node The parent
        @param {string} label The element label
        @param {string} value The element value
    */
    constructor(node, label, value) {
        value = value ? value : '';
        label = label ? label : value;
        super(node, 'OPTION', {
            'value': value
        }, label);
    }
}