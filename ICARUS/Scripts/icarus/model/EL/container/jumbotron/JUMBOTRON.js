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

        this.body.pane.addClass('jumbotron');
        this.body.pane.addClass('noselect');

        this.dataElements = ['header', 'p', 'bgImage'];

        // Data Attributes
        if (this.dataId > 0) {
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': this.data.header
            }), 1);

            if (this.data.p) {
                if (this.data.p.length > 0) {
                    this.hr = new HR(this.body.pane, new MODEL());
                    this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
                }
            }
            
            if (this.data.bgimage) {
                this.body.pane.el.setAttribute('style',
                    'background: url(../Content/Images/' + this.data.bgimage + ');'
                );
            }
        }

        console.log('JUMBOTRON: ');
        console.log(this);

        this.populate(model.children);
    }
}