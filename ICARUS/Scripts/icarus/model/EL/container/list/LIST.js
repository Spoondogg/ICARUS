﻿/**
    List Constructor
    A LIST is essentially a UL that is designed to contain List Items (LI)

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
*/
class LIST extends CONTAINER {
    /**
        Constructs An Unordered List
        @param {EL} node Parent Node
        @param {MODEL} model Object MODEL
     */
    constructor(node, model) {
        super(node, 'UL', model, ['LISTITEM']);
        this.addClass('list');
        this.populate(model.children);
    }

    construct() {

    }

}