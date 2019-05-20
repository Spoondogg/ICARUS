/** @module */
import IFACE, { EL } from './IFACE.js';
import Move from '../event/Move.js';
/** An interface for Move driven Events
    @class
    @extends IFACE
*/
export default class Movable extends IFACE {
	/** A series of Move Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'movable');
	}
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
        @param { number } [dur] Animation duration in milliseconds)
	    @returns {void}
	*/
    addListeners(node, dur = 150) {
        node.el.addEventListener('move', (ev) => {
            if (ev.detail.direction === 2) {
                //this.onError(node.move, ev, 'MoveUp Failed');
                node.moveDown(node, dur);
            } else {
                node.moveUp(node, dur);
            }
        });
    }
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
        @param {number} [dur] Animation duration in milliseconds
	    @returns {void}
	*/
	setMethods(node, dur = 150) {
		/** Moves the element up
	        @returns {void}
	    */
        this.methods.moveUp = () => this.move(node, 0, dur);
		/** Moves the element down
		    @returns {void}
		*/
        this.methods.moveDown = () => this.move(node, 2, dur);
    }
    /** Checks for the existence of a sibling to this node in the DOM, in the given direction
        @todo Eliminate JQuery dependency and instead use css animations and classes to indicate state
        @param {EL} node Element to implement methods
        @param {number} direction Move Direction (0=up,1=right,2=down,3=left)
	    @returns {boolean} True if sibling exists
	*/
    checkForSibling(node, direction) {
        let n = $(node.el);
        let hasSibling = false;
        switch (direction) {
            case 0: // up
                hasSibling = n.prev().length > 0;
                break;

            case 1: // right
            case 2: // down
                hasSibling = n.next().length > 0;
                break;

            case 3: // left
                break

            default:
                console.warn(node.toString() + '.move(), No direction specified');
        }
        return hasSibling;
    }
	/** Moves this element in the specified direction amongst its siblings
        @param {EL} node Element to implement methods
        @param {number} direction Move Direction (0=up,1=right,2=down,3=left)
        @param {number} [dur] Animation duration in milliseconds
	    @returns {void}
	*/
    move(node, direction = 0, dur = 150) {
        console.log(node.toString() + '.moveUp(' + dur + ')');
        let nA = $(node.el);
        let hasSibling = this.checkForSibling(node, direction);
        if (hasSibling) {
            // Get next/prev sibling
            let siblings = node.getContainer().get();
            let myIndex = siblings.indexOf(node);
            let siblingIndex = direction === 0 ? myIndex - 1 : myIndex + 1;
            let sibling = siblings[siblingIndex];
            let nB = $(sibling.el);
            // Collapse element and sibling
            [nA, nB].forEach((n) => n.animate({
                height: 'toggle'
            }, dur));
            // Swap positions
            setTimeout(() => {
                // in the DOM...
                switch (direction) {
                    case 0:
                        nB.insertAfter(node.el);
                        break;
                    case 2:
                        nB.insertBefore(node.el);
                        break;
                    default:
                        console.warn('Unrecognized direction', direction);
                }
                // Swap positions in array too see https://stackoverflow.com/a/872317/722785
                let tmp = siblings[siblingIndex];
                siblings[siblingIndex] = siblings[myIndex];
                siblings[myIndex] = tmp;
                // Restore element and sibling
                setTimeout(() => {
                    [nA, nB].forEach((n) => n.animate({
                        height: 'toggle'
                    }, dur));
                }, dur);
            }, dur);
        }
	}
}
export { EL, IFACE, Move }