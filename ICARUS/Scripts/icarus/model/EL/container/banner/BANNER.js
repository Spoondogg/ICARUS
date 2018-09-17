﻿/**
    A fixed height, full width Container
    @module
*/
import CONTAINER from '../CONTAINER.js';

/**
    A horizontal container designed to be
    populated with self contained objects
    @class
    @extends CONTAINER
*/
export default class BANNER extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['CALLOUT','THUMBNAIL']);
        this.body.pane.addClass('banner');
        this.populate(model.children);
    }

    construct() {

    }

    /**
        Returns the parent container for this container or null if it does not exist
        @method
        @returns {CONTAINER} The parent container for this container
    */
    getContainer() {
        return this.getProtoTypeByClass('CONTAINER');
    }

    /**
        Returns the MAIN container
        @method
        @returns {MAIN} The MAIN Container
        @throws Will throw an error 
    */
    getMainContainer() {
        return this.getProtoTypeByClass('CONTAINER').getMainContainer();
    }
}