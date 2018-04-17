/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
class MODALMENU extends MODAL { // CALL ME A MENU!!!!
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} children Array of [label, glyphicon, buttonType]
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, children, vertical) {
        console.log('MODALMENU('+label+');');
        super(label, text, vertical);
        this.addClass('prompt');

        console.log('Creating Modal Menu...');
        this.menu = new NAVITEMGROUP(this.container.body.pane, new MODEL(
            new ATTRIBUTES('nav navbar-nav navbar-inverse')
        ).set({
            'name': 'menu'
            //'children': children
        }));

        this.menu.populate(children);
    }    
}