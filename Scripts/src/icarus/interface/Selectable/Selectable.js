﻿/** @module */
import Deselect from '../../event/Deselect.js';
import INTERFACE from '../INTERFACE.js';
/** An interface for Select driven Events
    @class
    @extends INTERFACE
*/
export default class Selectable extends INTERFACE {
	/** A series of Select Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('selectable');
        node.el.addEventListener('select', () => node.select());
        node.el.addEventListener('selectAll', () => node.selectAll());
        node.el.addEventListener('deselect', () => node.deselect());
        node.el.addEventListener('deselectAll', () => node.deselectAll());
        /** Select this element
            @returns {Promise<ThisType>} callback
        */
        this.methods.select = () => node.callback(() => {
            try {
                //this.methods.deselectAll().then(() => node.addClass('selected'));
                node.deselectAll().then(() => node.addClass('selected'));
            } catch (e) {
                if (e instanceof TypeError) {
                    console.warn('Unable to deselect node (Consider stopping propagation)', node, e);
                }
            }
        });
        /** Selects any 'selectable' elements 
            @returns {Promise<void>} callback
        */
        this.methods.selectAll = () => Promise.resolve($('.selectable').addClass('selected'));
        /** Deselect this element
            @returns {Promise<ThisType>} callback
        */
        this.methods.deselect = () => node.removeClass('selected');
        /** Deselects any 'selected' elements 
            @returns {Promise<void>} callback
        */
        this.methods.deselectAll = () => node.callback(() => {
            let selected = $('.selected');
            if (selected.length > 0) {
                selected.each((i) => selected[i].dispatchEvent(new Deselect(node)));
            }
        });
    }
}