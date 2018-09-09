import GROUP from '../GROUP.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import BUTTON from '../../button/BUTTON.js';
import TOGGLEBUTTON from '../../button/togglebutton/TOGGLEBUTTON.js';
import MODEL from '../../../MODEL.js';
import { ALIGN } from '../../../../enums/ALIGN.js';
/**
    A container for Buttons
*/
export default class BUTTONGROUP extends GROUP {
    /**
        Constructs a Button Group
        @param {EL} node The parent
        @param {string} className Optional className to be appended to default class
        @param {string} align ALIGN.enum
        @param {string} size SIZE.enum
     */
    constructor(node, className, align, size) {
        let attributes = new ATTRIBUTES('btn-group');
        attributes.set('role', 'group');
        super(node, 'DIV', new MODEL(attributes));

        if (className) { this.addClass(className); }
        if (align === ALIGN.VERTICAL) { this.addClass('btn-group-vertical'); }
        this.addClass('btn-group-' + size ? size : SIZE.EXTRA_SMALL);

        /* Add cases for each relevant constructor that inherited class does not have */
        this.addCase('BUTTON', function (model) {
            return this.addButton(model.label, model.glyphicon, model.buttonType);
        }.bind(this));

        this.addCase('TOGGLEBUTTON', function (model) {
            return this.addToggleButton(model.label, model.glyphicon, model.buttonType);
        }.bind(this));
    }
    /**
        Creates a button and adds it to this button group, then adds it to the buttons array
        @param {string} label The label
        @param {string} glyphicon icon,
        @param {string} buttonType button type
        @returns {BUTTON} A generic button object
    */
    addButton(label, glyphicon, buttonType) {
        let btn = new BUTTON(this, label, glyphicon, buttonType);
        btn.el.onclick = function () {
            return false;
        };
        this.children.push(btn);
        return this.children[this.children.length - 1];
    }
    /**
        Createa a toggle button with a corresponding dropdown menu
        @param {string} label The label
        @param {string} glyphicon The icon
        @param {string} buttonType The button type
        @returns {TOGGLEBUTTON} A toggle button
    */
    addToggleButton(label, glyphicon, buttonType) {
        this.children.push(new TOGGLEBUTTON(this, label, glyphicon, buttonType));
        return this.children[this.children.length - 1];
    }
}