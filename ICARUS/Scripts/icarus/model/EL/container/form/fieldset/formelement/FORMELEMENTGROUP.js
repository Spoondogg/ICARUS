/**
    A container made up of a group of form elements
*/
class FORMELEMENTGROUP extends CONTAINER {
    /**
        Constructs a Form Element Group
        @param {EL} node The parent
        @param {MODEL} model datamodel
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('form-element-group');
        this.addContainerCase('INPUT');
        this.addContainerCase('SELECT');
        this.addContainerCase('TEXTAREA');
        //this.construct();
        this.populate(model.children);
    }

    construct() {

    }

    /**
     * Adds the array of input elements to this form element group
     * @param {any} inputs
     */
    addInputElements(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            debug('inputs[' + i + ']:');
            debug(inputs[i]);
            let inp = null;
            if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
                new FORMPOSTINPUT(this.body.pane, inputs[i]);
            } else {
                new INPUT(this.body.pane, inputs[i]);
            }
            this.children.push(inp);
        }
    }
}