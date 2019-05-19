/** @module */
import IFACE, { EL } from './IFACE.js';
import Collapse from '../event/Collapse.js';
import Expand from '../event/Expand.js';
import Modify from '../event/Modify.js';
/** An interface for Drag driven Events
    @see https://www.w3schools.com/jsref/event_ondrag.asp
    @class
    @extends IFACE
*/
export default class Draggable extends IFACE {
	/** A series of Drag Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'draggable');
        node.setAttribute('draggable', true);
        node.dragging = false;
    }
    touchStart(ev, node) {
        setTimeout(() => {
            try {
                // Grab the location of touch
                let [touchLocation] = ev.targetTouches;
                node.touchLocation = [touchLocation.pageX, touchLocation.pageY]; // only need Y
                // Check the height(s) of all siblings and store
                node.touchSiblings = node.getContainer().get();
                node.siblingHeights = node.touchSiblings.map((s) => Math.round(s.el.getBoundingClientRect().height));
                node.myIndex = node.touchSiblings.indexOf(node);
                //console.log('Total Sibling Height', node.siblingHeights.reduce((a, b) => a + b, 0));
            } catch (e) {
                console.warn('Unable to dispatch TouchStart', ev);
                throw e;
            }
        }, 150);
    }
    /* eslint-disable max-lines-per-function, complexity, max-statements */
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
    addListeners(node) {
        if (node.className !== 'MAIN') {
            node.touchLocation = null;
            node.siblingHeights = null;
            node.dragTimer = null;
            node.touchSiblings = null;
            node.myIndex = null;
            node.navheader.el.addEventListener('touchstart', (ev) => this.touchStart(ev, node), { passive: true });
            node.navheader.el.addEventListener('touchmove', (ev) => {
                node.dragging = true;
                node.addClass('dragging');
                try {
                    clearTimeout(node.dragtimer);
                } catch (e) {
                    console.log('timer error', e);
                }
                ev.preventDefault();
                let [touchLocation] = ev.targetTouches;
                node.dragtimer = window.setTimeout(() => {
                    node.navheader.el.dispatchEvent(new Collapse(node.navheader));
                    //console.log(node.toString() + '.touchend()', [touchLocation.pageX, touchLocation.pageY]);
                    // calculate distance
                    let dir = node.touchLocation[1] > touchLocation.pageY ? 0 : 2;
                    let diff = Math.abs(node.touchLocation[1] - touchLocation.pageY);
                    //console.log(' - Moved ' + dir + ' ' + diff + ' pixels from index[' + node.myIndex + '] at ' + node.touchLocation[1] + ' to ' + touchLocation.pageY);
                    // starting at index, determine number of objects become greater than height
                    let objSum = 0 - node.navheader.el.getBoundingClientRect().height; // -56px is default height
                    let i = node.myIndex;
                    let j = 0;
                    while (objSum < diff) {
                        objSum += node.siblingHeights[i];
                        i = dir === 2 ? i + 1 : i - 1;
                        j++;
                    }
                    //console.log(' - objSum: ' + j + ' objects, total height' + objSum);
                    node.touchSiblings.forEach((s) => s.removeClass('drag-over'));
                    let targetIndex = dir === 2 ? node.myIndex + j : node.myIndex - j;
                    let target = node.touchSiblings[targetIndex];
                    target.addClass('drag-over');
                    node.dragtimer = window.setTimeout(() => {
                        // Determine if still dragging / timeout drag
                        node.dragging = false;
                        node.removeClass('dragging');
                        target.removeClass('drag-over');
                        // Insert at location
                        setTimeout(() => {
                            if (node.dragging === false) {
                                $(node.el).animate({
                                    height: 'toggle'
                                }, 300);
                                setTimeout(() => $(node.el).insertBefore(target.el), 300);
                                $(node.el).animate({
                                    height: 'toggle'
                                }, 300);

                                // Swap positions in array too see https://stackoverflow.com/a/872317/722785
                                let k = node.myIndex;
                                if (dir === 2) {
                                    while (k < targetIndex) {
                                        let tmp = node.touchSiblings[k];
                                        node.touchSiblings[k] = node.touchSiblings[k + 1];
                                        node.touchSiblings[k + 1] = tmp;
                                        k++;
                                    }
                                } else {
                                    while (k > targetIndex) {
                                        let tmp = node.touchSiblings[k];
                                        node.touchSiblings[k] = node.touchSiblings[k - 1];
                                        node.touchSiblings[k - 1] = tmp;
                                        k--;
                                    }
                                }
                                node.navheader.el.dispatchEvent(new Expand(node.navheader));
                                let container = node.getContainer();
                                container.el.dispatchEvent(new Modify(container));
                            } else {
                                clearTimeout(node.dragtimer);
                            }
                        }, 300);
                    }, 400);
                }, 10);
                ev.stopPropagation();
            }, { passive: false });
        }
		node.el.addEventListener('dragstart', (ev) => this.onError(node.dragstart, ev, 'DragStart Failed'));
		node.el.addEventListener('drop', (ev) => this.onError(node.drop, ev, 'Drop Failed'));
        node.el.addEventListener('dragover', (ev) => this.onError(node.dragover, ev, 'DragOver Failed'));
        node.el.addEventListener('dragleave', (ev) => this.onError(node.dragleave, ev, 'DragLeave Failed'));
		node.el.addEventListener('dragend', (ev) => this.onError(node.dragend, ev, 'DragEnd Failed'));
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Drag Start Event Handler: Drag the element
            @param {Event} ev DragStart Event
            @returns {void}
        */
        this.methods.dragstart = (ev) => {
            node.dragging = true;
            try {
                let cnt = node.getContainer();
                console.log(' - Setting ' + cnt.toString() + ' state to modified');
                cnt.el.dispatchEvent(new Modify(cnt));

                //console.log('Dragging: ' + node.toString() + '::' + node.label);
                node.addClass('dragging');
                node.body.el.dispatchEvent(new Collapse(node.body)); //node.body.collapse();
				ev.dataTransfer.setData("Container", node.id);
				ev.stopPropagation();
			} catch (e) {
				console.warn('Unable to dispatch DragStart', node, ev);
				throw e;
			}
		};
		// Drop this element
		this.methods.drop = (ev) => {
            let cont = ev.dataTransfer.getData("Container");
            //console.log('Dropping: ' + node.toString() + '::' + node.label + ' before Element(' + cont.toString() + ')');
            //https://stackoverflow.com/a/37297292/722785
            [...document.getElementsByClassName('drag-over')].forEach((el) => el.classList.remove('drag-over'));

            let container = $(document.getElementById(cont));
            container.insertBefore(node.el);

            let cnt = node.getContainer();
            //console.log(' - Setting ' + cnt.toString() + ' state to modified');
            cnt.el.dispatchEvent(new Modify(cnt));
			ev.preventDefault();
			ev.stopPropagation();
		};
		// Allow drop on this element
		this.methods.dragover = (ev) => {
            //console.log('Dragging over ' + node.toString() + '::' + node.label);
            node.addClass('drag-over');
			ev.preventDefault();
			ev.stopPropagation();
        };
        // No longer having an element dragged over this
        this.methods.dragleave = (ev) => {
            //console.log('Drag-Leave ' + node.toString() + '::' + node.label);
            node.removeClass('drag-over');
            ev.preventDefault();
            ev.stopPropagation();
        };
		// Action(s) performed when drag events complete
        this.methods.dragend = (ev) => {
            node.dragging = false;
            node.removeClass('dragging');
            //console.log('Drag End: ' + node.toString() + '::' + node.label);
			ev.stopPropagation();
		};
	}
}
export { Collapse, EL, Modify }