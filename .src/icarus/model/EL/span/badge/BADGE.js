/**
    @module
*/
import SPAN from '../SPAN.js';
/**
    A bootstrap badge, typically contained within a list-item
    @class
    @extends EL
*/
export default class BADGE extends SPAN {
/**
    Construct a Badge Element
    @param {EL} node The object to contain this element
    @param {string} label The inner text for this element
*/
constructor(node, label) {
super(node, { 'class': 'badge' }, label);
}
}