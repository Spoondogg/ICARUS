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

        super(label, text, true);

        this.dialog.addClass('loader');
        //this.footer.el.style.display = 'none';

        this.progress = new EL(this, 'DIV', new MODEL(new ATTRIBUTES('progress')));
        $(this.progress.el).insertBefore(this.container.el);

        this.progressBar = new EL(this.progress, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'progress-bar progress-bar-info progress-bar-striped active',
            'role': 'progressbar',
            'aria-valuenow': value,
            'aria-valuemin': 0,
            'aria-valuemax': 100
        })));

        // Set progress default
        this.setProgress(value);
    }

    /**
        Sets the progress bar status.

        @param {number} value Percentage as integer (ie: 50 means 50%).
        @param {string} text Text displayed inside progress bar.  
    */
    setProgress(value, text) {
        this.progressBar.el.style.width = value + '%';
        this.progressBar.el.setAttribute('aria-valuenow', value);
        this.addText(text);
    }
}