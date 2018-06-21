/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.body.pane.addClass('jumbotron');
        this.body.pane.addClass('noselect');
        //this.dataElements = DATAELEMENTS.JUMBOTRON;
        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Override abstract method
     */
    construct() {
        if (this.dataId > 0) {

            this.screen = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('screen')));
            console.log('screen');
            if (this.data.screencolor && this.data.screencolor !== '.') {
                console.log(this.data.screencolor);
                //this.screen.el.backgroundColor = 'background-color: rgba(162, 34, 34, 0.88);';
                this.screen.el.setAttribute('style', 'background-color: '+this.data.screencolor+';');
            }

            this.header = new HEADER(this.screen, new MODEL().set({
                'label': this.data.header
            }), 1);

            if (this.data.p) {
                if (this.data.p.length > 0) {
                    this.hr = new HR(this.screen, new MODEL());
                    this.p = new P(this.screen, new MODEL(), this.htmlDecode(this.data.p));
                }
            }

            // Test to see if the formpost can be retrieved            
            if (this.data.bgimage !== '0' && this.data.bgimage !== '.') {
                //console.log('JUMBOTRON');
                try {
                    $.getJSON('/FORMPOST/Get/' + parseInt(this.data.bgimage), function (data) {

                        // If access granted...
                        if (data.model) {
                            //console.log('Retrieved image id: ' + parseInt(this.data.bgimage));
                            //console.log(data.model);
                            console.log('Parsed...');
                            let parsed = JSON.parse(data.model.jsonResults);
                            console.log(parsed);

                            // Extract the base64 values and create an image
                            for (let p = 0; p < parsed.length; p++) {
                                if (parsed[p].name === 'base64') {
                                    this.body.pane.el.setAttribute('style',
                                        'background: url(' + parsed[p].value + ');'
                                    );
                                }
                            }
                        }
                    }.bind(this));
                } catch (e) {
                    console.log('Unable to retrieve FormPost.');
                    console.log(e);
                }
            }

            if (this.data.bgcolor && this.data.bgcolor !== '.') {
                this.body.pane.el.style.backgroundColor = this.data.bgcolor;
            }
        }
    }

}