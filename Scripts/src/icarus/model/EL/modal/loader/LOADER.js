/**
    @module
*/
import DIALOG, { ATTRIBUTES, DIV, MODEL } from '../../dialog/DIALOG.js';
import CONSOLE from '../../ul/console/CONSOLE.js';
import PROGRESSBAR from './PROGRESSBAR.js';
/**
    A Loader type modal.
    @class
    @extends DIALOG
*/
export default class LOADER extends DIALOG {
	/**
        Constructs a dialog that displays loading details
        @param {number} value Percentage complete (integer)
        @param {string} label The header text for this modal	    
        @param {string} text Text that appears in modal's well
    */
	constructor(value = 0, label = '', text = '') {
		super(new MODEL().set({
			value,
			label,
			text
		}));
		this.addClass('loader');
		//this.el.setAttribute('name', 'LOADER');
		this.progress = new DIV(this.body, new MODEL('progress'));
		this.progressBar = new PROGRESSBAR(this.progress, new MODEL());
		this.console = new CONSOLE(this.body, new MODEL(new ATTRIBUTES({
			'class': 'console collapse in',
			'aria-expanded': false
		})));
		this.progressBar.el.onclick = () => {
			$(this.console.el).collapse('toggle');
		};
		if (this.well) {
			$(this.progress.el).insertBefore(this.well.el);
			$(this.console.el).insertBefore(this.well.el);
		}
		this.log(value);
	}
	/**
		Sets the progress bar status
		@param {number} value Percentage as integer (ie: 50 means 50%).
		@param {string} text Text displayed inside progress bar.  
	    @param {boolean} show If true, the log will be displayed
	    @returns {void}
	*/
	log(value, text, show = false) {
		if (this.el) {
			this.progressBar.el.style.width = value + '%';
			this.progressBar.el.setAttribute('aria-valuenow', value);
			if (text) {
				let txt = text.substr(0, 32) + '...';
				this.progressBar.setInnerHTML(txt);
				this.console.addEntry(text);
				console.log(text);
			}
			if (show) {
				this.expand();
				if (value === 100) {
					this.close();
				}
			}
		} else {
			console.log('Unable to find loader');
		}
	}
	/**
        Shows the Loader Console
        @returns {void}
    */
	showConsole() {
		$(this.console.el).collapse('show');
	}
	/**
        Hides the Loader Console
        @returns {void}
    */
	hideConsole() {
		$(this.console.el).collapse('hide');
	}
}