/** @module */
import IFACE, { EL, MODEL } from '../IFACE.js';
import Activate from '../../event/Activate.js';
import Deactivate from '../../event/Deactivate.js';
import Deselect from '../../event/Deselect.js';
import Select from '../../event/Select.js';
import Selectable from '../Selectable/Selectable.js';
import Switchable from '../Switchable/Switchable.js';
/** An interface for Click driven Events
    @class
    @extends IFACE
*/
export default class Clickable extends IFACE {
	/** A series of Click Related Events and Methods
        A 'clickable' element is capable of performing 5 separate events
            - Single Click toggles Activation/Deactivation
            - Double Click toggles Selection/Deselection
            - Long Click toggles the CONTEXT Event
        @todo Stop Propogation could use some work
        @param {EL} node Class to implement this interface (Typically 'this')
        @param {MODEL} options Click Timer Options
	*/
	constructor(node, options = new MODEL().set({
		delay: 200,
		longClickDelay: 850,
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
	addListeners(node) {
		// Detect Long click on desktop (MouseEvent) and mobile (TouchEvent) 
		// @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
		// Consider showing a simple press-timer animation after 100ms
		node.el.addEventListener('mousedown', () => node.pressDown());
		node.el.addEventListener('mouseup', () => node.pressUp());
		node.el.addEventListener('touchstart', () => node.pressDown(), { passive: true });
		node.el.addEventListener('touchend', () => node.pressUp(), { passive: true });
		node.el.addEventListener('click', () => node.pressed());
	}
	startTimer(node) {
		clearTimeout(node.timer);
		node.touchtime = 1;
	}
	resetTimer(node) {
		node.touchtime = 0;
		clearTimeout(node.timer);
	}
	setMethods(node) {
		this.methods.click = () => this.toggle('active', new Activate(node), new Deactivate(node));
		this.methods.dblclick = () => this.toggle('selected', new Select(node), new Deselect(node));
		this.methods.longclick = () => console.log('longclick-down', node);
		/** On PressDown Event, starts a timer that triggers the Long Press Event
		    @returns {Promise<any>} Promise to resolve given function
		*/
		this.methods.pressDown = () => {
			node.timer = window.setTimeout(() => {
				this.startTimer(node);
				Promise.resolve(node.longclick());
			}, this.options.longClickDelay);
		}
		/** On PressUp Event, cancels PressDown Timer
		    @returns {void} 
		*/
		this.methods.pressUp = () => clearTimeout(node.timer);
		/** Press Event occurs after Press Down/Up events complete, 
		    signalling that the element has been pressed
		    @returns {Promise<any>} Promise to resolve appropriate Press Event
		*/
		this.methods.pressed = () => {
			//console.log('Pressed', this.timer, ev);
			try {
				if (node.touchtime === 0) {
					node.touchtime = new Date().getTime();
					setTimeout(() => {
						if (node.touchtime !== 0) {
							console.log('click-single', node.timer, node);
							this.resetTimer(node);
							Promise.resolve(node.click());
						}
					}, this.options.delay);
				} else if (new Date().getTime() - node.touchtime < this.options.delay) {
					console.log('click-double', node.timer, node);
					this.resetTimer(node);
					Promise.resolve(node.dblclick());
				} else {
					console.log('longclick-up', node.timer, node);
					this.resetTimer(node);
					//Promise.resolve(longclick(ev));
				}
			} catch (e) {
				console.warn('error', e);
				this.resetTimer(node);
				Promise.reject(e);
			}
		}
	}
}
export { Activate, Deactivate, Deselect, EL, Select, Selectable, Switchable }