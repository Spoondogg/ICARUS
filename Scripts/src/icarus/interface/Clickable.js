/** @module */
import IFACE, { EL, MODEL } from './IFACE.js';
import Activate from '../event/Activate.js';
import Deactivate from '../event/Deactivate.js';
import Deselect from '../event/Deselect.js';
import LongClick from '../event/LongClick.js';
import { LongclickDelay } from '../enums/StyleVars.js';
import Select from '../event/Select.js';
import Selectable from './Selectable.js';
import Switchable from './Switchable.js';
/** An interface for Click driven Events
    @class
    @extends IFACE
*/
export default class Clickable extends IFACE {
	/** A series of Click Related Events and Methods
        A 'clickable' element is capable of performing 5 separate events
            - Single Click toggles Activation/Deactivation
            - Double Click toggles Selection/Deselection
            - Long Click performs contextual Events, Triggers etc
        @todo Stop Propagation could use some work
        @param {EL} node Class to implement this interface (Typically 'this')
        @param {MODEL} options Click Timer Options
	*/
	constructor(node, options = new MODEL().set({
		delay: 200,
		longClickDelay: LongclickDelay,
		stopPropagation: true
	})) {
		super(node, 'clickable');
        this.options = options;
		node.implement(new Switchable(node));
		node.implement(new Selectable(node));
		node.el.style.webkitTouchCallout = 'none';
		node.timer = null;
        node.touchtime = 0; // mobile double click detection
    }
    /** Disables the browser context menu
        @description This is generally not considered a good practice.  Use sparingly and be sure to enable again once you're done
        @see https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
        @returns {Promise<boolean>} Resolves true on completion
    */
    disableContextMenu() {
        return new Promise((resolve) => {
            document.addEventListener('contextmenu', this.preventDefault);
            resolve(true);
        });       
    }
    /** Enables the Context Menu in cases where it may have been disabled
        @param {number} delay Delay
        @returns {Promise<boolean>} Resolves true on completion
    */
    enableContextmenu(delay = 500) {
        return new Promise((resolve) => {
            setTimeout(() => {
                document.removeEventListener('contextmenu', this.preventDefault);
            }, delay);
            resolve(true);
        });
    }
    /** Calls Event.preventDefault attached to an Event Listener
        @param {Event} ev Event
        @returns {void}
    */
    preventDefault(ev) {
        ev.preventDefault();
    }
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		// Detect Long click on desktop (MouseEvent) and mobile (TouchEvent) 
		// @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
		// Consider showing a simple press-timer animation after 100ms
        node.el.addEventListener('mousedown', (ev) => node.pressDown(ev), { passive: true });
        node.el.addEventListener('mouseup', (ev) => node.pressUp(ev), { passive: true });
		node.el.addEventListener('touchstart', (ev) => node.pressDown(ev), { passive: true });
		node.el.addEventListener('touchend', (ev) => node.pressUp(ev), { passive: true });
        node.el.addEventListener('click', (ev) => node.pressed(ev), { passive: true });
	}
	startTimer(node) {
		clearTimeout(node.timer);
		node.touchtime = 1;
	}
	resetTimer(node) {
		node.touchtime = 0;
		clearTimeout(node.timer);
    }
    /** On PressDown Event, starts a timer that triggers the Long Press Event
        @param {EL} node Element to implement methods
        @param {Event} ev Event
		@returns {Promise<any>} Promise to resolve given function
	*/
    pressDown(node, ev) {
        node.addClass('press').then(() => {
            //console.log(node.toString() + '.press-down()');
            node.timer = window.setTimeout(() => {
                this.disableContextMenu().then(() => {
                    ev.stopPropagation();
                    this.startTimer(node);
                    Promise.resolve(node.longclick()).then(
                        () => node.removeClass('press').then(
                            () => this.enableContextmenu()));
                });
            }, this.options.longClickDelay);
        });
    }
    /** On PressUp Event, cancels PressDown Timer
        @param {EL} node Element to implement methods
        @param {Event} ev Event
		@returns {void} 
	*/
    pressUp(node, ev) {
        //console.log(node.toString() + '.press-up()');
        ev.stopPropagation();
        node.removeClass('press');
        clearTimeout(node.timer);
    }
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
    setMethods(node) {
		/** Toggle the 'active' state of this Element and dispatch appropriate Event
		    @returns {void}
		*/
		this.methods.click = () => this.toggle('active', new Activate(node), new Deactivate(node));
		/** Toggle the 'selected' state of this Element and dispatch appropriate Event
		    @returns {void}
		*/
		this.methods.dblclick = () => this.toggle('selected', new Select(node), new Deselect(node));
		/** Dispatches a LongClick Event
		    @returns {void}
		*/
        this.methods.longclick = () => node.el.dispatchEvent(new LongClick(node));
		/** On PressDown Event, starts a timer that triggers the Long Press Event
            @param {Event} ev Event
		    @returns {Promise<any>} Promise to resolve given function
		*/
        this.methods.pressDown = (ev) => this.pressDown(node, ev);
		/** On PressUp Event, cancels PressDown Timer
            @param {Event} ev Event
		    @returns {void} 
		*/
        this.methods.pressUp = (ev) => this.pressUp(node, ev);
		/** Press Event occurs after Press Down/Up events complete, 
		    signalling that the element has been pressed
            @param {Event} ev Event
		    @returns {Promise<any>} Promise to resolve appropriate Press Event
		*/
		this.methods.pressed = (ev) => {
			//console.log('Pressed', this.timer, ev);
            ev.stopPropagation();
            try {
                this.disableContextMenu().then(() => {
                    if (node.touchtime === 0) {
                        node.touchtime = new Date().getTime();
                        setTimeout(() => {
                            if (node.touchtime !== 0) {
                                //console.log('click-single', node.timer, node);
                                node.removeClass('press');
                                this.resetTimer(node);
                                Promise.resolve(node.click()).then(() => this.enableContextmenu());
                            }
                        }, this.options.delay);
                    } else if (new Date().getTime() - node.touchtime < this.options.delay) {
                        //console.log('click-double', node.timer, node);
                        node.removeClass('press');
                        this.resetTimer(node);
                        Promise.resolve(node.dblclick()).then(() => this.enableContextmenu());
                    } else {
                        //console.log('longclick-up', node.timer, node);
                        node.removeClass('press');
                        this.resetTimer(node);
                        Promise.resolve(true).then(() => this.enableContextmenu());
                    }
                });                
			} catch (e) {
                console.warn('Clickable Error', e);
                node.removeClass('press');
				this.resetTimer(node);
                Promise.reject(e).then(() => this.enableContextmenu());
            }
		}
	}
}
export { Activate, Deactivate, Deselect, EL, IFACE, Select, Selectable, Switchable }