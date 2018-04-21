﻿/**
    A Footer that sticks to bottom of page    
*/
class STICKYFOOTER extends FOOTER {
    /**
        Constructs a footer stuck to the bottom of the viewpane
        @param {EL} node The object to contain the table
        @param {MODEL} model stickyfooter model
     */
    constructor(node, model) {
        super(node, model);
        this.el.setAttribute('class', 'stickyfooter');
    }
}