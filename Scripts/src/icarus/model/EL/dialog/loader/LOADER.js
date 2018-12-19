/** @module */
import DIALOG, { DIV, MODEL } from '../../dialog/DIALOG.js'; //ATTRIBUTES
import CONSOLE from '../../ul/console/CONSOLE.js';
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
            container
		}));
        this.addClass('loader');
        this.el.setAttribute('data-backdrop', false);
		this.progress = new DIV(this.body, new MODEL('progress'));
        this.progressBar = new PROGRESSBAR(this.progress, new MODEL());
        this.console = new CONSOLE(this.body, new MODEL('console collapse')); //in
		this.progressBar.el.onclick = () => $(this.console.el).collapse('toggle');
        this.log(value);        
        //this.el.onclick = this.overrideCloseOnFocusOut;
    }
    /** Prevents the LOADER from closing when it loses focus
        @param {event} event Click event
        @returns {void} 
    
    overrideCloseOnFocusOut(event) {
        if (event.target === this.el) {
            this.hide();
        }
    }*/
	/** Sets the progress bar status
		@param {number} value Percentage as integer (ie: 50 means 50%).
		@param {string} text Text displayed inside progress bar.  
	    @param {boolean} show If true, the log will be displayed
        @param {number} delay Delay to hide when value reaches 100 or stay visible if value === 0
	    @returns {Promise<LOADER>} Promise to return this LOADER after success
	*/
	log(value, text = '', show = true, delay = 1000) {
        return new Promise((resolve, reject) => {
            try {
                this.progressBar.el.style.width = value + '%';
                this.progressBar.el.setAttribute('aria-valuenow', value);
                if (text) {
                    let txt = text.substr(0, 32) + '...';
                    this.progressBar.text.setInnerHTML(txt);
                    this.console.addEntry(text);
                }
                if (show) {
                    this.show();
                }
                if (value === 100 && delay > 0) {
                    setTimeout(() => this.hide().then((loader) => resolve(loader)), delay);
                } else {
                    resolve(this);
                }
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