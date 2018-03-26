/**
    Bootstrap style buttons, groups etc
*/
class GLYPHICON extends EL {
    /**
        Construct a Glyphicon
        @param {EL} node parent object
        @param {string} label The label
        @param {string} glyphicon The bootstrap glyphicon or ICON enum
     */
    constructor(node, label, glyphicon) {
        super(node, 'SPAN', new MODEL(new ATTRIBUTES(glyphicon ? glyphicon : '')));
        this.label = new EL(this, 'SPAN', new MODEL(new ATTRIBUTES('label')), label);
    }

    /**
     * Sets the ICON class to the given glypicon
     * @param {string} glyphicon The glyphicon name
     */
    setIcon(glyphicon) {
        this.el.className = glyphicon;
    }
}