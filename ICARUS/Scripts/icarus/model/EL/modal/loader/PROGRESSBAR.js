/**
    @module
*/
import EL from '../../EL.js';
/**
    A Bootstrap Progress Bar 
    @class
    @extends EL
*/
export default class PROGRESSBAR extends EL {
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('progress-bar progress-bar-info progress-bar-striped active noselect');
        this.el.setAttribute('role', 'progressbar');
        this.el.setAttribute('aria-valuenow', 0);
        this.el.setAttribute('aria-valuemin', 0);
        this.el.setAttribute('aria-valuemax', 100);
    }
}