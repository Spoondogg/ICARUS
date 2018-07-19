/**
    Jumbotron with centered icon and text
*/
class THUMBNAIL extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0'); // Override icarus-container 
        this.body.pane.addClass('thumbnail');
        //this.image = new IMG(this.body.pane, new MODEL());
        //this.construct();
        //this.populate(model.children);
    }

    construct() {
        this.image = new IMG(this.body.pane, new MODEL());
        console.log('dataId:' + this.dataId);
        if (this.dataId > 0 || this.dataId === -1) {

            let parsed = null;

            if (this.data.img) {

                // If this.data.img is integer, retrieve relevant formpost
                if (Number.isInteger(parseInt(this.data.img))) {

                    // Test to see if the formpost can be retrieved
                    try {
                        $.getJSON('/FORMPOST/Get/' + parseInt(this.data.img), function (data) {

                            // If access granted...
                            if (data.model) {
                                if (data.model.jsonResults) {
                                    parsed = JSON.parse(data.model.jsonResults);

                                    // Extract the base64 values and create an image
                                    for (let p = 0; p < parsed.length; p++) {
                                        if (parsed[p].name === 'base64') {
                                            this.image.el.src = parsed[p].value;
                                        }
                                    }
                                } else {
                                    console.log('Json Results empty');
                                }
                            }

                        }.bind(this));
                    } catch (e) {
                        console.log('Unable to retrieve FormPost.');
                        console.log(e);
                    }

                } else {
                    this.image = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                        'src': this.data.img
                    })));
                }
            }

            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': this.data.header
            }));
            this.p = new P(this.body.pane, new MODEL(), truncate(this.data.p, 128));

            this.buttonGroup = new BUTTONGROUP(this.body.pane, 'btn-block');
            this.button = this.buttonGroup.addButton('', ICON.CHEVRON_RIGHT);
            this.button.addClass('btn-block');

            this.button.el.onclick = function () {
                this.launchModal();
            }.bind(this);
        }
    }

    /**
     * Launches a modal that contains the detailed view of the given article
     */
    launchModal() {
        console.log('Launch Modal');

        let modal = new MODAL(this.data.header);
        modal.container.body.pane.addClass('thumbnail');

        modal.container.image = new IMG(modal.container.body.pane, new MODEL());
        modal.container.image.el.src = this.image.el.src;

        modal.container.header = new HEADER(modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        modal.container.p = new P(modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        modal.show();
    }

}