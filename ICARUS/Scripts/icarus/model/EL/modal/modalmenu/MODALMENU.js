﻿import MODAL from '../MODAL.js';
import MENU from '../../nav/menu/MENU.js';
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
export default class MODALMENU extends MODAL { // CALL ME A MENU!!!!
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} children Array of [label, glyphicon, buttonType]
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, children, vertical) {
        super(label, text, vertical);
        this.addClass('prompt');
        this.container.addContainerCase('MENU');

        this.menu = new MENU(
            this.container.body.pane,
            new MODEL(
                new ATTRIBUTES('navbar-inverse')
            ).set({
                'className': 'MENU',
                'name': 'menu'
            })
        );
        this.menu.populate(children);
    }    
}