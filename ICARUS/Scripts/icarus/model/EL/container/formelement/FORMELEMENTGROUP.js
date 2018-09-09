import CONTAINER from '../CONTAINER.js';
import FORMPOSTINPUT from './formpostinput/FORMPOSTINPUT.js';
import TEXTAREA from './textarea/TEXTAREA.js';
import INPUT from './input/INPUT.js';
import SELECT from './select/SELECT.js';
/**
    A container made up of a group of form elements
*/
export default class FORMELEMENTGROUP extends CONTAINER {
    /**
        Constructs a Form Element Group
        @param {EL} node The parent
        @param {MODEL} model datamodel
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['INPUT', 'SELECT', 'TEXTAREA']);
        this.addClass('form-element-group');
        //this.construct();
        this.populate(model.children);
    }

    construct() {

    }

    /**
     * Adds the array of input elements to this form element group
     * @param {FORMELEMENT} inputs A list of inputs
     */
    addInputElements(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            //console.log('inputs[' + i + ']:', inputs[i]);
            let inp = null;
            if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
                inp = new FORMPOSTINPUT(this.body.pane, inputs[i]);
            } else {
                switch (inputs[i].element) {
                    case 'TEXTAREA':
                        inp = new TEXTAREA(this.body.pane, inputs[i]);
                        break;

                    case 'SELECT':
                        inp = new SELECT(this.body.pane, inputs[i]);
                        break;

                    default:
                        inp = new INPUT(this.body.pane, inputs[i]);                    
                }
            }
            this.children.push(inp);
        }
    }
}