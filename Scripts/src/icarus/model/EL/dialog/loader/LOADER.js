/** @module */
import DIALOG, { DIV, EL, MODEL } from '../../dialog/DIALOG.js'; //ATTRIBUTES
import CONSOLE from '../../list/console/CONSOLE.js';
import PROGRESSBAR from './PROGRESSBAR.js';
/** A Dialog showing loading details
    @public
    @class
    @extends DIALOG
*/
export default class LOADER extends DIALOG {
	/** Constructs a LOADER dialog
        @param {number} value Percentage complete (integer)
        @param {string} label The header text for this modal	 
        @param {CONTAINER} container Parent Container
    */
	constructor(value = 0, label = '', container = null) {
		super(new MODEL().set({
			value,
			label,
			container,
			caller: container,
			name: 'loader'
		}), false);
		this.className = 'LOADER';
		this.addClass('loader');
		this.el.setAttribute('data-backdrop', false);
		this.progress = new DIV(this.body, new MODEL('progress'));
		this.progressBar = new PROGRESSBAR(this.progress);
		this.console = new CONSOLE(this.body);
		this.progressBar.el.onclick = () => this.console.flip();
		this.log(value);
	}
	/** Sets the progress bar status
		@param {number} value Percentage as integer (ie: 50 means 50%).
		@param {string} text Text displayed inside progress bar.  
	    @param {boolean} show If true, the log will be displayed
        @param {number} delay Delay to hide when value reaches 100 or stay visible if value === 0
	    @returns {Promise<LOADER>} Promise to return this LOADER after success
	*/
	log(value, text = '', show = true, delay = 300) {
		return this.chain(() => {
			this.progressBar.el.style.width = value + '%';
			this.progressBar.el.setAttribute('aria-valuenow', value);
			if (text) {
				let txt = text.substr(0, 32) + '...';
				this.progressBar.text.setInnerHTML(txt);
				this.console.addEntry(text);
			}
			if (value < 100) {
				clearTimeout(this.logTimer);
				if (show) {
					this.show();
				}
				//resolve(show ? this.show() : this);
			} else {
				this.logTimer = window.setTimeout(() => {
					clearTimeout(this.logTimer);
					//setTimeout(() => this.hide().then((loader) => resolve(loader)), delay);
					setTimeout(() => this.hide(), delay);
				}, delay);
			}
		});
	}
}
export { CONSOLE, DIV, EL, MODEL, PROGRESSBAR }