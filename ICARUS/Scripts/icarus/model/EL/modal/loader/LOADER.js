/**
    A Loader type modal.
*/
class LOADER extends MODAL {
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

        this.dialog.addClass('loader');
        //this.footer.el.style.display = 'none';

        this.progress = new EL(this.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('progress')));
        
        this.progressBar = new EL(this.progress, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'progress-bar progress-bar-info progress-bar-striped active noselect',
            'role': 'progressbar',
            'aria-valuenow': value,
            'aria-valuemin': 0,
            'aria-valuemax': 100
        })));
        
        this.console = new CONSOLE(this.container.body.pane, new MODEL(
            new ATTRIBUTES({
                'class': 'console collapse',
                'style': 'height:0',
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
    log(value, text) {
        this.show();
        this.progressBar.el.style.width = value + '%';
        this.progressBar.el.setAttribute('aria-valuenow', value);
        if (text) {
            let txt = text.substr(0, 32) + '...';
            this.progressBar.setInnerHTML(txt);
            this.console.addEntry(text);
            debug(text);
        }
    }
}