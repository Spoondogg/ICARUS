/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {EL} node The element that will contain this object
        @param {object} model The model
        @param {boolean} showHeader Shows or hides the header
     */
    constructor(node, model) {
        super(node, 'DIV', new MODEL(new ATTRIBUTES('jumbotron noselect')));
        
        this.text = new EL(this, 'p', { 'class': 'lead' }, model.text);
        if (model.backgroundUrl) {
            this.el.setAttribute('style',
                'background: url(../Content/Images/' + model.backgroundUrl + ') no-repeat center center fixed;'
            );
        }
    }
}