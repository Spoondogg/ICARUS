/**
    @module
*/
import EL, { MODEL } from '../EL.js';
/**
    A generic footer that should be placed at the bottom of content
    @class
    @extends EL
*/
export default class FOOTER extends EL {
/**
    Constructs a generic footer.
    @param {EL} node The object to contain the footer
    @param {MODEL} model The object model
 */
constructor(node, model) {
super(node, 'FOOTER', model);
}
}
export { EL, MODEL }