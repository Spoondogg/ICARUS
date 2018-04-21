/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('noselect');
        
        //this.header = new EL(this, 'p', { 'class': 'lead' }, 'model.header');
        if (model.backgroundUrl) {
            this.el.setAttribute('style',
                'background: url(../Content/Images/' + model.backgroundUrl + ') no-repeat center center fixed;'
            );
        }
        this.populate(model.children);
    }
}