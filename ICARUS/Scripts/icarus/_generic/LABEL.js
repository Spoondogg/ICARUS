/**
    A standard control-label for form elements
*/
class LABEL extends EL {
    /**
        Constructs a generic Label
        @param {EL} node the parent
        @param {string} label The innerHtml to be displayed
     */
    constructor(node, label) {
        super(node, 'LABEL', new MODEL(new ATTRIBUTES('control-label')), label || 'My Label');
    }
}