﻿/**
    A Bootstrap 3 Modal
    https://www.w3schools.com/bootstrap/bootstrap_modal.asp    
*/
class MODAL extends EL { // ALIGN VERTICALLY??
    /**
        Constructs a Modal
        @param {string} title The header text for this modal
        @param {string} text The html text that is displayed in the prompt's well
        @param {boolean} vertical If true, modal is vertically aligned
     */
    constructor(title, text, vertical) {
        super(document.body, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'modal fade in', 
            'role': 'dialog'
        })));
    
        // Vertical alignment helper div where required
        this.alignHelper = null;
        if (vertical) {
            this.alignHelper = new EL(this, 'DIV', new MODEL(new ATTRIBUTES('vertical-alignment-helper')));
        }

        // Dialog inside vertical align helper if set to vertical align
        let parentEl = vertical ? this.alignHelper : this;
        let dialogAttr = new ATTRIBUTES('modal-dialog');
        if (vertical) {
            dialogAttr.set('class', dialogAttr.get('class') + ' vertical-align-center');
        }
        this.dialog = new EL(parentEl, 'DIV', new MODEL(dialogAttr));

        // If modal is vertically aligned, set class accordingly
        //if (vertical) { parentEl.dialog.addClass('vertical-align-center'); }

        // If vertical, margin must be set to auto
        this.content = new EL(this.dialog, 'DIV', new MODEL(new ATTRIBUTES('modal-content')));
        if (vertical) { this.content.el.style = 'margin: 0 auto;'; }

        this.header = new EL(this.content, 'DIV', new MODEL(new ATTRIBUTES('modal-header')));

        this.header.btnClose = new EL(this.header, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'close',
            'type': 'BUTTON',
            'data-dismiss': 'modal',
            'aria-hidden': 'true'
        })), 'x');

        this.header.main = new HEADER(this.header, new MODEL());
        this.header.main.addClass('modal-title');

        this.header.text = new EL(this.header.main, 'DIV', new MODEL(), title);

        this.header.btnClose.el.onclick = this.close.bind(this);

        // A well containing various alerts        
        if (text) {
            this.well = new WELL(this.content, new MODEL(), text);
        }

        // Body	: Place forms, objects etc inside 'this.modalbody.el'
        this.container = new CONTAINER(
            this.content, 'DIV',
            new MODEL(new ATTRIBUTES('modal-body')).set({
                'label': 'Modal Body',
                'showHeader': 0
            })
        );

        // Footer : Contains options to save or cancel out of form
        this.footer = new EL(this.content, 'DIV', new MODEL(new ATTRIBUTES('modal-footer' )));
        
        this.footer.btnClose = new EL(this.footer, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'btn btn-default btn-block',
            'data-dismiss': 'modal',
            'aria-hidden': 'true'
        })), 'Close').el.onclick = close;
    }    

    /**
        Scrolls to top
    */
    scrollUp() {
        alert('scroll to top');
        this.el.scrollTop = 0;
    }

    /**
        Reveal the modal
    */
    show() {
        if ($(this.el).hasClass('in')) {
            $(this.el).modal('show');
        } /*else {
            console.log('modal already shown');
        }*/
    }

    /**
        Hide the modal // and remove from DOM
        @param {number} delay Millisecond delay
        @param {boolean} destroy If true, this modal is destroyed
    */
    hide(delay = 1000, destroy = false) {
        setTimeout(function () {
            $(this.el).modal('hide');
            $('.modal-backdrop').animate({ opacity: 'toggle' }, 300).remove();
            if (destroy) {
                this.destroy(delay);
            }
        }.bind(this), delay);
    }

    /**
        Convenience method for hide();  Should get ride of this
        @param {number} delay Millisecond delay
    
    close(delay) {
        this.hide(delay);
    }*/

    /**
        Sets the text to prompt well
        @param {string} text The text contained within the prompt's well
    */
    setText(text) {
        if (text) {
            this.well.el.innerHTML = text;
        }
    }

    /**
        Adds text to the prompt's well
        @param {string} text The text to be added
    
    addText(text) {
        if (this.well) {
            this.well.el.innerHTML += '<br>' + text;
        }
    }*/
}