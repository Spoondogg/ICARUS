/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends EL {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {EL} node The element that will contain this object
        @param {object} model The model
        @param {boolean} showHeader Shows or hides the header
     */
    constructor(node, model, showHeader) {
        super(node, 'DIV', new MODEL(new ATTRIBUTES('jumbotron noselect')));
        if (showHeader) {
            this.header = new IcarusSectionHeader(this, 'Jumbotron', showHeader);
        }
        this.headerText = new EL(this, 'h1', {}, model.header);
        this.text = new EL(this, 'p', { 'class': 'lead' }, model.text);
        if (model.backgroundUrl) {
            this.el.setAttribute('style', 'background: url(../Content/Images/' + model.backgroundUrl + ') no-repeat center center fixed;');
        }


        // Add CRUD buttons
        this.header.options.menu.groups['CRUD'].addNavItem(
            new MODEL(new ATTRIBUTES(), 'Modify-woot')
        ).el.onclick = this.save.bind(this);

        this.header.options.menu.groups['CRUD'].addNavItem(
            new MODEL(new ATTRIBUTES(), 'Delete-woot')
        ).el.onclick = this.destroy.bind(this);
    }
    
    /**
        Modifies the text elements within this Jumbotron
        @param {string} header header text
        @param {string} body body text
    */
    save(header, body) {
        if (!header && !body) {
            try {
                this.prompt = new PROMPT('Modify Jumbotron', 'Modify the values displayed within the Jumbotron:');
                this.prompt.formGroup.addInput('Header', IcarusInputType.TEXT, this.headerText.el.innerHTML, false);
                this.prompt.formGroup.addTextArea('Body', false);
                this.prompt.buttonGroup.addButton('Rename').el.onclick = function () {

                    let HeaderText = $(this.prompt.el).find('input[name="Header"]')[0].value;
                    let BodyText = $(this.prompt.el).find('textarea[name="Body"]')[0].value;

                    this.headerText.el.innerHTML = HeaderText;
                    this.text.el.innerHTML = BodyText;

                    this.prompt.hide();

                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = function () {
                    this.prompt.hide();
                }.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change values for this Jumbotron\n' + e);
            }
        }
    }
}