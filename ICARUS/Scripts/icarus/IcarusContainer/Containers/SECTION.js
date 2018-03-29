/**
    A generic SECTION within an ARTICLE.

    A SECTION represents a container that can be expanded or hidden and
    have elements added to itself.    
*/
class SECTION extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {EL} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'SECTION', model);
        this.addContainerCase('FORM');
        this.populate(model.children);
    }
}