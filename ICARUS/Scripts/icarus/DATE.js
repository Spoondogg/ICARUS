/**
    An Icarus Date Object
*/
class DATE {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('textblock');
        this.body.pane.addClass('paragraph');
        //this.dataElements = DATAELEMENTS.PARAGRAPH;
        this.addContainerCase('IMAGE');
        //this.construct();
        this.populate(model.children);
    }

    construct() {
        if (this.dataId > 0) {
            if (this.data.p) {

                let d = getDateObject(getDateValue(this.dateCreated));

                this.header = new HEADER(this.body.pane, new MODEL().set({
                    'label': d.date + ' - ' + d.time//'paragraph header'
                }));
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
            }
        }
    }
}