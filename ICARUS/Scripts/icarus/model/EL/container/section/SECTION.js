/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
/**
    A generic SECTION within an ARTICLE.
    @description A SECTION represents a container that can be expanded or hidden and
    have elements added to itself.    
    @class
    @extends CONTAINER
*/
export default class SECTION extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {ARTICLE} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'SECTION', model, ['FORM']);
        this.populate(model.children);
    }

    construct() {

    }
}