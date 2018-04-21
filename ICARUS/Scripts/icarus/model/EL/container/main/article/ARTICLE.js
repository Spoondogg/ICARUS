/**
    A generic Article    
*/
class ARTICLE extends CONTAINER {
    /**
        Construct and ARTICLE
        @param {MAIN} node The APP to contain the article
        @param {MODEL} model The text that is displayed within the footer
     */
    constructor(node, model) {
        super(node, 'ARTICLE', model);        
        this.addContainerCase('SECTION');
        this.populate(model.children);
    }
}