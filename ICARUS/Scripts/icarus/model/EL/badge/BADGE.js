import EL from '../EL.js';
/**
    A bootstrap badge, typically contained within a list-item
    @param {EL} node The object to contain this element
    @param {string} label The inner text for this element
    
*/
export default class BADGE extends EL {
    constructor(node, label) {
        super(node, 'SPAN', { 'class': 'badge' }, label);
    }
}

