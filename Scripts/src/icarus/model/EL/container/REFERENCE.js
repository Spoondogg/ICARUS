/** @module */
import { ICONS } from '../../../enums/ICONS.js';
import NAVHEADER from '../nav/navbar/navheader/NAVHEADER.js';
/** A REFERENCE represents a collection of menus and tabs representing the MODEL
    of its given CONTAINER as part of the document-map
    @class
*/
export default class REFERENCE extends NAVHEADER {
    constructor(node, model) {
        super(node, model);
        /** The CONTAINER that this REFERENCE is referring to
            
        */
        //this.container = this.required(model.container);
        this.name = this.required(model.name);
        this.addClass('reference');
        this.addTabbableMenu('tab1', 'Tab1', ICONS.FLAG, [
            {
                label: 'ONE',
                icon: ICONS.FLAG,
                name: 'ONE'
            }
        ], false);
    }
}