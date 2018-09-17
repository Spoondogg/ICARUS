/**
    @module
*/
import CONSOLE from '../../group/ul/console/CONSOLE.js';
import EL, { MODEL, ATTRIBUTES } from '../../EL.js';
import PROGRESSBAR from './PROGRESSBAR.js';
import MODAL from '../MODAL.js';
/**
    A Loader type modal.
    @class
    @extends MODAL
*/
export default class LOADER extends MODAL {
    /**
        Constructs a Loader
        @param {string} label The header text for this modal
        @param {string} text Text that appears in modal's well
        @param {number} value Percentage complete (integer)
     */
    constructor(label, text, value) {
        label = label ? label : '';
        value = value ? value : 0;
        
        super(label, null, true);
        this.addClass('modal-loader');
        this.el.setAttribute('name', 'LOADER');

        this.dialog.el.style.width = '80%';
        //this.el.setAttribute('data-backdrop', 'static');
        //this.el.setAttribute('data-keyboard', false);

        this.dialog.addClass('loader');

        this.progress = new EL(this.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('progress')));

        this.progressBar = new PROGRESSBAR(this.progress, new MODEL());
        
        this.console = new CONSOLE(this.container.body.pane, new MODEL(
            new ATTRIBUTES({
                'class': 'console collapse in',
                'aria-expanded': false
            })
        ));

        this.progressBar.el.onclick = function () {
            $(this.console.el).collapse('toggle');
        }.bind(this);

        if (this.well) {
            $(this.progress.el).insertBefore(this.well.el);
            $(this.console.el).insertBefore(this.well.el);
        }

        this.log(value);
    }

    /**
        Sets the progress bar status.

        @param {number} value Percentage as integer (ie: 50 means 50%).
        @param {string} text Text displayed inside progress bar.  
    */
    log(value, text, show = false) {
        if (this.el) {
            this.progressBar.el.style.width = value + '%';
            this.progressBar.el.setAttribute('aria-valuenow', value);
            if (text) {
                let txt = text.substr(0, 32) + '...';
                this.progressBar.setInnerHTML(txt);
                this.console.addEntry(text);
                try {
                    app.DEBUG.log(text);
                } catch (e) {
                    console.log(text);
                }
            }
            if (show) {
                this.show();
                if (value === 100) {
                    this.hide(1500);
                }
            }
        } else {
            try {
                app.DEBUG.log('Unable to find loader');
            } catch (e) {
                console.log('Unable to find loader');
            }
        }
    }

    /**
        Shows the Loader Console
    */
    showConsole() {
        $(this.console.el).collapse('show');
    }

    /**
        Hides the Loader Console
    */
    hideConsole() {
        $(this.console.el).collapse('hide');
    }
}