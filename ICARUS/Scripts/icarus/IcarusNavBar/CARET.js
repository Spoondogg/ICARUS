/**
    An icon button that toggles a dropdown
*/
class CARET extends EL {
    /**
        Construct an Icon button to toggle a dropdown
        @param {EL} node Parent element
     */
    constructor(node) {
        super(node, 'SPAN', new MODEL(new ATTRIBUTES('caret')));
    }
}