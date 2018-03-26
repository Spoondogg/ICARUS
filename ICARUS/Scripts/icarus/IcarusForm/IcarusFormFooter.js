/**
    A generic footer that should be placed at the bottom of content
*/
class IcarusFormFooter extends FOOTER {
    /**
        Constructs a Form Footer
        @param {EL} node The object to contain the table
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.el.className = 'btn-group-justified form-footer';
        this.buttonGroup = new BUTTONGROUP(this, null, ALIGN.VERTICAL, SIZE.MED); // Left aligned button group
    }    
}