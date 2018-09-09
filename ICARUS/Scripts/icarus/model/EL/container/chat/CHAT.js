import CONTAINER from '../CONTAINER.js';
import EL, { MODEL } from '../../EL.js';
import FORM from '../form/FORM.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import CONTAINERFACTORY from '../CONTAINERFACTORY.js';
/**
    A Chat Window
*/
export default class CHAT extends CONTAINER {
    /**
        Constructs a SECTION Container Element
        @param {CONTAINER} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
     */
    constructor(node, model) {
        super(node, 'DIV', model, []);
        this.addClass('chat');

        //this.conversation = new EL(this.body.pane, 'DIV', new MODEL('conversation'));

        this.form = CONTAINERFACTORY.createEmptyForm(this.body.pane);
        this.form.el.style = 'height:68px;background-color:#5a5a5a;';
        $(this.form.el).insertAfter(this.body.pane.el);

        let inputs = [
            new MODEL(new ATTRIBUTES({
                'name': 'statement',
                'type': 'TEXTAREA',
                'value': ''
            })).set({
                'element': 'TEXTAREA',
                'label': 'element'
            })
        ];

        this.form.fieldset.formElementGroup.addInputElements(inputs);

        this.form.setPostUrl('CHAT/Talk');

        /*
            Show the Payload response
        */
        this.form.afterSuccessfulPost = function (payload) {
            //console.log(payload);
            setTimeout(function () {
                this.addStatement('ICARUS', payload.message);
            }.bind(this), 1000);
        }.bind(this);
        
        this.chatInput = this.form.fieldset.formElementGroup.children[0].input;
        console.log('Chat Input');
        console.log(this.chatInput);
        this.chatInput.el.onkeypress = this.postStatement.bind(this);
    }

    /**
     * Return the user or Guest if doesn't exist
     * @returns {string} User string
     */
    getUser() {
        let userVar;
        try {
            userVar = user;
        } catch (e) {
            userVar = 'Guest';
        }
        return userVar;
    }

    /**
     * Posts the chat statement to the server and handles any responses
     * when the user presses ENTER 
     * @returns {Boolean} True if succeeds
     */
    postStatement() {
        if (window.event.keyCode === 13) {
            this.addStatement(this.getUser(), this.chatInput.el.value);
            this.form.post();
            this.chatInput.el.value = '';
            return false;
        } else {
            return true;
        }
    }

    /**
     * Adds a statement to the conversation window
     * @param {string} username User name
     * @param {string} string Statement
     * @returns {EL} The statement object
     */
    addStatement(username, string) {
        let statement = new EL(this.body.pane, 'DIV', new MODEL('statement'));
        statement.el.style.display = "none";

        statement.thumb = new EL(statement, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'thumb'
        })));
        statement.thumb.img = new EL(statement.thumb, 'IMG', new MODEL(new ATTRIBUTES({
            'class': 'user-photo',
            'src': 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png'
        })));

        statement.bubble = new EL(statement, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'bubble'
        })));
        statement.bubble.panel = new EL(statement.bubble, 'DIV', new MODEL('panel panel-default'));

        statement.bubble.panel.heading = new EL(statement.bubble.panel, 'DIV', new MODEL('panel-heading'));
        statement.bubble.panel.heading.strong = new EL(statement.bubble.panel.heading, 'STRONG', new MODEL(), username);
        statement.bubble.panel.heading.cite = new EL(statement.bubble.panel.heading, 'CITE', new MODEL(), 'commented X mins ago');

        statement.bubble.panel.body = new EL(statement.bubble.panel, 'DIV', new MODEL('panel-body'), string);

        $(statement.el).fadeIn(500);
        $(this.body.pane.el).animate({ scrollTop: $(this.body.pane.el).prop("scrollHeight") }, 1000);
        
        return statement;
    }

    construct() {
        setTimeout(function () {
            this.addStatement('ICARUS', 'Hello ' + this.getUser());
        }.bind(this), 2000);
    }
}