/** @module */
import CONTAINER, { ATTRIBUTES, MODEL } from '../CONTAINER.js';
import CITE from '../../cite/CITE.js';
import DIV from '../../div/DIV.js';
import FORM from '../../form/FORM.js';
import IMG from '../../img/IMG.js';
import STRONG from '../../strong/STRONG.js';
/** A Chat Window
    @class
    @extends CONTAINER
    @todo Consider extending FORM instead of CONTAINER (ie: A custom CHAT FORM)
*/
export default class CHAT extends CONTAINER {
	/** Constructs a SECTION Container Element
        @param {CONTAINER} node The ARTICLE to contain the section
        @param {MODEL} model The SECTION object retrieves from the server
    */
	constructor(node, model) {
		super(node, 'DIV', model, []);
		this.addClass('chat');
		this.user = this.getMain().getUser();
		this.form = FORM.createEmptyForm(this.body.pane);
		this.form.el.style = 'height:68px;background-color:#5a5a5a;';
		$(this.form.el).insertAfter(this.body.pane.el);
		let inputs = [
			new MODEL(new ATTRIBUTES({
				name: 'statement',
				type: 'TEXTAREA',
				value: ''
			})).set({
				element: 'TEXTAREA',
				label: 'element'
			})
		];
		this.form.fieldset.formElementGroup.addInputElements(inputs);
		this.form.setAction('CHAT/Talk');
		/** Show the Payload response
            @param {Payload} payload The payload
            @returns {void}
            @todo Rewrite without function call, instead just call setTimeout with a Payload parameter
            @todo this.form.afterSuccessfulPost = setTimeout(this.addStatement('ICARUS', payload.message), 1000, payload);
            @todo Needs testing
		*/
		this.form.afterSuccessfulPost = function(payload) {
			setTimeout(() => {
				this.addStatement('ICARUS', payload.message);
			}, 1000);
		}.bind(this);
		this.chatInput = this.form.fieldset.formElementGroup.children[0].input;
		console.log('Chat Input', this.chatInput);
		this.chatInput.el.onkeypress = this.postStatement.bind(this);
    }
    construct() {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    this.addStatement('ICARUS', 'Hello ' + this.user).then(() => resolve(this));
                }, 2000);
            } catch (e) {
                reject(e);
            }
        });
    }
	/** Posts the chat statement to the server and handles any responses
        when the user presses ENTER 
        @returns {boolean} True if succeeds
    */
	postStatement() {
		if (window.event.keyCode === 13) {
			this.addStatement(this.user, this.chatInput.el.value);
			this.form.post();
			this.chatInput.el.value = '';
			return false;
		}
		return true;
	}
	/** Adds a statement to the conversation window
        @param {string} username User name
        @param {string} string Statement
        @returns {Promise<EL>} The statement object
        @todo Consider creating a STATEMENT EL
    */
    addStatement(username, string) {
        return new Promise((resolve, reject) => {
            let statement = new DIV(this.body.pane, new MODEL('statement'));
            statement.el.style.display = 'none';
            statement.thumb = new DIV(statement, new MODEL(new ATTRIBUTES({
                'class': 'thumb'
            })));
            statement.thumb.img = new IMG(statement.thumb, new MODEL(new ATTRIBUTES({
                'class': 'user-photo',
                'src': 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png'
            })));
            statement.bubble = new DIV(statement, new MODEL('bubble'));
            statement.bubble.panel = new DIV(statement.bubble, new MODEL('panel panel-default'));
            statement.bubble.panel.heading = new DIV(statement.bubble.panel, new MODEL('panel-heading'));
            statement.bubble.panel.heading.strong = new STRONG(statement.bubble.panel.heading, new MODEL(), username);
            statement.bubble.panel.heading.cite = new CITE(statement.bubble.panel.heading, new MODEL(), 'commented X mins ago');
            statement.bubble.panel.body = new DIV(statement.bubble.panel, new MODEL('panel-body'), string);
            $(statement.el).fadeIn(500);
            $(this.body.pane.el).animate({ scrollTop: $(this.body.pane.el).prop("scrollHeight") }, 1000);
            resolve(statement);
        });
	}
}