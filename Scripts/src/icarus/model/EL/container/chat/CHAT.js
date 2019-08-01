/** @module */
import CONTAINER, { ATTRIBUTES, MODEL, createInputModel } from '../CONTAINER.js';
import CITE from '../../cite/CITE.js';
import DIV from '../../div/DIV.js';
import FORM from '../../form/FORM.js';
import IMG from '../../img/IMG.js';
import STRONG from '../../strong/STRONG.js';
/** A Chat Window
    @class
    @todo Consider extending FORM instead of CONTAINER (ie: A custom CHAT FORM)
*/
export default class CHAT extends CONTAINER {
	/** Constructs a SECTION Container Element
        @param {CONTAINER} node Node
        @param {ContainerModel} model Model
    */
	constructor(node, model) {
		super(node, 'DIV', model, []);
		this.addClass('chat');
		this.user = this.getMain().getUser();
        FORM.createEmptyForm(this.body.pane).then((form) => {            
            form.el.style = 'height:68px;background-color:#5a5a5a;';
            form.setAction('CHAT/Talk');
            $(form.el).insertAfter(this.body.pane.el);
            let inputs = [createInputModel('TEXTAREA', 'statement', '', 'element', 'TEXTAREA')];
            form.getFieldset()[0].getFormElementGroup()[0].addInputElements(inputs).then(() => {
                /** Show the Payload response
                    @param {Payload} payload The payload
                    @returns {void}
                    @todo Rewrite without function call, instead just call setTimeout with a Payload parameter
                    @todo this.form.afterSuccessfulPost = setTimeout(this.addStatement('ICARUS', payload.message), 1000, payload);
                    @todo Needs testing
                */
                form.afterSuccessfulPost = (payload) => setTimeout(() => this.addStatement('ICARUS', payload.message), 1000);
                let chatInput = form.getFieldset()[0].getFormElementGroup()[0].get()[0].input;
                console.log('Chat Input', chatInput);
                chatInput.el.onkeypress = () => this.postStatement(chatInput);
            });
            this.form = form;
        });
	}
	construct() {
		return new Promise((resolve, reject) => {
			try {
				setTimeout(() => this.addStatement('ICARUS', 'Hello ' + this.user).then(() => resolve(this)), 2000);
			} catch (e) {
				reject(e);
			}
		});
    }
    constructElements() {
        return Promise.resolve(this);
    }
	/** Posts the chat statement to the server and handles any responses
        when the user presses ENTER 
        @param {FORMELEMENT} chatInput Form Element
        @returns {boolean} True if succeeds
    */
	postStatement(chatInput) {
		if (window.event.keyCode === 13) {
			this.addStatement(this.user, chatInput.el.value);
			this.form.post();
			chatInput.el.value = '';
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
			try {
				let statement = new DIV(this.body.pane, new MODEL('statement'));
				statement.el.style.display = 'none';
				statement.thumb = new DIV(statement, new MODEL(new ATTRIBUTES('class', 'thumb')));
				statement.thumb.img = new IMG(statement.thumb, new MODEL(new ATTRIBUTES({
					class: 'user-photo',
					src: 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png'
				})));
				statement.bubble = new DIV(statement, new MODEL('bubble'));
				statement.bubble.panel = new DIV(statement.bubble, new MODEL('panel panel-default'));
				statement.bubble.panel.heading = new DIV(statement.bubble.panel, new MODEL('panel-heading'));
				statement.bubble.panel.heading.strong = new STRONG(statement.bubble.panel.heading, new MODEL().set('innerHTML', username));
				statement.bubble.panel.heading.cite = new CITE(statement.bubble.panel.heading, new MODEL().set('innerHTML', 'commented X mins ago'));
				statement.bubble.panel.body = new DIV(statement.bubble.panel, new MODEL('panel-body'), string);
				$(statement.el).fadeIn(500);
				$(this.body.pane.el).animate({
					scrollTop: $(this.body.pane.el).prop("scrollHeight")
				}, 1000);
				resolve(statement);
			} catch (e) {
				reject(e);
			}
		});
	}
}