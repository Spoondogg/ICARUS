/**
    @module
*/
import INPUT, { EL, MODEL, ATTRIBUTES } from '../INPUT.js';
import TEXTAREA from '../../textarea/TEXTAREA.js';
/**
    A file INPUT element for a FORM Container
    @class
    @extends INPUT
*/
export default class FILE extends INPUT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, new MODEL(
            new ATTRIBUTES({
                'type': 'FILE',
                'name': model.attributes.name
            })
        ));

        /**
            @property {TEXTAREA} base64 A textarea to hold a base64 encoded string
        */
        this.base64 = new TEXTAREA(this.body.pane, new MODEL().set({
            'name':'base64'
        }));

        this.dataElements.push(
            new MODEL(new ATTRIBUTES({
                'name': 'accept',
                'type': 'text'
            })).set({
                'element': 'INPUT',
                'label': 'accept'
            })
        );
    }    
}