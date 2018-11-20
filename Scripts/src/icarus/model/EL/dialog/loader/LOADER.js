/** @module */
import DIALOG, { DIV, MODEL } from '../../dialog/DIALOG.js'; //ATTRIBUTES
import CONSOLE from '../../ul/console/CONSOLE.js';
import PROGRESSBAR from './PROGRESSBAR.js';
/** A Dialog showing loading details
    @class
    @extends DIALOG
*/
export default class LOADER extends DIALOG {
	/** Constructs a LOADER dialog
        @param {number} value Percentage complete (integer)
        @param {string} label The header text for this modal	    
        param {string} text Text that appears in modal's well
        @param {CONTAINER} container Parent Container
    */
	constructor(value = 0, label = '', container = null) {
		super(new MODEL().set({
			value,
			label,
            container
		}));
		this.addClass('loader');
		this.progress = new DIV(this.body, new MODEL('progress'));
		this.progressBar = new PROGRESSBAR(this.progress, new MODEL());
		this.console = new CONSOLE(this.body, new MODEL('console collapse in'));
		this.progressBar.el.onclick = () => {
			$(this.console.el).collapse('toggle');
		};
		this.log(value);
	}
	/** Sets the progress bar status
		@param {number} value Percentage as integer (ie: 50 means 50%).
		@param {string} text Text displayed inside progress bar.  
	    @param {boolean} show If true, the log will be displayed
	    @returns {Promise} Promise to return this LOADER after success
	*/
	log(value, text, show = false) {
        return new Promise((resolve, reject) => {
            try {
                this.progressBar.el.style.width = value + '%';
                this.progressBar.el.setAttribute('aria-valuenow', value);
                if (text) {
                    let txt = text.substr(0, 32) + '...';
                    this.progressBar.setInnerHTML(txt);
                    this.console.addEntry(text);
                    console.log(text);
                }
                if (show) {
                    this.show();
                    if (value === 100) {
                        this.close();
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
	}
	/** Shows the Loader Console
        @returns {void}
    */
	showConsole() {
		$(this.console.el).collapse('show');
	}
	/** Hides the Loader Console
        @returns {void}
    */
	hideConsole() {
		$(this.console.el).collapse('hide');
	}
}