/**
    An icon button that toggles a dropdown
*/
class CARET extends SPAN {
    /**
        Construct an Icon button to toggle a dropdown
        @param {EL} node Parent element
     */
    constructor(node) {
        super(node, new MODEL(new ATTRIBUTES('caret')));
    }
}