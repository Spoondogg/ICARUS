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
        console.log('MODALMENU(' + label + ');');
        console.log(children);
        super(label, text, vertical);
        this.addClass('prompt');

        console.log('Creating Modal Menu...');

        //this.container.addContainerCase('NAVITEMGROUP')

        
        this.menu = new NAVITEMGROUP(
            this.container.body.pane,
            new MODEL(
                new ATTRIBUTES('navbar-inverse')
            ).set({
                'className': 'NAVITEMGROUP',
                'name': 'menu'
            })
        );
        
        /* THIS IS WRONG, learn from this
         * // Why have a method instead of calling the constructor?
        this.menu = this.container.create(

            new MODEL(
                new ATTRIBUTES('nav navbar-nav navbar-inverse')
            ).set({
                'className'
                'name': 'menu'
            })
        );*/

        this.menu.populate(children);
    }    
}